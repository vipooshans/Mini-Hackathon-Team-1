import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "⚠️  MONGO_URI is not set in .env — server will start but DB features won't work."
    );
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s instead of 30s default)
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("⚠️  MongoDB connection failed:", error.message);
    console.warn(
      "⚠️  Server will still start — DB-dependent routes will return errors."
    );
  }
};
