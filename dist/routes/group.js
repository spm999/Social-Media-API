"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupController_1 = require("../controllers/groupController");
const auth_1 = require("../middleware/auth");
const groupPostController_1 = require("../controllers/groupPostController");
const groupMembershipController_1 = require("../controllers/groupMembershipController");
const router = (0, express_1.Router)();
// Group routes
router.post('/groups', auth_1.authMiddleware, groupController_1.createGroup); // Create a new group
router.get('/groups/:groupId', auth_1.authMiddleware, groupController_1.getGroupById); // Get a group by ID
router.put('/groups/:groupId', auth_1.authMiddleware, groupController_1.updateGroup); // Update a group
router.delete('/groups/:groupId', auth_1.authMiddleware, groupController_1.deleteGroup); // Delete a group
// Group post routes
router.post('/groups/:groupId/posts', auth_1.authMiddleware, groupPostController_1.createGroupPost); // Create a post in a group
router.get('/groups/:groupId/posts', auth_1.authMiddleware, groupPostController_1.getGroupPosts); // Get all posts in a group
router.delete('/groups/:groupId/posts/:postId', auth_1.authMiddleware, groupPostController_1.deleteGroupPost); // Delete a post in a group
//Group membership routes
router.post('/:groupId/request', auth_1.authMiddleware, groupMembershipController_1.requestGroupMembership);
router.post('/:groupId/accept', auth_1.authMiddleware, groupMembershipController_1.acceptGroupMembership);
router.post('/:groupId/reject', auth_1.authMiddleware, groupMembershipController_1.rejectGroupMembership);
router.post('/:groupId/remove', auth_1.authMiddleware, groupMembershipController_1.removeGroupMember);
router.get('/:groupId/members', auth_1.authMiddleware, groupMembershipController_1.getGroupMembers);
exports.default = router;
