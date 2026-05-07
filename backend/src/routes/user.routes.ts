import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { getProfile, updateProfile } from '../controllers/user.controller';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
