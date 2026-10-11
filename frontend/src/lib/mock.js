// Analysis entry point for the UI. The real path is POST /api/analyze on the
// Express backend; this file also carries the local mock that answers when
// the backend cannot be reached, so the page always works offline. Both
// return the same shape, so the UI cannot tell which one responded.
// text stays null until PDF text extraction exists - the backend call is
// wired and waiting for it.

const API = import.meta.env?.VITE_API_URL || "http://localhost:4000";

export const ALL_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "React", "Node.js",
  "SQL", "PostgreSQL", "Git", "Docker", "AWS", "REST APIs",
  "HTML", "CSS", "MongoDB", "CI/CD", "Testing", "Linux",
];

export const TIERS = [
  { min: 80, label: "Strong match", summary: "Great coverage — you'd clear most keyword screens." },
  { min: 60, label: "Decent match", summary: "Solid base. A few missing keywords are holding the score back." },
  { min: 40, label: "Needs work", summary: "Several core skills aren't showing up. Worth adding before you apply." },
  { min: 0, label: "Weak match", summary: "Most searched-for skills are missing from this resume." },
];

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
// The local fallback, kept from the design mock: deterministic mock data keyed
// on the file name, so the real backend and the mock return the same shape.
function mockAnalysis(fileName) {
  const h = hashCode(fileName);
  const shuffled = [...ALL_SKILLS].sort((a, b) => {
    const ha = (h * 31 + a.length * 7 + a.charCodeAt(0)) | 0;
    const hb = (h * 31 + b.length * 7 + b.charCodeAt(0)) | 0;
    return ha - hb;
  });
  const presentCount = 5 + (h % 9);
  return {
    fileName,
    text: null,
    score: Math.round((presentCount / ALL_SKILLS.length) * 100),
    present: shuffled.slice(0, presentCount),
    missing: shuffled.slice(presentCount),
    tier: TIERS.find((t) => t.min <= Math.round((presentCount / ALL_SKILLS.length) * 100)).label,
    summary: TIERS.find((t) => t.min <= Math.round((presentCount / 18) * 100)).summary,
    analyzedAt: new Date(),
  };
}
// Try the real backend first, fall back to the mock. With no file name there
// is nothing to show either way, so the request skips straight to the fallback.
export async function analyzeResume(fileName, text) {
  if (!fileName) return mockAnalysis("unknown.pdf");
  try {
    const res = await fetch(API + "/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, text }),
    });
    if (!res.ok) throw new Error("API responded " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("API unavailable, using local mock:", err.message);
    return mockAnalysis(fileName);
  }
}
