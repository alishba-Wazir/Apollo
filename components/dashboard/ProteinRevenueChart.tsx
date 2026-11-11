"use client";

import React, { useState, useMemo } from "react";
import { CupSoda, TrendingUp, Building2, ArrowUpRight, Check, Sparkles, X, Coffee, Flame } from "lucide-react";
import type { Branch } from "@/lib/apollo-demo-store";

interface ProteinRevenueChartProps {
  branches: Branch[];
  selectedBranchId: string | null;
  onSelectBranch: (branchId: string | null) => void;
  rangeMultiplier?: number;
}

interface BranchProteinData {
  branchId: string;
  name: string;
  shortName: string;
  city: string;
  color: string;
  monthlyRevenuePKR: number;
  shakesSold: number;
  dailyAvg: number;
  sharePercent: number;
  topBlend: string;
  topBlendPrice: number;
  marginPercent: number;
  pathD: string;
  curvePoints: { x: number; y: number; valM: number; label: string }[];
}

export function ProteinRevenueChart({
  branches,
  selectedBranchId,
  onSelectBranch,
  rangeMultiplier = 1.0,
}: ProteinRevenueChartProps) {
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"protein" | "subscription">("protein");

  // Colors strictly conforming to Obsidian HUD:
  // Seaview: Brilliant Gold #FFD60A
  // Clifton: Amber #F59E0B
  // AJ Tower: Monochromatic Frosted White #FFFFFF
  // LuckyOne: Monochromatic Cool Slate #94A3B8
  const branchDataMap = useMemo<Record<string, Omit<BranchProteinData, "branchId" | "name" | "shortName" | "city">>>(() => {
    return {
      "branch-seaview": {
        color: "#FFD60A",
        monthlyRevenuePKR: 1480000,
        shakesSold: 1850,
        dailyAvg: 62,
        sharePercent: 34,
        topBlend: "TriFit Gold Whey Isolate 32g",
        topBlendPrice: 850,
        marginPercent: 66,
        pathD: "M 30 142 Q 150 122 250 102 T 410 74 T 530 58 T 630 46 L 670 24",
        curvePoints: [
          { x: 30, y: 142, valM: 1.05, label: "Q1 Kickoff" },
          { x: 150, y: 122, valM: 1.18, label: "Q2 Expansion" },
          { x: 250, y: 102, valM: 1.30, label: "Q3 Mid-Year" },
          { x: 410, y: 74, valM: 1.42, label: "Q4 Peak Run" },
          { x: 530, y: 58, valM: 1.55, label: "Target Pace" },
          { x: 670, y: 24, valM: 1.68, label: "Year-End Trajectory" },
        ],
      },
      "branch-clifton": {
        color: "#F59E0B",
        monthlyRevenuePKR: 1120000,
        shakesSold: 1400,
        dailyAvg: 47,
        sharePercent: 26,
        topBlend: "Creatine Muscle Fuel Surge",
        topBlendPrice: 750,
        marginPercent: 63,
        pathD: "M 30 156 Q 150 138 250 124 T 410 96 T 530 80 T 630 70 L 670 52",
        curvePoints: [
          { x: 30, y: 156, valM: 0.82, label: "Q1 Kickoff" },
          { x: 150, y: 138, valM: 0.94, label: "Q2 Expansion" },
          { x: 250, y: 124, valM: 1.02, label: "Q3 Mid-Year" },
          { x: 410, y: 96, valM: 1.12, label: "Q4 Peak Run" },
          { x: 530, y: 80, valM: 1.20, label: "Target Pace" },
          { x: 670, y: 52, valM: 1.32, label: "Year-End Trajectory" },
        ],
      },
      "branch-ajtower": {
        color: "#FFFFFF",
        monthlyRevenuePKR: 980000,
        shakesSold: 1220,
        dailyAvg: 41,
        sharePercent: 22,
        topBlend: "Plant Power Vegan Pea Protein",
        topBlendPrice: 800,
        marginPercent: 64,
        pathD: "M 30 166 Q 150 152 250 140 T 410 116 T 530 100 T 630 88 L 670 72",
        curvePoints: [
          { x: 30, y: 166, valM: 0.70, label: "Q1 Kickoff" },
          { x: 150, y: 152, valM: 0.81, label: "Q2 Expansion" },
          { x: 250, y: 140, valM: 0.89, label: "Q3 Mid-Year" },
          { x: 410, y: 116, valM: 0.98, label: "Q4 Peak Run" },
          { x: 530, y: 100, valM: 1.08, label: "Target Pace" },
          { x: 670, y: 72, valM: 1.20, label: "Year-End Trajectory" },
        ],
      },
      "branch-luckyone": {
        color: "#94A3B8",
        monthlyRevenuePKR: 780000,
        shakesSold: 980,
        dailyAvg: 33,
        sharePercent: 18,
        topBlend: "BCAA Cold Recovery Smoothie",
        topBlendPrice: 700,
        marginPercent: 61,
        pathD: "M 30 176 Q 150 166 250 156 T 410 136 T 530 122 T 630 110 L 670 96",
        curvePoints: [
          { x: 30, y: 176, valM: 0.55, label: "Q1 Kickoff" },
          { x: 150, y: 166, valM: 0.64, label: "Q2 Expansion" },
          { x: 250, y: 156, valM: 0.71, label: "Q3 Mid-Year" },
          { x: 410, y: 136, valM: 0.78, label: "Q4 Peak Run" },
          { x: 530, y: 122, valM: 0.86, label: "Target Pace" },
          { x: 670, y: 96, valM: 0.98, label: "Year-End Trajectory" },
        ],
      },
    };
  }, []);

  // Consolidated and branch-specific computations
  const branchList = useMemo<BranchProteinData[]>(() => {
    return branches.map((b) => {
      const data = branchDataMap[b.id] || branchDataMap["branch-seaview"];
      const cleanName = b.name
        .replace("TriFit ", "")
        .split("—")[0]
        .trim();
      return {
        branchId: b.id,
        name: b.name,
        shortName: cleanName === "Clifton" ? "Clifton Club" : cleanName,
        city: b.city,
        ...data,
      };
    });
  }, [branches, branchDataMap]);

  const totalMonthlyProteinPKR = useMemo(() => {
    return branchList.reduce((sum, b) => sum + b.monthlyRevenuePKR, 0);
  }, [branchList]);

  const totalShakesSold = useMemo(() => {
    return branchList.reduce((sum, b) => sum + b.shakesSold, 0);
  }, [branchList]);

  // When an individual branch is selected by admin
  const activeBranch = useMemo(() => {
    if (!selectedBranchId) return null;
    return branchList.find((b) => b.branchId === selectedBranchId) || null;
  }, [selectedBranchId, branchList]);

  // If subscription view is active (fallback view)
  const isSubscriptionTab = activeTab === "subscription";

  return (
    <div className="glass p-[22px] flex flex-col justify-between gap-4 h-full relative overflow-hidden">
      {/* =========================================================================
          HEADER: TITLE + TOGGLE (PROTEIN REVENUE vs SUBSCRIPTION MRR)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="card-title text-[var(--text)] flex items-center gap-2">
              <CupSoda className="w-5 h-5 text-[var(--accent)]" />
              <span>
                {activeBranch
                  ? `${activeBranch.shortName} • Protein & Fuel Bar Revenue`
                  : "Protein & Fuel Bar Revenue by Branch"}
              </span>
            </h3>

            {activeBranch ? (
              <button
                type="button"
                onClick={() => onSelectBranch(null)}
                className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent)] text-[var(--on-accent)] hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                title="Click to compare all 4 branches"
              >
                <span>Branch: {activeBranch.shortName}</span>
                <X className="w-3 h-3" />
              </button>
            ) : (
              <span className="admin-chip !py-0.5 !px-2 text-[10.5px]">
                4 Clubs Compared
              </span>
            )}
          </div>

          <p className="body-label text-xs mt-0.5 text-[var(--muted)]">
            {activeBranch
              ? `Individual club fuel bar telemetry • Top seller: ${activeBranch.topBlend} (PKR ${activeBranch.topBlendPrice})`
              : "Comparative shake bar collections & member nutrition volume across flagship locations"}
          </p>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg glass text-[11px] font-semibold self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("protein")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              activeTab === "protein"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <CupSoda className="w-3.5 h-3.5" />
            <span>Protein Bar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subscription")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              activeTab === "subscription"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Subscriptions</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CHART CANVAS (MULTI-BRANCH COMPARISON OR INDIVIDUAL BRANCH SCOPE)
         ========================================================================= */}
      <div className="w-full h-[220px] relative mt-1 flex flex-col justify-end">
        <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
          <defs>
            {/* Gradients for branch curves */}
            <linearGradient id="proteinSeaviewGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD60A" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#FFD60A" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFD60A" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="proteinCliftonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="singleBranchGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
              <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid guidelines per Obsidian HUD Section 10 */}
          <line x1="0" y1="35" x2="700" y2="35" className="chart-grid" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="700" y2="80" className="chart-grid" strokeDasharray="3 3" />
          <line x1="0" y1="125" x2="700" y2="125" className="chart-grid" strokeDasharray="3 3" />
          <line x1="0" y1="170" x2="700" y2="170" className="chart-grid" />

          {/* MODE 1: SINGLE INDIVIDUAL BRANCH SELECTED BY ADMIN */}
          {activeBranch ? (
            <g key={activeBranch.branchId} className="transition-all duration-500">
              {/* Area fill for individual branch */}
              <path
                d={`${activeBranch.pathD} L 670 185 L 30 185 Z`}
                fill="url(#singleBranchGradient)"
                className="transition-all duration-700"
              />

              {/* Curve Line in bold accent */}
              <path
                d={activeBranch.pathD}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
                className="transition-all duration-500"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255, 214, 10, 0.6))",
                }}
              />

              {/* Data points for this individual branch */}
              {activeBranch.curvePoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5.5"
                    fill="var(--accent)"
                    stroke="var(--card)"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:scale-125 transition-transform"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill="var(--text)"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    PKR {pt.valM.toFixed(2)}M
                  </text>
                </g>
              ))}
            </g>
          ) : isSubscriptionTab ? (
            /* FALLBACK MODE: SUBSCRIPTION ARR/MRR TRAJECTORY */
            <g>
              <path
                d="M 20 170 Q 120 160 220 90 T 420 50 T 580 80 T 680 30 L 680 190 L 20 190 Z"
                className="chart-area"
              />
              <path
                d="M 20 170 Q 120 160 220 90 T 420 50 T 580 80 T 680 30"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="chart-line"
              />
              <circle cx="20" cy="170" r="4.5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2.5" />
              <circle cx="220" cy="90" r="4.5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2.5" />
              <circle cx="420" cy="50" r="5.5" fill="var(--accent)" stroke="var(--card)" strokeWidth="2" />
              <circle cx="580" cy="80" r="4.5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2.5" />
              <circle cx="680" cy="30" r="6.5" fill="var(--accent)" stroke="var(--card)" strokeWidth="2" />
            </g>
          ) : (
            /* MODE 2: MULTI-BRANCH COMPARISON ("show between branches which branch use") */
            <g>
              {branchList.map((b) => {
                const isHovered = hoveredBranchId === b.branchId;
                const hasHover = hoveredBranchId !== null;
                const opacity = hasHover ? (isHovered ? 1 : 0.22) : 0.95;
                const strokeWidth = isHovered ? 4.5 : 2.8;

                return (
                  <g
                    key={b.branchId}
                    style={{
                      opacity,
                      transition: "opacity 0.25s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredBranchId(b.branchId)}
                    onMouseLeave={() => setHoveredBranchId(null)}
                    onClick={() => onSelectBranch(b.branchId)}
                  >
                    {/* Curve */}
                    <path
                      d={b.pathD}
                      fill="none"
                      stroke={b.branchId === "branch-ajtower" ? "var(--text)" : b.color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      style={{
                        filter: isHovered
                          ? `drop-shadow(0 0 10px ${b.branchId === "branch-ajtower" ? "var(--text)" : b.color})`
                          : "none",
                        transition: "stroke-width 0.2s ease, filter 0.2s ease",
                      }}
                    />

                    {/* Data Points on curve */}
                    {b.curvePoints.map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 5.5 : 4}
                        fill={b.branchId === "branch-ajtower" ? "var(--text)" : b.color}
                        stroke="var(--bg)"
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />
                    ))}

                    {/* End point value label for hovered branch */}
                    {isHovered && (
                      <g>
                        <rect
                          x={b.curvePoints[5].x - 55}
                          y={b.curvePoints[5].y - 28}
                          width="70"
                          height="22"
                          rx="6"
                          fill="var(--card)"
                          stroke={b.color}
                          strokeWidth="1.5"
                        />
                        <text
                          x={b.curvePoints[5].x - 20}
                          y={b.curvePoints[5].y - 13}
                          textAnchor="middle"
                          fill="var(--text)"
                          fontSize="10.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          PKR {(b.monthlyRevenuePKR / 1000000).toFixed(2)}M
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Time X-axis */}
        <div className="flex justify-between text-[11px] font-mono text-[var(--muted)] pt-2 border-t border-[var(--line)]">
          <span>Q1 (Jan-Mar)</span>
          <span>Q2 (Apr-Jun)</span>
          <span>Q3 (Jul-Sep)</span>
          <span>Q4 (Peak Fuel)</span>
          <span>Target Pace</span>
          <span>Year-End Trajectory</span>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE BRANCH BREAKDOWN (COMPARE ALL BRANCHES OR SHOW INDIVIDUAL STATS)
         ========================================================================= */}
      {activeBranch ? (
        /* INDIVIDUAL BRANCH VIEW SPECIFICS */
        <div className="pt-2.5 border-t border-[var(--line)] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-xl glass flex flex-col justify-between">
            <span className="text-[10.5px] text-[var(--muted)] font-semibold uppercase">
              Monthly Fuel Revenue
            </span>
            <div className="text-[15px] font-bold font-mono text-[var(--accent)] mt-0.5">
              PKR {(activeBranch.monthlyRevenuePKR / 1000000).toFixed(2)}M
            </div>
            <span className="text-[10px] text-[var(--muted)]">
              {activeBranch.sharePercent}% of network volume
            </span>
          </div>

          <div className="p-2 rounded-xl glass flex flex-col justify-between">
            <span className="text-[10.5px] text-[var(--muted)] font-semibold uppercase">
              Daily Shake Output
            </span>
            <div className="text-[15px] font-bold font-mono text-[var(--text)] mt-0.5">
              {activeBranch.dailyAvg} shakes/day
            </div>
            <span className="text-[10px] text-[var(--muted)]">
              {activeBranch.shakesSold.toLocaleString()} monthly
            </span>
          </div>

          <div className="p-2 rounded-xl glass flex flex-col justify-between">
            <span className="text-[10.5px] text-[var(--muted)] font-semibold uppercase">
              Top-Selling Blend
            </span>
            <div className="text-[11.5px] font-bold text-[var(--text)] truncate mt-0.5" title={activeBranch.topBlend}>
              {activeBranch.topBlend}
            </div>
            <span className="text-[10px] font-mono text-[var(--accent)]">
              PKR {activeBranch.topBlendPrice}
            </span>
          </div>

          <div className="p-2 rounded-xl glass flex flex-col justify-between">
            <span className="text-[10.5px] text-[var(--muted)] font-semibold uppercase">
              Fuel Bar Margin
            </span>
            <div className="text-[15px] font-bold font-mono text-emerald-400 mt-0.5">
              {activeBranch.marginPercent}% Gross
            </div>
            <button
              type="button"
              onClick={() => onSelectBranch(null)}
              className="text-[10px] text-[var(--accent)] hover:underline text-left cursor-pointer font-bold"
            >
              ← Compare All Clubs
            </button>
          </div>
        </div>
      ) : (
        /* MULTI-BRANCH COMPARISON LEGEND ("show between branches which branch use") */
        <div className="pt-2 border-t border-[var(--line)]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">
            <span>Branch Protein Collections</span>
            <span className="font-mono text-[var(--accent)]">
              Total: PKR {(totalMonthlyProteinPKR / 1000000).toFixed(2)}M ({totalShakesSold.toLocaleString()} Shakes)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {branchList.map((b) => {
              const isHovered = hoveredBranchId === b.branchId;

              return (
                <div
                  key={b.branchId}
                  onMouseEnter={() => setHoveredBranchId(b.branchId)}
                  onMouseLeave={() => setHoveredBranchId(null)}
                  onClick={() => onSelectBranch(b.branchId)}
                  className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 border ${
                    isHovered
                      ? "bg-[var(--menu-hover)] border-[var(--accent)] shadow-sm scale-[1.02]"
                      : "border-[var(--line)] hover:bg-[var(--chip)]"
                  }`}
                  title={`Click to scope dashboard to ${b.shortName}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                      style={{
                        background: b.branchId === "branch-ajtower" ? "var(--text)" : b.color,
                        boxShadow: isHovered
                          ? `0 0 8px ${b.branchId === "branch-ajtower" ? "var(--text)" : b.color}`
                          : "none",
                        transform: isHovered ? "scale(1.3)" : "scale(1)",
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-[11.5px] font-bold text-[var(--text)] truncate">
                        {b.shortName}
                      </div>
                      <div className="text-[9.5px] text-[var(--muted)] font-mono">
                        {b.dailyAvg} shakes/day • {b.sharePercent}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-[var(--text)]">
                      PKR {(b.monthlyRevenuePKR / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-[9px] text-[var(--accent)] font-semibold">
                      {b.city}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
