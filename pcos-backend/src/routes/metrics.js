import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get body metrics history
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const metrics = await prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30, // Last 30 entries
    });
    res.json({ metrics });
  } catch (error) {
    console.error("Get metrics error:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

// Log body metrics
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, weight, waist, hip } = req.body;

    // Calculate derived metrics
    let bmi = null;
    let waistHipRatio = null;

    // Get height from user profile or previous entry
    let height = null;
    const lastEntry = await prisma.bodyMetric.findFirst({
      where: { userId, height: { not: null } },
      orderBy: { date: "desc" },
    });
    if (lastEntry) height = lastEntry.height;
    if (req.body.height) height = Number(req.body.height);

    if (weight && height) {
      // BMI = weight(kg) / (height(m))^2
      const heightM = height / 100;
      bmi = Number((weight / (heightM * heightM)).toFixed(1));
    }

    if (waist && hip) {
      waistHipRatio = Number((waist / hip).toFixed(2));
    }

    const entry = await prisma.bodyMetric.create({
      data: {
        userId,
        date: new Date(date),
        weight: Number(weight),
        height: Number(height),
        waist: Number(waist),
        hip: Number(hip),
        bmi,
        waistHipRatio,
        notes: req.body.notes,
      },
    });
    res.json({ entry });
  } catch (error) {
    console.error("Log metrics error:", error);
    res.status(500).json({ error: "Failed to log metrics" });
  }
});

export default router;
