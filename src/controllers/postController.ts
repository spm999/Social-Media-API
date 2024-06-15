import { Request, Response } from 'express';
import prisma from '../prisma';
import cloudinary from '../config/cloudinary';

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  const image = req.file;
  const { content, visibility } = req.body;
  const authorId = (req as any).userId; // Assuming userId is attached to the request object

  if (!image) {
    return res.status(400).json({ error: 'No file found' });
  }

  try {
    // Upload image to Cloudinary
    cloudinary.uploader.upload_stream(
      { folder: 'uploads/post' },
      async (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Image upload failed' });
        }

        try {
          // Create post in the database
          const post = await prisma.post.create({
            data: {
              content,
              image: result.secure_url, // Use Cloudinary secure URL
              authorId,
              visibility,
            },
          });

          res.status(201).json({ post, message: 'Post created successfully' });
        } catch (dbError) {
          console.error('Error creating post:', dbError);
          res.status(500).json({ error: 'Failed to create post' });
        }
      }
    ).end(image.buffer);
  } catch (uploadError) {
    console.error('Error uploading image:', uploadError);
    res.status(500).json({ error: 'Image upload failed' });
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

//Get all posts
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
  const { content, visibility } = req.body;
  const image = req.file;

  // console.log(image, content, visibility)
  try {
    let imageUrl;
    if (image) {
      // Upload the new image to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'uploads/post' },
          (error, result) => {
            if (error || !result) {
              return reject(error);
            }
            resolve(result);
          }
        ).end(image.buffer);
      });

      imageUrl = result.secure_url;
    }

    // Update post in the database
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        visibility,
        ...(imageUrl && { image: imageUrl }), // Conditionally update the image field only if imageUrl is defined
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
