import { Router } from 'express';
import { createGroup, getGroupById, updateGroup,deleteGroup} from '../controllers/groupController';
import { authMiddleware } from '../middleware/auth';
import { createGroupPost, getGroupPosts,deleteGroupPost } from '../controllers/groupPostController';
import {
    requestGroupMembership,
    acceptGroupMembership,
    rejectGroupMembership,
    removeGroupMember,
    getGroupMembers,
  } from '../controllers/groupMembershipController';

  
const router = Router();

// Group routes
router.post('/groups', authMiddleware, createGroup); // Create a new group
router.get('/groups/:groupId', authMiddleware, getGroupById); // Get a group by ID
router.put('/groups/:groupId', authMiddleware, updateGroup); // Update a group
router.delete('/groups/:groupId', authMiddleware, deleteGroup); // Delete a group


// Group post routes
router.post('/groups/:groupId/posts', authMiddleware, createGroupPost); // Create a post in a group
router.get('/groups/:groupId/posts', authMiddleware, getGroupPosts); // Get all posts in a group
router.delete('/groups/:groupId/posts/:postId', authMiddleware, deleteGroupPost); // Delete a post in a group


//Group membership routes
router.post('/:groupId/request',authMiddleware, requestGroupMembership);
router.post('/:groupId/accept',authMiddleware, acceptGroupMembership);
router.post('/:groupId/reject',authMiddleware, rejectGroupMembership);
router.post('/:groupId/remove',authMiddleware, removeGroupMember);
router.get('/:groupId/members',authMiddleware, getGroupMembers);

export default router;
