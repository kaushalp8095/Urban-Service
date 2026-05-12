import { Router } from 'express';
import { sendOTP, verifyOTP, verifyFirebaseToken } from '../controllers/auth.controller';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/verify-firebase-token', verifyFirebaseToken);

export default router;
