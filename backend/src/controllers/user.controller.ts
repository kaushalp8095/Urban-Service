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
