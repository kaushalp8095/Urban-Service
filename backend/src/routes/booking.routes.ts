import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/booking.controller';
import { authorize } from '../middlewares/rbac';

const router = Router();

// Customer routes
router.post('/', authenticate, authorize(['CUSTOMER']), createBooking);
router.get('/', authenticate, authorize(['CUSTOMER']), getMyBookings);

// Admin/Partner routes
router.patch('/:id/status', authenticate, authorize(['ADMIN', 'PARTNER']), updateBookingStatus);

export default router;
