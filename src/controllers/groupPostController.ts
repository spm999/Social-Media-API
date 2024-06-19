// src/controllers/groupPostController.ts

import { Request, Response } from 'express';
import prisma from '../prisma';

export const createGroupPost = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assuming userId is set by authentication middleware
  const groupId = req.params.groupId;
  const { content } = req.body;

  try {
    const newPost = await prisma.groupPost.create({
      data: {
        content,
        groupId,
        authorId: userId,
      },
    });

    res.status(201).json({ post: newPost, message: 'Group post created successfully' });
  } catch (error) {
    console.error('Error creating group post:', error);
    res.status(500).json({ error: 'Failed to create group post' });
  }
};
