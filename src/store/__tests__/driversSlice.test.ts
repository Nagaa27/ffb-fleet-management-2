// src/store/__tests__/driversSlice.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  driversReducer,
  fetchDriversThunk,
  createDriverThunk,
  deleteDriverThunk,
} from '../driversSlice';

vi.mock('../../api/driverApi', () => ({
  fetchDrivers: vi.fn(),
  createDriver: vi.fn(),
  updateDriver: vi.fn(),
  deleteDriver: vi.fn(),
}));

import { fetchDrivers, createDriver, deleteDriver } from '../../api/driverApi';

const mockDrivers = [
  { id: '1', name: 'Budi', license_number: 'SIM-001', phone_number: '0812', status: 'AVAILABLE', created_at: '', updated_at: '' },
  { id: '2', name: 'Ahmad', license_number: 'SIM-002', phone_number: '0813', status: 'ON_DUTY', created_at: '', updated_at: '' },
];

function createTestStore() {
  return configureStore({
    reducer: { drivers: driversReducer },
  });
}

describe('driversSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has correct initial state', () => {
    const store = createTestStore();
    expect(store.getState().drivers.items).toEqual([]);
    expect(store.getState().drivers.status).toBe('idle');
  });

  it('fetchDriversThunk populates items', async () => {
    vi.mocked(fetchDrivers).mockResolvedValue({ success: true, data: mockDrivers });

    const store = createTestStore();
    await store.dispatch(fetchDriversThunk());

    expect(store.getState().drivers.items).toEqual(mockDrivers);
    expect(store.getState().drivers.status).toBe('succeeded');
  });

  it('createDriverThunk adds a new driver', async () => {
    vi.mocked(fetchDrivers).mockResolvedValue({ success: true, data: mockDrivers });
    const newDriver = { id: '3', name: 'New', license_number: 'SIM-003', phone_number: '0814', status: 'AVAILABLE', created_at: '', updated_at: '' };
    vi.mocked(createDriver).mockResolvedValue({ success: true, data: newDriver });

    const store = createTestStore();
    await store.dispatch(fetchDriversThunk());
    await store.dispatch(createDriverThunk({ name: 'New', licenseNumber: 'SIM-003', phoneNumber: '0814' }));

    expect(store.getState().drivers.items).toHaveLength(3);
  });

  it('deleteDriverThunk removes a driver', async () => {
    vi.mocked(fetchDrivers).mockResolvedValue({ success: true, data: mockDrivers });
    vi.mocked(deleteDriver).mockResolvedValue({ success: true });

    const store = createTestStore();
    await store.dispatch(fetchDriversThunk());
    await store.dispatch(deleteDriverThunk('1'));

    expect(store.getState().drivers.items).toHaveLength(1);
    expect(store.getState().drivers.items[0]?.id).toBe('2');
  });
});
