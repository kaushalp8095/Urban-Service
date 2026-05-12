import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db';

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalRevenue, totalBookings, totalUsers, totalPartners] = await Promise.all([
      prisma.booking.aggregate({
        _sum: { total_amount: true },
        where: { status: 'COMPLETED' }
      }),
      prisma.booking.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.partner.count()
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.total_amount || 0,
        totalBookings,
        totalUsers,
        totalPartners
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        partner: { include: { user: true } },
        package: { include: { service: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 50 // Limit to latest 50 for dashboard
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// Category Management
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, image_url, parent_id, city_ids } = req.body;
    const category = await prisma.category.create({
      data: { name, image_url, parent_id, city_ids }
    });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, image_url, parent_id, city_ids } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, image_url, parent_id, city_ids }
    });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

// Service Management
export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category_id, name, description, city_ids, is_active } = req.body;
    const service = await prisma.service.create({
      data: { category_id, name, description, city_ids, is_active }
    });
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, city_ids, is_active } = req.body;
    const service = await prisma.service.update({
      where: { id },
      data: { category_id, name, description, city_ids, is_active }
    });
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};

// Package Management
export const createPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { service_id, name, price, duration_min, inclusions_json } = req.body;
    const pkg = await prisma.package.create({
      data: { service_id, name, price, duration_min, inclusions_json }
    });
    res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
};

export const updatePackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { service_id, name, price, duration_min, inclusions_json } = req.body;
    const pkg = await prisma.package.update({
      where: { id },
      data: { service_id, name, price, duration_min, inclusions_json }
    });
    res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
};

export const deletePackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.package.delete({ where: { id } });
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    next(error);
  }
};

export const getAllPartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partners = await prisma.partner.findMany({
      include: { user: true },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: partners });
  } catch (error) {
    next(error);
  }
};

export const updatePartnerKYC = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { kyc_status } = req.body;
    const partner = await prisma.partner.update({
      where: { id },
      data: { kyc_status }
    });
    res.json({ success: true, data: partner });
  } catch (error) {
    next(error);
  }
};
