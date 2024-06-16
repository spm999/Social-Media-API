import { Router } from 'express';
import {
  getUserNotifications,
  markNotificationAsRead
} from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Route to get all notifications for the authenticated user
router.get('/notifications', authMiddleware, getUserNotifications);

// Route to mark a notification as read
router.patch('/notifications/:notificationId/read', authMiddleware, markNotificationAsRead);

export default router;
