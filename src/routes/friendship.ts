import { Router } from 'express';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getAllFriends } from '../controllers/friendshipController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/friend-request', authMiddleware, sendFriendRequest);
router.post('/friend-request/accept', authMiddleware, acceptFriendRequest);
router.post('/friend-request/reject', authMiddleware, rejectFriendRequest);
router.get('/friends', authMiddleware, getAllFriends);


export default router;
