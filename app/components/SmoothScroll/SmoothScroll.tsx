"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initializes Lenis smooth-inertia scrolling. No-op on touch devices and
 * when prefers-reduced-motion is set — those users get the browser's native
 * scroll, which is correct for them.
 *
 * Renders no DOM; just owns the RAF loop. Must be a client component mounted
 * high in the tree (layout.tsx) so it persists across route changes.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Skip on touch inputs — native scroll already feels right there and
    // Lenis can fight the OS's gesture handling.
    if (!finePointer || reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
