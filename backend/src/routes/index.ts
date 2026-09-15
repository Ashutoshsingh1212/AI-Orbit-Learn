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

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
