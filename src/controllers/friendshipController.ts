import { Request, Response } from 'express';
import prisma from '../prisma';

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { receiverId } = req.body;
  const requesterId = (req as any).userId; // Assume userId is set by an authentication middleware

  try {
    const existingRequest = await prisma.friendship.findFirst({
      where: {
        requesterId,
        receiverId,
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        receiverId,
        status: 'pending',
      },
    });

    res.status(201).json({ friendship, message: 'Friend request sent' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
};