"use client";

import React, { useState } from "react";

export interface HourlySlot {
  time: string; // "6 am", "8 am", etc.
  checkins: number;
  isPeak?: boolean;
}

interface CheckinsHourlyTimelineProps {
  data?: HourlySlot[];
  totalCheckins?: string;
  className?: string;
}

const DEFAULT_SLOTS: HourlySlot[] = [
  { time: "6 am", checkins: 70 },
  { time: "8 am", checkins: 140 },
  { time: "10 am", checkins: 110 },
  { time: "12 pm", checkins: 120 },
  { time: "2 pm", checkins: 100 },
  { time: "4 pm", checkins: 180 },
  { time: "6 pm", checkins: 350, isPeak: true },
  { time: "8 pm", checkins: 190 },
  { time: "10 pm", checkins: 88 },
];

export const CheckinsHourlyTimeline: React.FC<CheckinsHourlyTimelineProps> = ({
  data = DEFAULT_SLOTS,
  totalCheckins = "1,248 check-ins today, all clubs.",
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(...data.map((d) => d.checkins)) * 1.15 || 400;
  const peakSlot = data.find((d) => d.isPeak) || data[6];

  return (
    <div className={`w-full flex flex-col justify-between select-none ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[16px] font-[800] text-slate-900 dark:text-white">Check-ins by time of day</h3>
          <p className="text-[12.5px] text-slate-500 dark:text-neutral-400 mt-0.5">{totalCheckins}</p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-[11px] font-[800]"
          style={{
            background: "var(--accent)",
            color: "var(--on-accent)",
            boxShadow: "0 2px 8px var(--chart-glow)",
          }}
        >
          Peak {peakSlot.time}
        </div>
      </div>

      {/* Bars Chart */}
      <div className="w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2 h-[155px]">
        {data.map((slot, idx) => {
          const heightPct = (slot.checkins / maxVal) * 100;
          const isPeak = slot.isPeak;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
            >
              {/* Value on top of bar */}
              <div
                className={`text-[10.5px] font-[700] mb-1.5 transition-colors ${
                  isPeak
                    ? "text-amber-600 dark:text-[#FFD91C] font-extrabold"
                    : isHovered
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-neutral-400"
                }`}
              >
                {slot.checkins}
              </div>

              {/* The Bar */}
              <div className="w-full max-w-[42px] bg-slate-100 dark:bg-white/5 rounded-[4px_4px_1px_1px] overflow-hidden flex items-end h-full">
                <div
                  className="w-full transition-all duration-500 ease-out"
                  style={{
                    height: `${heightPct}%`,
                    borderRadius: "4px 4px 1px 1px",
                    background: isPeak
                      ? "var(--accent)"
                      : "linear-gradient(180deg, var(--bar-gradient-from), var(--bar-gradient-to))",
                    boxShadow: isPeak ? "0 0 14px var(--chart-glow)" : "none",
                  }}
                />
              </div>

              {/* Time Label on bottom */}
              <div
                className={`mt-2 text-[10.5px] transition-colors ${
                  isPeak
                    ? "text-amber-600 dark:text-[#FFD91C] font-extrabold"
                    : isHovered
                    ? "text-slate-900 dark:text-white font-semibold"
                    : "text-slate-500 dark:text-neutral-400 font-medium"
                }`}
              >
                {slot.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
