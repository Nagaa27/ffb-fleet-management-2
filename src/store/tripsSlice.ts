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

// Selectors (raw items)
export const selectRawTrips = (state: RootState) => state.trips.items;
export const selectTripsStatus = (state: RootState) => state.trips.status;
export const selectTripsLoading = (state: RootState) => state.trips.status === 'loading';
export const selectTripsError = (state: RootState) => state.trips.error;
export const selectSelectedTrip = (state: RootState) => state.trips.selectedTrip;
export const selectTripFilters = (state: RootState) => state.trips.filters;

// Mapped selector: raw DB rows → domain Trip type
export const selectAllTrips = (state: RootState) =>
  state.trips.items.map((t) => ({
    id: t.id,
    vehicleId: t.vehicle_id,
    driverId: t.driver_id,
    vehicle: t.vehicle_plate_number
      ? {
          id: t.vehicle_id,
          plateNumber: t.vehicle_plate_number,
          type: (t.vehicle_type ?? 'TRUCK_MEDIUM') as import('../types/enums').VehicleType,
          capacity: t.vehicle_capacity ?? 0,
          driverId: null,
          driver: null,
          status: 'ACTIVE' as import('../types/enums').VehicleStatus,
          createdAt: '',
          updatedAt: '',
        }
      : undefined,
    driver: t.driver_name
      ? {
          id: t.driver_id,
          name: t.driver_name,
          licenseNumber: t.driver_license_number ?? '',
          phoneNumber: '',
          status: 'ON_DUTY' as import('../types/enums').DriverStatus,
          createdAt: '',
          updatedAt: '',
        }
      : undefined,
    scheduledDate: t.scheduled_date,
    status: t.status as import('../types/enums').TripStatus,
    collections: (t.collections ?? []).map((c) => ({
      id: c.id,
      tripId: c.trip_id,
      millId: c.mill_id,
      mill: c.mill_name ? { id: c.mill_id, name: c.mill_name, location: { latitude: 0, longitude: 0 }, contactPerson: '', phoneNumber: '', avgDailyProduction: 0, createdAt: '', updatedAt: '' } : undefined,
      plannedWeight: c.planned_weight,
      actualWeight: c.actual_weight,
      collectedAt: c.collected_at,
      notes: c.notes,
      createdAt: '',
      updatedAt: '',
    })),
    estimatedDuration: t.estimated_duration,
    startedAt: t.started_at,
    completedAt: t.completed_at,
    cancelledAt: t.cancelled_at,
    cancellationReason: t.cancellation_reason,
    notes: t.notes,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }));

// Memoized selector: trips by status
export const selectTripsByStatus = createSelector(
  [selectRawTrips, (_state: RootState, status: string) => status],
  (trips, status) => trips.filter((t) => t.status === status),
);
