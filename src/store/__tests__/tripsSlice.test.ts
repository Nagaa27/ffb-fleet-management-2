// src/store/__tests__/tripsSlice.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  tripsReducer,
  fetchTripsThunk,
  createTripThunk,
  updateTripStatusThunk,
  setTripFilters,
  clearTripsError,
  clearSelectedTrip,
} from '../tripsSlice';

vi.mock('../../api/tripApi', () => ({
  fetchTrips: vi.fn(),
  fetchTripById: vi.fn(),
  createTrip: vi.fn(),
  updateTripStatus: vi.fn(),
  recordCollection: vi.fn(),
}));

import { fetchTrips, createTrip, updateTripStatus } from '../../api/tripApi';

const mockTrips = [
  {
    id: 'trip-1',
    vehicle_id: 'v1',
    driver_id: 'd1',
    scheduled_date: '2025-01-01',
    status: 'SCHEDULED',
    estimated_duration: 60,
    started_at: null,
    completed_at: null,
    cancelled_at: null,
    cancellation_reason: null,
    notes: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    vehicle_plate_number: 'B 1234 XY',
    driver_name: 'Budi',
    collections: [],
  },
];

function createTestStore() {
  return configureStore({
    reducer: { trips: tripsReducer },
  });
}

describe('tripsSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has correct initial state', () => {
    const store = createTestStore();
    const state = store.getState().trips;
    expect(state.items).toEqual([]);
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
    expect(state.selectedTrip).toBeNull();
  });

  it('fetchTripsThunk populates items on success', async () => {
    vi.mocked(fetchTrips).mockResolvedValue({ success: true, data: mockTrips, error: null });

    const store = createTestStore();
    await store.dispatch(fetchTripsThunk({}));

    expect(store.getState().trips.items).toEqual(mockTrips);
    expect(store.getState().trips.status).toBe('succeeded');
  });

  it('fetchTripsThunk sets error on failure', async () => {
    vi.mocked(fetchTrips).mockResolvedValue({ success: false, data: null, error: 'Server error' });

    const store = createTestStore();
    await store.dispatch(fetchTripsThunk({}));

    expect(store.getState().trips.status).toBe('failed');
    expect(store.getState().trips.error).toBeTruthy();
  });

  it('createTripThunk prepends new trip', async () => {
    vi.mocked(fetchTrips).mockResolvedValue({ success: true, data: mockTrips, error: null });
    const newTrip = {
      id: 'trip-2', vehicle_id: 'v1', driver_id: 'd1', scheduled_date: '2025-01-02',
      status: 'SCHEDULED', estimated_duration: 60, started_at: null, completed_at: null,
      cancelled_at: null, cancellation_reason: null, notes: null,
      created_at: '2025-01-02T00:00:00Z', updated_at: '2025-01-02T00:00:00Z',
      vehicle_plate_number: 'B 1234 XY', driver_name: 'Budi', collections: [],
    };
    vi.mocked(createTrip).mockResolvedValue({ success: true, data: newTrip, error: null });

    const store = createTestStore();
    await store.dispatch(fetchTripsThunk({}));
    await store.dispatch(createTripThunk({
      vehicleId: 'v1',
      driverId: 'd1',
      millIds: ['m1'],
      scheduledDate: '2025-01-02',
      plannedWeightPerMill: { m1: 10 },
      estimatedDuration: 60,
    }));

    expect(store.getState().trips.items).toHaveLength(2);
    expect(store.getState().trips.items[0]?.id).toBe('trip-2');
  });

  it('updateTripStatusThunk updates existing trip', async () => {
    vi.mocked(fetchTrips).mockResolvedValue({ success: true, data: mockTrips, error: null });
    const updated = {
      id: 'trip-1', vehicle_id: 'v1', driver_id: 'd1', scheduled_date: '2025-01-01',
      status: 'IN_PROGRESS', estimated_duration: 60, started_at: '2025-01-01T08:00:00Z',
      completed_at: null, cancelled_at: null, cancellation_reason: null, notes: null,
      created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z',
      vehicle_plate_number: 'B 1234 XY', driver_name: 'Budi', collections: [],
    };
    vi.mocked(updateTripStatus).mockResolvedValue({ success: true, data: updated, error: null });

    const store = createTestStore();
    await store.dispatch(fetchTripsThunk({}));
    await store.dispatch(updateTripStatusThunk({ id: 'trip-1', data: { status: 'IN_PROGRESS' } }));

    expect(store.getState().trips.items[0]?.status).toBe('IN_PROGRESS');
  });

  it('setTripFilters updates filters', () => {
    const store = createTestStore();
    store.dispatch(setTripFilters({ date: '2025-01-01', status: 'SCHEDULED' }));
    expect(store.getState().trips.filters).toEqual({ date: '2025-01-01', status: 'SCHEDULED' });
  });

  it('clearTripsError resets error', async () => {
    vi.mocked(fetchTrips).mockResolvedValue({ success: false, data: null, error: 'Error' });

    const store = createTestStore();
    await store.dispatch(fetchTripsThunk({}));
    expect(store.getState().trips.error).toBeTruthy();

    store.dispatch(clearTripsError());
    expect(store.getState().trips.error).toBeNull();
  });

  it('clearSelectedTrip resets selectedTrip', () => {
    const store = createTestStore();
    store.dispatch(clearSelectedTrip());
    expect(store.getState().trips.selectedTrip).toBeNull();
  });
});
