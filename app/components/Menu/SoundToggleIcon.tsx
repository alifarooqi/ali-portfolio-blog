"use client";

import { AnimatePresence, motion } from "motion/react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { useCursorMotionGate } from "../animaiton/useCursorMotionGate";

// Mirrors ThemeToggleIcon: in muted state show VolumeUp (action: unmute);
// in unmuted state VolumeOff. When motion is gated off (touch device or
// prefers-reduced-motion), icons swap instantly with no animation — still
// legible, just not animated. Audio itself is not motion-gated; only the
// icon crossfade is.
export default function SoundToggleIcon({ isMuted }: { isMuted: boolean }) {
  const animate = useCursorMotionGate();
  const icon = isMuted ? <VolumeUpIcon /> : <VolumeOffIcon />;

  if (!animate) {
    return <span className="menu-item-icon">{icon}</span>;
  }

  return (
    <span className="menu-item-icon" style={{ display: "inline-flex" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isMuted ? "muted" : "unmuted"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ display: "inline-flex" }}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
