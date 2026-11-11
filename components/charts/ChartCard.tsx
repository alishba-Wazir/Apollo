"use client";

import React from "react";
import { AlertCircle, RefreshCw, BarChart2, Info } from "lucide-react";

export interface ChartCardProps {
  title: string;
  units?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  isSample?: boolean;
  loading?: boolean;
  empty?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  summary?: string;
  ariaLabel?: string;
  headerActions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  minHeight?: string | number;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  units,
  subtitle,
  badge,
  isSample = false,
  loading = false,
  empty = false,
  error = null,
  onRetry,
  summary,
  ariaLabel,
  headerActions,
  className = "",
  children,
  minHeight = "280px",
}) => {
  const resolvedAriaLabel = ariaLabel || `${title}${units ? ` (${units})` : ""}`;
  const accessibleSummary = summary || `Chart visualization for ${title}. ${units ? `Values measured in ${units}.` : ""}`;

  return (
    <section
      aria-label={resolvedAriaLabel}
      className={`glass-panel p-6 rounded-[24px] transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${className}`}
      style={{ minHeight }}
    >
      {/* Specular highlight border at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Golden ambient corner glow in dark mode */}
      <div className="pointer-events-none absolute -bottom-12 -right-12 w-72 h-72 rounded-full bg-[#FFD91C]/[0.08] blur-3xl opacity-0 dark:opacity-100 transition-opacity" />

      {/* Screen reader summary */}
      <div className="sr-only" role="region" aria-live="polite">
        <p>{accessibleSummary}</p>
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-2.5 border-b border-[var(--border)] dark:border-white/[0.06] border-slate-200/70 relative z-10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3
              className="text-[15px] sm:text-[16px] font-[800] tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {title}
            </h3>

            {units && (
              <span
                className="text-[12px] font-semibold tracking-normal"
                style={{ color: "var(--text-muted)" }}
              >
                ({units})
              </span>
            )}

            {badge}
          </div>

          {subtitle && (
            <p
              className="text-[12px] font-normal mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {headerActions && (
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {headerActions}
          </div>
        )}
      </div>

      {/* Main Body with State Handling */}
      <div className="flex-1 w-full relative flex flex-col justify-center z-10">
        {loading ? (
          /* Loading State Skeleton with Specular Shimmer */
          <div
            className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 space-y-4"
            aria-busy="true"
            aria-label="Loading chart data"
          >
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
            <div className="w-48 h-3 rounded-full skeleton-shimmer" />
            <div className="w-full max-w-sm h-28 rounded-xl skeleton-shimmer" />
            <span className="text-xs font-semibold text-accent animate-pulse">
              Streaming real-time telemetry...
            </span>
          </div>
        ) : error ? (
          /* Error State */
          <div
            className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center space-y-3"
            role="alert"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(239, 68, 68, 0.12)", color: "var(--negative)" }}
            >
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>
                Unable to display chart
              </h4>
              <p className="text-xs max-w-sm" style={{ color: "var(--text-muted)" }}>
                {typeof error === "string" ? error : error?.message || "A network or telemetry rendering error occurred."}
              </p>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: "var(--accent)",
                  color: "var(--on-accent)",
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            )}
          </div>
        ) : empty ? (
          /* Empty State */
          <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center space-y-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--border)", color: "var(--text-muted)" }}
            >
              <BarChart2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              No data points available
            </h4>
            <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>
              There is currently no metric activity logged for this time period.
            </p>
          </div>
        ) : (
          /* Render Chart Children */
          <div className="w-full h-full flex-1 flex flex-col">
            {children}
          </div>
        )}
      </div>
    </section>
  );
};
