import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createComment, getCommentById, getCommentsByPostId , updateComment, deleteComment} from '../controllers/commentController';

const router = Router();

router.post('/create-comment/:postId', authMiddleware, createComment);
router.get('/comment/:commentId', authMiddleware, getCommentById);
router.get('/post/:postId', authMiddleware, getCommentsByPostId);
router.put('/post/:commentId', authMiddleware, updateComment);
router.delete('/post/:commentId', authMiddleware, deleteComment);

export default router;
