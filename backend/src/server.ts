import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const frontendOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((u) => u.trim().replace(/\/+$/, '')).filter(Boolean)
  : [];

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  ...frontendOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.has(origin.replace(/\/+$/, '')) ||
        process.env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  })
);

app.use(express.json());

// Direct health check and root endpoints (serverless-safe, no DB dependency by default)
app.get(['/', '/health', '/api/health'], async (req, res) => {
  if (req.query.db === 'true') {
    try {
      const prisma = (await import('./config/db')).default;
      await prisma.$queryRaw`SELECT 1`;
      return res.status(200).json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(200).json({
        status: 'degraded',
        database: 'disconnected',
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  res.status(200).json({
    status: 'ok',
    message: 'AI Orbit Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'production',
  });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

// Local development only - never executed when imported or in Vercel serverless environment
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`AI-Orbit backend running locally at http://localhost:${PORT}`);
  });
}

module.exports = app;
module.exports.default = app;
export default app;
