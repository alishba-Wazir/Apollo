"use client";

import React, { useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { useChartData, DonutSegment } from "@/lib/data";

export interface DonutTotalProps {
  dataKey?: string;
  data?: DonutSegment[];
  totalLabel?: string;
  title?: string;
  units?: string;
  subtitle?: string;
  isSample?: boolean;
  loading?: boolean;
  error?: Error | string | null;
  height?: number;
  className?: string;
}

const SEGMENT_COLORS = [
  "var(--accent)",
  "rgba(245, 197, 24, 0.75)",
  "rgba(245, 197, 24, 0.5)",
  "rgba(245, 197, 24, 0.28)",
  "rgba(245, 197, 24, 0.15)",
];

export const DonutTotal: React.FC<DonutTotalProps> = ({
  dataKey = "revenue_by_branch",
  data: explicitData,
  totalLabel: explicitTotalLabel,
  title: explicitTitle,
  units: explicitUnits,
  subtitle,
  isSample: explicitIsSample,
  loading: explicitLoading,
  error: explicitError,
  height = 240,
  className = "",
}) => {
  const hookData = useChartData<DonutSegment[]>(dataKey);
  const data = explicitData ?? hookData.data ?? [];
  const title = explicitTitle ?? hookData.title;
  const units = explicitUnits ?? hookData.units;
  const isSample = explicitIsSample ?? hookData.isSample;
  const loading = explicitLoading ?? hookData.loading;
  const error = explicitError ?? hookData.error;

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    hasAnimatedRef.current = true;
  }, []);

  const totalSum = data.reduce((acc, curr) => acc + curr.value, 0);
  const totalDisplay = explicitTotalLabel || `${totalSum.toFixed(2)}M`;

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
      ariaLabel={`${title} Donut Chart`}
      className={className}
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-1">
        {/* Donut Container with Centered Total */}
        <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={<ChartTooltip unit={units} isSample={isSample} />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={78}
                paddingAngle={3}
                cornerRadius={5}
                stroke="var(--bg)"
                strokeWidth={2}
                isAnimationActive={!hasAnimatedRef.current}
                animationDuration={900}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`donut-cell-${index}`}
                    fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
            <span
              className="text-base sm:text-lg font-black font-mono leading-none tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {totalDisplay}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              PKR total
            </span>
          </div>
        </div>

        {/* Legend with Values & Percentages */}
        <div className="flex-1 w-full space-y-2 text-xs">
          {data.map((item, idx) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-1.5 rounded-lg transition-colors"
              style={{ background: "rgba(255, 255, 255, 0.02)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: SEGMENT_COLORS[idx % SEGMENT_COLORS.length],
                    boxShadow: idx === 0 ? "0 0 6px var(--accent)" : "none",
                  }}
                />
                <span className="font-semibold" style={{ color: "var(--text)" }}>
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-2.5 font-mono">
                <span style={{ color: "var(--text-muted)" }}>
                  {item.formattedValue}
                </span>
                <span
                  className="font-bold min-w-[42px] text-right"
                  style={{ color: "var(--accent)" }}
                >
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
};
