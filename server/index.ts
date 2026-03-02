// server/index.ts
// Express.js BFF Server — serves static React app + REST API.
// BFF Architecture: Single container, single port, Express handles both static files and API.

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createConnection, initializeDatabase } from './db/connection';
import { createDriverRoutes } from './routes/drivers.routes';
import { createVehicleRoutes } from './routes/vehicles.routes';
import { createMillRoutes } from './routes/mills.routes';
import { createTripRoutes } from './routes/trips.routes';
import { createDashboardRoutes } from './routes/dashboard.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

// Initialize database
const db = createConnection();
initializeDatabase(db);

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes (BFF — all database access happens here)
app.use('/api/drivers', createDriverRoutes(db));
app.use('/api/vehicles', createVehicleRoutes(db));
app.use('/api/mills', createMillRoutes(db));
app.use('/api/trips', createTripRoutes(db));
app.use('/api/dashboard', createDashboardRoutes(db));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback — serve index.html for all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing database connection...');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Closing database connection...');
  db.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🌴 FFB Fleet Management Server running at http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🔋 Database: SQLite with WAL mode`);
});

export { app };
