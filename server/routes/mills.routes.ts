// server/routes/mills.routes.ts
// Express routes for mill management.
// BFF Architecture: Routes call repository functions, never raw SQL.

import { Router } from 'express';
import type Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllMills,
  getMillById,
  createMill,
  updateMill,
} from '../db/queries/millQueries';

export function createMillRoutes(db: Database.Database): Router {
  const router = Router();

  // GET /api/mills — List all mills
  router.get('/', (_req, res) => {
    try {
      const mills = getAllMills(db);
      res.json({ data: mills, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch mills' });
    }
  });

  // GET /api/mills/:id — Get mill by ID
  router.get('/:id', (req, res) => {
    try {
      const mill = getMillById(db, req.params['id']!);
      if (!mill) {
        res.status(404).json({ data: null, success: false, error: 'Mill not found' });
        return;
      }
      res.json({ data: mill, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch mill' });
    }
  });

  // POST /api/mills — Create a new mill
  router.post('/', (req, res) => {
    try {
      const { name, location, contactPerson, phoneNumber, avgDailyProduction } = req.body as {
        name: string;
        location: { latitude: number; longitude: number; address?: string };
        contactPerson: string;
        phoneNumber: string;
        avgDailyProduction: number;
      };

      if (!name || !location || !contactPerson || !phoneNumber || !avgDailyProduction) {
        res.status(400).json({ data: null, success: false, error: 'All fields are required' });
        return;
      }

      if (location.latitude < -90 || location.latitude > 90) {
        res.status(400).json({ data: null, success: false, error: 'Latitude must be between -90 and 90' });
        return;
      }

      if (location.longitude < -180 || location.longitude > 180) {
        res.status(400).json({ data: null, success: false, error: 'Longitude must be between -180 and 180' });
        return;
      }

      if (avgDailyProduction <= 0) {
        res.status(400).json({ data: null, success: false, error: 'Average daily production must be greater than 0' });
        return;
      }

      const now = new Date().toISOString();
      const mill = createMill(db, {
        id: uuidv4(),
        name,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        contactPerson,
        phoneNumber,
        avgDailyProduction,
        createdAt: now,
        updatedAt: now,
      });

      res.status(201).json({ data: mill, success: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create mill';
      if (message.includes('UNIQUE constraint')) {
        res.status(409).json({ data: null, success: false, error: 'Mill name already exists' });
        return;
      }
      res.status(500).json({ data: null, success: false, error: message });
    }
  });

  // PUT /api/mills/:id — Update mill
  router.put('/:id', (req, res) => {
    try {
      const existing = getMillById(db, req.params['id']!);
      if (!existing) {
        res.status(404).json({ data: null, success: false, error: 'Mill not found' });
        return;
      }

      const { name, location, contactPerson, phoneNumber, avgDailyProduction } = req.body as {
        name?: string;
        location?: { latitude: number; longitude: number; address?: string };
        contactPerson?: string;
        phoneNumber?: string;
        avgDailyProduction?: number;
      };

      const mill = updateMill(db, req.params['id']!, {
        name,
        latitude: location?.latitude,
        longitude: location?.longitude,
        address: location?.address,
        contactPerson,
        phoneNumber,
        avgDailyProduction,
        updatedAt: new Date().toISOString(),
      });

      res.json({ data: mill, success: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update mill';
      if (message.includes('UNIQUE constraint')) {
        res.status(409).json({ data: null, success: false, error: 'Mill name already exists' });
        return;
      }
      res.status(500).json({ data: null, success: false, error: message });
    }
  });

  return router;
}
