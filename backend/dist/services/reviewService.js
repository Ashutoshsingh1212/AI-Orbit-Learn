"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const db_1 = __importDefault(require("../config/db"));
const errorHandler_1 = require("../middleware/errorHandler");
class ReviewService {
    static async getReviewsByToolSlug(idOrSlug, page = 1, limit = 10) {
        const tool = await db_1.default.tool.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            select: { id: true, rating: true },
        });
        if (!tool) {
            throw new errorHandler_1.AppError('AI Tool not found', 404);
        }
        const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
        const take = Math.max(1, limit);
        const [total, reviews] = await Promise.all([
            db_1.default.review.count({ where: { toolId: tool.id } }),
            db_1.default.review.findMany({
                where: { toolId: tool.id },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                        },
                    },
                },
            }),
        ]);
        return {
            reviews,
            stats: {
                averageRating: tool.rating,
                totalReviews: total,
            },
            pagination: {
                page: Math.max(1, page),
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
            },
        };
    }
    static async addReview(idOrSlug, userId, data) {
        const { rating, title, content } = data;
        if (!rating || rating < 1 || rating > 5) {
            throw new errorHandler_1.AppError('Rating must be an integer between 1 and 5', 400);
        }
        if (!title || title.trim().length < 3) {
            throw new errorHandler_1.AppError('Review title must be at least 3 characters long', 400);
        }
        if (!content || content.trim().length < 10) {
            throw new errorHandler_1.AppError('Review content must be at least 10 characters long', 400);
        }
        const tool = await db_1.default.tool.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            select: { id: true },
        });
        if (!tool) {
            throw new errorHandler_1.AppError('AI Tool not found', 404);
        }
        // Create review
        const review = await db_1.default.review.create({
            data: {
                rating: Math.round(rating),
                title: title.trim(),
                content: content.trim(),
                toolId: tool.id,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        // Recalculate average rating for the tool
        const allReviews = await db_1.default.review.findMany({
            where: { toolId: tool.id },
            select: { rating: true },
        });
        const totalCount = allReviews.length;
        const avgRating = totalCount > 0
            ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
            : 0;
        await db_1.default.tool.update({
            where: { id: tool.id },
            data: {
                rating: avgRating,
            },
        });
        return review;
    }
}
exports.ReviewService = ReviewService;
