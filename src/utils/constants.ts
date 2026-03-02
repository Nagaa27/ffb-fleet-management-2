// src/utils/constants.ts
// Business constants — DO NOT CHANGE without updating .agent/CONSTANTS.md
// These values drive the core business logic of the application.

/** Produksi FFB per jam dalam satu mill (ton) */
export const FFB_PRODUCTION_PER_HOUR = 30; // ton/hour

/** Durasi shift operasional harian (jam) */
export const OPERATIONAL_SHIFT_HOURS = 8; // hours/day

/** Total produksi FFB per mill per hari: 30 × 8 = 240 ton/day */
export const DAILY_PRODUCTION_PER_MILL =
  FFB_PRODUCTION_PER_HOUR * OPERATIONAL_SHIFT_HOURS; // = 240

/** Kapasitas maksimum kendaraan (ton) */
export const MAX_VEHICLE_CAPACITY = 12; // ton

/** Minimum trips yang dibutuhkan per mill per hari */
export const MIN_TRIPS_PER_MILL_PER_DAY = Math.ceil(
  DAILY_PRODUCTION_PER_MILL / MAX_VEHICLE_CAPACITY,
); // = ceil(240/12) = 20 trips

/** Batas warning kapasitas kendaraan (%) */
export const CAPACITY_WARNING_THRESHOLD = 90; // %

/** Batas maksimum trip per driver per hari */
export const MAX_TRIPS_PER_DRIVER_PER_DAY = 3;

/** Port default server */
export const DEFAULT_PORT = 3000;

/** Path default database SQLite */
export const DEFAULT_DB_PATH = './data/database.sqlite';
