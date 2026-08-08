"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCursorMotionGate } from "./components/animaiton/useCursorMotionGate";

// Next.js template.tsx remounts on every navigation (unlike layout.tsx which
// persists). A motion.div keyed on pathname plays an entrance animation each
// time the route changes. No AnimatePresence — exit animations require
// keeping old server-rendered content mounted, which fights with App Router.
// Entrance-only is the pragmatic choice; the 0.3s fade is too quick for the
// absence of an exit to be noticeable.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const animate = useCursorMotionGate();

  if (!animate) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
