// src/store/__tests__/millsSlice.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  millsReducer,
  fetchMillsThunk,
  createMillThunk,
  updateMillThunk,
  clearMillsError,
} from '../millsSlice';

vi.mock('../../api/millApi', () => ({
  fetchMills: vi.fn(),
  fetchMillById: vi.fn(),
  createMill: vi.fn(),
  updateMill: vi.fn(),
}));

import { fetchMills, createMill, updateMill } from '../../api/millApi';

const mockMills = [
  {
    id: 'm1',
    name: 'PKS Satu',
    latitude: 1.5,
    longitude: 103.5,
    address: 'Alamat 1',
    contact_person: 'Andi',
    phone_number: '0812',
    avg_daily_production: 240,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'm2',
    name: 'PKS Dua',
    latitude: 1.6,
    longitude: 103.6,
    address: 'Alamat 2',
    contact_person: 'Budi',
    phone_number: '0813',
    avg_daily_production: 200,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

function createTestStore() {
  return configureStore({
    reducer: { mills: millsReducer },
  });
}

describe('millsSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has correct initial state', () => {
    const store = createTestStore();
    expect(store.getState().mills.items).toEqual([]);
    expect(store.getState().mills.status).toBe('idle');
    expect(store.getState().mills.error).toBeNull();
  });

  it('fetchMillsThunk populates items on success', async () => {
    vi.mocked(fetchMills).mockResolvedValue({ success: true, data: mockMills, error: null });

    const store = createTestStore();
    await store.dispatch(fetchMillsThunk());

    expect(store.getState().mills.items).toEqual(mockMills);
    expect(store.getState().mills.status).toBe('succeeded');
  });

  it('fetchMillsThunk sets error on failure', async () => {
    vi.mocked(fetchMills).mockResolvedValue({ success: false, data: null, error: 'Server error' });

    const store = createTestStore();
    await store.dispatch(fetchMillsThunk());

    expect(store.getState().mills.status).toBe('failed');
    expect(store.getState().mills.error).toBeTruthy();
  });

  it('createMillThunk adds a new mill', async () => {
    vi.mocked(fetchMills).mockResolvedValue({ success: true, data: mockMills, error: null });
    const newMill = { id: 'm3', name: 'PKS Tiga', latitude: 1.7, longitude: 103.7, address: 'Alamat 3', contact_person: 'Charlie', phone_number: '0814', avg_daily_production: 180, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' };
    vi.mocked(createMill).mockResolvedValue({ success: true, data: newMill, error: null });

    const store = createTestStore();
    await store.dispatch(fetchMillsThunk());
    await store.dispatch(createMillThunk({
      name: 'PKS Tiga',
      location: { latitude: 1.7, longitude: 103.7 },
      contactPerson: 'Charlie',
      phoneNumber: '0814',
      avgDailyProduction: 180,
    }));

    expect(store.getState().mills.items).toHaveLength(3);
  });

  it('updateMillThunk updates existing mill', async () => {
    vi.mocked(fetchMills).mockResolvedValue({ success: true, data: mockMills, error: null });
    const updated = { id: 'm1', name: 'PKS Satu Updated', latitude: 1.5, longitude: 103.5, address: 'Alamat 1', contact_person: 'Andi', phone_number: '0812', avg_daily_production: 240, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' };
    vi.mocked(updateMill).mockResolvedValue({ success: true, data: updated, error: null });

    const store = createTestStore();
    await store.dispatch(fetchMillsThunk());
    await store.dispatch(updateMillThunk({ id: 'm1', data: { name: 'PKS Satu Updated' } }));

    expect(store.getState().mills.items[0]?.name).toBe('PKS Satu Updated');
  });

  it('clearMillsError resets error', async () => {
    vi.mocked(fetchMills).mockResolvedValue({ success: false, data: null, error: 'Error' });

    const store = createTestStore();
    await store.dispatch(fetchMillsThunk());
    expect(store.getState().mills.error).toBeTruthy();

    store.dispatch(clearMillsError());
    expect(store.getState().mills.error).toBeNull();
  });
});
