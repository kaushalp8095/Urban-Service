import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import partnerRoutes from './partner.routes';
import serviceRoutes from './service.routes';
import bookingRoutes from './booking.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/partner', partnerRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);

export default router;
