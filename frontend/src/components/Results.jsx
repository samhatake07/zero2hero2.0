import { useEffect, useRef } from "react";
import useCountUp from "../hooks/useCountUp.js";
import { TIERS } from "../lib/mock.js";

const RING_LENGTH = 2 * Math.PI * 54; // circumference of the r=54 score ring

// The analysis results. The score ring is the same SVG as the old page; the
// animated number is useCountUp, and App unmounts the whole section on reset,
// so the ring's strokeDashoffset is the animation instead of a class flip.
export default function Results({ analysis, onReset }) {
  const ringRef = useRef(null);
  const scoreNum = useCountUp(analysis.score);

  useEffect(() => {
    const offset = RING_LENGTH * (1 - analysis.score / 100);
    ringRef.current.style.strokeDashoffset = offset;
  }, [analysis.score]);

  const tier = TIERS.find((t) => analysis.score >= t.min);

  return (
    <section className="results" aria-live="polite">
      <div className="results-head">
        <h2>Analysis complete</h2>
        <p className="results-file">{analysis.fileName}</p>
    </div>

      <div className="results-grid">
        <div className="score-card">
          <div className="ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="ring-bg" cx="60" cy="60" r="54"></circle>
              <circle className="ring-fg" ref={ringRef} cx="60" cy="60" r="54"></circle>
            </svg>
            <div className="ring-label">
              <span>{scoreNum}</span>
              <small>/ 100</small>
            </div>
          </div>
          <p className="tier">{tier.label}</p>
          <p className="summary">{tier.summary}</p>
          <button className="btn btn-ghost" onClick={onReset}>
            Analyze another resume
          </button>
        </div>

        <div className="skills-cards">
          <div className="skill-card">
            <h3>Skills found <span className="count">· {analysis.present.length}</span></h3>
            <ul className="chips">
              {analysis.present.map((skill) => (
                <Chip key={skill} skill={skill} present />
              ))}
            </ul>
          </div>
          <div className="skill-card">
            <h3>Skills missing <span className="count">· {analysis.missing.length}</span></h3>
            <ul className="chips">
              {analysis.missing.map((skill) => (
                <Chip key={skill} skill={skill} />
              ))}
            </ul>
            <p className="hint">Adding these keywords is the fastest way to lift the score.</p>
          </div>
        </div>
      </div>

      <p className="demo-note">Design mock — the score and skill lists are generated locally. A real parser backend will slot in behind this page.</p>
    </section>
  );
}

function Chip({ skill, present }) {
  return (
    <li className={present ? "chip chip-present" : "chip chip-missing"}>
      {present ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      )}
      {skill}
    </li>
  );
}
