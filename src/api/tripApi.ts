// src/api/tripApi.ts
// Client-side API functions for trip management.
// BFF Architecture: All data fetching goes through src/api/ — never direct from components.

import type { ApiResponse } from '../types/api';

interface TripResponse {
  id: string;
  vehicle_id: string;
  driver_id: string;
  scheduled_date: string;
  status: string;
  estimated_duration: number;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicle_plate_number?: string;
  vehicle_type?: string;
  vehicle_capacity?: number;
  driver_name?: string;
  driver_license_number?: string;
  collections?: CollectionResponse[];
}

interface CollectionResponse {
  id: string;
  trip_id: string;
  mill_id: string;
  planned_weight: number;
  actual_weight: number | null;
  collected_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  mill_name?: string;
  mill_latitude?: number;
  mill_longitude?: number;
  mill_address?: string | null;
}

interface TripFilters {
  date?: string;
  status?: string;
  vehicleId?: string;
  driverId?: string;
  millId?: string;
}

export async function fetchTrips(filters: TripFilters = {}): Promise<ApiResponse<TripResponse[]>> {
  try {
    const params = new URLSearchParams();
    if (filters.date) params.set('date', filters.date);
    if (filters.status) params.set('status', filters.status);
    if (filters.vehicleId) params.set('vehicleId', filters.vehicleId);
    if (filters.driverId) params.set('driverId', filters.driverId);
    if (filters.millId) params.set('millId', filters.millId);

    const queryString = params.toString();
    const url = queryString ? `/api/trips?${queryString}` : '/api/trips';

    const res = await fetch(url);
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<TripResponse[]>;
  } catch {
    return { data: null, error: 'Failed to fetch trips', success: false };
  }
}

export async function fetchTripById(id: string): Promise<ApiResponse<TripResponse>> {
  try {
    const res = await fetch(`/api/trips/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<TripResponse>;
  } catch {
    return { data: null, error: 'Failed to fetch trip', success: false };
  }
}

export async function createTrip(data: {
  vehicleId: string;
  driverId: string;
  millIds: string[];
  scheduledDate: string;
  plannedWeightPerMill: Record<string, number>;
  estimatedDuration: number;
  notes?: string;
}): Promise<ApiResponse<TripResponse>> {
  try {
    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to create trip', success: false };
    }
    return await res.json() as ApiResponse<TripResponse>;
  } catch {
    return { data: null, error: 'Failed to create trip', success: false };
  }
}

export async function updateTripStatus(
  id: string,
  data: { status: string; cancellationReason?: string },
): Promise<ApiResponse<TripResponse>> {
  try {
    const res = await fetch(`/api/trips/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to update trip status', success: false };
    }
    return await res.json() as ApiResponse<TripResponse>;
  } catch {
    return { data: null, error: 'Failed to update trip status', success: false };
  }
}

export async function recordCollection(
  tripId: string,
  data: { millId: string; actualWeight: number; notes?: string },
): Promise<ApiResponse<CollectionResponse>> {
  try {
    const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to record collection', success: false };
    }
    return await res.json() as ApiResponse<CollectionResponse>;
  } catch {
    return { data: null, error: 'Failed to record collection', success: false };
  }
}
