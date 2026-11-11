"use client";

import React, { useEffect, useState } from "react";

export interface BarDataPoint {
  label: string;
  value: number;
  sublabel?: string;
  formatted?: string;
}

interface GradientBarChartProps {
  data: BarDataPoint[];
  height?: number;
  className?: string;
}

export const GradientBarChart: React.FC<GradientBarChartProps> = ({
  data,
  height = 200,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15 || 1;

  return (
    <div className={`w-full flex flex-col justify-end select-none pb-2 ${className}`}>
      {/* Bars container */}
      <div
        className="w-full flex items-end justify-between gap-2 sm:gap-4 px-2"
        style={{ height }}
      >
        {data.map((item, idx) => {
          const heightPct = (item.value / maxVal) * 100;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
            >
              {/* Value label on top of bar */}
              <div
                className={`mb-1.5 text-[11px] font-[700] transition-all duration-200 ${
                  isHovered ? "text-accent scale-110" : "text-text-muted"
                }`}
              >
                {item.formatted || item.value.toLocaleString()}
              </div>

              {/* The bar element (9px 9px 3px 3px radius per Document B) */}
              <div className="w-full max-w-[56px] bg-border/40 rounded-[9px_9px_3px_3px] overflow-hidden flex items-end h-full">
                <div
                  className="w-full transition-all duration-1000 ease-out relative group-hover:brightness-110 group-hover:shadow-[0_0_16px_rgba(255,217,28,0.45)]"
                  style={{
                    height: mounted ? `${heightPct}%` : "0%",
                    transitionDelay: `${idx * 120}ms`,
                    background: "linear-gradient(180deg, var(--bar-gradient-from) 0%, var(--bar-gradient-to) 100%)",
                    boxShadow: isHovered ? "0 0 16px var(--chart-glow)" : "none",
                    borderRadius: "9px 9px 3px 3px",
                  }}
                />
              </div>

              {/* Bottom label container with ample padding so labels are fully visible */}
              <div className="flex flex-col items-center mt-2.5 pb-1 w-full text-center">
                <span className="text-[11px] font-[600] text-text-muted group-hover:text-text transition-colors leading-tight">
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="text-[9.5px] text-text-muted/80 mt-0.5 leading-tight">
                    {item.sublabel}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
