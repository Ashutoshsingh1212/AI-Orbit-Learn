import { Router } from 'express';
import toolRoutes from './toolRoutes';
import categoryRoutes from './categoryRoutes';
import authRoutes from './authRoutes';
import bookmarkRoutes from './bookmarkRoutes';

const router = Router();

router.use('/tools', toolRoutes);
router.use('/categories', categoryRoutes);
router.use('/auth', authRoutes);
router.use('/bookmarks', bookmarkRoutes);

// Health check endpoint (simple and serverless-safe)
router.get('/health', async (req, res) => {
  if (req.query.db === 'true') {
    try {
      const prisma = (await import('../config/db')).default;
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

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;
