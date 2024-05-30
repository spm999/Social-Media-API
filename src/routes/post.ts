// src/routes/userRoutes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {createPost, getAllPublicPosts, updatePostById, deletePostById, getAllPosts} from "../controllers/postController"

const router = Router();

router.post('/create-post', authMiddleware, createPost);
router.post('/all-posts', getAllPublicPosts);
router.post('/auth-all-posts',authMiddleware, getAllPosts);
router.put('/update-post',authMiddleware, updatePostById);
router.post('/delete-post', authMiddleware, deletePostById)

export default router;