// The page, top to bottom. Old app.js's DOM assembly became components;
// none of the markup changed, so every CSS selector still matches.

import { useEffect, useState } from "react";
import Header from "../../src/components/Header.jsx";
import Hero from "../../src/components/Hero.jsx";
import Results from "../../src/components/Results.jsx";
import HowItWorks from "../../src/components/HowItWorks.jsx";
import Footer from "../../src/components/Footer.jsx";

export default function App() {
  // The one piece of app-wide state: the last analysis. Hero's upload flow
  // produces it, Results consumes it, and the reset just sets it back to null
  // — which unmounts Results, so the ring and count reset themselves.
  const [analysis, setAnalysis] = useState(null);

  // The old page scrolled to the results as it revealed them.
  useEffect(() => {
    if (analysis) {
      document.querySelector(".results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [analysis]);

  function reset() {
    setAnalysis(null);
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <Header />
      <main className="container">
        <Hero onAnalysis={setAnalysis} />
        {analysis && <Results analysis={analysis} onReset={() => setAnalysis(null)} />}
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
