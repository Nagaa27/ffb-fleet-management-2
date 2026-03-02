// server/db/queries/driverQueries.ts
// Repository pattern: all driver-related SQLite queries.
// BFF Architecture: SQLite access ONLY in server/ folder.

import type Database from 'better-sqlite3';

export interface DriverRow {
  id: string;
  name: string;
  license_number: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function getAllDrivers(db: Database.Database): DriverRow[] {
  const stmt = db.prepare(`
    SELECT * FROM drivers ORDER BY name ASC
  `);
  return stmt.all() as DriverRow[];
}

export function getDriverById(db: Database.Database, id: string): DriverRow | undefined {
  const stmt = db.prepare(`SELECT * FROM drivers WHERE id = ?`);
  return stmt.get(id) as DriverRow | undefined;
}

export function getAvailableDrivers(db: Database.Database, date: string): DriverRow[] {
  const stmt = db.prepare(`
    SELECT d.* FROM drivers d
    WHERE d.status = 'AVAILABLE'
      AND d.id NOT IN (
        SELECT t.driver_id FROM trips t
        WHERE t.scheduled_date = ?
          AND t.status IN ('SCHEDULED', 'IN_PROGRESS')
      )
    ORDER BY d.name ASC
  `);
  return stmt.all(date) as DriverRow[];
}

export function createDriver(
  db: Database.Database,
  data: { id: string; name: string; licenseNumber: string; phoneNumber: string; createdAt: string; updatedAt: string },
): DriverRow {
  const stmt = db.prepare(`
    INSERT INTO drivers (id, name, license_number, phone_number, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'AVAILABLE', ?, ?)
  `);
  stmt.run(data.id, data.name, data.licenseNumber, data.phoneNumber, data.createdAt, data.updatedAt);
  return getDriverById(db, data.id)!;
}

export function updateDriver(
  db: Database.Database,
  id: string,
  data: { name?: string; licenseNumber?: string; phoneNumber?: string; status?: string; updatedAt: string },
): DriverRow | undefined {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.licenseNumber !== undefined) { fields.push('license_number = ?'); values.push(data.licenseNumber); }
  if (data.phoneNumber !== undefined) { fields.push('phone_number = ?'); values.push(data.phoneNumber); }
  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
  fields.push('updated_at = ?');
  values.push(data.updatedAt);
  values.push(id);

  const stmt = db.prepare(`UPDATE drivers SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  return getDriverById(db, id);
}

export function deleteDriver(db: Database.Database, id: string): boolean {
  // Check for active trips
  const activeTrips = db.prepare(`
    SELECT COUNT(*) as count FROM trips
    WHERE driver_id = ? AND status IN ('SCHEDULED', 'IN_PROGRESS')
  `).get(id) as { count: number };

  if (activeTrips.count > 0) {
    return false;
  }

  const stmt = db.prepare(`DELETE FROM drivers WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}
