"use client";

import React, { useState } from "react";
import { TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

interface MilestonePoint {
  id: string;
  label: string;
  sublabel?: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100 (0 is top, 100 is bottom)
  value: string;
  members: string;
  pace: string;
}

const MILESTONES: MilestonePoint[] = [
  {
    id: "q1",
    label: "Q1 (Kickoff)",
    x: 6,
    y: 72,
    value: "PKR 14.2M",
    members: "1,240 Enrolled",
    pace: "96% of Target",
  },
  {
    id: "q2",
    label: "Q2 (Expansion)",
    x: 24,
    y: 54,
    value: "PKR 26.8M",
    members: "1,890 Enrolled",
    pace: "101% of Target",
  },
  {
    id: "q3",
    label: "Q3 (Mid-Year)",
    x: 48,
    y: 38,
    value: "PKR 39.4M",
    members: "2,450 Enrolled",
    pace: "105% of Target",
  },
  {
    id: "q4",
    label: "Q4 (Peak Run)",
    x: 68,
    y: 44,
    value: "PKR 45.1M",
    members: "2,780 Enrolled",
    pace: "104% of Target",
  },
  {
    id: "target",
    label: "Target Pace",
    x: 82,
    y: 49,
    value: "PKR 48.5M",
    members: "2,950 Benchmark",
    pace: "100% Baseline",
  },
  {
    id: "yearend",
    label: "Year-End Trajectory",
    x: 96,
    y: 30,
    value: "PKR 54.8M",
    members: "3,340 Projected",
    pace: "108% Target Pace",
  },
];

interface SubscriptionGrowthTrajectoryChartProps {
  selectedBranchName?: string;
}

export const SubscriptionGrowthTrajectoryChart: React.FC<SubscriptionGrowthTrajectoryChartProps> = ({
  selectedBranchName,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions for coordinate calculations
  const svgWidth = 800;
  const svgHeight = 220;

  // Transform percentage coordinates to SVG absolute viewBox pixels
  const points = MILESTONES.map((m) => ({
    ...m,
    px: (m.x / 100) * svgWidth,
    py: (m.y / 100) * svgHeight,
  }));

  // Construct smooth cubic bezier path through the milestone points
  // Path starts at (px[0], py[0]), smooth curve up through q2, q3, gentle dip to q4, leveling to target, curving up to yearend
  const pathD = `
    M ${points[0].px} ${points[0].py}
    C ${points[0].px + 60} ${points[0].py - 5},
      ${points[1].px - 60} ${points[1].py + 10},
      ${points[1].px} ${points[1].py}
    C ${points[1].px + 70} ${points[1].py - 25},
      ${points[2].px - 70} ${points[2].py},
      ${points[2].px} ${points[2].py}
    C ${points[2].px + 60} ${points[2].py + 5},
      ${points[3].px - 60} ${points[3].py - 15},
      ${points[3].px} ${points[3].py}
    C ${points[3].px + 40} ${points[3].py + 15},
      ${points[4].px - 40} ${points[4].py - 5},
      ${points[4].px} ${points[4].py}
    C ${points[4].px + 50} ${points[4].py - 10},
      ${points[5].px - 50} ${points[5].py + 35},
      ${points[5].px} ${points[5].py}
  `.replace(/\s+/g, " ").trim();

  // Closed path for subtle golden gradient fill
  const areaD = `${pathD} L ${points[5].px} ${svgHeight} L ${points[0].px} ${svgHeight} Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="glass p-[22px] rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="card-title text-[var(--text)] tracking-tight">
              Subscription Growth &amp; Revenue Trajectory
            </h2>
          </div>
          <p className="body-label text-xs mt-0.5 text-[var(--muted)]">
            {selectedBranchName
              ? `Collections trajectory and acquisition cadence for ${selectedBranchName.replace("TriFit ", "")}`
              : "Consolidated monthly collections pace and member acquisition cadence"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Annual Target: 108% Pace</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[210px] sm:h-[230px] my-1 select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Smooth glowing golden gradient fill under trajectory */}
            <linearGradient id="trajectoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD60A" stopOpacity="0.28" />
              <stop offset="45%" stopColor="#FFCC00" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFD60A" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter for spline curve */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Subtle horizontal grid lines */}
          <line
            x1="0"
            y1={svgHeight * 0.25}
            x2={svgWidth}
            y2={svgHeight * 0.25}
            stroke="var(--line)"
            strokeDasharray="4 4"
            strokeOpacity="0.4"
          />
          <line
            x1="0"
            y1={svgHeight * 0.55}
            x2={svgWidth}
            y2={svgHeight * 0.55}
            stroke="var(--line)"
            strokeDasharray="4 4"
            strokeOpacity="0.4"
          />
          <line
            x1="0"
            y1={svgHeight * 0.85}
            x2={svgWidth}
            y2={svgHeight * 0.85}
            stroke="var(--line)"
            strokeDasharray="4 4"
            strokeOpacity="0.4"
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#trajectoryGradient)" />

          {/* Main Trajectory Spline Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#goldGlow)"
          />

          {/* Milestone Dots */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            const isTerminal = idx === points.length - 1;

            return (
              <g
                key={pt.id}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hit target */}
                <circle cx={pt.px} cy={pt.py} r={16} fill="transparent" />

                {/* Outer Pulse Ring on Terminal / Hovered */}
                {(isTerminal || isHovered) && (
                  <circle
                    cx={pt.px}
                    cy={pt.py}
                    r={isHovered ? 11 : 9}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeOpacity={isHovered ? 0.9 : 0.6}
                    className="animate-pulse"
                  />
                )}

                {/* Inner Dot */}
                <circle
                  cx={pt.px}
                  cy={pt.py}
                  r={isTerminal ? 6 : isHovered ? 5.5 : 4}
                  fill={isTerminal ? "var(--accent)" : "#070708"}
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Milestone Hover Floating Card Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none px-3 py-1.5 rounded-xl glass border border-[var(--accent)]/50 shadow-2xl text-xs -translate-x-1/2 -translate-y-full transition-all"
            style={{
              left: `${activePoint.x}%`,
              top: `${Math.max(10, activePoint.y - 10)}%`,
            }}
          >
            <div className="font-bold text-[var(--accent)] font-display text-[12.5px]">
              {activePoint.value}
            </div>
            <div className="text-[10px] text-[var(--text)] font-semibold">
              {activePoint.members} • {activePoint.pace}
            </div>
          </div>
        )}

        {/* Milestone Labels on Horizontal Axis */}
        <div className="flex items-center justify-between text-[11px] sm:text-[11.5px] font-mono text-[var(--muted)] px-1 mt-2">
          {MILESTONES.map((m, idx) => (
            <div
              key={m.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`cursor-pointer transition-colors text-center ${
                hoveredIndex === idx
                  ? "text-[var(--accent)] font-bold scale-105"
                  : idx === MILESTONES.length - 1
                  ? "text-[var(--accent)] font-semibold"
                  : "hover:text-[var(--text)]"
              }`}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom KPI Bar matching reference design */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3.5 mt-2 border-t border-[var(--line)] text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5 font-medium">
          <span>Average Plan Duration:</span>
          <span className="font-bold font-display text-[var(--text)]">9.4 Months</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span>Subscription Retention:</span>
          <span className="font-bold font-display text-emerald-400">94.2% Active</span>
        </div>
      </div>
    </div>
  );
};
