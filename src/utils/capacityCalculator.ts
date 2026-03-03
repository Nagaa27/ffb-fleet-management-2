// src/utils/capacityCalculator.ts
// Utility functions for fleet capacity and load planning calculations.
// Uses business constants defined in constants.ts.

import {
  DAILY_PRODUCTION_PER_MILL,
  MAX_VEHICLE_CAPACITY,
  CAPACITY_WARNING_THRESHOLD,
  MAX_TRIPS_PER_DRIVER_PER_DAY,
} from './constants';

/**
 * Calculate the minimum number of trips needed to transport a mill's
 * daily production given a specific vehicle capacity.
 *
 * @param dailyProduction - Mill daily production in tons (defaults to DAILY_PRODUCTION_PER_MILL)
 * @param vehicleCapacity - Vehicle capacity in tons (defaults to MAX_VEHICLE_CAPACITY)
 * @returns Number of trips needed (rounded up)
 */
export function calculateTripsNeeded(
  dailyProduction: number = DAILY_PRODUCTION_PER_MILL,
  vehicleCapacity: number = MAX_VEHICLE_CAPACITY,
): number {
  if (vehicleCapacity <= 0) return 0;
  return Math.ceil(dailyProduction / vehicleCapacity);
}

/**
 * Calculate the load percentage of a vehicle given actual weight and capacity.
 *
 * @param actualWeight - Actual weight loaded in tons
 * @param vehicleCapacity - Vehicle capacity in tons
 * @returns Load percentage (0–100+)
 */
export function calculateLoadPercentage(
  actualWeight: number,
  vehicleCapacity: number,
): number {
  if (vehicleCapacity <= 0) return 0;
  return (actualWeight / vehicleCapacity) * 100;
}

/**
 * Determine if a load exceeds the warning threshold.
 *
 * @param loadPercentage - Current load percentage
 * @param threshold - Warning threshold percentage (defaults to CAPACITY_WARNING_THRESHOLD)
 * @returns true if load exceeds threshold
 */
export function isOverCapacityWarning(
  loadPercentage: number,
  threshold: number = CAPACITY_WARNING_THRESHOLD,
): boolean {
  return loadPercentage >= threshold;
}

/**
 * Calculate the minimum number of drivers needed for a set of trips per day.
 *
 * @param totalTrips - Total trips to complete in a day
 * @param maxTripsPerDriver - Max trips per driver per day (defaults to MAX_TRIPS_PER_DRIVER_PER_DAY)
 * @returns Minimum drivers needed
 */
export function calculateDriversNeeded(
  totalTrips: number,
  maxTripsPerDriver: number = MAX_TRIPS_PER_DRIVER_PER_DAY,
): number {
  if (maxTripsPerDriver <= 0) return 0;
  return Math.ceil(totalTrips / maxTripsPerDriver);
}

/**
 * Calculate fleet utilization: how many vehicles out of total are being used.
 *
 * @param activeVehicles - Number of active vehicles
 * @param totalVehicles - Total vehicles in fleet
 * @returns Utilization percentage (0–100)
 */
export function calculateFleetUtilization(
  activeVehicles: number,
  totalVehicles: number,
): number {
  if (totalVehicles <= 0) return 0;
  return Math.round((activeVehicles / totalVehicles) * 100);
}
