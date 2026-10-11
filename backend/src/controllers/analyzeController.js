// The analyze controller: middleware validated the request, so the body has a
// non-empty text field. Runs the service, stores the result via the model,
// and answers the request. Storage errors come back as a clear 500.

import Resume from "../models/Resume.js";
import { analyzeResumeText } from "../services/resumeText.js";

export async function analyze(req, res) {
  try {
    const { fileName, text } = req.body;
    const analysis = analyzeResumeText(text);
    const saved = await Resume.create({ ...analysis, fileName: fileName || null });
    res.status(201).json(saved.toObject());
  } catch (err) {
    console.error("analyze failed:", err);
    res.status(500).json({ error: "Analysis failed." });
  }
}
