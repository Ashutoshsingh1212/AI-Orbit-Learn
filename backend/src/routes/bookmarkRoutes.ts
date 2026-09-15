import { Router } from 'express';
import { BookmarkController } from '../controllers/bookmarkController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, BookmarkController.getUserBookmarks);

export default router;
