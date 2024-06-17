import { Request, Response } from 'express';
import prisma from '../prisma';

// Add a like to a post
export const addLike = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = (req as any).userId; // Assume userId is set by authentication middleware

  try {

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        visibility: true,
        authorId: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }



     // Check the post visibility
     if (post.visibility === 'private') {
      return res.status(403).json({ error: 'You cannot like a private post' });
    }

    if (post.visibility === 'friends') {
      // Check if the liker is a friend of the post author
      const isFriend = await prisma.friendship.findFirst({
        where: {
          status: 'accepted',
          OR: [
            { requesterId: userId, receiverId: post.authorId, status:'accepted' },
            { receiverId: userId, requesterId: post.authorId, status:'accepted'}
          ],
        },
      });

      if (!isFriend) {
        return res.status(403).json({ error: 'You can only like posts made by friends' });
      }
    }



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

    // Create a notification for the post author
    if (post.authorId !== userId) { // Don't notify if the user is liking their own post
      await prisma.notification.create({
        data: {
          userId: post.authorId, // Notify the post author
          type: 'like',
          data: {
            postId,
            likerId: userId,
          },
        },
      });
    }

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

    // Fetch the post to get author details
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Remove the notification for the post author
 // Remove the notification for the post author
 if (post.authorId !== userId) {
  await prisma.notification.deleteMany({
    where: {
      userId: post.authorId,
      type: 'like',
      data: {
        equals: {
          postId,
          likerId: userId,
        },
      },
    },
  });
}

    res.status(200).json({ message: 'Like removed and notification deleted successfully' });
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
        user: { select: { id: true, profilePicture: true, username: true } }, // Select only needed user fields
      },
    });

    res.status(200).json(likes);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
};


// Get likes by user
export const getLikesByUserId = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assume userId is set by authentication middleware

  try {
    const likes = await prisma.like.findMany({
      where: { userId },
      include: {
        post: { select: { id: true, content: true, image: true, createdAt: true } }, // Select only needed post fields
      },
    });

    res.status(200).json(likes);
  } catch (error) {
    console.error('Error fetching likes by user:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
};



