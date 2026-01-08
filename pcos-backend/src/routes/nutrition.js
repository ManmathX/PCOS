import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get daily nutrition log
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    // Start and end of day
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const [foodEntries, waterIntake] = await Promise.all([
      prisma.foodEntry.findMany({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.waterIntake.findUnique({
        where: {
          userId_date: {
            userId,
            date: startOfDay,
          },
        },
      }),
    ]);

    res.json({ foodEntries, waterIntake });
  } catch (error) {
    console.error("Get nutrition error:", error);
    res.status(500).json({ error: "Failed to fetch nutrition logs" });
  }
});

// Log food
router.post("/food", async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      date,
      mealType,
      foodName,
      portion,
      calories,
      carbs,
      protein,
      fat,
      isPCOSFriendly,
    } = req.body;

    const entry = await prisma.foodEntry.create({
      data: {
        userId,
        date: new Date(date),
        mealType,
        foodName,
        portion,
        calories: Number(calories) || 0,
        carbs: Number(carbs),
        protein: Number(protein),
        fat: Number(fat),
        isPCOSFriendly: Boolean(isPCOSFriendly),
      },
    });
    res.json({ entry });
  } catch (error) {
    console.error("Log food error:", error);
    res.status(500).json({ error: "Failed to log food" });
  }
});

// Update water intake
router.post("/water", async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, glasses } = req.body;
    const logDate = new Date(new Date(date).setHours(0, 0, 0, 0));

    const intake = await prisma.waterIntake.upsert({
      where: {
        userId_date: {
          userId,
          date: logDate,
        },
      },
      update: { glasses: Number(glasses) },
      create: {
        userId,
        date: logDate,
        glasses: Number(glasses),
      },
    });
    res.json({ intake });
  } catch (error) {
    console.error("Log water error:", error);
    res.status(500).json({ error: "Failed to log water" });
  }
});

export default router;
