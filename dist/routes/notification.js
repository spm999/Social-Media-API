"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Route to get all notifications for the authenticated user
router.get('/notifications', auth_1.authMiddleware, notificationController_1.getUserNotifications);
// Route to mark a notification as read
router.patch('/notifications/:notificationId/read', auth_1.authMiddleware, notificationController_1.markNotificationAsRead);
// Route to delete a notification
router.delete('/notifications/:notificationId', auth_1.authMiddleware, notificationController_1.deleteNotification);
exports.default = router;
