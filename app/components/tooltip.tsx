"use client";

import { useState } from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  title?: string;
  placement?: TooltipPlacement;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// TODO Figure out why this component is not working as expected
export default function Tooltip({
  title,
  placement = "top",
  children,
  className = "",
  style
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const placementClasses: Record<TooltipPlacement, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={style}
    >
      {children}

      {visible && title && (
        <div
          className={`absolute px-2 py-1 text-sm rounded bg-gray-800 text-white whitespace-nowrap shadow-lg ${placementClasses[placement]}`}
        >
          {title}
        </div>
      )}
    </div>
  );
}
