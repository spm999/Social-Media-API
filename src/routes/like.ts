// src/routes/likeRoutes.ts
import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { addLike, removeLike, getLikesByPostId, getLikesByUserId } from '../controllers/likeController';

const router = express.Router();

router.post('/likes', authMiddleware, addLike);
router.delete('/likes', authMiddleware, removeLike);
router.get('/posts/:postId/likes', authMiddleware, getLikesByPostId);
router.get('/likes/user', authMiddleware, getLikesByUserId);

export default router;
