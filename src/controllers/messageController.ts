// src/controllers/messageController.ts
import { Request, Response } from 'express';
import prisma  from '../prisma';

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  const senderId = (req as any).userId; // Assume userId is set by authentication middleware
  const { receiverId, content, threadId } = req.body;

  try {
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