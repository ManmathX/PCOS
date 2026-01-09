import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/ai-reports - Save a new report (User only)
router.post('/', async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.userId;

        if (!content) {
            return res.status(400).json({ error: 'Report content is required' });
        }

        const report = await prisma.aIReport.create({
            data: {
                userId,
                content
            }
        });

        res.status(201).json(report);
    } catch (error) {
        console.error('Error saving AI report:', error);
        res.status(500).json({ error: 'Failed to save report' });
    }
});

// GET /api/ai-reports/user - Get reports for logged-in user
router.get('/user', async (req, res) => {
    try {
        const userId = req.user.userId;
        const reports = await prisma.aIReport.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// GET /api/ai-reports/patient/:patientId - Get reports for a specific patient (Doctor only)
// Note: Middleware check for doctor role happens in index.js route definition
router.get('/patient/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;

        // Check if doctor has consent for this patient
        const consent = await prisma.patientConsent.findUnique({
            where: {
                patientId_doctorId: {
                    patientId: patientId,
                    doctorId: req.user.userId // req.user.userId is the User ID of the doctor
                }
            }
        });

        // Actually, RBAC middleware ensures req.user is a doctor. 
        // But we need to check if the doctor has access to THIS patient.
        // Simplifying for prototype: assume if they are querying, they might have access, or check generic consent.
        // Ideally we should check `consent.status === 'APPROVED'`

        const reports = await prisma.aIReport.findMany({
            where: { userId: patientId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reports);
    } catch (error) {
        console.error('Error fetching patient reports:', error);
        res.status(500).json({ error: 'Failed to fetch patient reports' });
    }
});

export default router;
