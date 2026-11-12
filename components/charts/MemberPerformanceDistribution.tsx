"use client";

import React, { useState } from "react";
import { Activity, Flame, ShieldAlert, Award, Clock, ArrowRight, Zap, RefreshCw } from "lucide-react";

export type MemberCategoryKey = "ALL" | "HYPER_ACTIVE" | "CONSISTENT" | "PLATEAUED" | "FADING";

export interface MemberCategoryCohort {
  key: MemberCategoryKey;
  label: string;
  count: number;
  percentage: number;
  avgVisitsWeek: number;
  bioScanCompliance: number;
  churnRisk: "VERY_LOW" | "LOW" | "MODERATE" | "HIGH";
  color: string;
  description: string;
  actionText: string;
}

export const MEMBER_COHORTS: MemberCategoryCohort[] = [
  {
    key: "HYPER_ACTIVE",
    label: "Hyper-Active",
    count: 1840,
    percentage: 34,
    avgVisitsWeek: 4.8,
    bioScanCompliance: 92,
    churnRisk: "VERY_LOW",
    color: "#10B981",
    description: "4+ workouts/week • Highly engaged with Signature Studios & Fuel Bar",
    actionText: "Invite to HYROX TriFit League",
  },
  {
    key: "CONSISTENT",
    label: "Consistent",
    count: 2210,
    percentage: 41,
    avgVisitsWeek: 2.6,
    bioScanCompliance: 78,
    churnRisk: "LOW",
    color: "#F59E0B",
    description: "2-3 workouts/week • Stable recurring visit pattern on set days",
    actionText: "Offer PT Nutrition Consultation",
  },
  {
    key: "PLATEAUED",
    label: "Plateaued",
    count: 810,
    percentage: 15,
    avgVisitsWeek: 2.1,
    bioScanCompliance: 34,
    churnRisk: "MODERATE",
    color: "#8B5CF6",
    description: "Regular check-ins but zero 3D bio-scan progression in last 60 days",
    actionText: "Queue Free Forma 3D Body Re-Scan",
  },
  {
    key: "FADING",
    label: "Fading / At-Risk",
    count: 560,
    percentage: 10,
    avgVisitsWeek: 0.4,
    bioScanCompliance: 12,
    churnRisk: "HIGH",
    color: "#EF4444",
    description: "0-1 visits in last 3 weeks • Critical 14+ day gap warning",
    actionText: "Send AI Winback WhatsApp Offer",
  },
];

interface Props {
  selectedCategory?: MemberCategoryKey;
  onSelectCategory?: (cat: MemberCategoryKey) => void;
}

export function MemberPerformanceDistribution({ selectedCategory = "ALL", onSelectCategory }: Props) {
  const [hoveredKey, setHoveredKey] = useState<MemberCategoryKey | null>(null);

  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  const totalMembers = MEMBER_COHORTS.reduce((sum, c) => sum + c.count, 0);

  const activeCohort = MEMBER_COHORTS.find((c) => c.key === (hoveredKey || selectedCategory)) || MEMBER_COHORTS[0];

  return (
    <div className="glass p-5 sm:p-6 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="card-title text-[var(--text)]">Member Performance Distribution</h3>
            <span className="admin-chip text-[11px]">{totalMembers.toLocaleString()} Members</span>
          </div>
          <p className="body-label text-xs mt-1 text-[var(--muted)]">
            Behavioral categorization based on check-in frequency and Forma 3D body telemetry
          </p>
        </div>

        {/* View all filter reset */}
        {selectedCategory !== "ALL" && onSelectCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory("ALL")}
            className="btn text-xs !py-1 !px-2.5 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Show All Categories</span>
          </button>
        )}
      </div>

      {/* Main Visuals: Donut + Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive SVG Donut (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative py-2">
          <svg className="w-48 h-48 -rotate-90 transform overflow-visible" viewBox="0 0 180 180">
            {MEMBER_COHORTS.map((item) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedAngle / 100) * circumference);
              accumulatedAngle += item.percentage;

              const isSelected = (selectedCategory === item.key) || (hoveredKey === item.key);

              return (
                <circle
                  key={item.key}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isSelected ? 20 : 15}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 10px ${item.color})` : "none",
                    transformOrigin: "center",
                  }}
                  onMouseEnter={() => setHoveredKey(item.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => onSelectCategory && onSelectCategory(item.key)}
                />
              );
            })}
          </svg>

          {/* Central Telemetry readout */}
          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
            {hoveredKey ? (
              <>
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">Cohort</span>
                <span className="text-2xl font-black font-mono text-[var(--text)]">{activeCohort.percentage}%</span>
                <span className="text-[11px] font-bold" style={{ color: activeCohort.color }}>
                  {activeCohort.label}
                </span>
              </>
            ) : (
              <>
                <span className="text-[10.5px] font-black font-mono text-[var(--accent)] uppercase tracking-wider">Total Active</span>
                <span className="text-2xl font-black font-mono text-[var(--text)]">{totalMembers.toLocaleString()}</span>
                <span className="text-[11px] font-semibold text-[var(--muted)]">Members</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Cohort Cards & Actionable Telemetry (7 cols) */}
        <div className="md:col-span-7 space-y-2.5">
          {MEMBER_COHORTS.map((cohort) => {
            const isSelected = selectedCategory === cohort.key;
            const isHovered = hoveredKey === cohort.key;

            return (
              <div
                key={cohort.key}
                onMouseEnter={() => setHoveredKey(cohort.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectCategory && onSelectCategory(cohort.key)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected || isHovered
                    ? "bg-[var(--chip)] border-[var(--card-border)] shadow-md scale-[1.01]"
                    : "bg-[var(--card)] border-[var(--line)] hover:border-[var(--card-border)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cohort.color }} />
                    <span className="font-bold text-xs text-[var(--text)]">{cohort.label}</span>
                    <span className="text-[11px] font-mono opacity-70 text-[var(--muted)]">
                      ({cohort.count.toLocaleString()} members)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {cohort.avgVisitsWeek}x / wk
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                      style={{ background: `${cohort.color}25`, color: cohort.color }}
                    >
                      {cohort.percentage}%
                    </span>
                  </div>
                </div>

                <p className="text-[11.5px] text-[var(--muted)] mt-1 line-clamp-1">
                  {cohort.description}
                </p>

                {/* Extended info on active */}
                {(isSelected || isHovered) && (
                  <div className="mt-2 pt-2 border-t border-[var(--line)] flex items-center justify-between text-[11px] animate-in fade-in duration-200">
                    <span className="text-[var(--muted)]">
                      3D Bio-Scan Compliance: <strong className="text-[var(--text)]">{cohort.bioScanCompliance}%</strong>
                    </span>
                    <span className="text-[var(--accent)] font-semibold flex items-center gap-1">
                      {cohort.actionText} →
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
