"use client";

import React, { useEffect, useState } from "react";

export interface DataPoint {
  label: string;
  value: number;
  formatted?: string;
}

interface AnimatedLineChartProps {
  data: DataPoint[];
  height?: number;
  yAxisPrefix?: string;
  startAtZero?: boolean;
  className?: string;
}

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  height = 220,
  yAxisPrefix = "PKR ",
  startAtZero = false,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data || data.length === 0) return null;

  const paddingX = 56;
  const paddingY = 30;
  const width = 640;

  const minVal = startAtZero ? 0 : Math.min(...data.map((d) => d.value)) * 0.95;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.05;
  const valRange = maxVal - minVal || 1;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.value - minVal) / valRange) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate SVG path string
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Area path closing down to bottom
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className={`w-full overflow-hidden select-none ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: height }}
      >
        <defs>
          {/* Fading area fill gradient */}
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--chart-line)" stopOpacity="0.32" />
            <stop offset="60%" stopColor="var(--chart-line)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--chart-line)" stopOpacity="0.0" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = paddingY + pct * (height - paddingY * 2);
          const gridVal = maxVal - pct * valRange;
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 3.5}
                textAnchor="end"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="Inter, sans-serif"
              >
                {yAxisPrefix}
                {Math.abs(gridVal) < 1
                  ? "0"
                  : gridVal >= 1000000
                  ? `${(gridVal / 1000000).toFixed(1)}M`
                  : gridVal >= 1000
                  ? `${Math.round(gridVal / 1000)}k`
                  : Math.round(gridVal)}
              </text>
            </g>
          );
        })}

        {/* Self-drawing Area Path */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          className={`transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
        />

        {/* Self-drawing Line Path with stroke-dashoffset */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--chart-line)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: mounted ? 0 : 1200,
            transition: "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Interactive Dots and Labels */}
        {points.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Outer hover ring */}
              {isHovered && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="10"
                  fill="rgba(255, 217, 28, 0.25)"
                  className="animate-ping"
                />
              )}
              {/* Point circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4}
                fill="var(--accent)"
                stroke="var(--bg)"
                strokeWidth="2.5"
                style={{
                  transition: "r 0.2s ease, transform 0.2s ease",
                }}
              />

              {/* Tooltip value pill on hover */}
              {isHovered && (
                <g className="animate-in fade-in zoom-in-95 duration-150">
                  <rect
                    x={p.x - 42}
                    y={p.y - 34}
                    width="84"
                    height="24"
                    rx="6"
                    fill="var(--bg)"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={p.x}
                    y={p.y - 18}
                    textAnchor="middle"
                    fill="var(--text)"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                  >
                    {p.formatted || `${yAxisPrefix}${p.value.toLocaleString()}`}
                  </text>
                </g>
              )}

              {/* Bottom X-axis label: 11px per Document B */}
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="11"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
