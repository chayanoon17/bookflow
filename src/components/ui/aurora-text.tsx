"use client";

import React, { memo } from "react";

import { AURORA_COLORS } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = [...AURORA_COLORS],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animationDuration: `${10 / speed}s`,
    } as React.CSSProperties;

    return (
      <span className={cn("relative inline-block", className)}>
        <span className="sr-only">{children}</span>
        <span
          className="animate-aurora relative bg-size-[200%_auto] bg-clip-text text-transparent motion-reduce:animate-none"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  }
);

AuroraText.displayName = "AuroraText";
