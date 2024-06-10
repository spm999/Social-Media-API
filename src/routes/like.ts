// src/routes/likeRoutes.ts

import express from 'express';
import { addLike, removeLike, getLikesByPostId} from '../controllers/likeController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/addLike', authMiddleware, addLike);          // Add a like
router.post('/removeLike', authMiddleware, removeLike);          // Add a like
router.get('/like/post/:postId', authMiddleware, getLikesByPostId);  // Get likes by post

export default router;
