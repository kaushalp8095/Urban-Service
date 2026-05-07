import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { KYCStatus } from '@prisma/client';

export const registerPartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category_ids } = req.body;
    const user_id = req.user!.id;

    // Check if partner already exists
    const existing = await prisma.partner.findUnique({ where: { user_id } });
    if (existing) {
      return res.status(400).json({ success: false, error: { message: 'Already registered as a partner' } });
    }

    const partner = await prisma.partner.create({
      data: {
        user_id,
        category_ids,
        kyc_status: KYCStatus.PENDING,
      }
    });

    // Update user role to PARTNER if it was CUSTOMER
    await prisma.user.update({
      where: { id: user_id },
      data: { role: 'PARTNER' }
    });

    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    next(error);
  }
};

export const getPartnerBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partner = await prisma.partner.findUnique({ where: { user_id: req.user!.id } });
    if (!partner) {
      return res.status(404).json({ success: false, error: { message: 'Partner profile not found' } });
    }

    const bookings = await prisma.booking.findMany({
      where: { partner_id: partner.id },
      include: {
        user: true,
        package: { include: { service: true } }
      },
      orderBy: { slot_datetime: 'asc' }
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const getPartnerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partner = await prisma.partner.findUnique({ where: { user_id: req.user!.id } });
    if (!partner) return res.status(404).json({ success: false, error: { message: 'Partner profile not found' } });

    const bookings = await prisma.booking.findMany({
      where: { partner_id: partner.id, status: 'COMPLETED' }
    });

    const totalEarnings = bookings.reduce((sum, b) => sum + b.total_amount, 0);
    
    res.json({
      success: true,
      data: {
        totalEarnings,
        jobsCompleted: bookings.length,
        rating: partner.rating
      }
    });
  } catch (error) {
    next(error);
  }
};
