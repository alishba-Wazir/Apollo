"use client";

import React, { useState } from "react";
import { ChartCard } from "./ChartCard";
import { useChartData, HeatmapCell } from "@/lib/data";

export interface HeatmapProps {
  dataKey?: string;
  data?: HeatmapCell[];
  title?: string;
  units?: string;
  subtitle?: string;
  isSample?: boolean;
  loading?: boolean;
  error?: Error | string | null;
  className?: string;
}

export const Heatmap: React.FC<HeatmapProps> = ({
  dataKey = "attendance_heatmap",
  data: explicitData,
  title: explicitTitle,
  units: explicitUnits,
  subtitle,
  isSample: explicitIsSample,
  loading: explicitLoading,
  error: explicitError,
  className = "",
}) => {
  const hookData = useChartData<HeatmapCell[]>(dataKey);
  const data = explicitData ?? hookData.data ?? [];
  const title = explicitTitle ?? hookData.title;
  const units = explicitUnits ?? hookData.units;
  const isSample = explicitIsSample ?? hookData.isSample;
  const loading = explicitLoading ?? hookData.loading;
  const error = explicitError ?? hookData.error;

  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"];

  const getCellFor = (day: string, hour: string) => {
    return data.find((c) => c.day === day && c.hour === hour);
  };

  const getCellColor = (val: number) => {
    if (val < 25) return "rgba(255, 217, 28, 0.08)";
    if (val < 50) return "rgba(255, 217, 28, 0.22)";
    if (val < 70) return "rgba(255, 217, 28, 0.45)";
    if (val < 85) return "rgba(255, 217, 28, 0.72)";
    return "var(--accent)";
  };

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
      ariaLabel={`${title} Weekly Heatmap`}
      className={className}
    >
      <div className="w-full overflow-x-auto py-1 scrollbar-none">
        <div className="min-w-[500px] select-none">
          {/* Header row: hours */}
          <div className="grid grid-cols-10 gap-1.5 pb-2 border-b border-[var(--border)] text-center text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>
            <span className="text-left font-mono">Day</span>
            {hours.map((h) => (
              <span key={h} className="truncate">{h}</span>
            ))}
          </div>

          {/* Grid rows for each day */}
          <div className="space-y-1.5 pt-2">
            {days.map((day) => (
              <div key={day} className="grid grid-cols-10 gap-1.5 items-center">
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: "var(--text)" }}
                >
                  {day}
                </span>

                {hours.map((hour) => {
                  const cell = getCellFor(day, hour);
                  const val = cell?.value ?? 0;
                  const isHovered = hoveredCell?.day === day && hoveredCell?.hour === hour;

                  return (
                    <div
                      key={`${day}-${hour}`}
                      onMouseEnter={() => cell && setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="h-8 rounded-lg transition-all duration-200 cursor-pointer relative group flex items-center justify-center border"
                      style={{
                        background: getCellColor(val),
                        borderColor: isHovered ? "var(--accent)" : "transparent",
                        transform: isHovered ? "scale(1.12)" : "scale(1)",
                        zIndex: isHovered ? 10 : 1,
                        boxShadow: isHovered ? "0 0 10px var(--chart-glow)" : "none",
                      }}
                      tabIndex={0}
                      role="gridcell"
                      aria-label={`${day} at ${hour}: ${val}% density, ~${cell?.rawCheckins || 0} check-ins`}
                    >
                      {/* Optional micro text on higher density cells */}
                      {val >= 70 && (
                        <span
                          className="text-[9px] font-mono font-black"
                          style={{
                            color: val >= 85 ? "var(--on-accent)" : "var(--text)",
                          }}
                        >
                          {val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Heatmap Footer Legend & Hover Inspector */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Active Hover Inspection */}
            <div className="flex items-center gap-2">
              {hoveredCell ? (
                <span className="font-medium" style={{ color: "var(--text)" }}>
                  <strong style={{ color: "var(--accent)" }}>{hoveredCell.day} {hoveredCell.hour}:</strong>{" "}
                  {hoveredCell.value}% capacity ({hoveredCell.rawCheckins} estimated check-ins)
                </span>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>
                  Hover over any time slot to inspect live gym floor traffic
                </span>
              )}
            </div>

            {/* Gradient scale */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
              <span>Low (0%)</span>
              <div className="flex gap-1">
                {[15, 35, 60, 80, 95].map((level) => (
                  <span
                    key={level}
                    className="w-3.5 h-3 rounded"
                    style={{ background: getCellColor(level) }}
                  />
                ))}
              </div>
              <span>Peak (100%)</span>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};
