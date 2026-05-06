import { Router, Request, Response } from 'express';
import prisma from '../utils/db';

const router = Router();

// Get all active services, optionally filtered by city
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    const services = await prisma.service.findMany({
      where: {
        is_active: true,
        ...(city ? { city_ids: { has: city as string } } : {})
      },
      include: {
        packages: true
      }
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch services' } });
  }
});

// Get all categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parent_id: null },
      include: { subcategories: true }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch categories' } });
  }
});

export default router;
