"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/messageRoutes.ts
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const auth_1 = require("../middleware/auth"); // Assume this middleware sets req.userId
const router = express_1.default.Router();
// Send a message
router.post('/messages', auth_1.authMiddleware, messageController_1.sendMessage);
// Get messages between two users
router.get('/messages/:otherUserId', auth_1.authMiddleware, messageController_1.getMessages);
// Mark a message as read
router.put('/messages/:messageId/read', auth_1.authMiddleware, messageController_1.markAsRead);
exports.default = router;
