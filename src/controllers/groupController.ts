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


export const getGroupById = async (req: Request, res: Response) => {
    const groupId = req.params.groupId;
  
    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: { memberships: true, posts: true },
      });
  
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      res.status(200).json(group);
    } catch (error) {
      console.error('Error fetching group by ID:', error);
      res.status(500).json({ error: 'Failed to fetch group' });
    }
  };

  
  export const updateGroup = async (req: Request, res: Response) => {
    const groupId = req.params.groupId;
    const userId = (req as any).userId; // Assume userId is set by authentication middleware

    const { name, description } = req.body;
  
    try {

        // Fetch the group to check the admin
        const group = await prisma.group.findUnique({
          where: { id: groupId },
          select: { adminId: true },
        });
    
        if (!group) {
          return res.status(404).json({ error: 'Group not found' });
        }
    
        // Check if the current user is the admin of the group
        if (group.adminId !== userId) {
          return res.status(403).json({ error: 'Only the group admin can update the group' });
        }


        const updatedGroup = await prisma.group.update({
          where: { id: groupId },
          data: { name, description },
        });
      res.status(200).json({ group: updatedGroup, message: 'Group updated successfully' });
    } catch (error) {
      console.error('Error updating group:', error);
      res.status(500).json({ error: 'Failed to update group' });
    }
  };
  
  
  export const deleteGroup = async (req: Request, res: Response) => {
    const groupId = req.params.groupId;
    const userId = (req as any).userId; // Assume userId is set by authentication middleware

    try {
      // Fetch the group to check the admin
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { adminId: true },
      });
  
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      // Check if the current user is the admin of the group
      if (group.adminId !== userId) {
        return res.status(403).json({ error: 'Only the group admin can delete the group' });
      }
  
      // Proceed with deleting the group
      await prisma.group.delete({
        where: { id: groupId },
      });  
    } 
    catch (error) {
      console.error('Error deleting group:', error);
      res.status(500).json({ error: 'Failed to delete group' });
    }
  };
  



