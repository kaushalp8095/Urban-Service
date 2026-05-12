import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';
import { Role } from '@prisma/client';
import admin from '../utils/firebase';

// Verify Firebase ID token and create/login user
export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, error: { message: 'ID token is required.' } });
    }

    // Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (err: any) {
      console.error('[Firebase Token Verify Error]', err.message);
      return res.status(401).json({ success: false, error: { message: 'Invalid Firebase token.' } });
    }

    const phone = decodedToken.phone_number;
    if (!phone) {
      return res.status(400).json({ success: false, error: { message: 'Phone number not found in token.' } });
    }

    // Check if user exists, else create
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: 'New User',
          role: Role.CUSTOMER,
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

// Mock OTP for development - phone -> { otp, expiresAt }
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// Send OTP (mock mode for testing)
export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: { message: 'Phone number is required.' } });
    }

    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(formattedPhone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // Log OTP for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV OTP] OTP for ${formattedPhone}: ${otp}`);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { data: { otp, phone: formattedPhone } })
    });

  } catch (error) {
    next(error);
  }
};

// Verify OTP (mock mode)
export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: { message: 'Phone and OTP are required.' } });
    }

    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    const storedData = otpStore.get(formattedPhone);

    if (!storedData || storedData.expiresAt < Date.now()) {
      otpStore.delete(formattedPhone);
      return res.status(400).json({ success: false, error: { message: 'OTP expired. Please request a new one.' } });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ success: false, error: { message: 'Invalid OTP.' } });
    }

    otpStore.delete(formattedPhone);

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone: formattedPhone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: formattedPhone,
          name: 'New User',
          role: Role.CUSTOMER,
        }
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      data: { user, token }
    });

  } catch (error) {
    next(error);
  }
};
