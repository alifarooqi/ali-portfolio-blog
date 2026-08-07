"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import "./CustomCursor.scss";

/**
 * Two-element custom cursor: a hard 8px dot that tracks exactly, and a
 * trailing 36px ring that springs behind. The ring grows when hovering
 * elements marked [data-cursor="hover"] (or any native interactive element).
 *
 * Disabled entirely on touch devices and when prefers-reduced-motion is set —
 * in those cases the native cursor remains and this component renders nothing.
 */

// Gate the cursor on (pointer: fine) AND no reduced-motion. SSR returns false;
// client subscribes via useSyncExternalStore so changes (e.g. user toggles
// reduced-motion in OS prefs) are picked up live.
const GATE_QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";
function subscribeGate(callback: () => void) {
  const mql = window.matchMedia(GATE_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function readGate() {
  return window.matchMedia(GATE_QUERY).matches;
}
function readGateSSR() {
  return false;
}

export default function CustomCursor() {
  const enabled = useSyncExternalStore(subscribeGate, readGate, readGateSSR);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("custom-cursor-active");

    const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]';

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = e.target as Element | null;
      setHovering(!!target && !!target.closest(HOVER_SELECTOR));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div className="custom-cursor" data-hidden={hidden} aria-hidden="true">
      <motion.div
        className="custom-cursor__dot"
        style={{ x, y }}
        data-hover={hovering}
        data-pressed={pressed}
      />
      <motion.div
        className="custom-cursor__ring"
        style={{ x: ringX, y: ringY }}
        data-hover={hovering}
        data-pressed={pressed}
      />
    </div>
  );
}
