import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createComment } from '../controllers/commentController';

const router = Router();

router.post('/create-comment', authMiddleware, createComment);



export default router;
