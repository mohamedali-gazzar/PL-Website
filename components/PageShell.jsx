"use client";

import SmoothScroll from "@/components/SmoothScroll";
import EnergyRail from "@/components/EnergyRail";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PageShell({ children }) {
  return (
    <SmoothScroll>
      <EnergyRail />
      <Nav />
      <main>{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
