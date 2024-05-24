// src/routes/userRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login',authMiddleware, loginUser);
// router.get('/profile', authMiddleware, getUserProfile);

export default router;
