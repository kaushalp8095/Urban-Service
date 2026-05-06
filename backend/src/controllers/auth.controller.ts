import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';
import { Role } from '@prisma/client';

// Mock OTP Store (In-memory for development. In production, use Redis)
const otpStore = new Map<string, string>();

export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: { message: 'Phone number is required.' } });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store it
    otpStore.set(phone, otp);

    // In a real scenario, integrate with Twilio/MSG91 here
    console.log(`[MOCK OTP] Sent OTP ${otp} to phone ${phone}`);

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Return OTP in dev mode for easy testing
      ...(process.env.NODE_ENV === 'development' && { data: { otp } })
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp, role = Role.CUSTOMER, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: { message: 'Phone and OTP are required.' } });
    }

    const storedOtp = otpStore.get(phone);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ success: false, error: { message: 'Invalid or expired OTP.' } });
    }

    // OTP matched, remove it
    otpStore.delete(phone);

    // Check if user exists, else create
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: name || 'New User',
          role: role as Role,
        }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });

  } catch (error) {
    next(error);
  }
};
