import { Router } from 'express';
import { createGroup, getGroupById, updateGroup,deleteGroup} from '../controllers/groupController';
import { authMiddleware } from '../middleware/auth';
import { createGroupPost } from '../controllers/groupPostController';

const router = Router();

// Group routes
router.post('/groups', authMiddleware, createGroup); // Create a new group
router.get('/groups/:groupId', authMiddleware, getGroupById); // Get a group by ID
router.put('/groups/:groupId', authMiddleware, updateGroup); // Update a group
router.delete('/groups/:groupId', authMiddleware, deleteGroup); // Delete a group


// Group post routes
router.post('/groups/:groupId/posts', authMiddleware, createGroupPost); // Create a post in a group


export default router;
