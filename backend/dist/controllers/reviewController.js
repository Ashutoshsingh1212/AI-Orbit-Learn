"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const reviewService_1 = require("../services/reviewService");
const errorHandler_1 = require("../middleware/errorHandler");
class ReviewController {
    static async getReviewsByToolSlug(req, res, next) {
        try {
            const toolId = req.params.id || req.params.slug;
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const result = await reviewService_1.ReviewService.getReviewsByToolSlug(toolId, page, limit);
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async addReview(req, res, next) {
        try {
            const toolId = req.params.id || req.params.slug;
            const { rating, title, content } = req.body;
            if (!req.user) {
                throw new errorHandler_1.AppError('You must be logged in to leave a review', 401);
            }
            const review = await reviewService_1.ReviewService.addReview(toolId, req.user.id, {
                rating: Number(rating),
                title,
                content,
            });
            res.status(201).json({
                success: true,
                data: review,
                message: 'Review submitted successfully',
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ReviewController = ReviewController;
