import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../prisma';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { userId } = payload;

  try {
    // Find user by userId and email to ensure both match
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
    });

    // If no matching user is found, deny access
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found or has been deleted' });
    }

    // Attach userId to the request object for further use in controllers
    (req as any).userId = userId;
    next();
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
