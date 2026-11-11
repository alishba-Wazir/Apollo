"use client";

import React, { useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { useChartData, BarGoldPoint } from "@/lib/data";

export interface BarGoldProps {
  dataKey?: string;
  data?: BarGoldPoint[];
  title?: string;
  units?: string;
  subtitle?: string;
  isSample?: boolean;
  loading?: boolean;
  error?: Error | string | null;
  height?: number;
  showLabels?: boolean;
  className?: string;
}

export const BarGold: React.FC<BarGoldProps> = ({
  dataKey = "hourly_checkins",
  data: explicitData,
  title: explicitTitle,
  units: explicitUnits,
  subtitle,
  isSample: explicitIsSample,
  loading: explicitLoading,
  error: explicitError,
  height = 240,
  showLabels = true,
  className = "",
}) => {
  const hookData = useChartData<BarGoldPoint[]>(dataKey);
  const data = explicitData ?? hookData.data ?? [];
  const title = explicitTitle ?? hookData.title;
  const units = explicitUnits ?? hookData.units;
  const isSample = explicitIsSample ?? hookData.isSample;
  const loading = explicitLoading ?? hookData.loading;
  const error = explicitError ?? hookData.error;

  const shouldAnimate =
    typeof window === "undefined"
      ? true
      : !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Find peak point for highlight badge
  const peakPoint = data.reduce<BarGoldPoint | null>((max, p) => {
    if (!max || p.value > max.value) return p;
    return max;
  }, null);

  const peakBadge = peakPoint ? (
    <span
      className="inline-flex items-center gap-1 text-[10.5px] font-[900] px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-[#FFD91C] text-[#0B0B09] shadow-[0_0_12px_rgba(255,217,28,0.45)]"
    >
      PEAK {peakPoint.label.toUpperCase()}
    </span>
  ) : undefined;

  return (
    <ChartCard
      title={title}
      units={units}
      subtitle={subtitle}
      badge={peakBadge}
      isSample={isSample}
      loading={loading}
      empty={!loading && data.length === 0}
      error={error}
      onRetry={hookData.refetch}
      summary={hookData.summary}
      ariaLabel={`${title} Bar Chart in ${units}`}
      className={className}
    >
      <div className="w-full h-full min-h-[220px]" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 12, left: -14, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGoldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--bar-gradient-from)" />
                <stop offset="100%" stopColor="var(--bar-gradient-to)" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="barPeakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE033" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>

              <filter id="peakGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="var(--accent)" floodOpacity="0.8" />
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="2 4"
              vertical={false}
              stroke="var(--chart-grid)"
            />

            <XAxis
              dataKey="label"
              stroke="var(--text-muted)"
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              dy={6}
            />

            <YAxis
              domain={[0, "auto"]}
              stroke="var(--text-muted)"
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              dx={-4}
            />

            <Tooltip
              content={<ChartTooltip unit={units} isSample={isSample} />}
              cursor={{ fill: "var(--border)", opacity: 0.2 }}
            />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              isAnimationActive={shouldAnimate}
              animationDuration={850}
              animationEasing="ease-out"
            >
              {showLabels && (
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="var(--text-muted)"
                  fontSize={11}
                  fontWeight={700}
                  offset={8}
                />
              )}

              {data.map((entry, index) => {
                const isPeak = entry.isPeak || (peakPoint && entry.value === peakPoint.value);
                return (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={isPeak ? "url(#barPeakGradient)" : "url(#barGoldGradient)"}
                    filter={isPeak ? "url(#peakGlow)" : undefined}
                    stroke={isPeak ? "var(--accent)" : "transparent"}
                    strokeWidth={isPeak ? 1.5 : 0}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
