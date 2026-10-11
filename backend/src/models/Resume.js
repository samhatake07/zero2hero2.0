import mongoose from "mongoose";

// One stored analysis. Resume TEXT is deliberately not stored yet - the JD
// comparison step will decide what gets kept. analyze.js always provides
// tier, summary, score and analyzedAt, so required is safe. fileName stays
// null until real PDF uploads send a name alongside the text.
const resumeSchema = new mongoose.Schema(
  {
    fileName: { type: String, default: null },
    score: { type: Number, required: true },
    present: { type: [String], default: [] },
    missing: { type: [String], default: [] },
    tier: { type: String, required: true },
    summary: { type: String, required: true },
    analyzedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("Resume", resumeSchema);
