import { Router, Request, Response } from 'express';
import prisma from '../utils/db';

const router = Router();

// Search services and categories
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, city } = req.query;
    if (!q || (q as string).trim() === '') {
      return res.json({ success: true, data: { services: [], categories: [] } });
    }
    const query = (q as string).trim();

    const [services, categories] = await Promise.all([
      prisma.service.findMany({
        where: {
          is_active: true,
          ...(city ? { city_ids: { has: city as string } } : {}),
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { packages: true, category: true },
        take: 10,
      }),
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ]);

    res.json({ success: true, data: { services, categories } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Search failed' } });
  }
});

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
