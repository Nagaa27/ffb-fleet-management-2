// src/store/tripsSlice.ts
// Redux slice for trip state management.

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { fetchTrips, fetchTripById, createTrip, updateTripStatus } from '../api/tripApi';
import type { RootState } from './store';

interface CollectionItem {
  id: string;
  trip_id: string;
  mill_id: string;
  planned_weight: number;
  actual_weight: number | null;
  collected_at: string | null;
  notes: string | null;
  mill_name?: string;
}

interface TripItem {
  id: string;
  vehicle_id: string;
  driver_id: string;
  scheduled_date: string;
  status: string;
  estimated_duration: number;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicle_plate_number?: string;
  vehicle_type?: string;
  vehicle_capacity?: number;
  driver_name?: string;
  driver_license_number?: string;
  collections?: CollectionItem[];
}

interface TripFilters {
  date?: string;
  status?: string;
  vehicleId?: string;
  driverId?: string;
  millId?: string;
}

interface TripsState {
  items: TripItem[];
  selectedTrip: TripItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: TripFilters;
}

const initialState: TripsState = {
  items: [],
  selectedTrip: null,
  status: 'idle',
  error: null,
  filters: {},
};

export const fetchTripsThunk = createAsyncThunk(
  'trips/fetchAll',
  async (filters: TripFilters = {}) => {
    const response = await fetchTrips(filters);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

export const fetchTripByIdThunk = createAsyncThunk('trips/fetchById', async (id: string) => {
  const response = await fetchTripById(id);
  if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
  return response.data;
});

export const createTripThunk = createAsyncThunk(
  'trips/create',
  async (data: {
    vehicleId: string;
    driverId: string;
    millIds: string[];
    scheduledDate: string;
    plannedWeightPerMill: Record<string, number>;
    estimatedDuration: number;
    notes?: string;
  }) => {
    const response = await createTrip(data);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

export const updateTripStatusThunk = createAsyncThunk(
  'trips/updateStatus',
  async ({ id, data }: { id: string; data: { status: string; cancellationReason?: string } }) => {
    const response = await updateTripStatus(id, data);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTripFilters(state, action: { payload: TripFilters }) {
      state.filters = action.payload;
    },
    clearTripsError(state) {
      state.error = null;
    },
    clearSelectedTrip(state) {
      state.selectedTrip = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTripsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTripsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTripsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch trips';
      })
      // Fetch by ID
      .addCase(fetchTripByIdThunk.fulfilled, (state, action) => {
        state.selectedTrip = action.payload;
      })
      // Create
      .addCase(createTripThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update status
      .addCase(updateTripStatusThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedTrip?.id === action.payload.id) {
          state.selectedTrip = action.payload;
        }
      });
  },
});

export const { setTripFilters, clearTripsError, clearSelectedTrip } = tripsSlice.actions;
export const tripsReducer = tripsSlice.reducer;

// Selectors
export const selectAllTrips = (state: RootState) => state.trips.items;
export const selectTripsStatus = (state: RootState) => state.trips.status;
export const selectTripsError = (state: RootState) => state.trips.error;
export const selectSelectedTrip = (state: RootState) => state.trips.selectedTrip;
export const selectTripFilters = (state: RootState) => state.trips.filters;

// Memoized selector: trips by status
export const selectTripsByStatus = createSelector(
  [selectAllTrips, (_state: RootState, status: string) => status],
  (trips, status) => trips.filter((t) => t.status === status),
);
