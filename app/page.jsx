"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import ElectricBackground from "@/components/ElectricBackground";
import EnergyRail from "@/components/EnergyRail";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import ProductLines from "@/components/sections/ProductLines";
import Milestones from "@/components/sections/Milestones";
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

  return (
    <SmoothScroll>
      {!introPlayed && (
        <Preloader
          onComplete={() => {
            introPlayed = true;
            setReady(true);
          }}
        />
      )}

      {/* Subtle, slow electric ambiance behind the whole page */}
      <div className="page-electric" aria-hidden="true">
        <ElectricBackground opacity={0.4} rate={0.028} fade={0.03} />
      </div>

      <EnergyRail />
      <Nav />
      <main className="home-main">
        <Hero ready={ready} />
        <Projects />
        <ProductLines />
        <Milestones />
        <Values />
        <Safety />
        <PowerlineEffect />
        <Logos />
        <Memorial />
        <CTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
