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


export const getCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  // console.log(commentId)
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error('Error fetching comment by ID:', error);
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
};





