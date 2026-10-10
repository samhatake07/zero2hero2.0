// 0→Shipped — resume parser design mock.
// No backend: a "parse" is simulated with a timer + deterministic mock data,
// so the same file always produces the same result.

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const dzIdle = document.getElementById("dz-idle");
const dzBusy = document.getElementById("dz-busy");
const dzError = document.getElementById("dz-error");
const results = document.getElementById("results");
const resultsFile = document.getElementById("results-file");
const ringFg = document.getElementById("ring-fg");
const scoreNum = document.getElementById("score-num");
const scoreTier = document.getElementById("score-tier");
const scoreSummary = document.getElementById("score-summary");
const presentList = document.getElementById("present-list");
const missingList = document.getElementById("missing-list");
const presentCount = document.getElementById("present-count");
const missingCount = document.getElementById("missing-count");
const resetBtn = document.getElementById("reset-btn");

const RING_LENGTH = 2 * Math.PI * 54; // circumference of the r=54 score ring

// The skill pool a real parser would scan for.
const ALL_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "React", "Node.js",
  "SQL", "PostgreSQL", "Git", "Docker", "AWS", "REST APIs",
  "HTML", "CSS", "MongoDB", "CI/CD", "Testing", "Linux",
];

const TIERS = [
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

function mockAnalysis(fileName) {
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

function render(fileName, analysis) {
  resultsFile.textContent = fileName;

  // Score ring: animate the stroke from 0 to the score.
  const offset = RING_LENGTH * (1 - analysis.score / 100);
  ringFg.style.strokeDashoffset = offset;
  animateCount(analysis.score);

  const tier = TIERS.find((t) => analysis.score >= t.min);
  scoreTier.textContent = tier.label;
  scoreSummary.textContent = tier.summary;

  presentList.innerHTML = "";
  analysis.present.forEach((skill) =>
    presentList.appendChild(chip(skill, "chip-present", true))
  );
  missingList.innerHTML = "";
  analysis.missing.forEach((skill) =>
    missingList.appendChild(chip(skill, "chip-missing", false))
  );

  presentCount.textContent = `· ${analysis.present.length}`;
  missingCount.textContent = `· ${analysis.missing.length}`;

  results.classList.remove("hidden");
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function chip(label, className, present) {
  const li = document.createElement("li");
  li.className = `chip ${className}`;
  li.innerHTML = present
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  li.appendChild(document.createTextNode(label));
  return li;
}

function animateCount(target) {
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    scoreNum.textContent = Math.round(eased * target);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---------- upload flow ----------

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

["dragenter", "dragover"].forEach((event) =>
  dropzone.addEventListener(event, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  })
);

["dragleave", "drop"].forEach((event) =>
  dropzone.addEventListener(event, () => dropzone.classList.remove("dragover"))
);

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  dzError.classList.add("hidden");

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    dzError.classList.remove("hidden");
    return;
  }

  dzIdle.classList.add("hidden");
  dzBusy.classList.remove("hidden");

  // Simulated parse time. Swap this block for a real fetch() later.
  setTimeout(() => {
    render(file.name, mockAnalysis(file.name));
    dzBusy.classList.add("hidden");
    dzIdle.classList.remove("hidden");
    fileInput.value = ""; // allow re-uploading the same file
  }, 1400);
}

resetBtn.addEventListener("click", () => {
  results.classList.add("hidden");
  ringFg.style.strokeDashoffset = RING_LENGTH;
  scoreNum.textContent = "0";
  dropzone.scrollIntoView({ behavior: "smooth", block: "center" });
});
