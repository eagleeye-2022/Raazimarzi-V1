import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

// Global cache (important for Next.js & serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // Already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Create connection promise if not exists
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10, // production safe
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
