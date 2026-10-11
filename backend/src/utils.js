// The skill pool recruiters search for - the shared source of truth for
// present/missing/score. The frontend mock reads the same list from
// frontend/src/lib/mock.js; when the AI step lands it can replace the simple
// scan in analyze.js without touching this.

export const ALL_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "React", "Node.js",
  "SQL", "PostgreSQL", "Git", "Docker", "AWS", "REST APIs",
  "HTML", "CSS", "MongoDB", "CI/CD", "Testing", "Linux",
];

export const TIERS = [
  { min: 80, label: "Strong match", summary: "Great coverage - you'd clear most keyword screens." },
  { min: 60, label: "Decent match", summary: "Solid base. A few missing keywords are holding the score back." },
  { min: 40, label: "Needs work", summary: "Several core skills aren't showing up. Worth adding before you apply." },
  { min: 0, label: "Weak match", summary: "Most searched-for skills are missing from this resume." },
];
