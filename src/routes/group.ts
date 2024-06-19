import { Router } from 'express';
import { createGroup, getGroupById, updateGroup} from '../controllers/groupController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/groups', authMiddleware, createGroup); // Create a new group
router.get('/groups/:groupId', authMiddleware, getGroupById); // Get a group by ID
router.put('/groups/:groupId', authMiddleware, updateGroup); // Update a group







export default router;
