import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { findBestPartner } from '../services/matching.service';
import { BookingStatus, TransactionType, TransactionStatus } from '@prisma/client';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { package_id, address, slot_datetime } = req.body;
    const user_id = req.user!.id;

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
        slot_datetime: new Date(slot_datetime),
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
