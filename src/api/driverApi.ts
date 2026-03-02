// src/api/driverApi.ts
// Client-side API functions for driver management.
// BFF Architecture: All data fetching goes through src/api/ — never direct from components.

import type { ApiResponse } from '../types/api';

interface DriverResponse {
  id: string;
  name: string;
  license_number: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function fetchDrivers(): Promise<ApiResponse<DriverResponse[]>> {
  try {
    const res = await fetch('/api/drivers');
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<DriverResponse[]>;
  } catch {
    return { data: null, error: 'Failed to fetch drivers', success: false };
  }
}

export async function fetchAvailableDrivers(date: string): Promise<ApiResponse<DriverResponse[]>> {
  try {
    const res = await fetch(`/api/drivers/available?date=${encodeURIComponent(date)}`);
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<DriverResponse[]>;
  } catch {
    return { data: null, error: 'Failed to fetch available drivers', success: false };
  }
}

export async function fetchDriverById(id: string): Promise<ApiResponse<DriverResponse>> {
  try {
    const res = await fetch(`/api/drivers/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<DriverResponse>;
  } catch {
    return { data: null, error: 'Failed to fetch driver', success: false };
  }
}

export async function createDriver(data: {
  name: string;
  licenseNumber: string;
  phoneNumber: string;
}): Promise<ApiResponse<DriverResponse>> {
  try {
    const res = await fetch('/api/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to create driver', success: false };
    }
    return await res.json() as ApiResponse<DriverResponse>;
  } catch {
    return { data: null, error: 'Failed to create driver', success: false };
  }
}

export async function updateDriver(
  id: string,
  data: { name?: string; licenseNumber?: string; phoneNumber?: string; status?: string },
): Promise<ApiResponse<DriverResponse>> {
  try {
    const res = await fetch(`/api/drivers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to update driver', success: false };
    }
    return await res.json() as ApiResponse<DriverResponse>;
  } catch {
    return { data: null, error: 'Failed to update driver', success: false };
  }
}

export async function deleteDriver(id: string): Promise<ApiResponse<null>> {
  try {
    const res = await fetch(`/api/drivers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to delete driver', success: false };
    }
    return await res.json() as ApiResponse<null>;
  } catch {
    return { data: null, error: 'Failed to delete driver', success: false };
  }
}
