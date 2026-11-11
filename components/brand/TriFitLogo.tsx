"use client";

import React from "react";

interface TriFitLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export const TriFitLogo: React.FC<TriFitLogoProps> = ({
  size = 40,
  className = "",
  showWordmark = true,
}) => {
  // Exact authentic TriFit logo provided by user (324x201px, aspect ratio 1.61)
  const logoWidth = size;
  const logoHeight = Math.round((size * 201) / 324);

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official TriFit Brand Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
        style={{
          width: logoWidth,
          height: logoHeight,
          filter: "drop-shadow(0 0 14px rgba(255, 217, 28, 0.45))",
        }}
      >
        <img
          src="/brand/trifit-logo.png"
          alt="TriFit Official Logo"
          width={logoWidth}
          height={logoHeight}
          className="w-full h-full object-contain"
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[17px] font-[900] tracking-[-0.025em] leading-none text-text"
              style={{
                textShadow: "0 0 16px rgba(255, 217, 28, 0.25)",
              }}
            >
              APOLLO
            </span>
          </div>
          <span className="text-[10px] font-[600] tracking-wider text-text-muted uppercase leading-tight mt-1">
            Enterprise Fitness
          </span>
        </div>
      )}
    </div>
  );
};
