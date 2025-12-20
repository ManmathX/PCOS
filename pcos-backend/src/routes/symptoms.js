import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /symptoms
 * Get all symptoms for logged-in user
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const where = { userId };

        // Optional date filtering
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const symptoms = await prisma.symptomLog.findMany({
            where,
            orderBy: { date: 'desc' },
        });

        res.json({ symptoms });
    } catch (error) {
        console.error('Get symptoms error:', error);
        res.status(500).json({ error: 'Failed to fetch symptoms' });
    }
});

/**
 * POST /symptoms
 * Log a new symptom
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { date, symptomType, severity, notes } = req.body;

        if (!date || !symptomType) {
            return res.status(400).json({ error: 'Date and symptom type are required' });
        }

        const symptom = await prisma.symptomLog.create({
            data: {
                userId,
                date: new Date(date),
                symptomType,
                severity: severity || 5,
                notes,
            },
        });

        res.status(201).json({ symptom, message: 'Symptom logged successfully' });
    } catch (error) {
        console.error('Create symptom error:', error);
        res.status(500).json({ error: 'Failed to log symptom' });
    }
});

/**
 * DELETE /symptoms/:id
 * Delete symptom log
 */
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const existingSymptom = await prisma.symptomLog.findUnique({ where: { id } });
        if (!existingSymptom || existingSymptom.userId !== userId) {
            return res.status(404).json({ error: 'Symptom not found' });
        }

        await prisma.symptomLog.delete({ where: { id } });

        res.json({ message: 'Symptom deleted successfully' });
    } catch (error) {
        console.error('Delete symptom error:', error);
        res.status(500).json({ error: 'Failed to delete symptom' });
    }
});

/**
 * GET /symptoms/summary
 * Get symptom summary/aggregation
 */
router.get('/summary', async (req, res) => {
    try {
        const userId = req.user.id;

        const symptoms = await prisma.symptomLog.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });

        // Aggregate by symptom type
        const summary = {};
        symptoms.forEach(s => {
            if (!summary[s.symptomType]) {
                summary[s.symptomType] = { count: 0, avgSeverity: 0, total: 0 };
            }
            summary[s.symptomType].count++;
            summary[s.symptomType].total += s.severity;
        });

        // Calculate averages
        Object.keys(summary).forEach(type => {
            summary[type].avgSeverity = Math.round(summary[type].total / summary[type].count);
            delete summary[type].total;
        });

        res.json({ summary });
    } catch (error) {
        console.error('Get symptom summary error:', error);
        res.status(500).json({ error: 'Failed to fetch symptom summary' });
    }
});

export default router;
