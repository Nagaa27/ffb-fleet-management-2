// server/db/queries/tripQueries.ts
// Repository pattern: all trip-related SQLite queries.
// BFF Architecture: SQLite access ONLY in server/ folder.

import type Database from 'better-sqlite3';

export interface TripRow {
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
  // Joined fields
  vehicle_plate_number?: string;
  vehicle_type?: string;
  vehicle_capacity?: number;
  driver_name?: string;
  driver_license_number?: string;
}

export interface CollectionRow {
  id: string;
  trip_id: string;
  mill_id: string;
  planned_weight: number;
  actual_weight: number | null;
  collected_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined mill fields
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

export function getAllTrips(db: Database.Database, filters: TripFilters = {}): TripRow[] {
  let query = `
    SELECT t.*,
      v.plate_number as vehicle_plate_number,
      v.type as vehicle_type,
      v.capacity as vehicle_capacity,
      d.name as driver_name,
      d.license_number as driver_license_number
    FROM trips t
    JOIN vehicles v ON t.vehicle_id = v.id
    JOIN drivers d ON t.driver_id = d.id
  `;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.date) {
    conditions.push('t.scheduled_date = ?');
    params.push(filters.date);
  }
  if (filters.status) {
    conditions.push('t.status = ?');
    params.push(filters.status);
  }
  if (filters.vehicleId) {
    conditions.push('t.vehicle_id = ?');
    params.push(filters.vehicleId);
  }
  if (filters.driverId) {
    conditions.push('t.driver_id = ?');
    params.push(filters.driverId);
  }
  if (filters.millId) {
    query += ' JOIN trip_mills tm ON t.id = tm.trip_id';
    conditions.push('tm.mill_id = ?');
    params.push(filters.millId);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY t.scheduled_date DESC, t.created_at DESC';

  const stmt = db.prepare(query);
  return stmt.all(...params) as TripRow[];
}

export function getTripById(db: Database.Database, id: string): TripRow | undefined {
  const stmt = db.prepare(`
    SELECT t.*,
      v.plate_number as vehicle_plate_number,
      v.type as vehicle_type,
      v.capacity as vehicle_capacity,
      d.name as driver_name,
      d.license_number as driver_license_number
    FROM trips t
    JOIN vehicles v ON t.vehicle_id = v.id
    JOIN drivers d ON t.driver_id = d.id
    WHERE t.id = ?
  `);
  return stmt.get(id) as TripRow | undefined;
}

export function getCollectionsByTripId(db: Database.Database, tripId: string): CollectionRow[] {
  const stmt = db.prepare(`
    SELECT c.*,
      m.name as mill_name,
      m.latitude as mill_latitude,
      m.longitude as mill_longitude,
      m.address as mill_address
    FROM collections c
    JOIN mills m ON c.mill_id = m.id
    WHERE c.trip_id = ?
    ORDER BY c.created_at ASC
  `);
  return stmt.all(tripId) as CollectionRow[];
}

export function createTrip(
  db: Database.Database,
  data: {
    id: string;
    vehicleId: string;
    driverId: string;
    scheduledDate: string;
    estimatedDuration: number;
    notes?: string;
    millIds: string[];
    plannedWeightPerMill: Record<string, number>;
    createdAt: string;
    updatedAt: string;
  },
): TripRow {
  const insertTrip = db.prepare(`
    INSERT INTO trips (id, vehicle_id, driver_id, scheduled_date, status, estimated_duration, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'SCHEDULED', ?, ?, ?, ?)
  `);

  const insertTripMill = db.prepare(`
    INSERT INTO trip_mills (trip_id, mill_id) VALUES (?, ?)
  `);

  const insertCollection = db.prepare(`
    INSERT INTO collections (id, trip_id, mill_id, planned_weight, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    insertTrip.run(
      data.id, data.vehicleId, data.driverId, data.scheduledDate,
      data.estimatedDuration, data.notes ?? null, data.createdAt, data.updatedAt,
    );

    for (const millId of data.millIds) {
      insertTripMill.run(data.id, millId);

      // Create a collection record for each mill
      const collectionId = `col-${data.id}-${millId}`;
      const plannedWeight = data.plannedWeightPerMill[millId] ?? 0;
      insertCollection.run(collectionId, data.id, millId, plannedWeight, data.createdAt, data.updatedAt);
    }
  });

  transaction();
  return getTripById(db, data.id)!;
}

export function updateTripStatus(
  db: Database.Database,
  id: string,
  data: { status: string; cancellationReason?: string; updatedAt: string },
): TripRow | undefined {
  const fields: string[] = ['status = ?', 'updated_at = ?'];
  const values: unknown[] = [data.status, data.updatedAt];

  if (data.status === 'IN_PROGRESS') {
    fields.push('started_at = ?');
    values.push(data.updatedAt);
  } else if (data.status === 'COMPLETED') {
    fields.push('completed_at = ?');
    values.push(data.updatedAt);
  } else if (data.status === 'CANCELLED') {
    fields.push('cancelled_at = ?');
    values.push(data.updatedAt);
    if (data.cancellationReason) {
      fields.push('cancellation_reason = ?');
      values.push(data.cancellationReason);
    }
  }

  values.push(id);

  const stmt = db.prepare(`UPDATE trips SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  return getTripById(db, id);
}

export function recordCollection(
  db: Database.Database,
  data: { tripId: string; millId: string; actualWeight: number; notes?: string; updatedAt: string },
): CollectionRow | undefined {
  const stmt = db.prepare(`
    UPDATE collections
    SET actual_weight = ?, collected_at = ?, notes = ?, updated_at = ?
    WHERE trip_id = ? AND mill_id = ?
  `);
  stmt.run(data.actualWeight, data.updatedAt, data.notes ?? null, data.updatedAt, data.tripId, data.millId);

  const result = db.prepare(`
    SELECT c.*, m.name as mill_name, m.latitude as mill_latitude, m.longitude as mill_longitude, m.address as mill_address
    FROM collections c JOIN mills m ON c.mill_id = m.id
    WHERE c.trip_id = ? AND c.mill_id = ?
  `).get(data.tripId, data.millId) as CollectionRow | undefined;

  return result;
}

// Check if a driver already has a trip on a given date
export function hasDriverConflict(db: Database.Database, driverId: string, date: string, excludeTripId?: string): boolean {
  let query = `
    SELECT COUNT(*) as count FROM trips
    WHERE driver_id = ? AND scheduled_date = ? AND status IN ('SCHEDULED', 'IN_PROGRESS')
  `;
  const params: unknown[] = [driverId, date];

  if (excludeTripId) {
    query += ' AND id != ?';
    params.push(excludeTripId);
  }

  const result = db.prepare(query).get(...params) as { count: number };
  return result.count > 0;
}

// Check if a vehicle already has a trip on a given date
export function hasVehicleConflict(db: Database.Database, vehicleId: string, date: string, excludeTripId?: string): boolean {
  let query = `
    SELECT COUNT(*) as count FROM trips
    WHERE vehicle_id = ? AND scheduled_date = ? AND status IN ('SCHEDULED', 'IN_PROGRESS')
  `;
  const params: unknown[] = [vehicleId, date];

  if (excludeTripId) {
    query += ' AND id != ?';
    params.push(excludeTripId);
  }

  const result = db.prepare(query).get(...params) as { count: number };
  return result.count > 0;
}
