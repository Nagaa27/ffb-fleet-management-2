// server/routes/drivers.routes.ts
// Express routes for driver management.
// BFF Architecture: Routes call repository functions, never raw SQL.

import { Router } from 'express';
import type Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllDrivers,
  getDriverById,
  getAvailableDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../db/queries/driverQueries';

export function createDriverRoutes(db: Database.Database): Router {
  const router = Router();

  // GET /api/drivers — List all drivers
  router.get('/', (_req, res) => {
    try {
      const drivers = getAllDrivers(db);
      res.json({ data: drivers, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch drivers' });
    }
  });

  // GET /api/drivers/available?date=YYYY-MM-DD — Available drivers on a date
  router.get('/available', (req, res) => {
    try {
      const date = req.query['date'] as string;
      if (!date) {
        res.status(400).json({ data: null, success: false, error: 'Date parameter is required' });
        return;
      }
      const drivers = getAvailableDrivers(db, date);
      res.json({ data: drivers, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch available drivers' });
    }
  });

  // GET /api/drivers/:id — Get driver by ID
  router.get('/:id', (req, res) => {
    try {
      const driver = getDriverById(db, req.params['id']!);
      if (!driver) {
        res.status(404).json({ data: null, success: false, error: 'Driver not found' });
        return;
      }
      res.json({ data: driver, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch driver' });
    }
  });

  // POST /api/drivers — Create a new driver
  router.post('/', (req, res) => {
    try {
      const { name, licenseNumber, phoneNumber } = req.body as { name: string; licenseNumber: string; phoneNumber: string };

      if (!name || !licenseNumber || !phoneNumber) {
        res.status(400).json({ data: null, success: false, error: 'Name, license number, and phone number are required' });
        return;
      }

      const now = new Date().toISOString();
      const driver = createDriver(db, {
        id: uuidv4(),
        name,
        licenseNumber,
        phoneNumber,
        createdAt: now,
        updatedAt: now,
      });

      res.status(201).json({ data: driver, success: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create driver';
      if (message.includes('UNIQUE constraint')) {
        res.status(409).json({ data: null, success: false, error: 'License number already exists' });
        return;
      }
      res.status(500).json({ data: null, success: false, error: message });
    }
  });

  // PUT /api/drivers/:id — Update driver
  router.put('/:id', (req, res) => {
    try {
      const existing = getDriverById(db, req.params['id']!);
      if (!existing) {
        res.status(404).json({ data: null, success: false, error: 'Driver not found' });
        return;
      }

      const { name, licenseNumber, phoneNumber, status } = req.body as {
        name?: string; licenseNumber?: string; phoneNumber?: string; status?: string;
      };

      const driver = updateDriver(db, req.params['id']!, {
        name,
        licenseNumber,
        phoneNumber,
        status,
        updatedAt: new Date().toISOString(),
      });

      res.json({ data: driver, success: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update driver';
      if (message.includes('UNIQUE constraint')) {
        res.status(409).json({ data: null, success: false, error: 'License number already exists' });
        return;
      }
      res.status(500).json({ data: null, success: false, error: message });
    }
  });

  // DELETE /api/drivers/:id — Delete driver (only if no active trips)
  router.delete('/:id', (req, res) => {
    try {
      const existing = getDriverById(db, req.params['id']!);
      if (!existing) {
        res.status(404).json({ data: null, success: false, error: 'Driver not found' });
        return;
      }

      const deleted = deleteDriver(db, req.params['id']!);
      if (!deleted) {
        res.status(409).json({ data: null, success: false, error: 'Cannot delete driver with active trips' });
        return;
      }

      res.json({ data: null, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to delete driver' });
    }
  });

  return router;
}
