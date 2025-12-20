import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { analyzeImage, compareAnalyses } from "../services/imageAnalysis.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get daily logs for a user (with date range filter)
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      userId: req.user.id,
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        const [y1, m1, d1] = startDate.split("-").map(Number);
        where.date.gte = new Date(y1, m1 - 1, d1);
      }
      if (endDate) {
        const [y2, m2, d2] = endDate.split("-").map(Number);
        where.date.lte = new Date(y2, m2 - 1, d2);
      }
    }

    const logs = await prisma.dailyLog.findMany({
      where,
      orderBy: {
        date: "desc",
      },
    });

    res.json({ logs });
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    res.status(500).json({
      error: "Failed to fetch daily logs",
      message: error.message,
    });
  }
});

// Get a specific daily log by date
router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    // Parse date as local date to avoid timezone issues
    const [year, month, day] = date.split("-").map(Number);
    const logDate = new Date(year, month - 1, day);

    const log = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: logDate,
        },
      },
    });

    if (!log) {
      return res.status(404).json({ error: "No log found for this date" });
    }

    res.json({ log });
  } catch (error) {
    console.error("Error fetching daily log:", error);
    res.status(500).json({
      error: "Failed to fetch daily log",
      message: error.message,
    });
  }
});

// Create or update a daily log
router.post("/", async (req, res) => {
  try {
    const {
      date,
      mood,
      isOnPeriod,
      flowIntensity,
      cramps,
      energyLevel,
      sleepQuality,
      sleepHours,
      stressLevel,
      exerciseMinutes,
      symptoms,
      notes,
      photoUrl,
    } = req.body;

    // Validate required fields
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }
    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    // Validate numeric ranges
    if (
      cramps !== null &&
      cramps !== undefined &&
      (cramps < 0 || cramps > 10)
    ) {
      return res
        .status(400)
        .json({ error: "Cramps severity must be between 0 and 10" });
    }
    if (
      energyLevel !== null &&
      energyLevel !== undefined &&
      (energyLevel < 0 || energyLevel > 10)
    ) {
      return res
        .status(400)
        .json({ error: "Energy level must be between 0 and 10" });
    }
    if (
      sleepQuality !== null &&
      sleepQuality !== undefined &&
      (sleepQuality < 0 || sleepQuality > 10)
    ) {
      return res
        .status(400)
        .json({ error: "Sleep quality must be between 0 and 10" });
    }
    if (
      stressLevel !== null &&
      stressLevel !== undefined &&
      (stressLevel < 0 || stressLevel > 10)
    ) {
      return res
        .status(400)
        .json({ error: "Stress level must be between 0 and 10" });
    }
    if (
      sleepHours !== null &&
      sleepHours !== undefined &&
      (sleepHours < 0 || sleepHours > 24)
    ) {
      return res
        .status(400)
        .json({ error: "Sleep hours must be between 0 and 24" });
    }
    if (
      exerciseMinutes !== null &&
      exerciseMinutes !== undefined &&
      exerciseMinutes < 0
    ) {
      return res
        .status(400)
        .json({ error: "Exercise minutes cannot be negative" });
    }

    // Validate period flow
    if (isOnPeriod && !flowIntensity) {
      return res
        .status(400)
        .json({ error: "Flow intensity is required when on period" });
    }

    // Parse date as local date (YYYY-MM-DD) to avoid timezone issues
    const [year, month, day] = date.split("-").map(Number);
    const logDate = new Date(year, month - 1, day);

    // Analyze photo if provided
    let photoAnalysis = null;
    if (photoUrl) {
      photoAnalysis = await analyzeImage(photoUrl);

      // Get previous log to compare trends
      const previousLog = await prisma.dailyLog.findFirst({
        where: {
          userId: req.user.id,
          date: { lt: logDate },
          photoUrl: { not: null },
        },
        orderBy: { date: "desc" },
      });

      if (previousLog && photoAnalysis) {
        const trend = compareAnalyses(
          {
            acneCount: previousLog.acneCount,
            acneSeverity: previousLog.acneSeverity,
            facialHairScore: previousLog.facialHairScore,
            skinTexture: previousLog.skinTexture,
          },
          photoAnalysis
        );

        console.log("Photo trend analysis:", trend);
      }
    }

    // Use upsert to create or update
    const log = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: req.user.id,
          date: logDate,
        },
      },
      update: {
        mood,
        isOnPeriod: isOnPeriod ?? false,
        flowIntensity,
        cramps,
        energyLevel,
        sleepQuality,
        sleepHours,
        stressLevel,
        exerciseMinutes,
        symptoms: symptoms || [],
        notes,
        photoUrl,
        ...(photoAnalysis && {
          acneCount: photoAnalysis.acneCount,
          acneSeverity: photoAnalysis.acneSeverity,
          facialHairScore: photoAnalysis.facialHairScore,
          skinTexture: photoAnalysis.skinTexture,
          analysisDate: photoAnalysis.analysisDate,
        }),
      },
      create: {
        userId: req.user.id,
        date: logDate,
        mood,
        isOnPeriod: isOnPeriod ?? false,
        flowIntensity,
        cramps,
        energyLevel,
        sleepQuality,
        sleepHours,
        stressLevel,
        exerciseMinutes,
        symptoms: symptoms || [],
        notes,
        photoUrl,
        ...(photoAnalysis && {
          acneCount: photoAnalysis.acneCount,
          acneSeverity: photoAnalysis.acneSeverity,
          facialHairScore: photoAnalysis.facialHairScore,
          skinTexture: photoAnalysis.skinTexture,
          analysisDate: photoAnalysis.analysisDate,
        }),
      },
    });

    res.status(201).json({ log });
  } catch (error) {
    console.error("Error creating/updating daily log:", error);

    // Provide more specific error messages
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "A log already exists for this date",
        message: error.message,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        message: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to create/update daily log",
      message: error.message,
    });
  }
});

// Delete a daily log
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id format (MongoDB ObjectId is 24 characters hex)
    if (!id || id.length !== 24) {
      return res.status(400).json({
        error: "Invalid log ID format",
      });
    }

    // Check if the log belongs to the user
    const log = await prisma.dailyLog.findUnique({
      where: { id },
    });

    if (!log) {
      return res.status(404).json({ error: "Log not found" });
    }

    if (log.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.dailyLog.delete({
      where: { id },
    });

    res.json({ message: "Log deleted successfully" });
  } catch (error) {
    console.error("Error deleting daily log:", error);
    res.status(500).json({
      error: "Failed to delete daily log",
      message: error.message,
    });
  }
});

export default router;
