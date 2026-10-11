import { useRef, useState } from "react";
import { simulateParse } from "../../../src/lib/mock.js";

// The hero section: headline plus the upload card. In the old page this was
// getElementById wiring in app.js plus sections hidden by a .hidden class;
// here busy/error/drag-over are state, and Results is mounted by App once an
// analysis exists. Drag events need preventDefault or the browser navigates
// to the dropped file instead of handing it to us.
export default function Hero({ onAnalysis }) {
  const fileInputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    setError(false);
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError(true);
      return;
    }
    setBusy(true);
    simulateParse(file.name).then((result) => {
      setBusy(false);
      onAnalysis(result);
      if (fileInputRef.current) fileInputRef.current.value = ""; // allow re-uploading the same file
    });
  }

  return (
    <section className="hero">
      <p className="eyebrow">0 to shipped · resume parser</p>
      <h1>
        Your resume, <span className="accent">scored</span> in seconds.
      </h1>
      <p className="sub">
        Drop in a PDF and see your score, the skills recruiters can find, and the ones
        you're missing. Runs entirely in your browser.
      </p>
      <div className="upload-card" id="upload">
        <div
          className={dragOver ? "dropzone dragover" : "dropzone"}
          role="button"
          tabIndex={0}
          aria-label="Upload your resume PDF"
          onClick={() => fileInputRef.current.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current.click();
            }
          }}
          onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          {busy ? (
            <div className="dz-busy">
              <div className="spinner" />
              <p className="dz-title">Analyzing your resume…</p>
            </div>
          ) : (
            <div className="dz-idle">
              <svg className="dz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 16V4" />
                <path d="m6 9 6-6 6 6" />
                <path d="M4 20h16" />
              </svg>
              <p className="dz-title">Drag &amp; drop your resume here</p>
              <p className="dz-sub">or <span className="dz-link">browse files</span> — PDF only</p>
            </div>
          )}
          {error && <p className="dz-error">That doesn't look like a PDF — please choose a .pdf file.</p>}
        </div>
        <p className="upload-note">Demo build: your file never leaves the browser, and results are simulated.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
      </div>
    </section>
  );
}
