import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from "./routes/auth.js";
import cyclesRoutes from "./routes/cycles.js";
import symptomsRoutes from "./routes/symptoms.js";
import riskRoutes from "./routes/risk.js";
import predictionsRoutes from "./routes/predictions.js";
import habitsRoutes from "./routes/habits.js";
import challengesRoutes from "./routes/challenges.js";
import doctorRoutes from "./routes/doctor.js";
import dailyLogsRoutes from "./routes/dailyLogs.js";
import aiChatRoutes from "./routes/aiChat.js";
import communitiesRoutes from "./routes/communities.js";
import messagesRoutes from "./routes/messages.js";
import medicationsRoutes from "./routes/medications.js";
import nutritionRoutes from "./routes/nutrition.js";
import moodRoutes from "./routes/mood.js";
import metricsRoutes from "./routes/metrics.js";
import labsRoutes from "./routes/labs.js";
import aiReportsRoutes from "./routes/aiReports.js";
import { authenticateToken } from "./middleware/auth.js";
import { requireUser, requireDoctor } from "./middleware/rbac.js";

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "PCOS Early-Detection App API",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cycles", authenticateToken, requireUser, cyclesRoutes);
app.use("/api/symptoms", authenticateToken, requireUser, symptomsRoutes);
app.use("/api/risk", authenticateToken, requireUser, riskRoutes);
app.use("/api/predictions", authenticateToken, requireUser, predictionsRoutes);
app.use("/api/habits", authenticateToken, requireUser, habitsRoutes);
app.use("/api/challenges", authenticateToken, requireUser, challengesRoutes);
app.use("/api/doctor", authenticateToken, requireDoctor, doctorRoutes);
app.use("/api/daily-logs", authenticateToken, requireUser, dailyLogsRoutes);
app.use("/api/ai-chat", authenticateToken, requireDoctor, aiChatRoutes);
app.use(
  "/api/communities",
  authenticateToken,
  requireDoctor,
  communitiesRoutes
);
app.use("/api/messages", authenticateToken, requireDoctor, messagesRoutes);

// New Feature Routes
app.use("/api/medications", authenticateToken, requireUser, medicationsRoutes);
app.use("/api/nutrition", authenticateToken, requireUser, nutritionRoutes);
app.use("/api/mood", authenticateToken, requireUser, moodRoutes);
app.use("/api/metrics", authenticateToken, requireUser, metricsRoutes);
app.use("/api/labs", authenticateToken, requireUser, labsRoutes);
app.use("/api/ai-reports", authenticateToken, aiReportsRoutes);

// Protected route example (requires authentication)
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
