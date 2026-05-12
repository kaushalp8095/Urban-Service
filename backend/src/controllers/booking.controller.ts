import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { findBestPartner } from '../services/matching.service';
import { BookingStatus, TransactionType, TransactionStatus } from '@prisma/client';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { package_id, address, slot_datetime } = req.body;
    const user_id = req.user!.id;

    if (!package_id || !address || !slot_datetime) {
      return res.status(400).json({ success: false, error: { message: 'Missing required fields: package_id, address, or slot_datetime' } });
    }

    const date = new Date(slot_datetime);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ success: false, error: { message: 'Invalid slot_datetime format' } });
    }

    // 1. Fetch package details
    const pkg = await prisma.package.findUnique({ where: { id: package_id } });
    if (!pkg) {
      return res.status(404).json({ success: false, error: { message: 'Package not found' } });
    }

    // 2. Create the booking as PENDING
    const booking = await prisma.booking.create({
      data: {
        user_id,
        package_id,
        address,
        slot_datetime: date,
        total_amount: pkg.price,
        status: BookingStatus.PENDING,
      }
    });

    // 3. Create a transaction record (mocking payment initiation)
    await prisma.transaction.create({
      data: {
        user_id,
        booking_id: booking.id,
        type: TransactionType.DEBIT,
        amount: pkg.price,
        status: TransactionStatus.PENDING
      }
    });

    // 4. Trigger Matching Engine asynchronously
    // In a real app, this might go to a queue (like RabbitMQ or BullMQ).
    findBestPartner(booking.id).catch(console.error);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    // Emit socket event if needed (we'll implement this later)
    
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { user_id: req.user!.id },
      include: {
        package: { include: { service: true } },
        partner: true
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { packageId, date } = req.query;
    if (!packageId || !date) {
      return res.status(400).json({ success: false, error: { message: 'Missing packageId or date' } });
    }

    // 1. Get service category for the package
    const pkg = await prisma.package.findUnique({
      where: { id: packageId as string },
      include: { service: true }
    });

    if (!pkg) {
      return res.status(404).json({ success: false, error: { message: 'Package not found' } });
    }

    // 2. Find partners in this category
    const partners = await prisma.partner.findMany({
      where: {
        category_ids: { has: pkg.service.category_id },
        kyc_status: 'APPROVED'
      },
      select: { id: true }
    });

    const partnerIds = partners.map(p => p.id);

    // 3. Find slots for these partners on the requested date
    // Note: In a real app, you'd also check if the slot is already booked in the Booking table.
    const slots = await prisma.partnerSlot.findMany({
      where: {
        partner_id: { in: partnerIds },
        date: new Date(date as string),
        is_blocked: false
      },
      distinct: ['start_time'], // Show unique times available across all partners
      orderBy: { start_time: 'asc' }
    });

    // If no slots are found in DB, return some default ones for demonstration/fallback
    // (In a real production app, you'd strictly rely on the DB)
    if (slots.length === 0) {
      const defaultSlots = [
        { start_time: '09:00' },
        { start_time: '11:00' },
        { start_time: '13:00' },
        { start_time: '15:00' },
        { start_time: '17:00' }
      ];
      return res.json({ success: true, data: defaultSlots, isDefault: true });
    }

    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rating, comment, photos_json } = req.body;
    const user_id = req.user!.id;

    // 1. Verify booking exists and belongs to the user
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { partner: true }
    });

    if (!booking || booking.user_id !== user_id) {
      return res.status(404).json({ success: false, error: { message: 'Booking not found' } });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, error: { message: 'Can only review completed bookings' } });
    }

    // 2. Create the review
    const review = await prisma.review.create({
      data: {
        booking_id: id,
        rating: Number(rating),
        comment,
        photos_json
      }
    });

    // 3. Update partner's average rating (simplified logic)
    if (booking.partner_id) {
      const allPartnerReviews = await prisma.review.findMany({
        where: { booking: { partner_id: booking.partner_id } }
      });
      
      const avgRating = allPartnerReviews.reduce((acc, rev) => acc + rev.rating, 0) / allPartnerReviews.length;
      
      await prisma.partner.update({
        where: { id: booking.partner_id },
        data: { rating: avgRating }
      });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};
