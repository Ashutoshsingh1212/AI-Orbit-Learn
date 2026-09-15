"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const categoryService_1 = require("../services/categoryService");
class CategoryController {
    static async getCategories(_req, res, next) {
        try {
            const data = await categoryService_1.CategoryService.getCategories();
            res.status(200).json({
                success: true,
                data,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CategoryController = CategoryController;
