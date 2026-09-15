import { Router } from 'express';
import { ToolController } from '../controllers/toolController';
import { ReviewController } from '../controllers/reviewController';
import { BookmarkController } from '../controllers/bookmarkController';
import { optionalAuth, requireAuth } from '../middleware/auth';

const router = Router();

// Tools listing & search (GET /api/tools)
router.get('/', optionalAuth, ToolController.getTools);

// Specific tool details by ID or Slug (GET /api/tools/:id)
router.get('/:id', optionalAuth, ToolController.getToolById);

// Related tools (GET /api/tools/:id/related)
router.get('/:id/related', optionalAuth, ToolController.getRelatedTools);

// Tool reviews
router.get('/:id/reviews', optionalAuth, ReviewController.getReviewsByToolSlug);
router.post('/:id/reviews', requireAuth, ReviewController.addReview);

// Bookmarking
router.post('/:id/bookmark', requireAuth, BookmarkController.toggleBookmark);
router.delete('/:id/bookmark', requireAuth, BookmarkController.removeBookmark);

export default router;
