// src/types/enums.ts
// Canonical enum definitions — source of truth for all status values.
// DO NOT change these values without updating .agent/CONSTANTS.md
// Using regular enums (not const enum) for isolatedModules compatibility (Vite/SWC).

export enum VehicleType {
  TRUCK_SMALL = 'TRUCK_SMALL',     // < 8 ton
  TRUCK_MEDIUM = 'TRUCK_MEDIUM',   // 8–12 ton
  TRUCK_LARGE = 'TRUCK_LARGE',     // > 12 ton
}

export enum VehicleStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  ON_DUTY = 'ON_DUTY',
  OFF_DUTY = 'OFF_DUTY',
  SICK_LEAVE = 'SICK_LEAVE',
}

export enum TripStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
