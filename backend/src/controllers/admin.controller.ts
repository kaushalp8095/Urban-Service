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
