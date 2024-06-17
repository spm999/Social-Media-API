// src/controllers/commentController.ts
import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a comment
export const createComment = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assume userId is set by authentication middleware
  const postId = req.params.postId;
  const { content } = req.body;

  try {
    // Fetch the post to check its visibility and author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        visibility: true,
        authorId: true,
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the post is private
    if (post.visibility === 'private') {
      return res.status(403).json({ error: 'You cannot comment on private posts' });
    }
    
    // Check if the post is friends-only and if the commenter is a friend of the post author
    if (post.visibility === 'friends') {
      const isFriend = await prisma.friendship.findFirst({
        where: {
          OR: [
            { requesterId: userId, receiverId: post.authorId, status: 'accepted' },
            { receiverId: userId, requesterId: post.authorId, status: 'accepted' }
          ]
        }
      });

      // If not friends, return an error
      if (!isFriend) {
        return res.status(403).json({ error: 'You can only comment on friends-only posts if you are friends with the author' });
      }
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    // Create a notification for the post author
    if (post.authorId !== userId) { // Don't notify if the user is commenting on their own post
      await prisma.notification.create({
        data: {
          userId: post.authorId, // Notify the post author
          type: 'comment',
          data: {
            postId,
            commenterId: userId,
            commentId: newComment.id
          },
        },
      });
    }

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














