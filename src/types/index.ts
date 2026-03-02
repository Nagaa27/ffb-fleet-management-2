// src/types/index.ts
// Core data model interfaces — source of truth for all entity shapes.
// Matches SQLite schema in server/db/schema.sql

import { VehicleType, VehicleStatus, DriverStatus, TripStatus } from './enums';

export interface GeoLocation {
  latitude: number;   // -90 to 90
  longitude: number;  // -180 to 180
  address?: string;   // Human-readable address (optional)
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;    // Unique
  phoneNumber: string;      // Format: 08xx-xxxx-xxxx
  status: DriverStatus;
  createdAt: string;        // ISO 8601 string
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;      // Unique, e.g. "B 1234 XYZ"
  type: VehicleType;
  capacity: number;         // in tons (max: MAX_VEHICLE_CAPACITY = 12)
  driverId: string | null;  // FK → Driver.id
  driver: Driver | null;    // Joined data (nullable when not joined)
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Mill {
  id: string;
  name: string;             // Unique
  location: GeoLocation;
  contactPerson: string;
  phoneNumber: string;
  avgDailyProduction: number; // tons — typically 240 (30 ton/hr × 8 hr)
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  tripId: string;           // FK → Trip.id
  millId: string;           // FK → Mill.id
  mill?: Mill;              // Joined data (optional)
  plannedWeight: number;    // tons (planned collection)
  actualWeight: number | null; // tons (filled when collected)
  collectedAt: string | null;  // ISO 8601
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  vehicleId: string;        // FK → Vehicle.id
  driverId: string;         // FK → Driver.id
  vehicle?: Vehicle;        // Joined data
  driver?: Driver;          // Joined data
  scheduledDate: string;    // ISO 8601 date string (YYYY-MM-DD)
  status: TripStatus;
  collections: Collection[];
  estimatedDuration: number; // minutes
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Dashboard summary returned by /api/dashboard/summary
export interface DashboardSummary {
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

// Re-export enums for convenience
export { VehicleType, VehicleStatus, DriverStatus, TripStatus } from './enums';
