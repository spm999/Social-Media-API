// src/controllers/groupMembershipController.ts

import { Request, Response } from 'express';
import prisma from '../prisma';

// Request to join a group
export const requestGroupMembership = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assuming userId is set by authentication middleware
  const groupId = req.params.groupId;

  try {
    // Check if the user already requested to join the group
    const existingRequest = await prisma.groupMembership.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You have already requested to join this group' });
    }

    // Create a new group membership request
    const membershipRequest = await prisma.groupMembership.create({
      data: {
        groupId,
        userId,
        role: 'pending', // Use 'pending' or similar to indicate a request
      },
    });

    res.status(201).json({ membershipRequest, message: 'Request to join group sent successfully' });
  } catch (error) {
    console.error('Error requesting group membership:', error);
    res.status(500).json({ error: 'Failed to request group membership' });
  }
};


// src/controllers/groupMembershipController.ts

// Accept a membership request
export const acceptGroupMembership = async (req: Request, res: Response) => {
    const adminId = (req as any).userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    const { userId } = req.body; // ID of the user to accept
  
    try {
      // Verify the current user is the admin of the group
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });
  
      if (!group || group.adminId !== adminId) {
        return res.status(403).json({ error: 'You are not authorized to accept members for this group' });
      }
  
      // Accept the membership request
      const updatedMembership = await prisma.groupMembership.updateMany({
        where: {
          groupId,
          userId,
          role: 'pending', // Ensure it’s a pending request
        },
        data: {
          role: 'member', // Change role to 'member'
        },
      });
  
      if (updatedMembership.count === 0) {
        return res.status(404).json({ error: 'Membership request not found' });
      }
  
      res.status(200).json({ message: 'Membership request accepted' });
    } catch (error) {
      console.error('Error accepting group membership:', error);
      res.status(500).json({ error: 'Failed to accept group membership' });
    }
  };

  
  // src/controllers/groupMembershipController.ts

// Reject a membership request
export const rejectGroupMembership = async (req: Request, res: Response) => {
    const adminId = (req as any).userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    const { userId } = req.body; // ID of the user to reject
  
    try {
      // Verify the current user is the admin of the group
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });
  
      if (!group || group.adminId !== adminId) {
        return res.status(403).json({ error: 'You are not authorized to reject members for this group' });
      }
  
      // Reject the membership request
      await prisma.groupMembership.deleteMany({
        where: {
          groupId,
          userId,
          role: 'pending', // Ensure it’s a pending request
        },
      });
  
      res.status(200).json({ message: 'Membership request rejected' });
    } catch (error) {
      console.error('Error rejecting group membership:', error);
      res.status(500).json({ error: 'Failed to reject group membership' });
    }
  };

  
  // src/controllers/groupMembershipController.ts

// Remove a group member
export const removeGroupMember = async (req: Request, res: Response) => {
    const adminId = (req as any).userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    const { userId } = req.body; // ID of the user to remove
  
    try {
      // Verify the current user is the admin of the group
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });
  
      if (!group || group.adminId !== adminId) {
        return res.status(403).json({ error: 'You are not authorized to remove members from this group' });
      }
  
      // Remove the group member
      await prisma.groupMembership.deleteMany({
        where: {
          groupId,
          userId,
          role: 'member', // Ensure it’s a valid member
        },
      });
  
      res.status(200).json({ message: 'Group member removed successfully' });
    } catch (error) {
      console.error('Error removing group member:', error);
      res.status(500).json({ error: 'Failed to remove group member' });
    }
  };

  
  // src/controllers/groupMembershipController.ts

// Get all members of a group
export const getGroupMembers = async (req: Request, res: Response) => {
    const groupId = req.params.groupId;
  
    try {
      const members = await prisma.groupMembership.findMany({
        where: { groupId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      });
  
      res.status(200).json(members);
    } catch (error) {
      console.error('Error fetching group members:', error);
      res.status(500).json({ error: 'Failed to fetch group members' });
    }
  };
  