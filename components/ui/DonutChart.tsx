"use client";

import React, { useState } from "react";

export interface DonutDataPoint {
  label: string;
  value: number;
  formatted: string;
  sublabel?: string;
  color: string;
}

interface DonutChartProps {
  data: DonutDataPoint[];
  size?: number;
  thickness?: number;
  title?: string;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 180,
  thickness = 22,
  title = "Revenue",
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 select-none ${className}`}>
      {/* SVG Donut Circle */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={thickness}
            opacity="0.25"
          />

          {/* Slices */}
          {data.map((item, idx) => {
            const percent = item.value / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -(accumulatedPercent * circumference);
            accumulatedPercent += percent;

            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {hoveredIdx !== null ? (
            <>
              <span className="text-[11px] font-bold text-text-muted truncate max-w-[100px]">
                {data[hoveredIdx].label}
              </span>
              <span className="text-[14px] font-[800] text-accent mt-0.5">
                {data[hoveredIdx].formatted}
              </span>
              <span className="text-[10px] text-text-muted">
                {((data[hoveredIdx].value / total) * 100).toFixed(1)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10.5px] uppercase tracking-wider font-bold text-text-muted">
                {title}
              </span>
              <span className="text-[13px] font-[800] text-text mt-0.5">
                PKR {(total / 1000000).toFixed(2)}M
              </span>
              <span className="text-[10px] text-text-muted">100% Total</span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {data.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const pct = ((item.value / total) * 100).toFixed(1);
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-1.5 rounded-[10px] transition-all cursor-pointer ${
                isHovered ? "bg-accent/15 border border-accent/40 scale-[1.02]" : "hover:bg-glass"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <div className="truncate">
                  <span className="text-[12px] font-[700] text-text block leading-tight truncate">
                    {item.label}
                  </span>
                  {item.sublabel && (
                    <span className="text-[10px] text-text-muted block leading-tight">
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 pl-2">
                <span className="text-[12px] font-[700] text-text block leading-tight">
                  {item.formatted}
                </span>
                <span className="text-[10px] text-text-muted font-medium block leading-tight">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
