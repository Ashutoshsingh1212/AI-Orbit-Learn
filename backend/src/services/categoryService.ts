import prisma from '../config/db';

export class CategoryService {
  static async getCategories() {
    const tools = await prisma.tool.findMany({
      select: { category: true },
    });

    const counts: Record<string, number> = {};
    for (const tool of tools) {
      if (tool.category) {
        counts[tool.category] = (counts[tool.category] || 0) + 1;
      }
    }

    const categories = Object.entries(counts).map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      count,
      toolCount: count,
    }));

    return {
      totalTools: tools.length,
      categories,
    };
  }
}
