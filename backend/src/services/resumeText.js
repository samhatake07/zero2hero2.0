// The real analysis engine, moved out of the frontend mock. Takes resume TEXT
// (not the PDF bytes - text extraction lands with the AI step), scans it for
// the 18 skills recruiters search for, and returns a deterministic result.
// Parsing is simple: sentences are split on ., ; and newlines, then a skill
// matches when one of the sentences contains it, case-insensitive.

import { ALL_SKILLS, TIERS } from "../utils.js";

function sentences(text) {
  return text
    .toLowerCase()
    .split(/[.;\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function analyzeResumeText(text) {
  const raw = sentences(text);

  // Order follows ALL_SKILLS, so the present list reads in skill-pool order
  // rather than the order words happened to appear in the resume.
  const present = ALL_SKILLS.filter((skill) => {
    const target = skill.toLowerCase();
    return raw.some((sentence) => sentence.includes(target));
  });
  const missing = ALL_SKILLS.filter((skill) => !present.includes(skill));

  const score = Math.round((present.length / ALL_SKILLS.length) * 100);
  const tierDef = TIERS.find((t) => score >= t.min);

  return {
    fileName: null,
    text: null,
    score,
    present,
    missing,
    tier: tierDef.label,
    summary: tierDef.summary,
    analyzedAt: new Date(),
  };
}
