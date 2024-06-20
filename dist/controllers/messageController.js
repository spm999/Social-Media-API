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
exports.markAsRead = exports.getMessages = exports.sendMessage = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Send a message
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.userId; // Assume userId is set by authentication middleware
    const { receiverId, content, threadId } = req.body;
    try {
        // Check if the sender and receiver are friends
        const areFriends = yield prisma_1.default.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: senderId, status: 'accepted' },
                    { receiverId: senderId, status: 'accepted' },
                ],
            }
        });
        if (!areFriends) {
            return res.status(403).json({ error: 'You can only send messages to your friends' });
        }
        const message = yield prisma_1.default.message.create({
            data: {
                senderId,
                receiverId,
                content,
                threadId,
            },
        });
        res.status(201).json({ message: 'Message sent successfully' });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.sendMessage = sendMessage;
// Get messages between two users
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assume userId is set by authentication middleware
    const otherUserId = req.params.otherUserId;
    try {
        const messages = yield prisma_1.default.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
exports.getMessages = getMessages;
// Mark a message as read
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    try {
        const message = yield prisma_1.default.message.update({
            where: { id: messageId },
            data: { readAt: new Date().toISOString() },
        });
        res.status(200).json({ message: 'Message marked as read' });
    }
    catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
});
exports.markAsRead = markAsRead;
