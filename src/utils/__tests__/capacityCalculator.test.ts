// src/utils/__tests__/capacityCalculator.test.ts

import { describe, it, expect } from 'vitest';
import {
  calculateTripsNeeded,
  calculateLoadPercentage,
  isOverCapacityWarning,
  calculateDriversNeeded,
  calculateFleetUtilization,
} from '../capacityCalculator';

describe('capacityCalculator', () => {
  describe('calculateTripsNeeded', () => {
    it('returns 20 trips for default 240 ton / 12 ton capacity', () => {
      expect(calculateTripsNeeded()).toBe(20);
    });

    it('rounds up partial trips', () => {
      expect(calculateTripsNeeded(25, 12)).toBe(3); // 25/12 = 2.08 → 3
    });

    it('returns exact when evenly divisible', () => {
      expect(calculateTripsNeeded(24, 12)).toBe(2);
    });

    it('returns 0 when vehicleCapacity is 0', () => {
      expect(calculateTripsNeeded(100, 0)).toBe(0);
    });

    it('returns 0 when vehicleCapacity is negative', () => {
      expect(calculateTripsNeeded(100, -5)).toBe(0);
    });

    it('handles small production values', () => {
      expect(calculateTripsNeeded(1, 12)).toBe(1);
    });
  });

  describe('calculateLoadPercentage', () => {
    it('returns 100 when full', () => {
      expect(calculateLoadPercentage(12, 12)).toBe(100);
    });

    it('returns 50 when half loaded', () => {
      expect(calculateLoadPercentage(6, 12)).toBe(50);
    });

    it('returns over 100 when overloaded', () => {
      expect(calculateLoadPercentage(14, 12)).toBeCloseTo(116.67, 1);
    });

    it('returns 0 when vehicleCapacity is 0', () => {
      expect(calculateLoadPercentage(5, 0)).toBe(0);
    });

    it('returns 0 when no load', () => {
      expect(calculateLoadPercentage(0, 12)).toBe(0);
    });
  });

  describe('isOverCapacityWarning', () => {
    it('returns false below threshold', () => {
      expect(isOverCapacityWarning(80)).toBe(false);
    });

    it('returns true at threshold', () => {
      expect(isOverCapacityWarning(90)).toBe(true); // default threshold is 90
    });

    it('returns true above threshold', () => {
      expect(isOverCapacityWarning(95)).toBe(true);
    });

    it('respects custom threshold', () => {
      expect(isOverCapacityWarning(70, 80)).toBe(false);
      expect(isOverCapacityWarning(80, 80)).toBe(true);
    });
  });

  describe('calculateDriversNeeded', () => {
    it('calculates correctly with defaults', () => {
      // 20 trips / 3 max per driver = ceil(6.67) = 7
      expect(calculateDriversNeeded(20)).toBe(7);
    });

    it('returns 0 when maxTripsPerDriver is 0', () => {
      expect(calculateDriversNeeded(10, 0)).toBe(0);
    });

    it('returns exact when evenly divisible', () => {
      expect(calculateDriversNeeded(9, 3)).toBe(3);
    });

    it('rounds up partial drivers', () => {
      expect(calculateDriversNeeded(10, 3)).toBe(4);
    });
  });

  describe('calculateFleetUtilization', () => {
    it('returns 100 when all vehicles active', () => {
      expect(calculateFleetUtilization(10, 10)).toBe(100);
    });

    it('returns 50 when half active', () => {
      expect(calculateFleetUtilization(5, 10)).toBe(50);
    });

    it('returns 0 when no vehicles', () => {
      expect(calculateFleetUtilization(0, 10)).toBe(0);
    });

    it('returns 0 when totalVehicles is 0', () => {
      expect(calculateFleetUtilization(5, 0)).toBe(0);
    });

    it('rounds to nearest integer', () => {
      expect(calculateFleetUtilization(1, 3)).toBe(33);
    });
  });
});
