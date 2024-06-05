import { Router } from 'express';
import { sendFriendRequest } from '../controllers/friendshipController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/friend-request', authMiddleware, sendFriendRequest);


export default router;
