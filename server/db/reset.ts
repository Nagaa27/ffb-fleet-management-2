// server/db/reset.ts
// Reset script: drops all tables and re-creates schema.
// Run with: npm run db:reset

import { createConnection, resetDatabase, initializeDatabase } from './connection';

const db = createConnection();

console.log('🗑️  Resetting database...');
resetDatabase(db);
console.log('  ✅ All tables dropped');

initializeDatabase(db);
console.log('  ✅ Schema re-created');

db.close();
console.log('\n🎉 Database reset successfully! Run `npm run db:seed` to repopulate.');
