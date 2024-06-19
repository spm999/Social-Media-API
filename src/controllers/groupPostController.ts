import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a group post
export const createGroupPost = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assuming userId is set by authentication middleware
  const groupId = req.params.groupId;
  const { content } = req.body;

  try {
    // Check if the user is a member of the group
    const isMember = await prisma.groupMembership.findFirst({
      where: {
        groupId,
        userId,
        // Optional: Ensure the status is "active" if you have such a field
        // status: 'active'
      }
    });

    if (!isMember) {
      return res.status(403).json({ error: 'You must be a member of the group to create a post' });
    }

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


// Get posts for a specific group
export const getGroupPosts = async (req: Request, res: Response) => {
    const userId = (req as any).userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
  
    try {
      // Check if the user is a member of the group
      const isMember = await prisma.groupMembership.findFirst({
        where: {
          groupId,
          userId,
          // Optional: Ensure the status is "active" if you have such a field
          // status: 'active'
        }
      });
  
      if (!isMember) {
        return res.status(403).json({ error: 'You must be a member of the group to view posts' });
      }
  
      const posts = await prisma.groupPost.findMany({
        where: { groupId },
        orderBy: { createdAt: 'desc' },
      });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching group posts:', error);
      res.status(500).json({ error: 'Failed to fetch group posts' });
    }
  };


  export const deleteGroupPost = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const userId = (req as any).userId; // Assuming userId is set by authentication middleware
  
    try {
      const post = await prisma.groupPost.findUnique({
        where: { id: postId },
      });
  
      if (!post) {
        return res.status(404).json({ error: 'Group post not found' });
      }
  
      if (post.authorId !== userId) {
        // Check if user is admin
        const isAdmin = await prisma.group.findFirst({
          where: {
            id: post.groupId,
            adminId: userId,
          },
        });
  
        if (!isAdmin) {
          return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }
      }
  
      await prisma.groupPost.delete({
        where: { id: postId },
      });
  
      res.status(200).json({ message: 'Group post deleted successfully' });
    } catch (error) {
      console.error('Error deleting group post:', error);
      res.status(500).json({ error: 'Failed to delete group post' });
    }
  };
  


