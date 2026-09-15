"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkController = void 0;
const bookmarkService_1 = require("../services/bookmarkService");
const errorHandler_1 = require("../middleware/errorHandler");
class BookmarkController {
    static async toggleBookmark(req, res, next) {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError('Authentication required to bookmark tools', 401);
            }
            const toolId = req.params.id || req.params.slug;
            const result = await bookmarkService_1.BookmarkService.toggleBookmark(toolId, req.user.id);
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async removeBookmark(req, res, next) {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const toolId = req.params.id || req.params.slug;
            const result = await bookmarkService_1.BookmarkService.removeBookmark(toolId, req.user.id);
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getUserBookmarks(req, res, next) {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError('Authentication required to view bookmarks', 401);
            }
            const tools = await bookmarkService_1.BookmarkService.getUserBookmarks(req.user.id);
            res.status(200).json({
                success: true,
                data: tools,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.BookmarkController = BookmarkController;
