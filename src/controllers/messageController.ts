// src/controllers/messageController.ts
import { Request, Response } from 'express';
import prisma  from '../prisma';

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  const senderId = (req as any).userId; // Assume userId is set by authentication middleware
  const { receiverId, content, threadId } = req.body;

  try {
    // Check if the sender and receiver are friends
    const areFriends = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: senderId, status: 'accepted' },
          { receiverId: senderId, status: 'accepted' },
        ],
      }
    });

    if (!areFriends) {
      return res.status(403).json({ error: 'You can only send messages to your friends' });
    }


    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        threadId,
      },
    });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get messages between two users
export const getMessages = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assume userId is set by authentication middleware
  const otherUserId = req.params.otherUserId;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Mark a message as read
export const markAsRead = async (req: Request, res: Response) => {
  const { messageId } = req.params;

  try {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date().toISOString() },
    });

    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};