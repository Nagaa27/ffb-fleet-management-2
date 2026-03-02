// src/store/millsSlice.ts
// Redux slice for mill state management.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMills, createMill, updateMill } from '../api/millApi';
import type { RootState } from './store';

interface MillItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  contact_person: string;
  phone_number: string;
  avg_daily_production: number;
  created_at: string;
  updated_at: string;
}

interface MillsState {
  items: MillItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MillsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchMillsThunk = createAsyncThunk('mills/fetchAll', async () => {
  const response = await fetchMills();
  if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
  return response.data;
});

export const createMillThunk = createAsyncThunk(
  'mills/create',
  async (data: {
    name: string;
    location: { latitude: number; longitude: number; address?: string };
    contactPerson: string;
    phoneNumber: string;
    avgDailyProduction: number;
  }) => {
    const response = await createMill(data);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

export const updateMillThunk = createAsyncThunk(
  'mills/update',
  async ({ id, data }: {
    id: string;
    data: {
      name?: string;
      location?: { latitude: number; longitude: number; address?: string };
      contactPerson?: string;
      phoneNumber?: string;
      avgDailyProduction?: number;
    };
  }) => {
    const response = await updateMill(id, data);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

const millsSlice = createSlice({
  name: 'mills',
  initialState,
  reducers: {
    clearMillsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMillsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMillsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMillsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch mills';
      })
      .addCase(createMillThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMillThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearMillsError } = millsSlice.actions;
export const millsReducer = millsSlice.reducer;

// Selectors (raw items)
export const selectRawMills = (state: RootState) => state.mills.items;
export const selectMillsStatus = (state: RootState) => state.mills.status;
export const selectMillsLoading = (state: RootState) => state.mills.status === 'loading';
export const selectMillsError = (state: RootState) => state.mills.error;
export const selectMillById = (state: RootState, id: string) =>
  state.mills.items.find((m) => m.id === id);

// Mapped selector: raw DB rows → domain Mill type
export const selectAllMills = (state: RootState) =>
  state.mills.items.map((m) => ({
    id: m.id,
    name: m.name,
    location: {
      latitude: m.latitude,
      longitude: m.longitude,
      address: m.address ?? undefined,
    },
    contactPerson: m.contact_person,
    phoneNumber: m.phone_number,
    avgDailyProduction: m.avg_daily_production,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }));
