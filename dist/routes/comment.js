"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const commentController_1 = require("../controllers/commentController");
const router = (0, express_1.Router)();
router.post('/create-comment/:postId', auth_1.authMiddleware, commentController_1.createComment);
router.get('/comment/:commentId', auth_1.authMiddleware, commentController_1.getCommentById);
router.get('/post/:postId', auth_1.authMiddleware, commentController_1.getCommentsByPostId);
router.put('/post/:commentId', auth_1.authMiddleware, commentController_1.updateComment);
router.delete('/post/:commentId', auth_1.authMiddleware, commentController_1.deleteComment);
exports.default = router;