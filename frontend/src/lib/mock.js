// Mock analysis for the design mock. No backend: a "parse" is simulated with a
// timer + deterministic mock data, so the same file always gets the same score.

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

// Stable pseudo-random from the file name, so re-uploading the same file
// gives the same score (how a real parser would behave).
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function mockAnalysis(fileName) {
  const h = hashCode(fileName);
  const shuffled = [...ALL_SKILLS].sort((a, b) => {
    const ha = (h * 31 + a.length * 7 + a.charCodeAt(0)) | 0;
    const hb = (h * 31 + b.length * 7 + b.charCodeAt(0)) | 0;
    return ha - hb;
  });
  const presentCount = 5 + (h % 9); // between 5 and 13 of the 18 skills
  return {
    score: Math.round((presentCount / ALL_SKILLS.length) * 100),
    present: shuffled.slice(0, presentCount),
    missing: shuffled.slice(presentCount),
  };
}

// Stands in for the API call. When the Express backend lands (the next line in
// DECISION.md), this becomes a real fetch() to /api/analyze.
export function simulateParse(fileName, delay = 1400) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAnalysis(fileName)), delay);
  });
}
