import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
  static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await CategoryService.getCategories();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}
