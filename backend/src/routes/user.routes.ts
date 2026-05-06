import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import prisma from '../utils/db';

const router = Router();

router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch profile' } });
  }
});

// Update profile route scaffolding
router.put('/profile', authenticate, async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Profile update not fully implemented yet' });
});

export default router;
