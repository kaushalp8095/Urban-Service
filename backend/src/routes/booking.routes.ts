import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createBooking, getMyBookings, updateBookingStatus, getAvailableSlots, createReview } from '../controllers/booking.controller';
import { authorize } from '../middlewares/rbac';

const router = Router();

// Customer routes
router.get('/slots', getAvailableSlots); // Publicly available to check slots before booking
router.post('/', authenticate, authorize(['CUSTOMER']), createBooking);
router.get('/', authenticate, authorize(['CUSTOMER']), getMyBookings);
router.post('/:id/review', authenticate, authorize(['CUSTOMER']), createReview);

// Admin/Partner routes
router.patch('/:id/status', authenticate, authorize(['ADMIN', 'PARTNER']), updateBookingStatus);

export default router;
