"use client";

import React, { useRef, useEffect } from "react";
import { ChartCard } from "./ChartCard";
import { useChartData, FunnelStepItem } from "@/lib/data";
import { ArrowDownRight, CheckCircle2 } from "lucide-react";

export interface FunnelStepsProps {
  dataKey?: string;
  data?: FunnelStepItem[];
  title?: string;
  units?: string;
  subtitle?: string;
  isSample?: boolean;
  loading?: boolean;
  error?: Error | string | null;
  className?: string;
}

export const FunnelSteps: React.FC<FunnelStepsProps> = ({
  dataKey = "winback_funnel",
  data: explicitData,
  title: explicitTitle,
  units: explicitUnits,
  subtitle,
  isSample: explicitIsSample,
  loading: explicitLoading,
  error: explicitError,
  className = "",
}) => {
  const hookData = useChartData<FunnelStepItem[]>(dataKey);
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

  const recoveryRate = data.length > 0 ? data[data.length - 1].rate : 0;

  return (
    <ChartCard
      title={title}
      units={units}
      subtitle={subtitle}
      badge={
        <span
          className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{
            background: "var(--accent)",
            color: "var(--on-accent)",
          }}
        >
          {recoveryRate}% Recovery
        </span>
      }
      isSample={isSample}
      loading={loading}
      empty={!loading && data.length === 0}
      error={error}
      onRetry={hookData.refetch}
      summary={hookData.summary}
      ariaLabel={`${title} Conversion Funnel`}
      className={className}
    >
      <div className="w-full space-y-3 py-2">
        {data.map((step, idx) => {
          const widthPct = Math.max(step.rate, 22);
          const isFinal = idx === data.length - 1;

          return (
            <div key={step.step} className="space-y-1">
              {/* Step Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: isFinal ? "var(--accent)" : "rgba(255, 255, 255, 0.08)",
                      color: isFinal ? "var(--on-accent)" : "var(--text-muted)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`font-semibold ${isFinal ? "font-bold" : ""}`}
                    style={{ color: "var(--text)" }}
                  >
                    {step.step}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold" style={{ color: "var(--text)" }}>
                    {step.count.toLocaleString()}
                  </span>
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.2 rounded"
                    style={{
                      background: isFinal ? "var(--accent)" : "var(--border)",
                      color: isFinal ? "var(--on-accent)" : "var(--text-muted)",
                    }}
                  >
                    {step.rate}%
                  </span>
                </div>
              </div>

              {/* Progress Funnel Bar */}
              <div
                className="w-full h-3.5 rounded-xl overflow-hidden p-0.5 flex items-center"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="h-full rounded-lg transition-all duration-700 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    background: isFinal
                      ? "var(--accent)"
                      : "linear-gradient(90deg, var(--bar-gradient-from), var(--bar-gradient-to))",
                    boxShadow: isFinal ? "0 0 10px var(--chart-glow)" : "none",
                  }}
                />
              </div>

              {/* Drop-off notice between steps */}
              {step.dropOff !== undefined && step.dropOff > 0 && !isFinal && (
                <div
                  className="flex items-center justify-end text-[9.5px] font-mono pr-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <ArrowDownRight className="w-3 h-3 inline mr-0.5 opacity-60" />
                  <span>-{step.dropOff}% drop-off</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
};
