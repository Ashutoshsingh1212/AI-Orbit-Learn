import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { BookmarkService } from '../services/bookmarkService';
import { AppError } from '../middleware/errorHandler';

export class BookmarkController {
  static async toggleBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required to bookmark tools', 401);
      }

      const toolId = req.params.id || req.params.slug;
      const result = await BookmarkService.toggleBookmark(toolId, req.user.id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async removeBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const toolId = req.params.id || req.params.slug;
      const result = await BookmarkService.removeBookmark(toolId, req.user.id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUserBookmarks(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required to view bookmarks', 401);
      }

      const tools = await BookmarkService.getUserBookmarks(req.user.id);

      res.status(200).json({
        success: true,
        data: tools,
      });
    } catch (err) {
      next(err);
    }
  }
}
