// MongoDB connection. The URI comes from environment variables (loaded by
// the dev script from .env) with a local default when it is not set.

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zero2shipped";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected:", MONGODB_URI);
  } catch (err) {
    console.error("MongoDB not reachable yet:", err.message);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
