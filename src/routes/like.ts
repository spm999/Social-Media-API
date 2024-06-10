// src/routes/likeRoutes.ts

import express from 'express';
import { addLike} from '../controllers/likeController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/addLike', authMiddleware, addLike);          // Add a like

export default router;
