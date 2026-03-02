-- server/db/schema.sql
-- FFB Fleet Management — Database Schema
-- SQLite with WAL mode for concurrent reads

CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  plate_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  capacity REAL NOT NULL,
  driver_id TEXT REFERENCES drivers(id),
  status TEXT NOT NULL DEFAULT 'IDLE',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  contact_person TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  avg_daily_production REAL NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  driver_id TEXT NOT NULL REFERENCES drivers(id),
  scheduled_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  estimated_duration INTEGER NOT NULL,
  started_at TEXT,
  completed_at TEXT,
  cancelled_at TEXT,
  cancellation_reason TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trip_mills (
  trip_id TEXT NOT NULL REFERENCES trips(id),
  mill_id TEXT NOT NULL REFERENCES mills(id),
  PRIMARY KEY (trip_id, mill_id)
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES trips(id),
  mill_id TEXT NOT NULL REFERENCES mills(id),
  planned_weight REAL NOT NULL,
  actual_weight REAL,
  collected_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_trips_scheduled_date ON trips(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_collections_trip_id ON collections(trip_id);
CREATE INDEX IF NOT EXISTS idx_collections_mill_id ON collections(mill_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
