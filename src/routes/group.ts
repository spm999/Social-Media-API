import { Router } from 'express';
import { createGroup, getGroupById} from '../controllers/groupController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/groups', authMiddleware, createGroup); // Create a new group
router.get('/groups/:groupId', authMiddleware, getGroupById); // Get a group by ID







export default router;
