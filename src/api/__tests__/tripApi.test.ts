// src/api/__tests__/tripApi.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchTrips, fetchTripById, createTrip, updateTripStatus } from '../tripApi';

const mockFetch = vi.fn();

describe('tripApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchTrips', () => {
    it('calls /api/trips without params by default', async () => {
      const mockData = { success: true, data: [], error: null };
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

      const result = await fetchTrips();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/trips');
    });

    it('appends query params when filters provided', async () => {
      const mockData = { success: true, data: [], error: null };
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

      await fetchTrips({ date: '2025-01-01', status: 'SCHEDULED' });
      const calledUrl = mockFetch.mock.calls[0]![0] as string;
      expect(calledUrl).toContain('date=2025-01-01');
      expect(calledUrl).toContain('status=SCHEDULED');
    });

    it('returns error on HTTP failure', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      const result = await fetchTrips();
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
    });

    it('returns error on network failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network'));

      const result = await fetchTrips();
      expect(result.success).toBe(false);
    });
  });

  describe('fetchTripById', () => {
    it('calls correct URL', async () => {
      const mockData = { success: true, data: { id: 'trip-1' }, error: null };
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

      await fetchTripById('trip-1');
      expect(mockFetch).toHaveBeenCalledWith('/api/trips/trip-1');
    });
  });

  describe('createTrip', () => {
    it('sends POST request with trip data', async () => {
      const mockData = { success: true, data: { id: 'trip-new' }, error: null };
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

      const result = await createTrip({
        vehicleId: 'v1',
        driverId: 'd1',
        millIds: ['m1'],
        scheduledDate: '2025-01-01',
        plannedWeightPerMill: { m1: 10 },
        estimatedDuration: 60,
      });

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('/api/trips', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('returns server error message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ success: false, data: null, error: 'Vehicle in use' }),
      });

      const result = await createTrip({
        vehicleId: 'v1',
        driverId: 'd1',
        millIds: ['m1'],
        scheduledDate: '2025-01-01',
        plannedWeightPerMill: { m1: 10 },
        estimatedDuration: 60,
      });

      expect(result.error).toBe('Vehicle in use');
    });
  });

  describe('updateTripStatus', () => {
    it('sends PUT request to status endpoint', async () => {
      const mockData = { success: true, data: { id: 'trip-1', status: 'IN_PROGRESS' }, error: null };
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

      const result = await updateTripStatus('trip-1', { status: 'IN_PROGRESS' });

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/trips/trip-1/status',
        expect.objectContaining({ method: 'PUT' }),
      );
    });
  });
});
