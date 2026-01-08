import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get active medications and supplements
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const medications = await prisma.medication.findMany({
      where: { userId, isActive: true },
      include: {
        logs: {
          where: {
            takenAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's logs
            },
          },
        },
      },
    });
    res.json({ medications });
  } catch (error) {
    console.error("Get medications error:", error);
    res.status(500).json({ error: "Failed to fetch medications" });
  }
});

// Add new medication
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      type,
      dosage,
      frequency,
      timeOfDay,
      startDate,
      endDate,
      prescribedBy,
      notes,
    } = req.body;

    const medication = await prisma.medication.create({
      data: {
        userId,
        name,
        type,
        dosage,
        frequency,
        timeOfDay,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        prescribedBy,
        notes,
      },
    });
    res.json({ medication });
  } catch (error) {
    console.error("Add medication error:", error);
    res.status(500).json({ error: "Failed to add medication" });
  }
});

// Log medication intake
router.post("/:id/log", async (req, res) => {
  try {
    const userId = req.user.id;
    const medicationId = req.params.id;
    const { taken, skippedReason, notes } = req.body;

    const log = await prisma.medicationLog.create({
      data: {
        userId,
        medicationId,
        taken: taken !== false,
        skippedReason,
        notes,
      },
    });
    res.json({ log });
  } catch (error) {
    console.error("Log medication error:", error);
    res.status(500).json({ error: "Failed to log medication" });
  }
});

export default router;
