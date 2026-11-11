"use client";

import React, { useRef, useEffect } from "react";
import { ChartCard } from "./ChartCard";
import { useChartData, DialData } from "@/lib/data";

export interface DialProps {
  dataKey?: string;
  value?: number;
  min?: number;
  max?: number;
  target?: number;
  title?: string;
  units?: string;
  subtitle?: string;
  statusLabel?: string;
  isSample?: boolean;
  loading?: boolean;
  error?: Error | string | null;
  size?: number;
  className?: string;
}

export const Dial: React.FC<DialProps> = ({
  dataKey = "capacity_dial",
  value: explicitValue,
  min: explicitMin,
  max: explicitMax,
  target: explicitTarget,
  title: explicitTitle,
  units: explicitUnits,
  subtitle,
  statusLabel: explicitStatusLabel,
  isSample: explicitIsSample,
  loading: explicitLoading,
  error: explicitError,
  size = 190,
  className = "",
}) => {
  const hookData = useChartData<DialData>(dataKey);
  const dialData = hookData.data;

  const value = explicitValue ?? dialData?.value ?? 68;
  const min = explicitMin ?? dialData?.min ?? 0;
  const max = explicitMax ?? dialData?.max ?? 100;
  const target = explicitTarget ?? dialData?.target ?? 85;
  const title = explicitTitle ?? hookData.title;
  const units = explicitUnits ?? dialData?.units ?? hookData.units;
  const statusLabel = explicitStatusLabel ?? dialData?.statusLabel ?? "Normal";
  const isSample = explicitIsSample ?? hookData.isSample;
  const loading = explicitLoading ?? hookData.loading;
  const error = explicitError ?? hookData.error;

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    hasAnimatedRef.current = true;
  }, []);

  // Dial geometry (half circle or 240 degree arc)
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const arcLength = circumference * 0.75; // 270 degree arc: ~301.6
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const strokeDashoffset = arcLength - arcLength * percentage;

  return (
    <ChartCard
      title={title}
      units={units}
      subtitle={subtitle}
      badge={
        <span
          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(255, 217, 28, 0.15)",
            color: "var(--accent)",
            border: "1px solid rgba(255, 217, 28, 0.3)",
          }}
        >
          {statusLabel}
        </span>
      }
      isSample={isSample}
      loading={loading}
      error={error}
      onRetry={hookData.refetch}
      summary={hookData.summary}
      ariaLabel={`${title} Dial gauge: ${value}${units ? ` ${units}` : ""}`}
      className={className}
    >
      <div className="w-full flex flex-col items-center justify-center py-2">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 160 160"
            className="transform -rotate-[135deg]"
          >
            <defs>
              <linearGradient id="dialGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--bar-gradient-from)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>

              <filter id="dialGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--chart-glow)" />
              </filter>
            </defs>

            {/* Background Track Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="11"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />

            {/* Foreground Animated Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="url(#dialGradient)"
              strokeWidth="11"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter="url(#dialGlow)"
              className={!hasAnimatedRef.current ? "transition-all duration-1000 ease-out" : ""}
            />
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
            <span
              className="text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none"
              style={{ color: "var(--text)" }}
            >
              {value}%
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {statusLabel}
            </span>
            <span
              className="text-[9.5px] font-mono mt-0.5"
              style={{ color: "var(--accent)" }}
            >
              Target: {target}%
            </span>
          </div>
        </div>

        {/* Dial Scale Range Footnote */}
        <div
          className="w-full max-w-[200px] flex items-center justify-between text-[10px] font-mono mt-1 pt-1 border-t"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <span>Min: {min}%</span>
          <span>Max: {max}%</span>
        </div>
      </div>
    </ChartCard>
  );
};
