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

export const acceptFriendRequest = async (req: Request, res: Response) => {
    const { requesterId } = req.body;
    const receiverId = (req as any).userId; // Assume userId is set by an authentication middleware
  
    try {
      const friendship = await prisma.friendship.updateMany({
        where: {
          requesterId,
          receiverId,
          status: 'pending',
        },
        data: {
          status: 'accepted',
        },
      });
  
      if (friendship.count === 0) {
        return res.status(404).json({ error: 'Friend request not found' });
      }
  
      res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ error: 'Failed to accept friend request' });
    }
  };

export const rejectFriendRequest = async (req: Request, res: Response) => {
    const { requesterId } = req.body;
    const receiverId = (req as any).userId; // Assume userId is set by an authentication middleware
  
    try {
      const friendship = await prisma.friendship.updateMany({
        where: {
          requesterId,
          receiverId,
          status: 'pending',
        },
        data: {
          status: 'declined',
        },
      });
  
      if (friendship.count === 0) {
        return res.status(404).json({ error: 'Friend request not found' });
      }
  
      res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      res.status(500).json({ error: 'Failed to reject friend request' });
    }
  };
  

  export const getAllFriends = async (req: Request, res: Response) => {
    const userId = (req as any).userId; // Assume userId is set by an authentication middleware
  
    try {
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { requesterId: userId, status: 'accepted' },
            { receiverId: userId, status: 'accepted' },
          ],
        },
        include: {
        //   requester: true,
        //   receiver: true,
        requester: {
            select: {
              profilePicture: true,
              bio: true
            }
          },
          receiver: {
            select: {
              profilePicture: true,
              bio: true
            }
          },
        },
      });
  
      const friends = friendships.map(friendship => 
        friendship.requesterId === userId ? friendship.receiver : friendship.requester
      );
  
      res.status(200).json(friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      res.status(500).json({ error: 'Failed to fetch friends' });
    }
  };
  









  





