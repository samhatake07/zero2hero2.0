// Express server for the resume parser. Routing lives in src/routes, request
// validation in src/middleware, the analyze logic in src/controllers and
// src/services, and the MongoDB connection in src/config. Every analysis is
// stored via the Mongoose model in src/models.

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import analyzeRouter from "./src/routes/analyze.js";
import { connectDB, disconnectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? "connected" : "not connected" });
});

app.use("/api", analyzeRouter);

// The API starts even if MongoDB is not up yet - /health reports the
// connection state, and writes fail with a clear 500 until the DB answers.
await connectDB();
app.listen(PORT, () => console.log("resume parser API on http://localhost:" + PORT));

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await disconnectDB();
    process.exit(0);
  });
}
