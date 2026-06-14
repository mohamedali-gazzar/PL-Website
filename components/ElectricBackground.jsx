"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed canvas of electric pulses — lightning arcs that crackle across
 * the dark field. No text/neon signs; just the energy. Sits behind the
 * preloader. Honours prefers-reduced-motion (renders a single calm frame).
 */
export default function ElectricBackground({ opacity = 1, rate = 0.05, fade = 0.05 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf;
    let bolts = [];

    const makeBolt = () => {
      const x1 = Math.random() * W;
      const y1 = Math.random() * H;
      const x2 = Math.random() * W;
      const y2 = Math.random() * H;
      const pts = [];
      const segs = 9;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const jitter = i === 0 || i === segs ? 0 : (Math.random() - 0.5) * 70;
        pts.push([x1 + (x2 - x1) * t + jitter, y1 + (y2 - y1) * t + jitter]);
      }
      bolts.push({ pts, life: 1 });
    };

    const drawElectric = () => {
      ctx2d.clearRect(0, 0, W, H);

      if (!reduce && Math.random() < rate) makeBolt();

      bolts.forEach((bolt) => {
        // glow pass
        ctx2d.save();
        ctx2d.globalAlpha = bolt.life * 0.5;
        ctx2d.strokeStyle = "#F16722";
        ctx2d.shadowColor = "#F16722";
        ctx2d.shadowBlur = 26;
        ctx2d.lineWidth = 3;
        ctx2d.beginPath();
        bolt.pts.forEach((p, i) =>
          i === 0 ? ctx2d.moveTo(p[0], p[1]) : ctx2d.lineTo(p[0], p[1])
        );
        ctx2d.stroke();
        ctx2d.restore();

        // core pass
        ctx2d.save();
        ctx2d.globalAlpha = bolt.life * 0.9;
        ctx2d.strokeStyle = "#ffd9bf";
        ctx2d.shadowColor = "#F16722";
        ctx2d.shadowBlur = 14;
        ctx2d.lineWidth = 1.4;
        ctx2d.beginPath();
        bolt.pts.forEach((p, i) =>
          i === 0 ? ctx2d.moveTo(p[0], p[1]) : ctx2d.lineTo(p[0], p[1])
        );
        ctx2d.stroke();
        ctx2d.restore();

        bolt.life -= fade;
      });
      bolts = bolts.filter((b) => b.life > 0);

      raf = requestAnimationFrame(drawElectric);
    };

    if (reduce) {
      makeBolt();
      drawElectric();
      cancelAnimationFrame(raf);
    } else {
      drawElectric();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}
