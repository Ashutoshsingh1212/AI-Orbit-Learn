"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const db_1 = __importDefault(require("../config/db"));
class CategoryService {
    static async getCategories() {
        const tools = await db_1.default.tool.findMany({
            select: { category: true },
        });
        const counts = {};
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
exports.CategoryService = CategoryService;
