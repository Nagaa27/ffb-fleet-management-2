// src/store/vehiclesSlice.ts
// Redux slice for vehicle state management.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle, assignDriverToVehicle } from '../api/vehicleApi';
import type { RootState } from './store';

interface VehicleItem {
  id: string;
  plate_number: string;
  type: string;
  capacity: number;
  driver_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  driver_name?: string;
  driver_license_number?: string;
  driver_phone_number?: string;
  driver_status?: string;
}

interface VehiclesState {
  items: VehicleItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VehiclesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchVehiclesThunk = createAsyncThunk('vehicles/fetchAll', async () => {
  const response = await fetchVehicles();
  if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
  return response.data;
});

export const createVehicleThunk = createAsyncThunk(
  'vehicles/create',
  async (data: { plateNumber: string; type: string; capacity: number; driverId?: string }) => {
    const response = await createVehicle(data);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

export const updateVehicleThunk = createAsyncThunk(
  'vehicles/update',
  async ({ id, data }: { id: string; data: { plateNumber?: string; type?: string; capacity?: number; status?: string } }) => {
    const response = await updateVehicle(id, data);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

export const assignDriverThunk = createAsyncThunk(
  'vehicles/assignDriver',
  async ({ vehicleId, driverId }: { vehicleId: string; driverId: string | null }) => {
    const response = await assignDriverToVehicle(vehicleId, driverId);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

export const deleteVehicleThunk = createAsyncThunk('vehicles/delete', async (id: string) => {
  const response = await deleteVehicle(id);
  if (!response.success) throw new Error(response.error ?? 'Unknown error');
  return id;
});

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    clearVehiclesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchVehiclesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVehiclesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchVehiclesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch vehicles';
      })
      // Create
      .addCase(createVehicleThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateVehicleThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // Assign driver
      .addCase(assignDriverThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // Delete
      .addCase(deleteVehicleThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v.id !== action.payload);
      });
  },
});

export const { clearVehiclesError } = vehiclesSlice.actions;
export const vehiclesReducer = vehiclesSlice.reducer;

// Selectors (raw items)
export const selectRawVehicles = (state: RootState) => state.vehicles.items;
export const selectVehiclesStatus = (state: RootState) => state.vehicles.status;
export const selectVehiclesLoading = (state: RootState) => state.vehicles.status === 'loading';
export const selectVehiclesError = (state: RootState) => state.vehicles.error;
export const selectVehicleById = (state: RootState, id: string) =>
  state.vehicles.items.find((v) => v.id === id);

// Mapped selector: raw DB rows → domain Vehicle type
export const selectAllVehicles = (state: RootState) =>
  state.vehicles.items.map((v) => ({
    id: v.id,
    plateNumber: v.plate_number,
    type: v.type as import('../types/enums').VehicleType,
    capacity: v.capacity,
    driverId: v.driver_id,
    driver: v.driver_name
      ? {
          id: v.driver_id ?? '',
          name: v.driver_name,
          licenseNumber: v.driver_license_number ?? '',
          phoneNumber: v.driver_phone_number ?? '',
          status: (v.driver_status ?? 'AVAILABLE') as import('../types/enums').DriverStatus,
          createdAt: '',
          updatedAt: '',
        }
      : null,
    status: v.status as import('../types/enums').VehicleStatus,
    createdAt: v.created_at,
    updatedAt: v.updated_at,
  }));
