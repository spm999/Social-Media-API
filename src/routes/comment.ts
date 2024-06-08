import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createComment, getCommentById } from '../controllers/commentController';

const router = Router();

router.post('/create-comment/:postId', authMiddleware, createComment);
router.get('/:commentId', authMiddleware, getCommentById);


export default router;
