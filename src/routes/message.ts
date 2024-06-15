// src/routes/messageRoutes.ts
import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth'; // Assume this middleware sets req.userId

const router = express.Router();

// Send a message
router.post('/messages', authMiddleware, sendMessage);
// Get messages between two users
router.get('/messages/:otherUserId', authMiddleware, getMessages);

export default router;
