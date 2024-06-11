// src/routes/messageRoutes.ts
import express from 'express';
import { sendMessage } from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth'; // Assume this middleware sets req.userId

const router = express.Router();

// Send a message
router.post('/messages', authMiddleware, sendMessage);

export default router;
