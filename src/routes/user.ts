// src/routes/userRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, updateUserBio, updateProfileImage } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/register', registerUser);
router.post('/login',authMiddleware, loginUser);
router.put('/update-bio',authMiddleware, updateUserBio);
router.post('/update-pimg', upload.single('image'), authMiddleware, updateProfileImage)

export default router;
