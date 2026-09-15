"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const toolController_1 = require("../controllers/toolController");
const reviewController_1 = require("../controllers/reviewController");
const bookmarkController_1 = require("../controllers/bookmarkController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Tools listing & search (GET /api/tools)
router.get('/', auth_1.optionalAuth, toolController_1.ToolController.getTools);
// Specific tool details by ID or Slug (GET /api/tools/:id)
router.get('/:id', auth_1.optionalAuth, toolController_1.ToolController.getToolById);
// Related tools (GET /api/tools/:id/related)
router.get('/:id/related', auth_1.optionalAuth, toolController_1.ToolController.getRelatedTools);
// Tool reviews
router.get('/:id/reviews', auth_1.optionalAuth, reviewController_1.ReviewController.getReviewsByToolSlug);
router.post('/:id/reviews', auth_1.requireAuth, reviewController_1.ReviewController.addReview);
// Bookmarking
router.post('/:id/bookmark', auth_1.requireAuth, bookmarkController_1.BookmarkController.toggleBookmark);
router.delete('/:id/bookmark', auth_1.requireAuth, bookmarkController_1.BookmarkController.removeBookmark);
exports.default = router;
