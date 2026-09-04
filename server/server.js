import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import reportRoutes from "./routes/report/reportRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import pickupRoutes from "./routes/pickup/pickupRoutes.js";
import wasteGuideRoutes from "./routes/recycling/wasteGuideRoutes.js";
import recyclingCenterRoutes from "./routes/recycling/recyclingCenterRoutes.js";
import favoriteRoutes from "./routes/recycling/favoriteRoutes.js";
import reportCenterRoutes from "./routes/recycling/reportRoutes.js";
import adminRecyclingRoutes from "./routes/recycling/adminRoutes.js";
import educationRoutes from "./routes/recycling/educationRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "1mb" }));
// Sanitize user-controlled objects (avoid replacing immutable req.query on newer Node)
app.use((req, _res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." },
  })
);

// Serve uploaded report images as static files
app.use("/uploads", express.static("uploads"));

// --- Routes ---
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/waste-guides", wasteGuideRoutes);
app.use("/api/recycling-centers", recyclingCenterRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/center-reports", reportCenterRoutes);
app.use("/api/admin", adminRecyclingRoutes);
app.use("/api/education-articles", educationRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "CleanLanka API — Sri Lankan Waste Management Platform",
  });
});

// Error handler — must be mounted LAST
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
