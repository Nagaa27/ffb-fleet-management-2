// server/db/seed.ts
// Seed script: populates the database with realistic Indonesian data.
// Run with: npm run db:seed

import { createConnection, initializeDatabase } from './connection';
import { v4 as uuidv4 } from 'uuid';

const db = createConnection();
initializeDatabase(db);

console.log('🌱 Seeding database with Indonesian FFB fleet data...');

const now = new Date().toISOString();

// Helper: past date in ISO format
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// Helper: date string YYYY-MM-DD
function dateStr(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0]!;
}

// ═══════════════════════════════════════════════════════════════════════════
// DRIVERS — 10 Indonesian drivers
// ═══════════════════════════════════════════════════════════════════════════
const drivers = [
  { id: 'drv-001', name: 'Budi Santoso', licenseNumber: 'SIM-B2-001-MDN', phoneNumber: '0812-3456-7001', status: 'AVAILABLE' },
  { id: 'drv-002', name: 'Ahmad Hidayat', licenseNumber: 'SIM-B2-002-MDN', phoneNumber: '0813-4567-8002', status: 'AVAILABLE' },
  { id: 'drv-003', name: 'Agus Pratama', licenseNumber: 'SIM-B2-003-PKB', phoneNumber: '0821-5678-9003', status: 'AVAILABLE' },
  { id: 'drv-004', name: 'Rizki Ramadhan', licenseNumber: 'SIM-B2-004-PKB', phoneNumber: '0856-6789-0004', status: 'ON_DUTY' },
  { id: 'drv-005', name: 'Eko Wijaya', licenseNumber: 'SIM-B2-005-DUR', phoneNumber: '0878-7890-1005', status: 'AVAILABLE' },
  { id: 'drv-006', name: 'Hendra Gunawan', licenseNumber: 'SIM-B2-006-DUR', phoneNumber: '0812-8901-2006', status: 'OFF_DUTY' },
  { id: 'drv-007', name: 'Dedi Kurniawan', licenseNumber: 'SIM-B2-007-MDN', phoneNumber: '0813-9012-3007', status: 'AVAILABLE' },
  { id: 'drv-008', name: 'Iwan Setiawan', licenseNumber: 'SIM-B2-008-PKB', phoneNumber: '0821-0123-4008', status: 'AVAILABLE' },
  { id: 'drv-009', name: 'Firman Syahputra', licenseNumber: 'SIM-B2-009-MDN', phoneNumber: '0856-1234-5009', status: 'SICK_LEAVE' },
  { id: 'drv-010', name: 'Joko Susilo', licenseNumber: 'SIM-B2-010-DUR', phoneNumber: '0878-2345-6010', status: 'AVAILABLE' },
];

const insertDriver = db.prepare(`
  INSERT INTO drivers (id, name, license_number, phone_number, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const d of drivers) {
  insertDriver.run(d.id, d.name, d.licenseNumber, d.phoneNumber, d.status, daysAgo(30), now);
}
console.log(`  ✅ ${drivers.length} drivers seeded`);

// ═══════════════════════════════════════════════════════════════════════════
// VEHICLES — 10 Indonesian-plated trucks
// ═══════════════════════════════════════════════════════════════════════════
const vehicles = [
  { id: 'vhc-001', plateNumber: 'BK 1234 AB', type: 'TRUCK_MEDIUM', capacity: 12, driverId: 'drv-001', status: 'IDLE' },
  { id: 'vhc-002', plateNumber: 'BK 2345 CD', type: 'TRUCK_MEDIUM', capacity: 12, driverId: 'drv-002', status: 'IDLE' },
  { id: 'vhc-003', plateNumber: 'BK 3456 EF', type: 'TRUCK_LARGE', capacity: 15, driverId: 'drv-003', status: 'IDLE' },
  { id: 'vhc-004', plateNumber: 'BM 4567 GH', type: 'TRUCK_MEDIUM', capacity: 12, driverId: 'drv-004', status: 'ACTIVE' },
  { id: 'vhc-005', plateNumber: 'BM 5678 IJ', type: 'TRUCK_SMALL', capacity: 8, driverId: 'drv-005', status: 'IDLE' },
  { id: 'vhc-006', plateNumber: 'BM 6789 KL', type: 'TRUCK_MEDIUM', capacity: 12, driverId: null, status: 'MAINTENANCE' },
  { id: 'vhc-007', plateNumber: 'BK 7890 MN', type: 'TRUCK_MEDIUM', capacity: 12, driverId: 'drv-007', status: 'IDLE' },
  { id: 'vhc-008', plateNumber: 'BK 8901 OP', type: 'TRUCK_LARGE', capacity: 15, driverId: 'drv-008', status: 'IDLE' },
  { id: 'vhc-009', plateNumber: 'BM 9012 QR', type: 'TRUCK_SMALL', capacity: 8, driverId: null, status: 'IDLE' },
  { id: 'vhc-010', plateNumber: 'BK 0123 ST', type: 'TRUCK_MEDIUM', capacity: 12, driverId: 'drv-010', status: 'IDLE' },
];

const insertVehicle = db.prepare(`
  INSERT INTO vehicles (id, plate_number, type, capacity, driver_id, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const v of vehicles) {
  insertVehicle.run(v.id, v.plateNumber, v.type, v.capacity, v.driverId, v.status, daysAgo(30), now);
}
console.log(`  ✅ ${vehicles.length} vehicles seeded`);

// ═══════════════════════════════════════════════════════════════════════════
// MILLS — 5 Palm Oil Mills in Sumatra
// ═══════════════════════════════════════════════════════════════════════════
const mills = [
  {
    id: 'mill-001', name: 'PKS Sei Mangkei', latitude: 2.954, longitude: 99.357,
    address: 'Sei Mangkei, Simalungun, Sumatera Utara',
    contactPerson: 'Ir. Sutopo', phoneNumber: '0622-7891-234', avgDailyProduction: 240,
  },
  {
    id: 'mill-002', name: 'PKS Adolina', latitude: 3.537, longitude: 98.783,
    address: 'Perbaungan, Serdang Bedagai, Sumatera Utara',
    contactPerson: 'Ir. Hartono', phoneNumber: '0622-7891-235', avgDailyProduction: 240,
  },
  {
    id: 'mill-003', name: 'PKS Rambutan', latitude: 3.221, longitude: 99.115,
    address: 'Rambutan, Tebing Tinggi, Sumatera Utara',
    contactPerson: 'Ir. Bambang', phoneNumber: '0621-3456-789', avgDailyProduction: 200,
  },
  {
    id: 'mill-004', name: 'PKS Bukit Kapur', latitude: 1.722, longitude: 101.422,
    address: 'Bukit Kapur, Dumai, Riau',
    contactPerson: 'Ir. Wahyu', phoneNumber: '0765-4321-987', avgDailyProduction: 300,
  },
  {
    id: 'mill-005', name: 'PKS Tanjung Medan', latitude: 2.047, longitude: 99.852,
    address: 'Tanjung Medan, Labuhanbatu, Sumatera Utara',
    contactPerson: 'Ir. Sugianto', phoneNumber: '0624-5678-901', avgDailyProduction: 180,
  },
];

const insertMill = db.prepare(`
  INSERT INTO mills (id, name, latitude, longitude, address, contact_person, phone_number, avg_daily_production, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const m of mills) {
  insertMill.run(m.id, m.name, m.latitude, m.longitude, m.address, m.contactPerson, m.phoneNumber, m.avgDailyProduction, daysAgo(30), now);
}
console.log(`  ✅ ${mills.length} mills seeded`);

// ═══════════════════════════════════════════════════════════════════════════
// TRIPS — 50+ trips spanning 7 days
// ═══════════════════════════════════════════════════════════════════════════
interface TripSeed {
  id: string;
  vehicleId: string;
  driverId: string;
  scheduledDate: string;
  status: string;
  estimatedDuration: number;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  notes: string | null;
  mills: { millId: string; plannedWeight: number; actualWeight: number | null }[];
}

const tripSeeds: TripSeed[] = [];
let tripCounter = 0;

// Generate trips for past 3 days (COMPLETED)
for (let dayOffset = -3; dayOffset <= -1; dayOffset++) {
  const date = dateStr(dayOffset);
  const availableVehicles = ['vhc-001', 'vhc-002', 'vhc-003', 'vhc-004', 'vhc-005', 'vhc-007', 'vhc-008', 'vhc-010'];
  const availableDrivers = ['drv-001', 'drv-002', 'drv-003', 'drv-004', 'drv-005', 'drv-007', 'drv-008', 'drv-010'];

  for (let i = 0; i < 6; i++) {
    tripCounter++;
    const vIdx = i % availableVehicles.length;
    const dIdx = i % availableDrivers.length;
    const millIdx = i % mills.length;
    const mill = mills[millIdx]!;

    tripSeeds.push({
      id: `trip-${String(tripCounter).padStart(3, '0')}`,
      vehicleId: availableVehicles[vIdx]!,
      driverId: availableDrivers[dIdx]!,
      scheduledDate: date,
      status: 'COMPLETED',
      estimatedDuration: 120 + (i * 15),
      startedAt: daysAgo(-dayOffset),
      completedAt: daysAgo(-dayOffset),
      cancelledAt: null,
      cancellationReason: null,
      notes: `Trip rutin ke ${mill.name}`,
      mills: [{ millId: mill.id, plannedWeight: 12, actualWeight: 10 + Math.random() * 2 }],
    });
  }
}

// Today's trips: mix of SCHEDULED, IN_PROGRESS, COMPLETED
const today = dateStr(0);
const todayTrips: TripSeed[] = [
  {
    id: `trip-${String(++tripCounter).padStart(3, '0')}`,
    vehicleId: 'vhc-001', driverId: 'drv-001', scheduledDate: today,
    status: 'COMPLETED', estimatedDuration: 150,
    startedAt: now, completedAt: now, cancelledAt: null, cancellationReason: null,
    notes: 'Trip pagi ke PKS Sei Mangkei',
    mills: [{ millId: 'mill-001', plannedWeight: 12, actualWeight: 11.5 }],
  },
  {
    id: `trip-${String(++tripCounter).padStart(3, '0')}`,
    vehicleId: 'vhc-002', driverId: 'drv-002', scheduledDate: today,
    status: 'COMPLETED', estimatedDuration: 120,
    startedAt: now, completedAt: now, cancelledAt: null, cancellationReason: null,
    notes: 'Trip pagi ke PKS Adolina',
    mills: [{ millId: 'mill-002', plannedWeight: 12, actualWeight: 11.8 }],
  },
  {
    id: `trip-${String(++tripCounter).padStart(3, '0')}`,
    vehicleId: 'vhc-004', driverId: 'drv-004', scheduledDate: today,
    status: 'IN_PROGRESS', estimatedDuration: 180,
    startedAt: now, completedAt: null, cancelledAt: null, cancellationReason: null,
    notes: 'Trip siang ke PKS Bukit Kapur',
    mills: [{ millId: 'mill-004', plannedWeight: 12, actualWeight: null }],
  },
  {
    id: `trip-${String(++tripCounter).padStart(3, '0')}`,
    vehicleId: 'vhc-003', driverId: 'drv-003', scheduledDate: today,
    status: 'IN_PROGRESS', estimatedDuration: 135,
    startedAt: now, completedAt: null, cancelledAt: null, cancellationReason: null,
    notes: 'Trip siang ke PKS Rambutan',
    mills: [{ millId: 'mill-003', plannedWeight: 15, actualWeight: null }],
  },
  {
    id: `trip-${String(++tripCounter).padStart(3, '0')}`,
    vehicleId: 'vhc-005', driverId: 'drv-005', scheduledDate: today,
    status: 'SCHEDULED', estimatedDuration: 160,
    startedAt: null, completedAt: null, cancelledAt: null, cancellationReason: null,
    notes: 'Trip sore ke PKS Tanjung Medan',
    mills: [{ millId: 'mill-005', plannedWeight: 8, actualWeight: null }],
  },
  {
    id: `trip-${String(++tripCounter).padStart(3, '0')}`,
    vehicleId: 'vhc-007', driverId: 'drv-007', scheduledDate: today,
    status: 'SCHEDULED', estimatedDuration: 145,
    startedAt: null, completedAt: null, cancelledAt: null, cancellationReason: null,
    notes: 'Trip sore ke PKS Sei Mangkei',
    mills: [{ millId: 'mill-001', plannedWeight: 12, actualWeight: null }],
  },
  {
    id: `trip-${String(++tripCounter).padStart(3, '0')}`,
    vehicleId: 'vhc-008', driverId: 'drv-008', scheduledDate: today,
    status: 'SCHEDULED', estimatedDuration: 130,
    startedAt: null, completedAt: null, cancelledAt: null, cancellationReason: null,
    notes: 'Trip sore ke PKS Adolina',
    mills: [
      { millId: 'mill-002', plannedWeight: 8, actualWeight: null },
      { millId: 'mill-003', plannedWeight: 7, actualWeight: null },
    ],
  },
  {
    id: `trip-${String(++tripCounter).padStart(3, '0')}`,
    vehicleId: 'vhc-010', driverId: 'drv-010', scheduledDate: today,
    status: 'CANCELLED', estimatedDuration: 120,
    startedAt: null, completedAt: null, cancelledAt: now, cancellationReason: 'Kendaraan mengalami masalah mesin',
    notes: 'Trip pagi ke PKS Rambutan — dibatalkan',
    mills: [{ millId: 'mill-003', plannedWeight: 12, actualWeight: null }],
  },
];
tripSeeds.push(...todayTrips);

// Future trips (next 3 days — SCHEDULED)
for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
  const date = dateStr(dayOffset);
  const assignments = [
    { v: 'vhc-001', d: 'drv-001', m: 'mill-001', w: 12 },
    { v: 'vhc-002', d: 'drv-002', m: 'mill-002', w: 12 },
    { v: 'vhc-003', d: 'drv-003', m: 'mill-003', w: 15 },
    { v: 'vhc-005', d: 'drv-005', m: 'mill-005', w: 8 },
    { v: 'vhc-007', d: 'drv-007', m: 'mill-001', w: 12 },
    { v: 'vhc-008', d: 'drv-008', m: 'mill-004', w: 15 },
    { v: 'vhc-010', d: 'drv-010', m: 'mill-002', w: 12 },
  ];

  for (const a of assignments) {
    tripCounter++;
    tripSeeds.push({
      id: `trip-${String(tripCounter).padStart(3, '0')}`,
      vehicleId: a.v,
      driverId: a.d,
      scheduledDate: date,
      status: 'SCHEDULED',
      estimatedDuration: 120 + Math.floor(Math.random() * 60),
      startedAt: null,
      completedAt: null,
      cancelledAt: null,
      cancellationReason: null,
      notes: null,
      mills: [{ millId: a.m, plannedWeight: a.w, actualWeight: null }],
    });
  }
}

// Insert all trips
const insertTrip = db.prepare(`
  INSERT INTO trips (id, vehicle_id, driver_id, scheduled_date, status, estimated_duration,
    started_at, completed_at, cancelled_at, cancellation_reason, notes, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertTripMill = db.prepare(`
  INSERT INTO trip_mills (trip_id, mill_id) VALUES (?, ?)
`);

const insertCollection = db.prepare(`
  INSERT INTO collections (id, trip_id, mill_id, planned_weight, actual_weight, collected_at, notes, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seedTransaction = db.transaction(() => {
  for (const trip of tripSeeds) {
    insertTrip.run(
      trip.id, trip.vehicleId, trip.driverId, trip.scheduledDate,
      trip.status, trip.estimatedDuration,
      trip.startedAt, trip.completedAt, trip.cancelledAt,
      trip.cancellationReason, trip.notes, daysAgo(1), now,
    );

    for (const mill of trip.mills) {
      insertTripMill.run(trip.id, mill.millId);

      const colId = uuidv4();
      const collectedAt = mill.actualWeight !== null ? now : null;
      insertCollection.run(
        colId, trip.id, mill.millId,
        mill.plannedWeight, mill.actualWeight,
        collectedAt, null, daysAgo(1), now,
      );
    }
  }
});

seedTransaction();
console.log(`  ✅ ${tripSeeds.length} trips seeded (with collections)`);

db.close();
console.log('\n🎉 Database seeded successfully!');
console.log(`   Total: ${drivers.length} drivers, ${vehicles.length} vehicles, ${mills.length} mills, ${tripSeeds.length} trips`);
