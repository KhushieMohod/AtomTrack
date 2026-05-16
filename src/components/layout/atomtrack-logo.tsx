"use client";

import React from "react";
import Image from "next/image";

interface AtomTrackLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const SIZES = {
  sm: { imgH: "h-7", text: "text-base" },
  md: { imgH: "h-8", text: "text-lg" },
  lg: { imgH: "h-10", text: "text-xl" },
  xl: { imgH: "h-12", text: "text-2xl" },
};

export function AtomTrackLogo({ size = "md", showText = true, className = "" }: AtomTrackLogoProps) {
  const s = SIZES[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Custom Logo Image */}
      <Image
        src="/logo.png"
        alt="AtomTrack logo — soccer ball going into a net"
        width={120}
        height={120}
        className={`${s.imgH} w-auto object-contain`}
        priority
      />

      {/* Text */}
      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-[#0F172A] select-none`}>
          Atom<span className="text-[#2563EB]">Track</span>
        </span>
      )}
    </div>
  );
}
