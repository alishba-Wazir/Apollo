"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Sparkline } from "@/components/charts/Sparkline";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export type StatCardVariant = "success" | "warning" | "info" | "alert" | "neutral" | "default";

export interface StatCardProps {
  /** The title of the KPI metric */
  title: string;
  /** Primary display value (string formatted or fallback) */
  value?: string | number;
  /** Optional numeric value to power smooth AnimatedCounter */
  numericValue?: number;
  /** Value prefix e.g. "PKR " or "$" */
  valuePrefix?: string;
  /** Value suffix e.g. "M" or "%" */
  valueSuffix?: string;
  /** Unit shorthand (e.g. "Sessions" or "Units") */
  unit?: string;
  /** Lucide icon component or instantiated JSX element */
  icon?: React.ElementType | React.ReactNode;
  /** Strict color hierarchy variant */
  variant?: StatCardVariant;
  /** Trend badge object */
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  /** Trend change text shorthand (e.g. "+14.2%") */
  change?: string;
  /** Trend change polarity */
  changeType?: "positive" | "negative" | "neutral";
  /** Sparkline trend points */
  sparklineData?: number[];
  /** Custom sparkline stroke color override */
  sparklineColor?: string;
  /** Custom left footer slot (e.g. status badge) */
  footerLeft?: React.ReactNode;
  /** Custom right footer slot (e.g. secondary context text) */
  footerRight?: React.ReactNode;
  /** Secondary text shorthand for right footer */
  secondaryText?: string;
  /** Additional container classes */
  className?: string;
  /** Click handler if card is interactive */
  onClick?: () => void;
}

const variantStyles: Record<
  StatCardVariant,
  {
    iconBg: string;
    iconColor: string;
    iconBorder: string;
    defaultSparkline: string;
  }
> = {
  // Pure Yellow / Black / White theme adherence
  success: {
    iconBg: "bg-[var(--chip)]",
    iconColor: "text-[var(--accent)]",
    iconBorder: "border-[var(--accent)]/30",
    defaultSparkline: "#FFD60A",
  },
  warning: {
    iconBg: "bg-[var(--chip)]",
    iconColor: "text-[var(--accent)]",
    iconBorder: "border-[var(--accent)]/30",
    defaultSparkline: "#FFD60A",
  },
  info: {
    iconBg: "bg-[var(--btn-bg)]",
    iconColor: "text-[var(--text)]",
    iconBorder: "border-[var(--card-border)]",
    defaultSparkline: "#FFCC00",
  },
  alert: {
    iconBg: "bg-[var(--chip)]",
    iconColor: "text-[var(--accent)]",
    iconBorder: "border-[var(--accent)]/30",
    defaultSparkline: "#FFD60A",
  },
  neutral: {
    iconBg: "bg-[var(--btn-bg)]",
    iconColor: "text-[var(--muted)]",
    iconBorder: "border-[var(--card-border)]",
    defaultSparkline: "#FFD60A",
  },
  default: {
    iconBg: "bg-[var(--btn-bg)]",
    iconColor: "text-[var(--muted)]",
    iconBorder: "border-[var(--card-border)]",
    defaultSparkline: "#FFD60A",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  numericValue,
  valuePrefix = "",
  valueSuffix = "",
  unit,
  icon,
  variant = "neutral",
  trend,
  change,
  changeType = "positive",
  sparklineData,
  sparklineColor,
  footerLeft,
  footerRight,
  secondaryText,
  className = "",
  onClick,
}) => {
  const vStyle = variantStyles[variant] || variantStyles.neutral;
  const resolvedSparklineColor = sparklineColor || vStyle.defaultSparkline;

  // Resolve shorthand trend
  const resolvedTrend = trend || (change ? {
    value: change,
    isPositive: changeType === "positive",
  } : undefined);

  // Resolve footerRight
  const resolvedFooterRight = footerRight || secondaryText;

  // Resolve suffix with unit if provided
  const resolvedSuffix = valueSuffix || (unit ? ` ${unit}` : "");

  // Render icon whether it's an element, component, or node
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as React.ElementType;
    return <IconComponent className="w-3.5 h-3.5" />;
  };

  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl px-3.5 py-3 border border-[var(--card-border)] hover:border-[var(--accent)]/40 transition-all duration-200 relative overflow-hidden group flex flex-col justify-between ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Top Row: Metric Title & Soft Icon Container */}
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[var(--muted)] truncate">
          {title}
        </span>
        {icon && (
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover:scale-105 ${vStyle.iconBg} ${vStyle.iconColor} ${vStyle.iconBorder}`}
          >
            {renderIcon()}
          </div>
        )}
      </div>

      {/* Middle Row: Big Bold Metric & Smooth Trend Sparkline */}
      <div className="flex items-end justify-between gap-1.5 mt-1 sm:mt-1.5">
        <div className="text-xl sm:text-[22px] font-display font-bold text-[var(--text)] tracking-tight leading-none">
          {numericValue !== undefined ? (
            <AnimatedCounter
              value={numericValue}
              prefix={valuePrefix}
              suffix={resolvedSuffix}
            />
          ) : (
            <>
              {valuePrefix}{value}{resolvedSuffix && typeof value !== "string" ? resolvedSuffix : resolvedSuffix && !String(value).includes(resolvedSuffix.trim()) ? resolvedSuffix : ""}
            </>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="w-16 sm:w-20 h-5 shrink-0 flex items-center justify-end">
            <Sparkline
              data={sparklineData}
              strokeColor={resolvedSparklineColor}
              height={20}
            />
          </div>
        )}
      </div>

      {/* Bottom Row: Subtle Hairline Divider & Contextual Footers (Zero Rogue Colors) */}
      <div className="flex items-center justify-between text-[10px] text-[var(--muted)] pt-1.5 mt-1.5 border-t border-[var(--line)]">
        <div className="min-w-0">
          {resolvedTrend ? (
            <span
              className={`font-semibold flex items-center gap-0.5 ${
                resolvedTrend.isPositive
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {resolvedTrend.isPositive ? (
                <ArrowUpRight className="w-3 h-3 shrink-0 text-[var(--accent)]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 shrink-0 text-[var(--muted)]" />
              )}
              <span>{resolvedTrend.value}</span>
              {resolvedTrend.label && (
                <span className="font-normal text-[var(--muted)] ml-0.5 truncate">
                  {resolvedTrend.label}
                </span>
              )}
            </span>
          ) : (
            footerLeft
          )}
        </div>

        {resolvedFooterRight && (
          <div className="text-right truncate font-medium text-[var(--muted)] shrink-0 ml-1">
            {resolvedFooterRight}
          </div>
        )}
      </div>
    </div>
  );
};
