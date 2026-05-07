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
          name: { contains: query, mode: 'insensitive' },
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

// Get all categories — must be BEFORE /:id to avoid wildcard match
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

// Get services by category ID — must be BEFORE /:id
router.get('/category/:categoryId', async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    const services = await prisma.service.findMany({
      where: {
        category_id: req.params.categoryId,
        is_active: true,
        ...(city ? { city_ids: { has: city as string } } : {}),
      },
      include: { packages: true, category: true },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch services for category' } });
  }
});

// UUID regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Get single service by ID or slug (name-based)
// Supports: /services/<uuid>  OR  /services/ac-gas-refill (slug derived from name)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const param = req.params.id;
    let service;

    if (UUID_REGEX.test(param)) {
      // Exact UUID lookup
      service = await prisma.service.findUnique({
        where: { id: param },
        include: { packages: true, category: true },
      });
    } else {
      // Slug lookup: convert "ac-gas-refill" → "ac gas refill" and match by name
      const nameFromSlug = param.replace(/-/g, ' ');
      service = await prisma.service.findFirst({
        where: {
          name: { equals: nameFromSlug, mode: 'insensitive' },
          is_active: true,
        },
        include: { packages: true, category: true },
      });
    }

    if (!service) {
      return res.status(404).json({ success: false, error: { message: 'Service not found' } });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch service details' } });
  }
});

export default router;
