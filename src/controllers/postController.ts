import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  const { content, image, visibility } = req.body;
  const authorId = (req as any).userId; // Assuming userId is attached to the request object

  try {
    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId,
        visibility,
      },
    });

    res.status(201).json({ post, message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get all posts
export const getAllPublicPosts = async (req: Request, res: Response) => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          visibility: 'public',
        },
      });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  };


export const getAllPosts = async (req: Request, res: Response) => {
    const userId = (req as any).userId; // Assume userId is set by an authentication middleware
  
    try {
      // Find posts that are public
      const publicPosts = await prisma.post.findMany({
        where: { visibility: 'public' },
      });
  
      // Find posts that are friends-only and the user is a friend of the author
      const friendsPosts = await prisma.post.findMany({
        where: {
          AND: [
            { visibility: 'friends' },
            {
              author: {
                friendshipsReceived: {
                  some: {
                    requesterId: userId,
                    status: 'accepted',
                  },
                },
              },
            },
          ],
        },
      });
  
      // Find posts that belong to the current user
      const userPosts = await prisma.post.findMany({
        where: { authorId: userId },
      });
  
      // Combine all posts and remove duplicates
      const allPosts = [...publicPosts, ...friendsPosts, ...userPosts];
  
      // Removing duplicates
      const uniquePosts = Array.from(new Set(allPosts.map(post => post.id)))
                               .map(id => allPosts.find(post => post.id === id));
  
      res.status(200).json(uniquePosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  };

// Update a post by ID
export const updatePostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { content, image, visibility } = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        image,
        visibility,
      },
    });

    res.status(200).json({ post: updatedPost, message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// Delete a post by ID
export const deletePostById = async (req: Request, res: Response) => {
  const postId = req.params.id;

  try {
    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
