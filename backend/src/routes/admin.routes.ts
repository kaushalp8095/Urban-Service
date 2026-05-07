import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/rbac';
import { getAdminStats, getAllBookings } from '../controllers/admin.controller';

const router = Router();

router.get('/stats', authenticate, authorize(['ADMIN']), getAdminStats);
router.get('/bookings', authenticate, authorize(['ADMIN']), getAllBookings);

export default router;
