import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ReviewService } from '../services/reviewService';
import { AppError } from '../middleware/errorHandler';

export class ReviewController {
  static async getReviewsByToolSlug(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const toolId = req.params.id || req.params.slug;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = await ReviewService.getReviewsByToolSlug(toolId, page, limit);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const toolId = req.params.id || req.params.slug;
      const { rating, title, content } = req.body;

      if (!req.user) {
        throw new AppError('You must be logged in to leave a review', 401);
      }

      const review = await ReviewService.addReview(toolId, req.user.id, {
        rating: Number(rating),
        title,
        content,
      });

      res.status(201).json({
        success: true,
        data: review,
        message: 'Review submitted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}
