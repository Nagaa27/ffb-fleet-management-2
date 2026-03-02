// src/types/forms.ts
// Input types for forms and API requests — separate from DB entity types.

import { VehicleType, TripStatus } from './enums';
import { GeoLocation } from './index';

export interface CreateTripInput {
  vehicleId: string;
  driverId: string;
  millIds: string[];
  scheduledDate: string;        // YYYY-MM-DD
  plannedWeightPerMill: Record<string, number>; // millId → planned weight in tons
  estimatedDuration: number;    // minutes
  notes?: string;
}

export interface UpdateTripStatusInput {
  tripId: string;
  status: TripStatus;
  cancellationReason?: string;  // required if status = CANCELLED
}

export interface RecordCollectionInput {
  tripId: string;
  millId: string;
  actualWeight: number;
  notes?: string;
}

export interface CreateVehicleInput {
  plateNumber: string;
  type: VehicleType;
  capacity: number;
  driverId?: string;
}

export interface UpdateVehicleInput {
  plateNumber?: string;
  type?: VehicleType;
  capacity?: number;
  status?: string;
}

export interface AssignDriverInput {
  driverId: string | null;      // null to unassign
}

export interface CreateDriverInput {
  name: string;
  licenseNumber: string;
  phoneNumber: string;
}

export interface UpdateDriverInput {
  name?: string;
  licenseNumber?: string;
  phoneNumber?: string;
  status?: string;
}

export interface CreateMillInput {
  name: string;
  location: GeoLocation;
  contactPerson: string;
  phoneNumber: string;
  avgDailyProduction: number;
}

export interface UpdateMillInput {
  name?: string;
  location?: GeoLocation;
  contactPerson?: string;
  phoneNumber?: string;
  avgDailyProduction?: number;
}
