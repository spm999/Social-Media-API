// src/controllers/likeController.ts

import { Request, Response } from 'express';
import prisma from '../prisma';

// Add a like to a post
export const addLike = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = (req as any).userId; // Assume userId is set by authentication middleware

  try {
    // Check if the like already exists
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (existingLike) {
      return res.status(400).json({ error: 'You have already liked this post' });
    }

    // Create a new like
    const like = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    res.status(201).json({ like, message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({ error: 'Failed to add like' });
  }
};
