"use client";

import React, { useState } from "react";

export interface BranchShareItem {
  name: string;
  sharePercent: number;
  revenuePKR: number;
  color: string;
}

interface RevenueByBranchDonutProps {
  data?: BranchShareItem[];
  totalFormatted?: string;
  className?: string;
}

const DEFAULT_SHARES: BranchShareItem[] = [
  { name: "Seaview DHA", sharePercent: 35.1, revenuePKR: 8400000, color: "var(--accent)" },
  { name: "LuckyOne Mall", sharePercent: 23.2, revenuePKR: 5560000, color: "rgba(245, 197, 24, 0.75)" },
  { name: "Clifton", sharePercent: 21.3, revenuePKR: 5100000, color: "rgba(245, 197, 24, 0.5)" },
  { name: "AJ Tower", sharePercent: 20.5, revenuePKR: 4890000, color: "rgba(245, 197, 24, 0.28)" },
];

export const RevenueByBranchDonut: React.FC<RevenueByBranchDonutProps> = ({
  data = DEFAULT_SHARES,
  totalFormatted = "23.95M",
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const size = 135;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className={`w-full flex flex-col justify-between select-none ${className}`}>
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-[15px] font-[800] text-slate-900 dark:text-white">Revenue by branch</h3>
        <p className="text-[12px] text-slate-500 dark:text-neutral-400 mt-0.5">
          Share of this month's revenue.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 py-1">
        {/* Donut graphic */}
        <div className="relative shrink-0 my-1" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-white/[0.08]"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {data.map((item, idx) => {
              const fraction = item.sharePercent / 100;
              const dasharray = `${fraction * circumference} ${circumference}`;
              const dashoffset = -(accumulatedPercent * circumference);
              accumulatedPercent += fraction;

              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={dasharray}
                  strokeDashoffset={dashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Text matching screenshot */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[17px] font-[800] text-slate-900 dark:text-white leading-tight">
              {hoveredIdx !== null ? `${data[hoveredIdx].sharePercent}%` : totalFormatted}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-neutral-400 font-semibold leading-tight mt-0.5">
              {hoveredIdx !== null ? data[hoveredIdx].name.split(" ")[0] : "PKR total"}
            </span>
          </div>
        </div>

        {/* Legend matching screenshot layout */}
        <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
          {data.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between text-[11.5px] cursor-pointer transition-colors ${
                  isHovered
                    ? "text-slate-900 dark:text-white font-bold"
                    : "text-slate-600 dark:text-neutral-300"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-[700] shrink-0 text-right ml-2 text-slate-700 dark:text-neutral-300">
                  {item.sharePercent.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
