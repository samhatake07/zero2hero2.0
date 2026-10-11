export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <h2>How it works</h2>
      <div className="steps">
        <div className="step">
          <p className="step-num">01</p>
          <h3>Upload a PDF</h3>
          <p>Drag your resume into the box. Parsing starts the moment it lands.</p>
        </div>
        <div className="step">
          <p className="step-num">02</p>
          <h3>We scan for skills</h3>
          <p>The parser checks your resume against the skills recruiters actually search for.</p>
        </div>
        <div className="step">
          <p className="step-num">03</p>
          <h3>Get your score</h3>
          <p>See what's present, what's missing, and exactly what to add next.</p>
        </div>
      </div>
    </section>
  );
}
