"use client";

import React, { useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { useChartData, AreaTrendPoint } from "@/lib/data";

export interface AreaTrendProps {
  dataKey?: string;
  data?: AreaTrendPoint[];
  title?: string;
  units?: string;
  subtitle?: string;
  isSample?: boolean;
  loading?: boolean;
  error?: Error | string | null;
  height?: number;
  yAxisFromZero?: boolean;
  className?: string;
}

export const AreaTrend: React.FC<AreaTrendProps> = ({
  dataKey = "revenue_overview",
  data: explicitData,
  title: explicitTitle,
  units: explicitUnits,
  subtitle,
  isSample: explicitIsSample,
  loading: explicitLoading,
  error: explicitError,
  height = 240,
  yAxisFromZero = true,
  className = "",
}) => {
  const hookData = useChartData<AreaTrendPoint[]>(dataKey);
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

  return (
    <ChartCard
      title={title}
      units={units}
      subtitle={subtitle}
      isSample={isSample}
      loading={loading}
      empty={!loading && data.length === 0}
      error={error}
      onRetry={hookData.refetch}
      summary={hookData.summary}
      ariaLabel={`${title} Area Chart in ${units}`}
      className={className}
    >
      <div className="w-full h-full min-h-[220px]" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 12, right: 12, left: -14, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-line)" stopOpacity="0.32" />
                <stop offset="90%" stopColor="var(--chart-line)" stopOpacity="0.01" />
              </linearGradient>
              <filter id="areaGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--chart-glow)" />
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
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
              domain={yAxisFromZero ? [0, "auto"] : ["auto", "auto"]}
              stroke="var(--text-muted)"
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              dx={-4}
            />

            <Tooltip
              content={<ChartTooltip unit={units} isSample={isSample} />}
              cursor={{ stroke: "var(--accent)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-line)"
              strokeWidth={2.5}
              fill="url(#areaTrendGradient)"
              filter="url(#areaGlow)"
              isAnimationActive={shouldAnimate}
              animationDuration={900}
              animationEasing="ease-out"
              dot={{
                r: 3.5,
                fill: "var(--accent)",
                stroke: "var(--bg)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6.5,
                stroke: "var(--bg)",
                strokeWidth: 2.5,
                fill: "var(--accent)",
                filter: "drop-shadow(0 0 8px var(--accent))",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
