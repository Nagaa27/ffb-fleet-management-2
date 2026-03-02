// server/routes/trips.routes.ts
// Express routes for trip management.
// BFF Architecture: Routes call repository functions, never raw SQL.

import { Router } from 'express';
import type Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllTrips,
  getTripById,
  getCollectionsByTripId,
  createTrip,
  updateTripStatus,
  recordCollection,
  hasDriverConflict,
  hasVehicleConflict,
} from '../db/queries/tripQueries';

export function createTripRoutes(db: Database.Database): Router {
  const router = Router();

  // GET /api/trips — List trips with optional filters
  router.get('/', (req, res) => {
    try {
      const filters = {
        date: req.query['date'] as string | undefined,
        status: req.query['status'] as string | undefined,
        vehicleId: req.query['vehicleId'] as string | undefined,
        driverId: req.query['driverId'] as string | undefined,
        millId: req.query['millId'] as string | undefined,
      };

      const trips = getAllTrips(db, filters);
      res.json({ data: trips, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch trips' });
    }
  });

  // GET /api/trips/:id — Get trip with collections
  router.get('/:id', (req, res) => {
    try {
      const trip = getTripById(db, req.params['id']!);
      if (!trip) {
        res.status(404).json({ data: null, success: false, error: 'Trip not found' });
        return;
      }

      const collections = getCollectionsByTripId(db, req.params['id']!);
      res.json({ data: { ...trip, collections }, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch trip' });
    }
  });

  // POST /api/trips — Create a new trip
  router.post('/', (req, res) => {
    try {
      const { vehicleId, driverId, millIds, scheduledDate, plannedWeightPerMill, estimatedDuration, notes } = req.body as {
        vehicleId: string;
        driverId: string;
        millIds: string[];
        scheduledDate: string;
        plannedWeightPerMill: Record<string, number>;
        estimatedDuration: number;
        notes?: string;
      };

      // Validation
      if (!vehicleId || !driverId || !millIds?.length || !scheduledDate || !estimatedDuration) {
        res.status(400).json({ data: null, success: false, error: 'All required fields must be provided' });
        return;
      }

      // Date validation — cannot backdate
      const today = new Date().toISOString().split('T')[0];
      if (scheduledDate < today!) {
        res.status(400).json({ data: null, success: false, error: 'Scheduled date cannot be in the past' });
        return;
      }

      // Conflict detection — driver
      if (hasDriverConflict(db, driverId, scheduledDate)) {
        res.status(409).json({ data: null, success: false, error: 'Driver already has a trip scheduled on this date' });
        return;
      }

      // Conflict detection — vehicle
      if (hasVehicleConflict(db, vehicleId, scheduledDate)) {
        res.status(409).json({ data: null, success: false, error: 'Vehicle already has a trip scheduled on this date' });
        return;
      }

      const now = new Date().toISOString();
      const trip = createTrip(db, {
        id: uuidv4(),
        vehicleId,
        driverId,
        scheduledDate,
        estimatedDuration,
        notes,
        millIds,
        plannedWeightPerMill: plannedWeightPerMill ?? {},
        createdAt: now,
        updatedAt: now,
      });

      const collections = getCollectionsByTripId(db, trip.id);
      res.status(201).json({ data: { ...trip, collections }, success: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create trip';
      res.status(500).json({ data: null, success: false, error: message });
    }
  });

  // PUT /api/trips/:id/status — Update trip status
  router.put('/:id/status', (req, res) => {
    try {
      const trip = getTripById(db, req.params['id']!);
      if (!trip) {
        res.status(404).json({ data: null, success: false, error: 'Trip not found' });
        return;
      }

      const { status, cancellationReason } = req.body as { status: string; cancellationReason?: string };

      if (!status) {
        res.status(400).json({ data: null, success: false, error: 'Status is required' });
        return;
      }

      // Validate status transitions
      const validTransitions: Record<string, string[]> = {
        SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
        IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      };

      const allowed = validTransitions[trip.status];
      if (!allowed || !allowed.includes(status)) {
        res.status(400).json({
          data: null,
          success: false,
          error: `Cannot transition from ${trip.status} to ${status}`,
        });
        return;
      }

      if (status === 'CANCELLED' && !cancellationReason) {
        res.status(400).json({ data: null, success: false, error: 'Cancellation reason is required' });
        return;
      }

      const updated = updateTripStatus(db, req.params['id']!, {
        status,
        cancellationReason,
        updatedAt: new Date().toISOString(),
      });

      const collections = getCollectionsByTripId(db, req.params['id']!);
      res.json({ data: { ...updated, collections }, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to update trip status' });
    }
  });

  // POST /api/trips/:id/collections — Record a collection
  router.post('/:id/collections', (req, res) => {
    try {
      const trip = getTripById(db, req.params['id']!);
      if (!trip) {
        res.status(404).json({ data: null, success: false, error: 'Trip not found' });
        return;
      }

      if (trip.status !== 'IN_PROGRESS') {
        res.status(400).json({ data: null, success: false, error: 'Can only record collections for in-progress trips' });
        return;
      }

      const { millId, actualWeight, notes } = req.body as {
        millId: string; actualWeight: number; notes?: string;
      };

      if (!millId || actualWeight === undefined || actualWeight === null) {
        res.status(400).json({ data: null, success: false, error: 'Mill ID and actual weight are required' });
        return;
      }

      const collection = recordCollection(db, {
        tripId: req.params['id']!,
        millId,
        actualWeight,
        notes,
        updatedAt: new Date().toISOString(),
      });

      res.json({ data: collection, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to record collection' });
    }
  });

  return router;
}
