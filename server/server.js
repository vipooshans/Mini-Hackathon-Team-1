import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import reportRoutes from "./routes/report/reportRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// Serve uploaded report images as static files
app.use("/uploads", express.static("uploads"));

// --- Routes ---
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Teammates: mount your feature routes here, BEFORE errorHandler.

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
