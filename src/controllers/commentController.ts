import { Request, Response } from 'express';
import prisma from '../prisma';

export const createComment = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const postId=req.params.postId // Assuming userId is set by an authentication middleware
  const {content } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    res.status(201).json({ comment: newComment, message: 'Comment created successfully' });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};
