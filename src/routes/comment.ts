import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createComment, getCommentById, getCommentsByPostId } from '../controllers/commentController';

const router = Router();

router.post('/create-comment/:postId', authMiddleware, createComment);
router.get('/:commentId', authMiddleware, getCommentById);
router.get('/post/:postId', authMiddleware, getCommentsByPostId);


export default router;
