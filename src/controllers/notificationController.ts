import { Request, Response } from 'express';
import prisma from '../prisma';
import { ObjectId } from 'mongodb';

// Get all notifications for the authenticated user
export const getUserNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // Assume userId is set by authentication middleware

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }


  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};


// Mark a notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const notificationId = req.params.notificationId;
  const userId = (req as any).userId; // Assume userId is set by authentication middleware

  try {
    const notification = await prisma.notification.update({
      where: { 
        id: notificationId,
        userId:userId
       },
      data: {
        read: true,
        readAt: new Date().toISOString(),
      },
    });

    res.status(200).json({ notification, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};


// Delete a notification
export const deleteNotification = async (req: Request, res: Response) => {
  const notificationId = req.params.notificationId;
  const userId = (req as any).userId; // Assume userId is set by authentication middleware


  try {
    await prisma.notification.delete({
      where: { 
        id: notificationId,
        userId:userId

       },
    });

    res.status(204).send(); // No content response for delete
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};