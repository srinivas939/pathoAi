// backend/app.ts
// Express Backend Application Entry Point

import express from 'express';
import { addLog } from './db/data.js';

import authRouter from './routes/auth.js';
import scansRouter from './routes/scans.js';
import doctorsRouter from './routes/doctors.js';
import appointmentsRouter from './routes/appointments.js';
import notificationsRouter from './routes/notifications.js';
import feedbackRouter from './routes/feedback.js';
import adminRouter from './routes/admin.js';

export function createBackendApp() {
  const app = express();

  // JSON Body Parser with 15mb payload limit for scan image uploads
  app.use(express.json({ limit: '15mb' }));

  // API Request Timing & System Audit Logger
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const timeMs = Date.now() - start;
      addLog(req.originalUrl, req.method as any, res.statusCode, timeMs, req.ip || '127.0.0.1');
    });
    next();
  });

  // REST API Route Mounts
  app.use('/api/auth', authRouter);
  app.use('/api/scans', scansRouter);
  app.use('/api/doctors', doctorsRouter);
  app.use('/api/appointments', appointmentsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/feedback', feedbackRouter);
  app.use('/api/admin', adminRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'PathoAI Backend', timestamp: new Date().toISOString() });
  });

  return app;
}
