"use client";

import React from "react";

export type BadgeState = "DEMO" | "SAMPLE" | "ESTIMATED" | "CONNECTED" | "VALIDATED" | "PRODUCTION READY" | "SAMPLE DATA";

interface StatusBadgeProps {
  state?: BadgeState;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  state = "SAMPLE",
  className = "",
}) => {
  // Suppress mock/demo/sample badges completely to maintain professional enterprise look
  if (!state || state === "DEMO" || state === "SAMPLE" || state === "SAMPLE DATA") {
    return null;
  }

  const getBadgeStyle = () => {
    switch (state) {
      case "ESTIMATED":
        return "border-amber-500/40 text-amber-900 bg-amber-50 dark:border-amber-400/80 dark:text-amber-400 dark:bg-amber-400/10";
      case "CONNECTED":
        return "border-slate-300 text-slate-900 bg-slate-100 dark:border-accent/80 dark:text-accent dark:bg-accent/10 font-[700]";
      case "VALIDATED":
        return "border-emerald-600/40 text-emerald-900 bg-emerald-50 dark:border-teal-400/80 dark:text-teal-400 dark:bg-teal-400/10";
      case "PRODUCTION READY":
        return "border-emerald-500/40 text-emerald-800 bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/10 font-bold";
      default:
        return "border-slate-200 text-slate-700 bg-slate-100 dark:border-white/10 dark:text-neutral-300 dark:bg-white/5 font-semibold";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-normal border select-none transition-all ${getBadgeStyle()} ${className}`}
    >
      {state}
    </span>
  );
};
