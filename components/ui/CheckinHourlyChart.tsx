"use client";

import React, { useState } from "react";
import { Zap } from "lucide-react";

export interface HourlyCheckinPoint {
  time: string;
  checkins: number;
  isPeak?: boolean;
}

interface CheckinHourlyChartProps {
  data?: HourlyCheckinPoint[];
  height?: number;
  className?: string;
}

const DEFAULT_HOURLY_DATA: HourlyCheckinPoint[] = [
  { time: "06:00", checkins: 48 },
  { time: "08:00", checkins: 112 },
  { time: "10:00", checkins: 86 },
  { time: "12:00", checkins: 94 },
  { time: "14:00", checkins: 72 },
  { time: "16:00", checkins: 138 },
  { time: "18:00", checkins: 245, isPeak: true },
  { time: "20:00", checkins: 182 },
  { time: "22:00", checkins: 64 },
];

export const CheckinHourlyChart: React.FC<CheckinHourlyChartProps> = ({
  data = DEFAULT_HOURLY_DATA,
  height = 180,
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(...data.map((d) => d.checkins)) * 1.15 || 1;
  const peakPoint = data.find((d) => d.isPeak) || data.reduce((prev, current) => (prev.checkins > current.checkins) ? prev : current);

  return (
    <div className={`w-full flex flex-col justify-between select-none ${className}`}>
      {/* Peak banner tag */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-text-muted">Turnstile Throughput</span>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-[10.5px] font-[800]">
          <Zap className="w-3 h-3 fill-accent" />
          <span>Peak: {peakPoint.time} ({peakPoint.checkins} check-ins/hr)</span>
        </div>
      </div>

      {/* Bars container */}
      <div className="w-full flex items-end justify-between gap-1.5 sm:gap-2.5 px-1 pt-4" style={{ height }}>
        {data.map((item, idx) => {
          const heightPct = (item.checkins / maxVal) * 100;
          const isHovered = hoveredIdx === idx;
          const isPeak = item.isPeak;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
            >
              {/* Value floating above bar */}
              <div
                className={`text-[10px] font-bold mb-1 transition-all ${
                  isPeak
                    ? "text-accent scale-110 font-extrabold"
                    : isHovered
                    ? "text-text scale-105"
                    : "text-text-muted/80 opacity-0 group-hover:opacity-100"
                }`}
              >
                {item.checkins}
              </div>

              {/* Peak indicator dot */}
              {isPeak && (
                <div className="absolute -top-1 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#FFD91C] animate-pulse" />
              )}

              {/* The Bar */}
              <div className="w-full max-w-[28px] bg-border/40 rounded-[6px_6px_2px_2px] overflow-hidden flex items-end h-full">
                <div
                  className={`w-full transition-all duration-700 ease-out ${
                    isPeak
                      ? "bg-gradient-to-t from-[#B89600] to-[#FFD91C] shadow-[0_0_12px_rgba(255,217,28,0.5)]"
                      : isHovered
                      ? "bg-gradient-to-t from-gray-500 to-gray-300"
                      : "bg-border/80 group-hover:bg-accent/60"
                  }`}
                  style={{
                    height: `${heightPct}%`,
                    borderRadius: "6px 6px 2px 2px",
                  }}
                />
              </div>

              {/* Time label */}
              <div className="mt-2 text-[10px] font-medium text-text-muted group-hover:text-text transition-colors">
                {item.time.split(":")[0]}h
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
