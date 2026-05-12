import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { getProfile, updateProfile, getWalletStats, addMoneyToWallet } from '../controllers/user.controller';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

router.get('/wallet', authenticate, getWalletStats);
router.post('/wallet/add', authenticate, addMoneyToWallet);

export default router;
