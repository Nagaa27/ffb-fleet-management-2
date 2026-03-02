// src/api/vehicleApi.ts
// Client-side API functions for vehicle management.
// BFF Architecture: All data fetching goes through src/api/ — never direct from components.

import type { ApiResponse } from '../types/api';

interface VehicleResponse {
  id: string;
  plate_number: string;
  type: string;
  capacity: number;
  driver_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  driver_name?: string;
  driver_license_number?: string;
  driver_phone_number?: string;
  driver_status?: string;
}

export async function fetchVehicles(): Promise<ApiResponse<VehicleResponse[]>> {
  try {
    const res = await fetch('/api/vehicles');
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<VehicleResponse[]>;
  } catch {
    return { data: null, error: 'Failed to fetch vehicles', success: false };
  }
}

export async function fetchVehicleById(id: string): Promise<ApiResponse<VehicleResponse>> {
  try {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<VehicleResponse>;
  } catch {
    return { data: null, error: 'Failed to fetch vehicle', success: false };
  }
}

export async function createVehicle(data: {
  plateNumber: string;
  type: string;
  capacity: number;
  driverId?: string;
}): Promise<ApiResponse<VehicleResponse>> {
  try {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to create vehicle', success: false };
    }
    return await res.json() as ApiResponse<VehicleResponse>;
  } catch {
    return { data: null, error: 'Failed to create vehicle', success: false };
  }
}

export async function updateVehicle(
  id: string,
  data: { plateNumber?: string; type?: string; capacity?: number; status?: string },
): Promise<ApiResponse<VehicleResponse>> {
  try {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to update vehicle', success: false };
    }
    return await res.json() as ApiResponse<VehicleResponse>;
  } catch {
    return { data: null, error: 'Failed to update vehicle', success: false };
  }
}

export async function assignDriverToVehicle(
  vehicleId: string,
  driverId: string | null,
): Promise<ApiResponse<VehicleResponse>> {
  try {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(vehicleId)}/driver`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId }),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to assign driver', success: false };
    }
    return await res.json() as ApiResponse<VehicleResponse>;
  } catch {
    return { data: null, error: 'Failed to assign driver', success: false };
  }
}

export async function deleteVehicle(id: string): Promise<ApiResponse<null>> {
  try {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to delete vehicle', success: false };
    }
    return await res.json() as ApiResponse<null>;
  } catch {
    return { data: null, error: 'Failed to delete vehicle', success: false };
  }
}
