"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../prisma"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    const payload = (0, jwt_1.verifyToken)(token);
    if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found or has been deleted' });
        }
        // Attach userId to the request object for further use in controllers
        req.userId = payload.userId;
        next();
    }
    catch (error) {
        console.error('Error verifying user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.authMiddleware = authMiddleware;
