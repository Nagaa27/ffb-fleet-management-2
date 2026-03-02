// src/store/dashboardSlice.ts
// Redux slice for dashboard state management.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardSummary } from '../api/dashboardApi';
import type { DashboardSummary } from '../types/index';
import type { RootState } from './store';

interface DashboardState {
  summary: DashboardSummary | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedDate: string;
}

const initialState: DashboardState = {
  summary: null,
  status: 'idle',
  error: null,
  selectedDate: new Date().toISOString().split('T')[0]!,
};

export const fetchDashboardThunk = createAsyncThunk(
  'dashboard/fetchSummary',
  async (date?: string) => {
    const response = await fetchDashboardSummary(date);
    if (!response.success || !response.data) throw new Error(response.error ?? 'Unknown error');
    return response.data;
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedDate(state, action: { payload: string }) {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchDashboardThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch dashboard';
      });
  },
});

export const { setSelectedDate } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;

// Selectors
export const selectDashboard = (state: RootState) => state.dashboard.summary;
export const selectDashboardSummary = (state: RootState) => state.dashboard.summary;
export const selectDashboardStatus = (state: RootState) => state.dashboard.status;
export const selectDashboardLoading = (state: RootState) => state.dashboard.status === 'loading';
export const selectDashboardError = (state: RootState) => state.dashboard.error;
export const selectDashboardDate = (state: RootState) => state.dashboard.selectedDate;
