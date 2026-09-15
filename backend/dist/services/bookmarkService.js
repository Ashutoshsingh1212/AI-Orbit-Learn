"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkService = void 0;
const db_1 = __importDefault(require("../config/db"));
const errorHandler_1 = require("../middleware/errorHandler");
class BookmarkService {
    static async toggleBookmark(idOrSlug, userId) {
        const tool = await db_1.default.tool.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            select: { id: true },
        });
        if (!tool) {
            throw new errorHandler_1.AppError('AI Tool not found', 404);
        }
        const existing = await db_1.default.bookmark.findUnique({
            where: {
                userId_toolId: {
                    userId,
                    toolId: tool.id,
                },
            },
        });
        if (existing) {
            await db_1.default.bookmark.delete({
                where: { id: existing.id },
            });
            return {
                bookmarked: false,
                message: 'Tool removed from bookmarks',
            };
        }
        else {
            await db_1.default.bookmark.create({
                data: {
                    userId,
                    toolId: tool.id,
                },
            });
            return {
                bookmarked: true,
                message: 'Tool added to bookmarks',
            };
        }
    }
    static async removeBookmark(idOrSlug, userId) {
        const tool = await db_1.default.tool.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            select: { id: true },
        });
        if (!tool) {
            throw new errorHandler_1.AppError('AI Tool not found', 404);
        }
        const existing = await db_1.default.bookmark.findUnique({
            where: {
                userId_toolId: {
                    userId,
                    toolId: tool.id,
                },
            },
        });
        if (existing) {
            await db_1.default.bookmark.delete({
                where: { id: existing.id },
            });
        }
        return { bookmarked: false, message: 'Tool removed from bookmarks' };
    }
    static async getUserBookmarks(userId) {
        const bookmarks = await db_1.default.bookmark.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                tool: true,
            },
        });
        return bookmarks.map((b) => ({
            ...b.tool,
            features: JSON.parse(b.tool.features || '[]'),
            tags: JSON.parse(b.tool.tags || '[]'),
            isBookmarked: true,
        }));
    }
}
exports.BookmarkService = BookmarkService;
