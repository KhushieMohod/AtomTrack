"use client";

import React from "react";

interface AtomTrackLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 28, text: "text-lg", orbit: 11 },
  md: { icon: 36, text: "text-xl", orbit: 14 },
  lg: { icon: 44, text: "text-2xl", orbit: 17 },
  xl: { icon: 56, text: "text-3xl", orbit: 22 },
};

export function AtomTrackLogo({ size = "md", showText = true, className = "" }: AtomTrackLogoProps) {
  const s = SIZES[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Atom Icon */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: s.icon, height: s.icon }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="AtomTrack Logo"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="atomGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="orbitGrad" x1="0" y1="24" x2="48" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A5B4FC" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
            <linearGradient id="nucleusGrad" x1="20" y1="18" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#C7D2FE" />
            </linearGradient>
          </defs>

          {/* Main rounded square background */}
          <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#atomGrad)" />

          {/* Orbit rings - humanized with slight irregularity */}
          <ellipse
            cx="24"
            cy="24"
            rx="16"
            ry="8"
            transform="rotate(-30 24 24)"
            stroke="url(#orbitGrad)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
          <ellipse
            cx="24"
            cy="24"
            rx="16"
            ry="8"
            transform="rotate(30 24 24)"
            stroke="url(#orbitGrad)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
          <ellipse
            cx="24"
            cy="24"
            rx="16"
            ry="8"
            transform="rotate(90 24 24)"
            stroke="url(#orbitGrad)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />

          {/* Person silhouette in nucleus - humanized */}
          <circle cx="24" cy="19" r="4" fill="url(#nucleusGrad)" opacity="0.95" />
          <path
            d="M17 33C17 28.5817 20.134 25 24 25C27.866 25 31 28.5817 31 33"
            stroke="url(#nucleusGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />

          {/* Electron dots on orbits */}
          <circle cx="10" cy="18" r="2" fill="#A5B4FC" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="38" cy="30" r="2" fill="#C7D2FE" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="24" cy="10" r="1.5" fill="#E0E7FF" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Upward progress arrow integrated subtly */}
          <path
            d="M36 16L38 13L40 16"
            stroke="#C7D2FE"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-slate-900 select-none`}>
          Atom<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Track</span>
        </span>
      )}
    </div>
  );
}
