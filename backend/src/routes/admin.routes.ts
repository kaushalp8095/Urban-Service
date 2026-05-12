import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/rbac';
import { 
  getAdminStats, 
  getAllBookings,
  createCategory, updateCategory, deleteCategory,
  createService, updateService, deleteService,
  createPackage, updatePackage, deletePackage,
  getAllPartners, updatePartnerKYC
} from '../controllers/admin.controller';

const router = Router();

// Dashboard & Stats
router.get('/stats', authenticate, authorize(['ADMIN']), getAdminStats);
router.get('/bookings', authenticate, authorize(['ADMIN']), getAllBookings);

// Partner Management
router.get('/partners', authenticate, authorize(['ADMIN']), getAllPartners);
router.patch('/partners/:id/kyc', authenticate, authorize(['ADMIN']), updatePartnerKYC);

// Category Management
router.post('/categories', authenticate, authorize(['ADMIN']), createCategory);
router.patch('/categories/:id', authenticate, authorize(['ADMIN']), updateCategory);
router.delete('/categories/:id', authenticate, authorize(['ADMIN']), deleteCategory);

// Service Management
router.post('/services', authenticate, authorize(['ADMIN']), createService);
router.patch('/services/:id', authenticate, authorize(['ADMIN']), updateService);
router.delete('/services/:id', authenticate, authorize(['ADMIN']), deleteService);

// Package Management
router.post('/packages', authenticate, authorize(['ADMIN']), createPackage);
router.patch('/packages/:id', authenticate, authorize(['ADMIN']), updatePackage);
router.delete('/packages/:id', authenticate, authorize(['ADMIN']), deletePackage);

export default router;
