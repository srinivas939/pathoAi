// server.ts
// Main Full-Stack Web Server (Express + Vite)

import express from 'express';
import path from 'path';
import { createBackendApp } from './backend/app.js';
import { initMySQLDatabase } from './backend/db/mysql.js';

const app = createBackendApp();
const PORT = 3000;

async function startServer() {
  // Initialize MySQL database connection (XAMPP DB named 'pathoai')
  await initMySQLDatabase();

  // Vite development middleware vs Static Production serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PathoAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
