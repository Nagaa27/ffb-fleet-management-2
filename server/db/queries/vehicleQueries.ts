// server/db/queries/vehicleQueries.ts
// Repository pattern: all vehicle-related SQLite queries.
// BFF Architecture: SQLite access ONLY in server/ folder.

import type Database from 'better-sqlite3';

export interface VehicleRow {
  id: string;
  plate_number: string;
  type: string;
  capacity: number;
  driver_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined driver fields (optional)
  driver_name?: string;
  driver_license_number?: string;
  driver_phone_number?: string;
  driver_status?: string;
}

export function getAllVehicles(db: Database.Database): VehicleRow[] {
  const stmt = db.prepare(`
    SELECT v.*,
      d.name as driver_name,
      d.license_number as driver_license_number,
      d.phone_number as driver_phone_number,
      d.status as driver_status
    FROM vehicles v
    LEFT JOIN drivers d ON v.driver_id = d.id
    ORDER BY v.plate_number ASC
  `);
  return stmt.all() as VehicleRow[];
}

export function getVehicleById(db: Database.Database, id: string): VehicleRow | undefined {
  const stmt = db.prepare(`
    SELECT v.*,
      d.name as driver_name,
      d.license_number as driver_license_number,
      d.phone_number as driver_phone_number,
      d.status as driver_status
    FROM vehicles v
    LEFT JOIN drivers d ON v.driver_id = d.id
    WHERE v.id = ?
  `);
  return stmt.get(id) as VehicleRow | undefined;
}

export function createVehicle(
  db: Database.Database,
  data: { id: string; plateNumber: string; type: string; capacity: number; driverId?: string; createdAt: string; updatedAt: string },
): VehicleRow {
  const stmt = db.prepare(`
    INSERT INTO vehicles (id, plate_number, type, capacity, driver_id, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'IDLE', ?, ?)
  `);
  stmt.run(data.id, data.plateNumber, data.type, data.capacity, data.driverId ?? null, data.createdAt, data.updatedAt);
  return getVehicleById(db, data.id)!;
}

export function updateVehicle(
  db: Database.Database,
  id: string,
  data: { plateNumber?: string; type?: string; capacity?: number; status?: string; updatedAt: string },
): VehicleRow | undefined {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.plateNumber !== undefined) { fields.push('plate_number = ?'); values.push(data.plateNumber); }
  if (data.type !== undefined) { fields.push('type = ?'); values.push(data.type); }
  if (data.capacity !== undefined) { fields.push('capacity = ?'); values.push(data.capacity); }
  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
  fields.push('updated_at = ?');
  values.push(data.updatedAt);
  values.push(id);

  const stmt = db.prepare(`UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  return getVehicleById(db, id);
}

export function assignDriver(
  db: Database.Database,
  vehicleId: string,
  driverId: string | null,
  updatedAt: string,
): VehicleRow | undefined {
  const stmt = db.prepare(`UPDATE vehicles SET driver_id = ?, updated_at = ? WHERE id = ?`);
  stmt.run(driverId, updatedAt, vehicleId);
  return getVehicleById(db, vehicleId);
}

export function deleteVehicle(db: Database.Database, id: string): boolean {
  // Check for active trips
  const activeTrips = db.prepare(`
    SELECT COUNT(*) as count FROM trips
    WHERE vehicle_id = ? AND status IN ('SCHEDULED', 'IN_PROGRESS')
  `).get(id) as { count: number };

  if (activeTrips.count > 0) {
    return false;
  }

  const stmt = db.prepare(`DELETE FROM vehicles WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}
