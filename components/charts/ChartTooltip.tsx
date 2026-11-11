"use client";

import React from "react";

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string;
  isSample?: boolean;
  customLabel?: string;
  customValue?: string | number;
  secondaryLabel?: string;
  secondaryValue?: string | number;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  unit,
  isSample = true,
  customLabel,
  customValue,
  secondaryLabel,
  secondaryValue,
}) => {
  if (!active && !customValue) return null;

  const pointData = payload && payload.length > 0 ? payload[0] : null;
  const displayLabel = customLabel || label || pointData?.name || pointData?.payload?.label || "";
  const rawValue = customValue !== undefined ? customValue : pointData?.value ?? 0;
  const secondary = secondaryValue !== undefined ? secondaryValue : pointData?.payload?.secondaryValue;
  const formattedVal = pointData?.payload?.formattedValue || `${rawValue}${unit ? ` ${unit}` : ""}`;

  return (
    <div
      role="tooltip"
      className="p-3 rounded-xl shadow-xl min-w-[150px] max-w-[240px] pointer-events-none transition-all duration-150 select-none"
      style={{
        background: "var(--bg)",
        border: "1.5px solid var(--accent)",
        color: "var(--text)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 14px var(--chart-glow)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Tooltip Header / Label */}
      {displayLabel && (
        <div
          className="text-[11px] font-bold pb-1 mb-1.5 border-b"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          {displayLabel}
        </div>
      )}

      {/* Primary Value */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
          {unit || "Value"}:
        </span>
        <span
          className="text-sm font-black font-mono"
          style={{ color: "var(--accent)" }}
        >
          {formattedVal}
        </span>
      </div>

      {/* Secondary Value if present */}
      {secondary !== undefined && (
        <div className="flex items-baseline justify-between gap-3 mt-1 pt-1 border-t border-[var(--border)]">
          <span className="text-[10.5px]" style={{ color: "var(--text-muted)" }}>
            {secondaryLabel || "Secondary"}:
          </span>
          <span className="text-xs font-bold font-mono" style={{ color: "var(--text)" }}>
            {secondary}
          </span>
        </div>
      )}

    </div>
  );
};
