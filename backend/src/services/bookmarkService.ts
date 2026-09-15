import prisma from '../config/db';
import { AppError } from '../middleware/errorHandler';

export class BookmarkService {
  static async toggleBookmark(idOrSlug: string, userId: string) {
    const tool = await prisma.tool.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true },
    });

    if (!tool) {
      throw new AppError('AI Tool not found', 404);
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_toolId: {
          userId,
          toolId: tool.id,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });

      return {
        bookmarked: false,
        message: 'Tool removed from bookmarks',
      };
    } else {
      await prisma.bookmark.create({
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

  static async removeBookmark(idOrSlug: string, userId: string) {
    const tool = await prisma.tool.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true },
    });

    if (!tool) {
      throw new AppError('AI Tool not found', 404);
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_toolId: {
          userId,
          toolId: tool.id,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
    }

    return { bookmarked: false, message: 'Tool removed from bookmarks' };
  }

  static async getUserBookmarks(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
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
