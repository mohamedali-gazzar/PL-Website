"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import EnergyField from "@/components/EnergyField";
import EnergyRail from "@/components/EnergyRail";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import ProductLines from "@/components/sections/ProductLines";
import Milestones from "@/components/sections/Milestones";
import PowerMap from "@/components/sections/PowerMap";
import Values from "@/components/sections/Values";
import Safety from "@/components/sections/Safety";
import PowerlineEffect from "@/components/sections/PowerlineEffect";
import Logos from "@/components/sections/Logos";
import Memorial from "@/components/sections/Memorial";
import CTA from "@/components/sections/CTA";

// Module-scoped flag: false on a full page load (first open / reload), and
// stays true across in-app navigation. So the intro plays once per page load,
// never again when the user returns to home from another page.
let introPlayed = false;

export default function Home() {
  const [ready, setReady] = useState(introPlayed);
  const [showIntro, setShowIntro] = useState(!introPlayed);

  return (
    <SmoothScroll>
      {showIntro && (
        <Preloader
          // Reveal the site AND unmount the preloader together at the very end.
          // No React state changes during the animation → it can never restart.
          onComplete={() => {
            introPlayed = true;
            setReady(true);
            setShowIntro(false);
          }}
        />
      )}

      {/* Calm, organized ambient field behind the whole page — a chain of
          dots that pass energy to each other in sequence. Replaces the
          chaotic random-lightning background. */}
      <div className="page-electric" aria-hidden="true">
        <EnergyField />
      </div>

      <EnergyRail />
      <Nav />
      <main className="home-main">
        <Hero ready={ready} />
        <Projects />
        <ProductLines />
        <Milestones />
        <PowerMap />
        <Values />
        <Safety />
        <PowerlineEffect />
        <Logos />
        <CTA />
        <Memorial />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
