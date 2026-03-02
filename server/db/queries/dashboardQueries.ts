// server/db/queries/dashboardQueries.ts
// Repository pattern: dashboard aggregation queries.
// BFF Architecture: Dedicated endpoint for dashboard — avoids multiple client-side API calls.

import type Database from 'better-sqlite3';

export interface DashboardSummaryRow {
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  maintenanceVehicles: number;
  availableDrivers: number;
  onDutyDrivers: number;
  todayScheduled: number;
  todayInProgress: number;
  todayCompleted: number;
  todayCollectedTons: number;
  todayTargetTons: number;
}

export function getDashboardSummary(db: Database.Database, date: string): DashboardSummaryRow {
  // Vehicle counts
  const vehicleCounts = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'IDLE' THEN 1 ELSE 0 END) as idle,
      SUM(CASE WHEN status = 'MAINTENANCE' THEN 1 ELSE 0 END) as maintenance
    FROM vehicles
  `).get() as { total: number; active: number; idle: number; maintenance: number };

  // Driver counts
  const driverCounts = db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
      SUM(CASE WHEN status = 'ON_DUTY' THEN 1 ELSE 0 END) as on_duty
    FROM drivers
  `).get() as { available: number; on_duty: number };

  // Trip counts for the date
  const tripCounts = db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'SCHEDULED' THEN 1 ELSE 0 END) as scheduled,
      SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed
    FROM trips
    WHERE scheduled_date = ?
  `).get(date) as { scheduled: number; in_progress: number; completed: number };

  // Today's collected tons (actual weight from completed collections)
  const collectedTons = db.prepare(`
    SELECT COALESCE(SUM(c.actual_weight), 0) as total
    FROM collections c
    JOIN trips t ON c.trip_id = t.id
    WHERE t.scheduled_date = ? AND c.actual_weight IS NOT NULL
  `).get(date) as { total: number };

  // Today's target tons (planned weight for all trips today)
  const targetTons = db.prepare(`
    SELECT COALESCE(SUM(c.planned_weight), 0) as total
    FROM collections c
    JOIN trips t ON c.trip_id = t.id
    WHERE t.scheduled_date = ?
  `).get(date) as { total: number };

  return {
    totalVehicles: vehicleCounts.total,
    activeVehicles: vehicleCounts.active,
    idleVehicles: vehicleCounts.idle,
    maintenanceVehicles: vehicleCounts.maintenance,
    availableDrivers: driverCounts.available ?? 0,
    onDutyDrivers: driverCounts.on_duty ?? 0,
    todayScheduled: tripCounts.scheduled ?? 0,
    todayInProgress: tripCounts.in_progress ?? 0,
    todayCompleted: tripCounts.completed ?? 0,
    todayCollectedTons: collectedTons.total,
    todayTargetTons: targetTons.total,
  };
}
