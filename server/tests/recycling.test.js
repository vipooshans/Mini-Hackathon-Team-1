/**
 * Backend tests for Recycling & Disposal Guide (Component 3).
 * Run: npm test (from server/)
 *
 * Requires MONGODB_URI / MONGO_URI. Uses the same DB as development —
 * prefer a local/test database.
 */
import dotenv from "dotenv";
import request from "supertest";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { connectDB } from "../config/db.js";
import wasteGuideRoutes from "../routes/recycling/wasteGuideRoutes.js";
import recyclingCenterRoutes from "../routes/recycling/recyclingCenterRoutes.js";
import WasteGuide from "../models/recycling/WasteGuide.js";
import RecyclingCenter from "../models/recycling/RecyclingCenter.js";

dotenv.config();

function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/waste-guides", wasteGuideRoutes);
  app.use("/api/recycling-centers", recyclingCenterRoutes);
  return app;
}

const app = buildApp();

beforeAll(async () => {
  await connectDB();
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB not connected — set MONGODB_URI for tests");
  }
  await WasteGuide.deleteMany({ slug: /^test-/ });
  await RecyclingCenter.deleteMany({ name: /^Test Center/ });

  await WasteGuide.create({
    name: "Test Battery Pack",
    slug: "test-battery-pack",
    category: "Batteries",
    description: "Test battery guide",
    recyclable: true,
    recyclabilityType: "Hazardous",
    keywords: ["battery", "batt", "test"],
    status: "published",
    language: "en",
    preparationInstructions: ["Keep separate"],
    dos: ["Use collection point"],
    donts: ["Do not bin"],
    acceptedItems: ["Packs"],
    rejectedItems: [],
    disposalMethods: ["E-waste center"],
  });

  await RecyclingCenter.create({
    name: "Test Center Colombo",
    description: "Test",
    type: "Recycling Center",
    district: "Colombo",
    address: "Test Rd",
    location: { type: "Point", coordinates: [79.8612, 6.9271] },
    acceptedWaste: ["Plastic", "Batteries"],
    rejectedWaste: [],
    services: ["Drop-off"],
    verified: true,
    verificationStatus: "Approved",
    isDemo: true,
  });
}, 30000);

afterAll(async () => {
  await WasteGuide.deleteMany({ slug: /^test-/ });
  await RecyclingCenter.deleteMany({ name: /^Test Center/ });
  await mongoose.connection.close();
});

describe("Waste guides API", () => {
  test("GET /api/waste-guides returns published guides", async () => {
    const res = await request(app).get("/api/waste-guides");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/waste-guides/search?q=batt finds battery", async () => {
    const res = await request(app).get("/api/waste-guides/search?q=batt");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const names = (res.body.data || []).map((g) => g.name.toLowerCase());
    expect(names.some((n) => n.includes("battery"))).toBe(true);
  });

  test("GET /api/waste-guides/:slug returns guide", async () => {
    const res = await request(app).get("/api/waste-guides/test-battery-pack");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Test Battery Pack");
  });
});

describe("Recycling centers nearby API", () => {
  test("GET /api/recycling-centers/nearby requires coords", async () => {
    const res = await request(app).get("/api/recycling-centers/nearby");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /api/recycling-centers/nearby returns centres", async () => {
    const res = await request(app).get(
      "/api/recycling-centers/nearby?latitude=6.9271&longitude=79.8612&radius=20&wasteType=Plastic"
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
