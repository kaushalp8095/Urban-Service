import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/rbac';

const router = Router();

// Partner dashboard base route
router.get('/dashboard', authenticate, authorize(['PARTNER']), async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Partner dashboard data scaffold' });
});

export default router;
