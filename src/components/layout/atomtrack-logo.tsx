"use client";

import React from "react";
import { Target } from "lucide-react";

interface AtomTrackLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 20, text: "text-base", container: "w-8 h-8" },
  md: { icon: 22, text: "text-lg", container: "w-9 h-9" },
  lg: { icon: 26, text: "text-xl", container: "w-10 h-10" },
  xl: { icon: 30, text: "text-2xl", container: "w-12 h-12" },
};

export function AtomTrackLogo({ size = "md", showText = true, className = "" }: AtomTrackLogoProps) {
  const s = SIZES[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Icon */}
      <div
        className={`${s.container} rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0`}
      >
        <Target className="text-white" style={{ width: s.icon, height: s.icon }} />
      </div>

      {/* Text */}
      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-[#0F172A] select-none`}>
          Atom<span className="text-[#2563EB]">Track</span>
        </span>
      )}
    </div>
  );
}
