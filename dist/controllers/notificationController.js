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
exports.deleteNotification = exports.markNotificationAsRead = exports.getUserNotifications = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const mongodb_1 = require("mongodb");
// Get all notifications for the authenticated user
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assume userId is set by authentication middleware
    if (!mongodb_1.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const notifications = yield prisma_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
exports.getUserNotifications = getUserNotifications;
// Mark a notification as read
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationId = req.params.notificationId;
    const userId = req.userId; // Assume userId is set by authentication middleware
    try {
        const notification = yield prisma_1.default.notification.update({
            where: {
                id: notificationId,
                userId: userId
            },
            data: {
                read: true,
                readAt: new Date().toISOString(),
            },
        });
        res.status(200).json({ notification, message: 'Notification marked as read' });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
// Delete a notification
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationId = req.params.notificationId;
    const userId = req.userId; // Assume userId is set by authentication middleware
    try {
        yield prisma_1.default.notification.delete({
            where: {
                id: notificationId,
                userId: userId
            },
        });
        res.status(204).send(); // No content response for delete
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});
exports.deleteNotification = deleteNotification;
