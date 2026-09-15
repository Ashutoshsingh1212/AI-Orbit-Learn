"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const result = await authService_1.AuthService.register(name, email, password);
            res.status(201).json({
                success: true,
                ...result,
                message: 'Account registered successfully',
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService_1.AuthService.login(email, password);
            res.status(200).json({
                success: true,
                ...result,
                message: 'Logged in successfully',
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getMe(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Not authenticated' });
                return;
            }
            const user = await authService_1.AuthService.getMe(req.user.id);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
