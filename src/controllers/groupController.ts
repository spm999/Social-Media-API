// src/controllers/groupController.ts

import { Request, Response } from 'express';
import prisma from '../prisma';

export const createGroup = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assuming userId is set by authentication middleware
  const { name, description } = req.body;

  try {
    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
        adminId: userId, // Set the creator as admin
        memberships: {
          create: {
            userId: userId,
            role: 'admin', // Set the role of the creator as admin
          },
        },
      },
      include: {
        memberships: true,
      },
    });

    res.status(201).json({ group: newGroup, message: 'Group created successfully' });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};