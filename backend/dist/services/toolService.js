"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolService = void 0;
const db_1 = __importDefault(require("../config/db"));
const errorHandler_1 = require("../middleware/errorHandler");
class ToolService {
    static async getTools(params) {
        const { search = '', category, pricing, view, sort = 'popular', page = 1, limit = 12, userId, } = params;
        const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
        const take = Math.max(1, limit);
        const andConditions = [];
        // Category filter with slug and alias normalization
        if (category && category !== 'all' && category !== 'All') {
            const catLower = category.toLowerCase().trim();
            const categoryMap = {
                'coding': 'Coding',
                'code': 'Coding',
                'writing': 'Text & Writing',
                'text': 'Text & Writing',
                'text-writing': 'Text & Writing',
                'text & writing': 'Text & Writing',
                'image': 'Image Generation',
                'image-generation': 'Image Generation',
                'image-vision': 'Image Generation',
                'image generation': 'Image Generation',
                'image & vision': 'Image Generation',
                'video': 'Video',
                'generative-video': 'Video',
                'generative video': 'Video',
                'audio': 'Audio',
                'voice': 'Audio',
                'voice-audio': 'Audio',
                'voice & audio': 'Audio',
                'productivity': 'Productivity',
                'marketing': 'Marketing Ops',
                'marketing-ops': 'Marketing Ops',
                'marketing ops': 'Marketing Ops',
                'research': 'Deep Research',
                'deep-research': 'Deep Research',
                'deep research': 'Deep Research',
            };
            const targetCategory = categoryMap[catLower] || category;
            andConditions.push({
                OR: [
                    { category: { equals: targetCategory } },
                    { category: { contains: targetCategory } },
                    { category: { contains: category } },
                ],
            });
        }
        // Pricing filter
        if (pricing && pricing !== 'all' && pricing !== 'All') {
            const prLower = pricing.toLowerCase().trim();
            if (prLower === 'free') {
                andConditions.push({ pricing: { equals: 'Free' } });
            }
            else if (prLower === 'freemium') {
                andConditions.push({ pricing: { equals: 'Freemium' } });
            }
            else if (prLower === 'paid') {
                andConditions.push({ pricing: { equals: 'Paid' } });
            }
            else {
                andConditions.push({ pricing: { equals: pricing } });
            }
        }
        // View filter: e.g. view=featured
        if (view === 'featured') {
            andConditions.push({ featured: true });
        }
        // Search query
        if (search && search.trim() !== '') {
            const cleanSearch = search.trim();
            andConditions.push({
                OR: [
                    { name: { contains: cleanSearch } },
                    { tagLine: { contains: cleanSearch } },
                    { description: { contains: cleanSearch } },
                    { fullDescription: { contains: cleanSearch } },
                    { category: { contains: cleanSearch } },
                    { tags: { contains: cleanSearch } },
                ],
            });
        }
        const where = andConditions.length > 0 ? { AND: andConditions } : {};
        // Sorting order
        let orderBy = [];
        switch (sort) {
            case 'rating':
                orderBy = [{ rating: 'desc' }, { reviewsCount: 'desc' }];
                break;
            case 'newest':
                orderBy = [{ createdAt: 'desc' }];
                break;
            case 'az':
                orderBy = [{ name: 'asc' }];
                break;
            case 'popular':
            default:
                orderBy = [{ reviewsCount: 'desc' }, { rating: 'desc' }, { name: 'asc' }];
                break;
        }
        const [total, tools] = await Promise.all([
            db_1.default.tool.count({ where }),
            db_1.default.tool.findMany({
                where,
                orderBy,
                skip,
                take,
                include: {
                    ...(userId
                        ? {
                            bookmarks: {
                                where: { userId },
                                select: { id: true },
                            },
                        }
                        : {}),
                },
            }),
        ]);
        const formattedTools = tools.map((tool) => ToolService.formatTool(tool, userId));
        return {
            data: formattedTools,
            pagination: {
                page: Math.max(1, page),
                limit: take,
                total,
                totalPages: Math.ceil(total / take) || 1,
            },
        };
    }
    // Fetch single item by ID or slug
    static async getToolByIdOrSlug(idOrSlug, userId) {
        const tool = await db_1.default.tool.findFirst({
            where: {
                OR: [
                    { id: idOrSlug },
                    { slug: idOrSlug },
                ],
            },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                ...(userId
                    ? {
                        bookmarks: {
                            where: { userId },
                            select: { id: true },
                        },
                    }
                    : {}),
            },
        });
        if (!tool) {
            throw new errorHandler_1.AppError('AI Tool not found', 404);
        }
        return ToolService.formatTool(tool, userId);
    }
    // Related tools based on same category
    static async getRelatedTools(idOrSlug, limit = 3) {
        const currentTool = await db_1.default.tool.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            select: { id: true, category: true },
        });
        if (!currentTool) {
            return [];
        }
        const related = await db_1.default.tool.findMany({
            where: {
                category: currentTool.category,
                id: { not: currentTool.id },
            },
            take: limit,
            orderBy: [{ rating: 'desc' }],
        });
        return related.map((tool) => ToolService.formatTool(tool));
    }
    // Centralized tool serializer ensuring complete prompt & backward compatibility
    static formatTool(tool, userId) {
        let parsedFeatures = [];
        try {
            parsedFeatures = typeof tool.features === 'string' ? JSON.parse(tool.features || '[]') : tool.features || [];
        }
        catch {
            parsedFeatures = [];
        }
        let parsedUseCases = [];
        try {
            parsedUseCases = typeof tool.useCases === 'string' ? JSON.parse(tool.useCases || '[]') : tool.useCases || [];
        }
        catch {
            parsedUseCases = [];
        }
        let parsedTags = [];
        try {
            parsedTags = typeof tool.tags === 'string' ? JSON.parse(tool.tags || '[]') : tool.tags || [];
        }
        catch {
            parsedTags = [];
        }
        const effectiveWebsiteUrl = tool.websiteUrl || tool.url || '';
        const effectiveIconUrl = tool.iconUrl || tool.icon || '';
        const effectiveTagLine = tool.tagLine || tool.description || '';
        const effectiveDescription = tool.description || tool.fullDescription || tool.tagLine || '';
        const effectiveFullDescription = tool.fullDescription || tool.description || '';
        return {
            ...tool,
            tagLine: effectiveTagLine,
            description: effectiveDescription,
            fullDescription: effectiveFullDescription,
            websiteUrl: effectiveWebsiteUrl,
            url: effectiveWebsiteUrl,
            iconUrl: effectiveIconUrl,
            icon: effectiveIconUrl,
            features: parsedFeatures,
            useCases: parsedUseCases,
            tags: parsedTags,
            reviewsCount: tool.reviewsCount ?? (tool.reviews ? tool.reviews.length : 0),
            featured: Boolean(tool.featured),
            verified: tool.verified ?? true,
            isBookmarked: userId ? Boolean(tool.bookmarks?.length) : false,
            bookmarks: undefined,
        };
    }
}
exports.ToolService = ToolService;
