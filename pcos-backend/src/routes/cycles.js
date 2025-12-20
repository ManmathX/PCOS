import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /cycles
 * Get all cycles for logged-in user
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;

        const cycles = await prisma.cycleEntry.findMany({
            where: { userId },
            orderBy: { startDate: 'desc' },
        });

        res.json({ cycles });
    } catch (error) {
        console.error('Get cycles error:', error);
        res.status(500).json({ error: 'Failed to fetch cycles' });
    }
});

/**
 * POST /cycles
 * Create new cycle entry
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate, flowIntensity, painLevel, notes, medications } = req.body;

        if (!startDate) {
            return res.status(400).json({ error: 'Start date is required' });
        }

        const cycle = await prisma.cycleEntry.create({
            data: {
                userId,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                flowIntensity,
                painLevel,
                notes,
                medications: medications || [],
            },
        });

        res.status(201).json({ cycle, message: 'Cycle logged successfully' });
    } catch (error) {
        console.error('Create cycle error:', error);
        res.status(500).json({ error: 'Failed to create cycle entry' });
    }
});

/**
 * PATCH /cycles/:id
 * Update existing cycle entry
 */
router.patch('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { startDate, endDate, flowIntensity, painLevel, notes, medications } = req.body;

        // Verify ownership
        const existingCycle = await prisma.cycleEntry.findUnique({ where: { id } });
        if (!existingCycle || existingCycle.userId !== userId) {
            return res.status(404).json({ error: 'Cycle not found' });
        }

        const cycle = await prisma.cycleEntry.update({
            where: { id },
            data: {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                flowIntensity,
                painLevel,
                notes,
                medications,
            },
        });

        res.json({ cycle, message: 'Cycle updated successfully' });
    } catch (error) {
        console.error('Update cycle error:', error);
        res.status(500).json({ error: 'Failed to update cycle' });
    }
});

/**
 * DELETE /cycles/:id
 * Delete cycle entry
 */
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const existingCycle = await prisma.cycleEntry.findUnique({ where: { id } });
        if (!existingCycle || existingCycle.userId !== userId) {
            return res.status(404).json({ error: 'Cycle not found' });
        }

        await prisma.cycleEntry.delete({ where: { id } });

        res.json({ message: 'Cycle deleted successfully' });
    } catch (error) {
        console.error('Delete cycle error:', error);
        res.status(500).json({ error: 'Failed to delete cycle' });
    }
});

export default router;
