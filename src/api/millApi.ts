// src/api/millApi.ts
// Client-side API functions for mill management.
// BFF Architecture: All data fetching goes through src/api/ — never direct from components.

import type { ApiResponse } from '../types/api';

interface MillResponse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  contact_person: string;
  phone_number: string;
  avg_daily_production: number;
  created_at: string;
  updated_at: string;
}

export async function fetchMills(): Promise<ApiResponse<MillResponse[]>> {
  try {
    const res = await fetch('/api/mills');
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<MillResponse[]>;
  } catch {
    return { data: null, error: 'Failed to fetch mills', success: false };
  }
}

export async function fetchMillById(id: string): Promise<ApiResponse<MillResponse>> {
  try {
    const res = await fetch(`/api/mills/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<MillResponse>;
  } catch {
    return { data: null, error: 'Failed to fetch mill', success: false };
  }
}

export async function createMill(data: {
  name: string;
  location: { latitude: number; longitude: number; address?: string };
  contactPerson: string;
  phoneNumber: string;
  avgDailyProduction: number;
}): Promise<ApiResponse<MillResponse>> {
  try {
    const res = await fetch('/api/mills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to create mill', success: false };
    }
    return await res.json() as ApiResponse<MillResponse>;
  } catch {
    return { data: null, error: 'Failed to create mill', success: false };
  }
}

export async function updateMill(
  id: string,
  data: {
    name?: string;
    location?: { latitude: number; longitude: number; address?: string };
    contactPerson?: string;
    phoneNumber?: string;
    avgDailyProduction?: number;
  },
): Promise<ApiResponse<MillResponse>> {
  try {
    const res = await fetch(`/api/mills/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as ApiResponse<null>;
      return { data: null, error: err.error ?? 'Failed to update mill', success: false };
    }
    return await res.json() as ApiResponse<MillResponse>;
  } catch {
    return { data: null, error: 'Failed to update mill', success: false };
  }
}
