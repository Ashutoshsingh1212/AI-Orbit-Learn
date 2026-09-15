import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ToolService } from '../services/toolService';

export class ToolController {
  static async getTools(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, pricing, view, sort, page, limit } = req.query;

      const result = await ToolService.getTools({
        search: typeof search === 'string' ? search : undefined,
        category: typeof category === 'string' ? category : undefined,
        pricing: typeof pricing === 'string' ? pricing : undefined,
        view: typeof view === 'string' ? view : undefined,
        sort: sort as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 12,
        userId: req.user?.id,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getToolById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const slugOrId = (req.params.slugOrId || req.params.id) as string;
      const tool = await ToolService.getToolByIdOrSlug(slugOrId, req.user?.id);

      res.status(200).json({
        success: true,
        data: tool,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRelatedTools(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const slugOrId = (req.params.slugOrId || req.params.id) as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;
      const tools = await ToolService.getRelatedTools(slugOrId, limit);

      res.status(200).json({
        success: true,
        data: tools,
      });
    } catch (err) {
      next(err);
    }
  }
}
