import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get mood logs
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const where = { userId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const moods = await prisma.moodEntry.findMany({
      where,
      orderBy: { date: "desc" },
    });
    res.json({ moods });
  } catch (error) {
    console.error("Get moods error:", error);
    res.status(500).json({ error: "Failed to fetch moods" });
  }
});

// Log mood
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, mood, moodScore, emotions, triggers, journalEntry } =
      req.body;

    const entry = await prisma.moodEntry.create({
      data: {
        userId,
        date: new Date(date),
        mood,
        moodScore: Number(moodScore),
        emotions,
        triggers,
        journalEntry,
      },
    });
    res.json({ entry });
  } catch (error) {
    console.error("Log mood error:", error);
    res.status(500).json({ error: "Failed to log mood" });
  }
});

export default router;
