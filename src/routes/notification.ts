import { Router } from 'express';
import {
  getUserNotifications,
} from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Route to get all notifications for the authenticated user
router.get('/notifications', authMiddleware, getUserNotifications);