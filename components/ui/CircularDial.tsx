"use client";

import React, { useEffect, useState } from "react";

interface CircularDialProps {
  value: number; // 0 - 100
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export const CircularDial: React.FC<CircularDialProps> = ({
  value,
  label,
  sublabel,
  size = 130,
  strokeWidth = 10,
  color,
  className = "",
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setAnimatedValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 150);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 select-none">
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          {/* Animated active arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color || "var(--accent)"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>

        {/* Center Percentage Display: 24px / 800 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[24px] font-[800] tracking-[-0.03em] leading-none text-text">
            {Math.round(animatedValue)}%
          </span>
          {sublabel && (
            <span className="text-[10px] font-semibold text-text-muted mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {/* Dial Label: 12.5px / 600 */}
      <span className="text-[12.5px] font-[600] text-text-muted mt-2 tracking-tight">
        {label}
      </span>
    </div>
  );
};
