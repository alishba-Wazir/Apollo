"use client";

import React, { useState } from "react";
import { DollarSign, Layers, TrendingUp, Sparkles, Filter } from "lucide-react";

interface DayRevenue {
  day: string;
  fullDay: string;
  membershipDuesPKR: number;
  personalTrainingPKR: number;
  fuelBarPKR: number;
}

const DEFAULT_WEEKLY_DATA: DayRevenue[] = [
  {
    day: "Mon",
    fullDay: "Monday",
    membershipDuesPKR: 850000,
    personalTrainingPKR: 420000,
    fuelBarPKR: 180000,
  },
  {
    day: "Tue",
    fullDay: "Tuesday",
    membershipDuesPKR: 980000,
    personalTrainingPKR: 540000,
    fuelBarPKR: 210000,
  },
  {
    day: "Wed",
    fullDay: "Wednesday",
    membershipDuesPKR: 920000,
    personalTrainingPKR: 490000,
    fuelBarPKR: 230000,
  },
  {
    day: "Thu",
    fullDay: "Thursday",
    membershipDuesPKR: 1100000,
    personalTrainingPKR: 580000,
    fuelBarPKR: 270000,
  },
  {
    day: "Fri",
    fullDay: "Friday",
    membershipDuesPKR: 1250000,
    personalTrainingPKR: 620000,
    fuelBarPKR: 280000,
  },
  {
    day: "Sat",
    fullDay: "Saturday (Peak)",
    membershipDuesPKR: 1680000,
    personalTrainingPKR: 790000,
    fuelBarPKR: 380000,
  },
  {
    day: "Sun",
    fullDay: "Sunday (Recovery)",
    membershipDuesPKR: 1420000,
    personalTrainingPKR: 660000,
    fuelBarPKR: 320000,
  },
];

interface Props {
  selectedBranchName?: string;
}

export function WeeklyRevenueStackedBar({ selectedBranchName }: Props) {
  const [activeStream, setActiveStream] = useState<"ALL" | "DUES" | "PT" | "FUEL">("ALL");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxDailyTotal = Math.max(
    ...DEFAULT_WEEKLY_DATA.map((d) => d.membershipDuesPKR + d.personalTrainingPKR + d.fuelBarPKR)
  );

  const totalWeekly = DEFAULT_WEEKLY_DATA.reduce(
    (acc, d) => ({
      dues: acc.dues + d.membershipDuesPKR,
      pt: acc.pt + d.personalTrainingPKR,
      fuel: acc.fuel + d.fuelBarPKR,
      total: acc.total + d.membershipDuesPKR + d.personalTrainingPKR + d.fuelBarPKR,
    }),
    { dues: 0, pt: 0, fuel: 0, total: 0 }
  );

  return (
    <div className="glass p-5 sm:p-6 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="card-title text-[var(--text)]">Weekly Revenue Distribution</h3>
            <span className="admin-chip !py-0.5 text-[11px]">7-Day Stacked</span>
          </div>
          <p className="body-label text-xs mt-1 text-[var(--muted)]">
            {selectedBranchName ? `${selectedBranchName} • ` : "All Flagships • "}
            Membership dues vs PT coaching vs Fuel Bar retail collections
          </p>
        </div>

        {/* Stream Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs">
          <button
            type="button"
            onClick={() => setActiveStream("ALL")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeStream === "ALL"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            All Streams
          </button>
          <button
            type="button"
            onClick={() => setActiveStream("DUES")}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              activeStream === "DUES"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm font-bold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Dues
          </button>
          <button
            type="button"
            onClick={() => setActiveStream("PT")}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              activeStream === "PT"
                ? "bg-emerald-500 text-white shadow-sm font-bold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            PT
          </button>
          <button
            type="button"
            onClick={() => setActiveStream("FUEL")}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              activeStream === "FUEL"
                ? "bg-amber-400 text-black shadow-sm font-bold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Fuel Bar
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="relative pt-4 pb-2">
        <div className="h-[210px] w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
          {DEFAULT_WEEKLY_DATA.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const total = item.membershipDuesPKR + item.personalTrainingPKR + item.fuelBarPKR;

            // Height proportions
            const duesH = activeStream === "ALL" || activeStream === "DUES" ? (item.membershipDuesPKR / maxDailyTotal) * 100 : 0;
            const ptH = activeStream === "ALL" || activeStream === "PT" ? (item.personalTrainingPKR / maxDailyTotal) * 100 : 0;
            const fuelH = activeStream === "ALL" || activeStream === "FUEL" ? (item.fuelBarPKR / maxDailyTotal) * 100 : 0;
            const totalH = duesH + ptH + fuelH;

            return (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating tooltip */}
                {isHovered && (
                  <div className="absolute -top-24 z-30 min-w-[190px] p-2.5 rounded-xl glass bg-[var(--card)]/95 shadow-2xl border border-[var(--card-border)] text-xs pointer-events-none transform -translate-x-1/2 left-1/2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="font-bold text-[var(--text)] flex items-center justify-between pb-1 mb-1 border-b border-[var(--line)]">
                      <span>{item.fullDay}</span>
                      <span className="font-mono text-[var(--accent)]">PKR {(total / 1000).toLocaleString()}k</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[var(--muted)]">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                          Dues:
                        </span>
                        <span className="font-mono font-semibold text-[var(--text)]">
                          PKR {(item.membershipDuesPKR / 1000).toLocaleString()}k
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[var(--muted)]">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                          PT Sessions:
                        </span>
                        <span className="font-mono font-semibold text-[var(--text)]">
                          PKR {(item.personalTrainingPKR / 1000).toLocaleString()}k
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[var(--muted)]">
                          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                          Fuel Bar:
                        </span>
                        <span className="font-mono font-semibold text-[var(--text)]">
                          PKR {(item.fuelBarPKR / 1000).toLocaleString()}k
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stacked Bar Container */}
                <div
                  className={`w-full max-w-[48px] rounded-t-xl overflow-hidden flex flex-col-reverse transition-all duration-300 ${
                    isHovered ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)] scale-y-102" : "opacity-95"
                  }`}
                  style={{ height: `${Math.max(totalH, 8)}%` }}
                >
                  {/* Segment 1: Membership Dues (Base) */}
                  {(activeStream === "ALL" || activeStream === "DUES") && (
                    <div
                      className="w-full transition-all duration-500 bg-[#F59E0B] relative hover:brightness-110"
                      style={{
                        height: totalH > 0 ? `${(duesH / totalH) * 100}%` : "0%",
                      }}
                      title={`Membership Dues: PKR ${(item.membershipDuesPKR / 1000).toFixed(0)}k`}
                    />
                  )}

                  {/* Segment 2: Personal Training */}
                  {(activeStream === "ALL" || activeStream === "PT") && (
                    <div
                      className="w-full transition-all duration-500 bg-[#10B981] relative hover:brightness-110"
                      style={{
                        height: totalH > 0 ? `${(ptH / totalH) * 100}%` : "0%",
                      }}
                      title={`Personal Training: PKR ${(item.personalTrainingPKR / 1000).toFixed(0)}k`}
                    />
                  )}

                  {/* Segment 3: Fuel Bar */}
                  {(activeStream === "ALL" || activeStream === "FUEL") && (
                    <div
                      className="w-full transition-all duration-500 bg-[#38BDF8] relative hover:brightness-110"
                      style={{
                        height: totalH > 0 ? `${(fuelH / totalH) * 100}%` : "0%",
                      }}
                      title={`Fuel Bar: PKR ${(item.fuelBarPKR / 1000).toFixed(0)}k`}
                    />
                  )}
                </div>

                {/* Bottom Day Label */}
                <span className={`text-[11px] font-bold mt-2 transition-colors ${
                  isHovered ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}>
                  {item.day}
                </span>
                <span className="text-[9.5px] font-mono opacity-60 text-[var(--muted)] -mt-0.5">
                  {(total / 1000000).toFixed(1)}M
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Summary & Legend */}
      <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-[var(--muted)] font-medium">Dues (PKR {(totalWeekly.dues / 1000000).toFixed(2)}M)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span className="text-[var(--muted)] font-medium">PT (PKR {(totalWeekly.pt / 1000000).toFixed(2)}M)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
            <span className="text-[var(--muted)] font-medium">Fuel Bar (PKR {(totalWeekly.fuel / 1000000).toFixed(2)}M)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono font-bold text-[var(--text)]">
          <span className="text-[var(--muted)] font-sans font-normal">7-Day Gross:</span>
          <span className="text-[var(--accent)]">PKR {(totalWeekly.total / 1000000).toFixed(2)}M</span>
        </div>
      </div>
    </div>
  );
}
