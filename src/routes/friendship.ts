import { Router } from 'express';
import { sendFriendRequest, acceptFriendRequest } from '../controllers/friendshipController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/friend-request', authMiddleware, sendFriendRequest);
router.post('/friend-request/accept', authMiddleware, acceptFriendRequest);


export default router;
