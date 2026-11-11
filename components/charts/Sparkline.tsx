"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { SparklinePoint } from "@/lib/data";

export interface SparklineProps {
  data?: number[] | SparklinePoint[];
  width?: number | string;
  height?: number;
  strokeColor?: string;
  fillOpacity?: number;
  ariaLabel?: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data = [18, 19.2, 20.1, 21.0, 21.8, 22.5, 23.95],
  width = "100%",
  height = 40,
  strokeColor = "var(--chart-line)",
  fillOpacity = 0.25,
  ariaLabel = "Metric sparkline trend",
  className = "",
}) => {
  // Normalize data format
  const points = data.map((item, idx) => ({
    i: idx,
    value: typeof item === "number" ? item : item.value,
  }));

  const gradientId = `sparklineGradient-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      className={`relative inline-block overflow-hidden ${className}`}
      style={{ width, height }}
      aria-label={ariaLabel}
      role="img"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={fillOpacity} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.8}
            fill={`url(#${gradientId})`}
            isAnimationActive={true}
            animationDuration={600}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
