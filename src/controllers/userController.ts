import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { generateToken } from '../utils/jwt';
import cloudinary from '../config/cloudinary'

//register the user
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ user, message: 'User created successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: 'User registration failed' });
  }
};


//login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update the lastLogin field
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date().toISOString() },
    });

    const token = generateToken(user.id);
    // console.log(user.id, user.email, token)
    res.status(200).json({ user, token, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};


//add user bio
export const updateUserBio = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assuming userId is available in request

  try {
    const { bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { bio },
    });

    res.status(200).json({ user: updatedUser, message: 'Bio updated successfully' });
  } catch (error) {
    console.error('Error updating user bio:', error);
    res.status(500).json({ error: 'Failed to update bio' });
  }
};

// const image="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
// export const updateProfileImage = async (req: Request, res: Response) => {
//   try {
//     // Check if image path is provided
//     if (!image) {
//       return res.status(400).json({ error: 'No image path provided' });
//     }

//     // Upload image to Cloudinary
//     cloudinary.uploader.upload(image, { folder: 'uploads' }, (error, result) => {
//       if (error || !result) {
//         console.error('Cloudinary upload error:', error);
//         return res.status(500).json({ error: 'Image upload failed' });
//       }

//       res.status(200).json({ url: result.secure_url });
//     });
//   } catch (error) {
//     console.error('Internal server error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

export const updateProfileImage = async (req: Request, res: Response) => {
  // Access the file using req.file, not req.image
  const file = req.file;

  try {
      // Check if file is uploaded
      if (!file) {
          return res.status(400).json({ error: 'No file found' });
      }

      // Upload image to Cloudinary
      cloudinary.uploader.upload_stream(
          { folder: 'uploads/users' },
          (error, result) => {
              if (error || !result) {
                  console.error('Cloudinary upload error:', error);
                  return res.status(500).json({ error: 'Image upload failed' });
              }

              // Assuming userId is available in request
              const userId = (req as any ).userId;
              // Update user profile picture in the database
              prisma.user
                  .update({
                      where: { id: userId },
                      data: {
                          profilePicture: result.secure_url, // Assuming result contains the secure URL
                      },
                  })
                  .then((updatedUser) => {
                      res.status(200).json({ user: updatedUser, message: 'Profile image updated successfully' });
                  })
                  .catch((error) => {
                      console.error('Database update error:', error);
                      res.status(500).json({ error: 'Failed to update profile image in database' });
                  });
          }
      ).end(file.buffer);
  } catch (error) {
      console.error('Internal server error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
