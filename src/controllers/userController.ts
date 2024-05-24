import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { generateToken } from '../utils/jwt';

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

    const token = generateToken(user.id);
    res.status(201).json({ user, token, message: 'User created successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: 'User registration failed' });
  }
};

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
    console.log(user.id, user.email, token)
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
