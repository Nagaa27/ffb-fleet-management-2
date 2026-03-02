// server/db/queries/millQueries.ts
// Repository pattern: all mill-related SQLite queries.
// BFF Architecture: SQLite access ONLY in server/ folder.

import type Database from 'better-sqlite3';

export interface MillRow {
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

export function getAllMills(db: Database.Database): MillRow[] {
  const stmt = db.prepare(`SELECT * FROM mills ORDER BY name ASC`);
  return stmt.all() as MillRow[];
}

export function getMillById(db: Database.Database, id: string): MillRow | undefined {
  const stmt = db.prepare(`SELECT * FROM mills WHERE id = ?`);
  return stmt.get(id) as MillRow | undefined;
}

export function createMill(
  db: Database.Database,
  data: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
    contactPerson: string;
    phoneNumber: string;
    avgDailyProduction: number;
    createdAt: string;
    updatedAt: string;
  },
): MillRow {
  const stmt = db.prepare(`
    INSERT INTO mills (id, name, latitude, longitude, address, contact_person, phone_number, avg_daily_production, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    data.id, data.name, data.latitude, data.longitude, data.address ?? null,
    data.contactPerson, data.phoneNumber, data.avgDailyProduction,
    data.createdAt, data.updatedAt,
  );
  return getMillById(db, data.id)!;
}

export function updateMill(
  db: Database.Database,
  id: string,
  data: {
    name?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    contactPerson?: string;
    phoneNumber?: string;
    avgDailyProduction?: number;
    updatedAt: string;
  },
): MillRow | undefined {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.latitude !== undefined) { fields.push('latitude = ?'); values.push(data.latitude); }
  if (data.longitude !== undefined) { fields.push('longitude = ?'); values.push(data.longitude); }
  if (data.address !== undefined) { fields.push('address = ?'); values.push(data.address); }
  if (data.contactPerson !== undefined) { fields.push('contact_person = ?'); values.push(data.contactPerson); }
  if (data.phoneNumber !== undefined) { fields.push('phone_number = ?'); values.push(data.phoneNumber); }
  if (data.avgDailyProduction !== undefined) { fields.push('avg_daily_production = ?'); values.push(data.avgDailyProduction); }
  fields.push('updated_at = ?');
  values.push(data.updatedAt);
  values.push(id);

  const stmt = db.prepare(`UPDATE mills SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  return getMillById(db, id);
}
