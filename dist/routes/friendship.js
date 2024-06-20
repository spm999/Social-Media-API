"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendshipController_1 = require("../controllers/friendshipController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/friend-request', auth_1.authMiddleware, friendshipController_1.sendFriendRequest);
router.post('/friend-request/accept', auth_1.authMiddleware, friendshipController_1.acceptFriendRequest);
router.post('/friend-request/reject', auth_1.authMiddleware, friendshipController_1.rejectFriendRequest);
router.get('/friends', auth_1.authMiddleware, friendshipController_1.getAllFriends);
exports.default = router;
