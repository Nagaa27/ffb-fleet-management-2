// server/routes/dashboard.routes.ts
// Express routes for dashboard aggregation.
// BFF Architecture: Dedicated endpoint avoids multiple client-side API calls.

import { Router } from 'express';
import type Database from 'better-sqlite3';
import { getDashboardSummary } from '../db/queries/dashboardQueries';

export function createDashboardRoutes(db: Database.Database): Router {
  const router = Router();

  // GET /api/dashboard/summary?date=YYYY-MM-DD — Daily dashboard metrics
  router.get('/summary', (req, res) => {
    try {
      const date = (req.query['date'] as string) || new Date().toISOString().split('T')[0]!;
      const summary = getDashboardSummary(db, date);
      res.json({ data: summary, success: true, error: null });
    } catch {
      res.status(500).json({ data: null, success: false, error: 'Failed to fetch dashboard summary' });
    }
  });

  return router;
}
