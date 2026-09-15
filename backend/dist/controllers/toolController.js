"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolController = void 0;
const toolService_1 = require("../services/toolService");
class ToolController {
    static async getTools(req, res, next) {
        try {
            const { search, category, pricing, view, sort, page, limit } = req.query;
            const result = await toolService_1.ToolService.getTools({
                search: typeof search === 'string' ? search : undefined,
                category: typeof category === 'string' ? category : undefined,
                pricing: typeof pricing === 'string' ? pricing : undefined,
                view: typeof view === 'string' ? view : undefined,
                sort: sort,
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : 12,
                userId: req.user?.id,
            });
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getToolById(req, res, next) {
        try {
            const slugOrId = (req.params.slugOrId || req.params.id);
            const tool = await toolService_1.ToolService.getToolByIdOrSlug(slugOrId, req.user?.id);
            res.status(200).json({
                success: true,
                data: tool,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getRelatedTools(req, res, next) {
        try {
            const slugOrId = (req.params.slugOrId || req.params.id);
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 3;
            const tools = await toolService_1.ToolService.getRelatedTools(slugOrId, limit);
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
exports.ToolController = ToolController;
