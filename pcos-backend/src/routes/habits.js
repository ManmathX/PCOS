import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /habits
 * Get all habit logs for user
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate, habitType } = req.query;

        const where = { userId };
        if (habitType) where.habitType = habitType;
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const habits = await prisma.habitLog.findMany({
            where,
            orderBy: { date: 'desc' },
        });

        res.json({ habits });
    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({ error: 'Failed to fetch habits' });
    }
});

/**
 * POST /habits
 * Log a habit for the day
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { habitType, date, completed, value, notes } = req.body;

        if (!habitType || !date) {
            return res.status(400).json({ error: 'Habit type and date are required' });
        }

        // Upsert (create or update)
        const habit = await prisma.habitLog.upsert({
            where: {
                userId_habitType_date: {
                    userId,
                    habitType,
                    date: new Date(date),
                },
            },
            update: { completed, value, notes },
            create: {
                userId,
                habitType,
                date: new Date(date),
                completed,
                value,
                notes,
            },
        });

        res.json({ habit, message: 'Habit logged successfully' });
    } catch (error) {
        console.error('Log habit error:', error);
        res.status(500).json({ error: 'Failed to log habit' });
    }
});

/**
 * GET /habits/streaks
 * Calculate current streaks for all habit types
 */
router.get('/streaks', async (req, res) => {
    try {
        const userId = req.user.id;

        const habits = await prisma.habitLog.findMany({
            where: { userId, completed: true },
            orderBy: { date: 'desc' },
        });

        // Calculate streaks by habit type
        const streaks = {};
        const habitTypes = [...new Set(habits.map(h => h.habitType))];

        for (const type of habitTypes) {
            const typeHabits = habits.filter(h => h.habitType === type);
            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < typeHabits.length; i++) {
                const habitDate = new Date(typeHabits[i].date);
                habitDate.setHours(0, 0, 0, 0);

                const expectedDate = new Date(today);
                expectedDate.setDate(expectedDate.getDate() - i);

                if (habitDate.getTime() === expectedDate.getTime()) {
                    streak++;
                } else {
                    break;
                }
            }

            streaks[type] = streak;
        }

        res.json({ streaks });
    } catch (error) {
        console.error('Get streaks error:', error);
        res.status(500).json({ error: 'Failed to calculate streaks' });
    }
});

export default router;
