"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const toolRoutes_1 = __importDefault(require("./toolRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const bookmarkRoutes_1 = __importDefault(require("./bookmarkRoutes"));
const router = (0, express_1.Router)();
router.use('/tools', toolRoutes_1.default);
router.use('/categories', categoryRoutes_1.default);
router.use('/auth', authRoutes_1.default);
router.use('/bookmarks', bookmarkRoutes_1.default);
// Health check endpoint
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = router;
