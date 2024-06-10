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

// Remove a like from a post
export const removeLike = async (req: Request, res: Response) => {
    const { postId } = req.body;
    const userId = (req as any).userId; // Assume userId is set by authentication middleware
  
    try {
      // Check if the like exists
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });
  
      if (!existingLike) {
        return res.status(404).json({ error: 'Like not found' });
      }
  
      // Delete the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
  
      res.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
      console.error('Error removing like:', error);
      res.status(500).json({ error: 'Failed to remove like' });
    }
  };


// Get all likes for a specific post
export const getLikesByPostId = async (req: Request, res: Response) => {
    const postId = req.params.postId;
  
    try {
      const likes = await prisma.like.findMany({
        where: { postId },
        include: {
          user: true, // Include user data if needed
        },
      });
  
      res.status(200).json(likes);
    } catch (error) {
      console.error('Error fetching likes:', error);
      res.status(500).json({ error: 'Failed to fetch likes' });
    }
  };
  





