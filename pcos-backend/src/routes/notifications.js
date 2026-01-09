import express from 'express';
import { PrismaClient } from '@prisma/client';
import notificationService from '../services/notificationService.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications with pagination and filters
 * @access  Private
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly, type } = req.query;

        const result = await notificationService.getUserNotifications(
            req.user.id,
            {
                page: parseInt(page),
                limit: parseInt(limit),
                unreadOnly: unreadOnly === 'true',
                type: type || null,
            }
        );

        res.json(result);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Private
 */
router.get('/unread-count', async (req, res) => {
    try {
        const count = await notificationService.getUnreadCount(req.user.id);
        res.json({ count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});

/**
 * @route   POST /api/notifications/mark-read/:id
 * @desc    Mark a notification as read
 * @access  Private
 */
router.post('/mark-read/:id', async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.id, req.user.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

/**
 * @route   POST /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.post('/mark-all-read', async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
    try {
        await notificationService.deleteNotification(req.params.id, req.user.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

/**
 * @route   DELETE /api/notifications/cleanup/old
 * @desc    Delete all read notifications older than 30 days
 * @access  Private
 */
router.delete('/cleanup/old', async (req, res) => {
    try {
        const result = await notificationService.cleanupOldNotifications(req.user.id);
        res.json({ success: true, deletedCount: result.count });
    } catch (error) {
        console.error('Error cleaning up notifications:', error);
        res.status(500).json({ error: 'Failed to cleanup notifications' });
    }
});

/**
 * @route   GET /api/notifications/preferences
 * @desc    Get user notification preferences
 * @access  Private
 */
router.get('/preferences', async (req, res) => {
    try {
        const preferences = await notificationService.getUserPreferences(req.user.id);
        res.json(preferences);
    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).json({ error: 'Failed to fetch notification preferences' });
    }
});

/**
 * @route   PUT /api/notifications/preferences
 * @desc    Update user notification preferences
 * @access  Private
 */
router.put('/preferences', async (req, res) => {
    try {
        const preferences = await notificationService.updateUserPreferences(
            req.user.id,
            req.body
        );
        res.json(preferences);
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Failed to update notification preferences' });
    }
});

/**
 * @route   POST /api/notifications/test
 * @desc    Create a test notification (for development)
 * @access  Private
 */
router.post('/test', async (req, res) => {
    try {
        const notification = await notificationService.createNotification({
            userId: req.user.id,
            type: 'GENERAL',
            title: 'Test Notification',
            message: 'This is a test notification to verify the system is working.',
            priority: 'MEDIUM',
        });
        res.json(notification);
    } catch (error) {
        console.error('Error creating test notification:', error);
        res.status(500).json({ error: 'Failed to create test notification' });
    }
});

export default router;
