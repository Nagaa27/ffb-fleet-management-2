// src/store/driversSlice.ts
// Redux slice for driver state management.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDrivers, createDriver, updateDriver, deleteDriver } from '../api/driverApi';
import type { RootState } from './store';

interface DriverItem {
  id: string;
  name: string;
  license_number: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DriversState {
  items: DriverItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DriversState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchDriversThunk = createAsyncThunk('drivers/fetchAll', async () => {
  const response = await fetchDrivers();
  if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
  return response.data;
});

export const createDriverThunk = createAsyncThunk(
  'drivers/create',
  async (data: { name: string; licenseNumber: string; phoneNumber: string }) => {
    const response = await createDriver(data);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

export const updateDriverThunk = createAsyncThunk(
  'drivers/update',
  async ({ id, data }: { id: string; data: { name?: string; licenseNumber?: string; phoneNumber?: string; status?: string } }) => {
    const response = await updateDriver(id, data);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

export const deleteDriverThunk = createAsyncThunk('drivers/delete', async (id: string) => {
  const response = await deleteDriver(id);
  if (!response.success) throw new Error(response.error ?? 'Unknown error');
  return id;
});

const driversSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    clearDriversError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriversThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDriversThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDriversThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch drivers';
      })
      .addCase(createDriverThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateDriverThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((d) => d.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteDriverThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export const { clearDriversError } = driversSlice.actions;
export const driversReducer = driversSlice.reducer;

// Selectors (raw items)
export const selectRawDrivers = (state: RootState) => state.drivers.items;
export const selectDriversStatus = (state: RootState) => state.drivers.status;
export const selectDriversLoading = (state: RootState) => state.drivers.status === 'loading';
export const selectDriversError = (state: RootState) => state.drivers.error;
export const selectDriverById = (state: RootState, id: string) =>
  state.drivers.items.find((d) => d.id === id);

// Mapped selector: raw DB rows → domain Driver type
export const selectAllDrivers = (state: RootState) =>
  state.drivers.items.map((d) => ({
    id: d.id,
    name: d.name,
    licenseNumber: d.license_number,
    phoneNumber: d.phone_number,
    status: d.status as import('../types/enums').DriverStatus,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }));
