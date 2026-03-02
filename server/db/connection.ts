// server/db/connection.ts
// SQLite database connection with WAL mode.
// BFF Architecture: All database access is ONLY in server/ folder.

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env['DB_PATH'] || './data/database.sqlite';

export function createConnection(dbPath: string = DB_PATH): Database.Database {
  // Ensure data directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath);

  // Enable WAL mode for concurrent reads
  db.pragma('journal_mode = WAL');
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  return db;
}

export function initializeDatabase(db: Database.Database): void {
  const schemaPath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')),
    'schema.sql',
  );

  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
}

export function resetDatabase(db: Database.Database): void {
  db.exec(`
    DROP TABLE IF EXISTS collections;
    DROP TABLE IF EXISTS trip_mills;
    DROP TABLE IF EXISTS trips;
    DROP TABLE IF EXISTS vehicles;
    DROP TABLE IF EXISTS mills;
    DROP TABLE IF EXISTS drivers;
  `);
}
