import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import collectionScheduleRoutes from "./routes/collection-schedule/collectionScheduleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
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

app.use("/api/health", healthRoutes);
app.use("/api/collection-schedules", collectionScheduleRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "CleanLanka API" });
});

app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
