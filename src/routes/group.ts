import { Router } from 'express';
import { createGroup} from '../controllers/groupController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/groups', authMiddleware, createGroup); // Create a new group







export default router;
