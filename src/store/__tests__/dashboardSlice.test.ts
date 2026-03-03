// src/store/__tests__/dashboardSlice.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { dashboardReducer, fetchDashboardThunk, setSelectedDate } from '../dashboardSlice';

// Mock the API module
vi.mock('../../api/dashboardApi', () => ({
  fetchDashboardSummary: vi.fn(),
}));

import { fetchDashboardSummary } from '../../api/dashboardApi';

const mockSummary = {
  totalVehicles: 10,
  activeVehicles: 5,
  idleVehicles: 3,
  maintenanceVehicles: 2,
  availableDrivers: 7,
  onDutyDrivers: 3,
  todayScheduled: 4,
  todayInProgress: 2,
  todayCompleted: 3,
  todayCollectedTons: 25.5,
  todayTargetTons: 50,
};

function createTestStore() {
  return configureStore({
    reducer: { dashboard: dashboardReducer },
  });
}

describe('dashboardSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has correct initial state', () => {
    const store = createTestStore();
    const state = store.getState().dashboard;
    expect(state.summary).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });

  it('setSelectedDate updates the date', () => {
    const store = createTestStore();
    store.dispatch(setSelectedDate('2026-03-15'));
    expect(store.getState().dashboard.selectedDate).toBe('2026-03-15');
  });

  it('fetchDashboardThunk sets loading state', async () => {
    const mockedFn = vi.mocked(fetchDashboardSummary);
    mockedFn.mockResolvedValue({ success: true, data: mockSummary, error: null });

    const store = createTestStore();
    const promise = store.dispatch(fetchDashboardThunk('2026-03-02'));

    expect(store.getState().dashboard.status).toBe('loading');
    await promise;
    expect(store.getState().dashboard.status).toBe('succeeded');
    expect(store.getState().dashboard.summary).toEqual(mockSummary);
  });

  it('fetchDashboardThunk handles error', async () => {
    const mockedFn = vi.mocked(fetchDashboardSummary);
    mockedFn.mockResolvedValue({ success: false, error: 'Server error', data: null });

    const store = createTestStore();
    await store.dispatch(fetchDashboardThunk('2026-03-02'));

    expect(store.getState().dashboard.status).toBe('failed');
    expect(store.getState().dashboard.error).toBeTruthy();
  });
});
