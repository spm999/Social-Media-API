// src/routes/userRoutes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {createPost, getAllPublicPosts, updatePostById, deletePostById, getAllPosts} from "../controllers/postController"
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/create-post', upload.single('image'), authMiddleware, createPost);
router.get('/all-posts', getAllPublicPosts);
router.get('/auth-all-posts',authMiddleware, getAllPosts);
router.put('/update-post/:id', upload.single('image'), authMiddleware, updatePostById);
router.delete('/delete-post/:id', authMiddleware, deletePostById)

export default router;