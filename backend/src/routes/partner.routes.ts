import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/rbac';
import { registerPartner, getPartnerBookings, getPartnerStats } from '../controllers/partner.controller';

const router = Router();

router.post('/register', authenticate, registerPartner);
router.get('/bookings', authenticate, authorize(['PARTNER']), getPartnerBookings);
router.get('/stats', authenticate, authorize(['PARTNER']), getPartnerStats);

export default router;
