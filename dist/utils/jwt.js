"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        return payload;
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};
exports.verifyToken = verifyToken;
