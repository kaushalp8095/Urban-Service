import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        partnerProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, city, address_json } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name,
        email,
        city,
        address_json
      }
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getWalletStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { wallet_balance: true }
    });

    const transactions = await prisma.transaction.findMany({
      where: { user_id: req.user!.id },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    res.json({
      success: true,
      data: {
        balance: user?.wallet_balance || 0,
        transactions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addMoneyToWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: { message: 'Invalid amount' } });
    }

    // Mocking a successful payment gateway response
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        wallet_balance: { increment: Number(amount) }
      }
    });

    const transaction = await prisma.transaction.create({
      data: {
        user_id: req.user!.id,
        type: 'CREDIT',
        amount: Number(amount),
        status: 'SUCCESS',
        gateway_ref: 'MOCK_GW_' + Date.now()
      }
    });

    res.json({ success: true, data: { balance: user.wallet_balance, transaction } });
  } catch (error) {
    next(error);
  }
};
