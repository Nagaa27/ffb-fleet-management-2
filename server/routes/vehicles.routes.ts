// server/routes/vehicles.routes.ts
// Express routes for vehicle management.
// BFF Architecture: Routes call repository functions, never raw SQL.

import { Router } from 'express';
import type Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  assignDriver,
  deleteVehicle,
} from '../db/queries/vehicleQueries';

export function createVehicleRoutes(db: Database.Database): Router {
  const router = Router();

  // GET /api/vehicles — List all vehicles
  router.get('/', (_req, res) => {
    try {
      const vehicles = getAllVehicles(db);
      res.json({ data: vehicles, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch vehicles' });
    }
  });

  // GET /api/vehicles/:id — Get vehicle by ID
  router.get('/:id', (req, res) => {
    try {
      const vehicle = getVehicleById(db, req.params['id']!);
      if (!vehicle) {
        res.status(404).json({ data: null, success: false, error: 'Vehicle not found' });
        return;
      }
      res.json({ data: vehicle, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch vehicle' });
    }
  });

  // POST /api/vehicles — Create a new vehicle
  router.post('/', (req, res) => {
    try {
      const { plateNumber, type, capacity, driverId } = req.body as {
        plateNumber: string; type: string; capacity: number; driverId?: string;
      };

      if (!plateNumber || !type || !capacity) {
        res.status(400).json({ data: null, success: false, error: 'Plate number, type, and capacity are required' });
        return;
      }

      if (capacity < 1 || capacity > 50) {
        res.status(400).json({ data: null, success: false, error: 'Capacity must be between 1 and 50 tons' });
        return;
      }

      const now = new Date().toISOString();
      const vehicle = createVehicle(db, {
        id: uuidv4(),
        plateNumber,
        type,
        capacity,
        driverId,
        createdAt: now,
        updatedAt: now,
      });

      res.status(201).json({ data: vehicle, success: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create vehicle';
      if (message.includes('UNIQUE constraint')) {
        res.status(409).json({ data: null, success: false, error: 'Plate number already exists' });
        return;
      }
      res.status(500).json({ data: null, success: false, error: message });
    }
  });

  // PUT /api/vehicles/:id — Update vehicle
  router.put('/:id', (req, res) => {
    try {
      const existing = getVehicleById(db, req.params['id']!);
      if (!existing) {
        res.status(404).json({ data: null, success: false, error: 'Vehicle not found' });
        return;
      }

      const { plateNumber, type, capacity, status } = req.body as {
        plateNumber?: string; type?: string; capacity?: number; status?: string;
      };

      const vehicle = updateVehicle(db, req.params['id']!, {
        plateNumber,
        type,
        capacity,
        status,
        updatedAt: new Date().toISOString(),
      });

      res.json({ data: vehicle, success: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update vehicle';
      if (message.includes('UNIQUE constraint')) {
        res.status(409).json({ data: null, success: false, error: 'Plate number already exists' });
        return;
      }
      res.status(500).json({ data: null, success: false, error: message });
    }
  });

  // PUT /api/vehicles/:id/driver — Assign/unassign driver
  router.put('/:id/driver', (req, res) => {
    try {
      const existing = getVehicleById(db, req.params['id']!);
      if (!existing) {
        res.status(404).json({ data: null, success: false, error: 'Vehicle not found' });
        return;
      }

      const { driverId } = req.body as { driverId: string | null };
      const vehicle = assignDriver(db, req.params['id']!, driverId, new Date().toISOString());
      res.json({ data: vehicle, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to assign driver' });
    }
  });

  // DELETE /api/vehicles/:id — Delete vehicle (only if no active trips)
  router.delete('/:id', (req, res) => {
    try {
      const existing = getVehicleById(db, req.params['id']!);
      if (!existing) {
        res.status(404).json({ data: null, success: false, error: 'Vehicle not found' });
        return;
      }

      const deleted = deleteVehicle(db, req.params['id']!);
      if (!deleted) {
        res.status(409).json({ data: null, success: false, error: 'Cannot delete vehicle with active trips' });
        return;
      }

      res.json({ data: null, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to delete vehicle' });
    }
  });

  return router;
}
