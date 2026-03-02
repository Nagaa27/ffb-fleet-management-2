// src/store/__tests__/vehiclesSlice.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  vehiclesReducer,
  fetchVehiclesThunk,
  createVehicleThunk,
  deleteVehicleThunk,
} from '../vehiclesSlice';

vi.mock('../../api/vehicleApi', () => ({
  fetchVehicles: vi.fn(),
  createVehicle: vi.fn(),
  updateVehicle: vi.fn(),
  deleteVehicle: vi.fn(),
  assignDriverToVehicle: vi.fn(),
}));

import { fetchVehicles, createVehicle, deleteVehicle } from '../../api/vehicleApi';

const mockVehicles = [
  { id: '1', plate_number: 'BK 1234', type: 'TRUCK_MEDIUM', capacity: 8, driver_id: null, status: 'IDLE', created_at: '', updated_at: '' },
  { id: '2', plate_number: 'BK 5678', type: 'TRUCK_LARGE', capacity: 12, driver_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
];

function createTestStore() {
  return configureStore({
    reducer: { vehicles: vehiclesReducer },
  });
}

describe('vehiclesSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has correct initial state', () => {
    const store = createTestStore();
    expect(store.getState().vehicles.items).toEqual([]);
    expect(store.getState().vehicles.status).toBe('idle');
  });

  it('fetchVehiclesThunk populates items', async () => {
    vi.mocked(fetchVehicles).mockResolvedValue({ success: true, data: mockVehicles });

    const store = createTestStore();
    await store.dispatch(fetchVehiclesThunk());

    expect(store.getState().vehicles.items).toEqual(mockVehicles);
    expect(store.getState().vehicles.status).toBe('succeeded');
  });

  it('createVehicleThunk adds a new vehicle', async () => {
    vi.mocked(fetchVehicles).mockResolvedValue({ success: true, data: mockVehicles });
    const newVehicle = { id: '3', plate_number: 'BK 9999', type: 'TRUCK_SMALL', capacity: 6, driver_id: null, status: 'IDLE', created_at: '', updated_at: '' };
    vi.mocked(createVehicle).mockResolvedValue({ success: true, data: newVehicle });

    const store = createTestStore();
    await store.dispatch(fetchVehiclesThunk());
    await store.dispatch(createVehicleThunk({ plateNumber: 'BK 9999', type: 'TRUCK_SMALL', capacity: 6 }));

    expect(store.getState().vehicles.items).toHaveLength(3);
  });

  it('deleteVehicleThunk removes a vehicle', async () => {
    vi.mocked(fetchVehicles).mockResolvedValue({ success: true, data: mockVehicles });
    vi.mocked(deleteVehicle).mockResolvedValue({ success: true });

    const store = createTestStore();
    await store.dispatch(fetchVehiclesThunk());
    await store.dispatch(deleteVehicleThunk('1'));

    expect(store.getState().vehicles.items).toHaveLength(1);
    expect(store.getState().vehicles.items[0]?.id).toBe('2');
  });
});
