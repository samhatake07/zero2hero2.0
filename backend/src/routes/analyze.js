// The analyze routes. POST /api/analyze (validate middleware, then
// controller) and GET /api/analyses (recent analyses list).

import { Router } from "express";
import { validateAnalyze } from "../middleware/validate.js";
import { analyze } from "../controllers/analyzeController.js";
import Resume from "../models/Resume.js";

const router = Router();

router.post("/analyze", validateAnalyze, analyze);
router.get("/analyses", async (req, res) => {
  try {
    const recent = await Resume.find().sort({ analyzedAt: -1 }).limit(20).lean();
    res.json(recent);
  } catch (err) {
    console.error("list failed:", err);
    res.status(500).json({ error: "Could not list analyses." });
  }
});

export default router;
