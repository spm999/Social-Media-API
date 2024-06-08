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


export const getCommentsByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  // console.log(postId)
  try {
    const comments = await prisma.comment.findMany({
      where: {postId: postId },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments for post:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const { content } = req.body;
  const userId = (req as any).userId;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });


    if (!comment || comment.authorId !== userId) {
      return res.status(404).json({ error: 'Comment not found or not authorized' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).json({ comment: updatedComment, message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const userId = (req as any).userId;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.authorId !== userId) {
      return res.status(404).json({ error: 'Comment not found or not authorized' });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};














