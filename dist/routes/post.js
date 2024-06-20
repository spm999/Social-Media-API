"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const postController_1 = require("../controllers/postController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post('/create-post', upload.single('image'), auth_1.authMiddleware, postController_1.createPost);
router.get('/all-posts', postController_1.getAllPublicPosts);
router.get('/auth-all-posts', auth_1.authMiddleware, postController_1.getAllPosts);
router.put('/update-post/:id', upload.single('image'), auth_1.authMiddleware, postController_1.updatePostById);
router.delete('/delete-post/:id', auth_1.authMiddleware, postController_1.deletePostById);
exports.default = router;
