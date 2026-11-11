"use client";

import React, { useState } from "react";

export interface MonthlyRevenuePoint {
  month: string;
  value: number; // e.g. 19.10, 20.30, 21.40, 22.20, 23.00, 23.95
}

interface RevenueOverviewChartProps {
  data?: MonthlyRevenuePoint[];
  currentMonthRevenue?: string;
  growthPercentage?: string;
  className?: string;
}

const DEFAULT_REVENUE_DATA: MonthlyRevenuePoint[] = [
  { month: "Jun", value: 19.10 },
  { month: "Jul", value: 20.30 },
  { month: "Aug", value: 21.40 },
  { month: "Sep", value: 22.20 },
  { month: "Oct", value: 23.00 },
  { month: "Nov", value: 23.95 },
];

export const RevenueOverviewChart: React.FC<RevenueOverviewChartProps> = ({
  data = DEFAULT_REVENUE_DATA,
  currentMonthRevenue = "PKR 23.95M",
  growthPercentage = "+4.1% vs last month",
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const height = 195;
  const width = 480;
  const paddingX = 35;
  const paddingBottom = 32;

  // Axis starts strictly at 0 per requirement
  const minVal = 0;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15 || 28;
  const range = maxVal - minVal;

  const chartHeight = height - paddingBottom - 20;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const y = 20 + chartHeight - (d.value / range) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${20 + chartHeight} L ${points[0].x} ${20 + chartHeight} Z`;

  return (
    <div className={`w-full flex flex-col justify-between select-none ${className}`}>
      {/* Header Info */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[15px] font-[800] text-slate-900 dark:text-white">Revenue overview</h3>
          <p className="text-[12px] text-slate-500 dark:text-neutral-400 mt-0.5">
            PKR millions per month. The axis starts at 0.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[20px] font-[800] text-slate-900 dark:text-white tracking-tight leading-none">
            {currentMonthRevenue}
          </div>
          <div className="text-[11.5px] font-[600] text-[#10B981] mt-1">
            {growthPercentage}
          </div>
        </div>
      </div>

      {/* SVG Line / Area Graph */}
      <div className="w-full relative mt-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="revenueGoldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--chart-line)" stopOpacity="0.4" />
              <stop offset="45%" stopColor="var(--chart-line)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--chart-line)" stopOpacity="0.0" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="var(--chart-glow)" />
            </filter>
          </defs>

          {/* Subtle horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = 20 + chartHeight - pct * chartHeight;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-white/10"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#revenueGoldGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--chart-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#goldGlow)"
          />

          {/* Data points & hover markers */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Dot outer ring */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill="var(--bg)"
                  stroke="var(--accent)"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-200"
                />

                {/* Month label */}
                <text
                  x={p.x}
                  y={height - 17}
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-[#9ca3af]"
                  fontSize="11"
                  fontFamily="Inter, sans-serif"
                  fontWeight="600"
                >
                  {p.month}
                </text>

                {/* Exact value under month */}
                <text
                  x={p.x}
                  y={height - 4}
                  textAnchor="middle"
                  fill={isHovered ? "#FFD91C" : "currentColor"}
                  className="text-slate-900 dark:text-white font-bold"
                  fontSize="11"
                  fontFamily="Inter, sans-serif"
                  fontWeight="700"
                >
                  {p.value.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
