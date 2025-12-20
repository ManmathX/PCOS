import express from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateRiskScore, calculateAvgCycleLength, detectPainSpike } from '../services/riskEngine.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /risk/calculate
 * Calculate current PCOS risk score for user
 */
router.get('/calculate', async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user's cycle data
        const cycles = await prisma.cycleEntry.findMany({
            where: { userId },
            orderBy: { startDate: 'desc' },
            take: 10,
        });

        // Fetch recent symptoms
        const symptoms = await prisma.symptomLog.findMany({
            where: {
                userId,
                date: {
                    gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
                },
            },
        });

        // Build user data for risk calculation
        const userData = {
            avgCycleLength: calculateAvgCycleLength(cycles),
            symptoms: [...new Set(symptoms.map(s => s.symptomType))], // Unique symptom types
            painSpikeDetected: detectPainSpike(cycles),
            avgPainLevel: cycles.length > 0
                ? Math.round(cycles.reduce((sum, c) => sum + (c.painLevel || 0), 0) / cycles.length)
                : 0,
            // TODO: Get from user profile
            currentBMI: null,
            bmiTrend: null,
            familyHistoryDiabetes: false,
        };

        const riskResult = calculateRiskScore(userData);

        // Save risk score to database
        const savedRisk = await prisma.riskScore.create({
            data: {
                userId,
                score: riskResult.score,
                riskLevel: riskResult.riskLevel,
                reasons: riskResult.reasons,
                cycleLength: userData.avgCycleLength,
                symptomCount: userData.symptoms.length,
            },
        });

        res.json({
            risk: savedRisk,
            insights: {
                avgCycleLength: userData.avgCycleLength,
                symptomCount: userData.symptoms.length,
                painSpikeDetected: userData.painSpikeDetected,
            },
        });
    } catch (error) {
        console.error('Calculate risk error:', error);
        res.status(500).json({ error: 'Failed to calculate risk score' });
    }
});

/**
 * GET /risk/history
 * Get historical risk scores for user
 */
router.get('/history', async (req, res) => {
    try {
        const userId = req.user.id;

        const riskScores = await prisma.riskScore.findMany({
            where: { userId },
            orderBy: { calculatedAt: 'desc' },
            take: 20,
        });

        res.json({ riskScores });
    } catch (error) {
        console.error('Get risk history error:', error);
        res.status(500).json({ error: 'Failed to fetch risk history' });
    }
});

/**
 * GET /risk/latest
 * Get most recent risk score
 */
router.get('/latest', async (req, res) => {
    try {
        const userId = req.user.id;

        const latestRisk = await prisma.riskScore.findFirst({
            where: { userId },
            orderBy: { calculatedAt: 'desc' },
        });

        if (!latestRisk) {
            return res.status(404).json({ error: 'No risk scores found. Please log cycle data first.' });
        }

        res.json({ risk: latestRisk });
    } catch (error) {
        console.error('Get latest risk error:', error);
        res.status(500).json({ error: 'Failed to fetch latest risk score' });
    }
});

export default router;
