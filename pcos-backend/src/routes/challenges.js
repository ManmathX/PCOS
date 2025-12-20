import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /challenges
 * Get all available challenges
 */
router.get('/', async (req, res) => {
    try {
        const challenges = await prisma.challenge.findMany({
            orderBy: { createdAt: 'desc' },
        });

        res.json({ challenges });
    } catch (error) {
        console.error('Get challenges error:', error);
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
});

/**
 * POST /challenges/join
 * Join a challenge
 */
router.post('/join', async (req, res) => {
    try {
        const userId = req.user.id;
        const { challengeId } = req.body;

        if (!challengeId) {
            return res.status(400).json({ error: 'Challenge ID is required' });
        }

        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + challenge.duration);

        const userChallenge = await prisma.userChallenge.create({
            data: {
                userId,
                challengeId,
                startDate,
                endDate,
            },
        });

        res.status(201).json({ userChallenge, message: 'Challenge joined successfully' });
    } catch (error) {
        console.error('Join challenge error:', error);
        res.status(500).json({ error: 'Failed to join challenge' });
    }
});

/**
 * GET /challenges/my
 * Get user's active challenges
 */
router.get('/my', async (req, res) => {
    try {
        const userId = req.user.id;

        const userChallenges = await prisma.userChallenge.findMany({
            where: { userId },
            include: { challenge: true },
            orderBy: { startDate: 'desc' },
        });

        res.json({ userChallenges });
    } catch (error) {
        console.error('Get my challenges error:', error);
        res.status(500).json({ error: 'Failed to fetch your challenges' });
    }
});

/**
 * PATCH /challenges/:id/complete
 * Mark challenge as completed
 */
router.patch('/:id/complete', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const userChallenge = await prisma.userChallenge.findFirst({
            where: { id, userId },
        });

        if (!userChallenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        const updated = await prisma.userChallenge.update({
            where: { id },
            data: { completed: true },
        });

        res.json({ userChallenge: updated, message: 'Challenge completed! 🎉' });
    } catch (error) {
        console.error('Complete challenge error:', error);
        res.status(500).json({ error: 'Failed to complete challenge' });
    }
});

export default router;
