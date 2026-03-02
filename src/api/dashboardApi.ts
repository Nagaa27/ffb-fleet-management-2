// src/api/dashboardApi.ts
// Client-side API functions for dashboard.
// BFF Architecture: Single dedicated endpoint for dashboard aggregation.

import type { ApiResponse } from '../types/api';
import type { DashboardSummary } from '../types/index';

export async function fetchDashboardSummary(date?: string): Promise<ApiResponse<DashboardSummary>> {
  try {
    const dateParam = date ?? new Date().toISOString().split('T')[0]!;
    const res = await fetch(`/api/dashboard/summary?date=${encodeURIComponent(dateParam)}`);
    if (!res.ok) throw new Error('Request failed');
    return await res.json() as ApiResponse<DashboardSummary>;
  } catch {
    return { data: null, error: 'Failed to fetch dashboard summary', success: false };
  }
}
