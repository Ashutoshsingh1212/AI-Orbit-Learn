import prisma from '../config/db';
import { AppError } from '../middleware/errorHandler';

export class ReviewService {
  static async getReviewsByToolSlug(idOrSlug: string, page: number = 1, limit: number = 10) {
    const tool = await prisma.tool.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true, rating: true },
    });

    if (!tool) {
      throw new AppError('AI Tool not found', 404);
    }

    const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
    const take = Math.max(1, limit);

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where: { toolId: tool.id } }),
      prisma.review.findMany({
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

  static async addReview(
    idOrSlug: string,
    userId: string,
    data: { rating: number; title: string; content: string }
  ) {
    const { rating, title, content } = data;

    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('Rating must be an integer between 1 and 5', 400);
    }

    if (!title || title.trim().length < 3) {
      throw new AppError('Review title must be at least 3 characters long', 400);
    }

    if (!content || content.trim().length < 10) {
      throw new AppError('Review content must be at least 10 characters long', 400);
    }

    const tool = await prisma.tool.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true },
    });

    if (!tool) {
      throw new AppError('AI Tool not found', 404);
    }

    // Create review
    const review = await prisma.review.create({
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
    const allReviews = await prisma.review.findMany({
      where: { toolId: tool.id },
      select: { rating: true },
    });

    const totalCount = allReviews.length;
    const avgRating =
      totalCount > 0
        ? Number(
            (
              allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
            ).toFixed(1)
          )
        : 0;

    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        rating: avgRating,
      },
    });

    return review;
  }
}
