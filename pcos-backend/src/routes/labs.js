import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get lab results
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await prisma.labResult.findMany({
      where: { userId },
      include: { values: true },
      orderBy: { testDate: "desc" },
    });
    res.json({ results });
  } catch (error) {
    console.error("Get labs error:", error);
    res.status(500).json({ error: "Failed to fetch lab results" });
  }
});

// Initialize upload logic for files later...

// Add lab result manually
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { testDate, testName, labName, values, notes } = req.body;

    const result = await prisma.labResult.create({
      data: {
        userId,
        testDate: new Date(testDate),
        testName,
        labName,
        notes,
        values: {
          create: values.map((v) => ({
            marker: v.marker,
            value: Number(v.value),
            unit: v.unit,
            normalMin: Number(v.normalMin),
            normalMax: Number(v.normalMax),
            isAbnormal: Boolean(v.isAbnormal),
          })),
        },
      },
      include: { values: true },
    });
    res.json({ result });
  } catch (error) {
    console.error("Add lab error:", error);
    res.status(500).json({ error: "Failed to add lab result" });
  }
});

export default router;
