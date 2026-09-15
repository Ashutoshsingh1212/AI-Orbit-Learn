import prisma from '../config/db';
import { AppError } from '../middleware/errorHandler';

export interface ToolQueryParams {
  search?: string;
  category?: string;
  pricing?: string;
  view?: string; // 'featured' or other views
  sort?: 'popular' | 'rating' | 'newest' | 'az';
  page?: number;
  limit?: number;
  userId?: string;
}

export class ToolService {
  static async getTools(params: ToolQueryParams) {
    const {
      search = '',
      category,
      pricing,
      view,
      sort = 'popular',
      page = 1,
      limit = 12,
      userId,
    } = params;

    const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
    const take = Math.max(1, limit);

    const andConditions: any[] = [];

    // Category filter with slug and alias normalization
    if (category && category !== 'all' && category !== 'All') {
      const catLower = category.toLowerCase().trim();
      const categoryMap: Record<string, string> = {
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
          { category: { equals: targetCategory, mode: 'insensitive' } },
          { category: { contains: targetCategory, mode: 'insensitive' } },
          { category: { contains: category, mode: 'insensitive' } },
        ],
      });
    }

    // Pricing filter
    if (pricing && pricing !== 'all' && pricing !== 'All') {
      const prLower = pricing.toLowerCase().trim();
      if (prLower === 'free') {
        andConditions.push({ pricing: { equals: 'Free' } });
      } else if (prLower === 'freemium') {
        andConditions.push({ pricing: { equals: 'Freemium' } });
      } else if (prLower === 'paid') {
        andConditions.push({ pricing: { equals: 'Paid' } });
      } else {
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
          { name: { contains: cleanSearch, mode: 'insensitive' } },
          { tagLine: { contains: cleanSearch, mode: 'insensitive' } },
          { description: { contains: cleanSearch, mode: 'insensitive' } },
          { fullDescription: { contains: cleanSearch, mode: 'insensitive' } },
          { category: { contains: cleanSearch, mode: 'insensitive' } },
          { tags: { contains: cleanSearch, mode: 'insensitive' } },
        ],
      });
    }

    const where: any = andConditions.length > 0 ? { AND: andConditions } : {};

    // Sorting order
    let orderBy: any = [];
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
      prisma.tool.count({ where }),
      prisma.tool.findMany({
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

    const formattedTools = tools.map((tool: any) => ToolService.formatTool(tool, userId));

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
  static async getToolByIdOrSlug(idOrSlug: string, userId?: string) {
    const tool = await prisma.tool.findFirst({
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
      throw new AppError('AI Tool not found', 404);
    }

    return ToolService.formatTool(tool, userId);
  }

  // Related tools based on same category
  static async getRelatedTools(idOrSlug: string, limit: number = 3) {
    const currentTool = await prisma.tool.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true, category: true },
    });

    if (!currentTool) {
      return [];
    }

    const related = await prisma.tool.findMany({
      where: {
        category: currentTool.category,
        id: { not: currentTool.id },
      },
      take: limit,
      orderBy: [{ rating: 'desc' }],
    });

    return related.map((tool: any) => ToolService.formatTool(tool));
  }

  // Centralized tool serializer ensuring complete prompt & backward compatibility
  private static formatTool(tool: any, userId?: string) {
    let parsedFeatures: string[] = [];
    try {
      parsedFeatures = typeof tool.features === 'string' ? JSON.parse(tool.features || '[]') : tool.features || [];
    } catch {
      parsedFeatures = [];
    }

    let parsedUseCases: string[] = [];
    try {
      parsedUseCases = typeof tool.useCases === 'string' ? JSON.parse(tool.useCases || '[]') : tool.useCases || [];
    } catch {
      parsedUseCases = [];
    }

    let parsedTags: string[] = [];
    try {
      parsedTags = typeof tool.tags === 'string' ? JSON.parse(tool.tags || '[]') : tool.tags || [];
    } catch {
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
