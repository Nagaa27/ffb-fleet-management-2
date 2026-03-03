// src/api/__tests__/millApi.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchMills, createMill, updateMill } from '../millApi';

const mockFetch = vi.fn();

describe('millApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchMills', () => {
    it('returns data on success', async () => {
      const mockData = { success: true, data: [{ id: 'm1', name: 'Mill' }], error: null };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchMills();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/mills');
    });

    it('returns error on HTTP failure', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      const result = await fetchMills();
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });

    it('returns error on network failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchMills();
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('createMill', () => {
    it('sends POST request with correct data', async () => {
      const mockData = { success: true, data: { id: 'm1' }, error: null };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await createMill({
        name: 'New Mill',
        location: { latitude: 1.0, longitude: 103.0 },
        contactPerson: 'Person',
        phoneNumber: '0812',
        avgDailyProduction: 200,
      });

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('/api/mills', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
    });

    it('returns error from server', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ success: false, data: null, error: 'Duplicate name' }),
      });

      const result = await createMill({
        name: 'Dup',
        location: { latitude: 1.0, longitude: 103.0 },
        contactPerson: 'Person',
        phoneNumber: '0812',
        avgDailyProduction: 200,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Duplicate name');
    });
  });

  describe('updateMill', () => {
    it('sends PUT request with correct data', async () => {
      const mockData = { success: true, data: { id: 'm1', name: 'Updated' }, error: null };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await updateMill('m1', { name: 'Updated' });

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/mills/m1',
        expect.objectContaining({ method: 'PUT' }),
      );
    });
  });
});
