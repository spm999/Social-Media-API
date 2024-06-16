import { Request, Response } from 'express';
import prisma from '../prisma';
import { ObjectId } from 'mongodb';

// Get all notifications for the authenticated user
export const getUserNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assume userId is set by authentication middleware

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }


  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
