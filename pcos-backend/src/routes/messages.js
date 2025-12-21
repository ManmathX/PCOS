import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /messages
 * Get list of conversations (unique users you've messaged with)
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all unique conversation partners
        const sentTo = await prisma.directMessage.findMany({
            where: { senderId: userId },
            select: { receiverId: true },
            distinct: ['receiverId'],
        });

        const receivedFrom = await prisma.directMessage.findMany({
            where: { receiverId: userId },
            select: { senderId: true },
            distinct: ['senderId'],
        });

        const partnerIds = [
            ...new Set([
                ...sentTo.map(m => m.receiverId),
                ...receivedFrom.map(m => m.senderId),
            ]),
        ];

        // Get partner details and last message
        const conversations = await Promise.all(
            partnerIds.map(async (partnerId) => {
                const partner = await prisma.user.findUnique({
                    where: { id: partnerId },
                    select: { id: true, firstName: true, lastName: true, role: true },
                });

                const lastMessage = await prisma.directMessage.findFirst({
                    where: {
                        OR: [
                            { senderId: userId, receiverId: partnerId },
                            { senderId: partnerId, receiverId: userId },
                        ],
                    },
                    orderBy: { createdAt: 'desc' },
                });

                const unreadCount = await prisma.directMessage.count({
                    where: {
                        senderId: partnerId,
                        receiverId: userId,
                        isRead: false,
                    },
                });

                return {
                    partner,
                    lastMessage,
                    unreadCount,
                };
            })
        );

        // Sort by last message time
        conversations.sort((a, b) => {
            const timeA = a.lastMessage?.createdAt || 0;
            const timeB = b.lastMessage?.createdAt || 0;
            return new Date(timeB) - new Date(timeA);
        });

        res.json({ conversations });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

/**
 * GET /messages/:userId
 * Get message history with a specific user
 */
router.get('/:userId', async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await prisma.directMessage.findMany({
            where: {
                OR: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId },
                ],
            },
            include: {
                sender: {
                    select: { id: true, firstName: true, lastName: true },
                },
                receiver: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        // Mark messages as read
        await prisma.directMessage.updateMany({
            where: {
                senderId: otherUserId,
                receiverId: currentUserId,
                isRead: false,
            },
            data: { isRead: true },
        });

        res.json({ messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

/**
 * POST /messages
 * Send a direct message
 */
router.post('/', async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ error: 'Receiver ID and content are required' });
        }

        const message = await prisma.directMessage.create({
            data: {
                senderId,
                receiverId,
                content,
            },
            include: {
                sender: {
                    select: { id: true, firstName: true, lastName: true },
                },
                receiver: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

/**
 * GET /messages/unread/count
 * Get total unread message count
 */
router.get('/unread/count', async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await prisma.directMessage.count({
            where: {
                receiverId: userId,
                isRead: false,
            },
        });

        res.json({ count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Failed to get unread count' });
    }
});

export default router;
