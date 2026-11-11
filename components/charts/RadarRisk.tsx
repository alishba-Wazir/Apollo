"use client";

import React, { useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { useChartData, RadarRiskPoint } from "@/lib/data";

export interface RadarRiskProps {
  dataKey?: string;
  data?: RadarRiskPoint[];
  title?: string;
  units?: string;
  subtitle?: string;
  isSample?: boolean;
  loading?: boolean;
  error?: Error | string | null;
  height?: number;
  className?: string;
}

export const RadarRisk: React.FC<RadarRiskProps> = ({
  dataKey = "churn_risk_radar",
  data: explicitData,
  title: explicitTitle,
  units: explicitUnits,
  subtitle,
  isSample: explicitIsSample,
  loading: explicitLoading,
  error: explicitError,
  height = 250,
  className = "",
}) => {
  const hookData = useChartData<RadarRiskPoint[]>(dataKey);
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
      ariaLabel={`${title} Radar Chart`}
      className={className}
    >
      <div className="w-full h-full min-h-[240px]" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
          >
            <PolarGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
            />

            <PolarAngleAxis
              dataKey="metric"
              tick={{
                fill: "var(--text-muted)",
                fontSize: 10.5,
                fontWeight: 600,
              }}
            />

            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
              }}
              stroke="var(--border)"
            />

            <Tooltip
              content={
                <ChartTooltip
                  unit="Score"
                  isSample={isSample}
                  customLabel="Risk Vector"
                />
              }
            />

            {/* Benchmark baseline */}
            <Radar
              name="Normal Benchmark"
              dataKey="benchmark"
              stroke="var(--text-muted)"
              strokeWidth={1}
              strokeDasharray="2 2"
              fill="transparent"
              isAnimationActive={false}
            />

            {/* Active Risk Profile */}
            <Radar
              name="Risk Severity"
              dataKey="score"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="var(--chart-fill)"
              fillOpacity={0.65}
              isAnimationActive={!hasAnimatedRef.current}
              animationDuration={850}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
