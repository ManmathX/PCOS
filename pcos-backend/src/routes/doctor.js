import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /doctor/patients
 * Get all consented patients for this doctor
 */
router.get('/patients', async (req, res) => {
    try {
        const doctorId = req.user.id;

        const consents = await prisma.patientConsent.findMany({
            where: { doctorId, granted: true },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        dateOfBirth: true,
                    },
                },
            },
        });

        // Fetch latest risk scores for each patient
        const patientsWithRisk = await Promise.all(
            consents.map(async (consent) => {
                const latestRisk = await prisma.riskScore.findFirst({
                    where: { userId: consent.patientId },
                    orderBy: { calculatedAt: 'desc' },
                });

                return {
                    ...consent.patient,
                    consentedAt: consent.grantedAt,
                    latestRisk: latestRisk ? {
                        score: latestRisk.score,
                        riskLevel: latestRisk.riskLevel,
                        calculatedAt: latestRisk.calculatedAt,
                    } : null,
                };
            })
        );

        res.json({ patients: patientsWithRisk });
    } catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

/**
 * GET /doctor/patients/:id
 * Get detailed patient information
 */
router.get('/patients/:id', async (req, res) => {
    try {
        const doctorId = req.user.id;
        const patientId = req.params.id;

        // Verify consent
        const consent = await prisma.patientConsent.findFirst({
            where: { doctorId, patientId, granted: true },
        });

        if (!consent) {
            return res.status(403).json({ error: 'No consent granted for this patient' });
        }

        // Fetch patient data
        const [patient, cycles, symptoms, riskScores] = await Promise.all([
            prisma.user.findUnique({
                where: { id: patientId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    dateOfBirth: true,
                },
            }),
            prisma.cycleEntry.findMany({
                where: { userId: patientId },
                orderBy: { startDate: 'desc' },
                take: 10,
            }),
            prisma.symptomLog.findMany({
                where: { userId: patientId },
                orderBy: { date: 'desc' },
                take: 20,
            }),
            prisma.riskScore.findMany({
                where: { userId: patientId },
                orderBy: { calculatedAt: 'desc' },
                take: 5,
            }),
        ]);

        res.json({
            patient,
            cycles,
            symptoms,
            riskScores,
        });
    } catch (error) {
        console.error('Get patient details error:', error);
        res.status(500).json({ error: 'Failed to fetch patient details' });
    }
});

/**
 * POST /doctor/patients/:id/comment
 * Add a comment/note for a patient
 */
router.post('/patients/:id/comment', async (req, res) => {
    try {
        const doctorId = req.user.id;
        const patientId = req.params.id;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        // Verify consent
        const consent = await prisma.patientConsent.findFirst({
            where: { doctorId, patientId, granted: true },
        });

        if (!consent) {
            return res.status(403).json({ error: 'No consent granted for this patient' });
        }

        const doctorComment = await prisma.doctorComment.create({
            data: {
                doctorId,
                patientId,
                comment,
            },
        });

        res.status(201).json({ comment: doctorComment, message: 'Comment added successfully' });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

export default router;
