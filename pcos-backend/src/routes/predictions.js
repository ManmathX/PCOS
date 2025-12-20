import express from 'express';
import { PrismaClient } from '@prisma/client';
import { predictNextCycle, getCycleInsights } from '../services/predictionEngine.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /predictions/next-cycle
 * Predict next menstrual cycle date
 */
router.get('/next-cycle', async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user's cycle history
        const cycles = await prisma.cycleEntry.findMany({
            where: { userId },
            orderBy: { startDate: 'desc' },
            take: 10,
        });

        if (cycles.length < 2) {
            return res.status(400).json({
                error: 'Need at least 2 cycle entries for prediction',
                message: 'Please log more cycle data to get accurate predictions',
            });
        }

        // Get symptoms for insights
        const symptoms = await prisma.symptomLog.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 50,
        });

        const prediction = predictNextCycle(cycles);
        const insights = getCycleInsights(prediction, symptoms);

        res.json({
            prediction,
            insights,
        });
    } catch (error) {
        console.error('Predict cycle error:', error);
        res.status(500).json({ error: 'Failed to predict next cycle' });
    }
});

export default router;
