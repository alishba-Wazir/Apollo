"use client";

import React, { useState, useMemo } from "react";
import { Crown, Sparkles, Check, Layers, ArrowUpRight } from "lucide-react";
import type { MembershipPlan, Member } from "@/lib/apollo-demo-store";

interface SubscriptionDonutChartProps {
  plans: MembershipPlan[];
  members: Member[];
  totalMembersCount?: number;
  selectedBranchName?: string;
}

interface SliceData {
  id: string;
  name: string;
  shortName: string;
  tier: string;
  category: "Regular" | "Plus" | "Special";
  durationMonths: number;
  pricePKR: number;
  monthlyEquivalentPKR: number;
  badge?: string;
  rawCount: number;
  scaledCount: number;
  percentage: number;
  color: string;
  border: string;
}

export function SubscriptionDonutChart({
  plans,
  members,
  totalMembersCount = 5440,
  selectedBranchName,
}: SubscriptionDonutChartProps) {
  const [hoveredSliceId, setHoveredSliceId] = useState<string | null>(null);
  const [selectedSliceId, setSelectedSliceId] = useState<string | null>("plan-trifit-plus-3m");
  const [viewMode, setViewMode] = useState<"all" | "tier">("all");

  // Palette strictly conforming to Obsidian HUD:
  // Amber / Gold palette (#FFD60A, #F59E0B, #FBBF24, #D97706)
  // Monochromatic contrast tokens (deep slate #64748B, frosted white #FFFFFF)
  // Subtle gold borders
  const paletteMap: Record<string, { color: string; border: string }> = {
    "plan-trifit-plus-12m": { color: "#FFD60A", border: "rgba(255, 214, 10, 0.45)" }, // Plus 12M (Best Value - Gold)
    "plan-trifit-regular-12m": { color: "#F59E0B", border: "rgba(245, 158, 11, 0.45)" }, // Regular 12M (Most Popular - Amber)
    "plan-trifit-regular-3m": { color: "#64748B", border: "rgba(100, 116, 139, 0.45)" }, // Regular 3M (Deep Slate)
    "plan-trifit-plus-3m": { color: "#FFFFFF", border: "rgba(255, 255, 255, 0.65)" }, // Plus 3M (Crisp Frosted White)
    "plan-trifit-regular-6m": { color: "#D97706", border: "rgba(217, 119, 6, 0.45)" }, // Regular 6M (Ochre Amber)
    "plan-trifit-plus-6m": { color: "#FBBF24", border: "rgba(251, 191, 36, 0.45)" }, // Plus 6M (Warm Sun Gold)
  };

  // Compute breakdown across all 6 official TriFit plans
  const allSlices = useMemo<SliceData[]>(() => {
    const planCounts: Record<string, number> = {};
    plans.forEach((p) => {
      planCounts[p.id] = 0;
    });

    members.forEach((m) => {
      if (m.planId && planCounts[m.planId] !== undefined) {
        planCounts[m.planId] += 1;
      } else {
        planCounts["plan-trifit-regular-12m"] = (planCounts["plan-trifit-regular-12m"] || 0) + 1;
      }
    });

    const totalRaw = members.length || 1;
    const scaleFactor = totalMembersCount / totalRaw;

    // Sort order: largest slice first (descending by member count)
    const sortedPlans = [...plans].sort((a, b) => {
      const countA = planCounts[a.id] || 0;
      const countB = planCounts[b.id] || 0;
      if (countB !== countA) return countB - countA;
      return b.pricePKR - a.pricePKR;
    });

    return sortedPlans.map((plan) => {
      const rawCount = planCounts[plan.id] || 0;
      const scaledCount = Math.round(rawCount * scaleFactor);
      const percentage = (rawCount / totalRaw) * 100;
      const style = paletteMap[plan.id] || { color: "#FFD60A", border: "rgba(255, 214, 10, 0.45)" };

      return {
        id: plan.id,
        name: plan.name,
        shortName: plan.name.replace("TriFit ", ""),
        tier: plan.tier,
        category: (plan.category || (plan.name.includes("Plus") ? "Plus" : "Regular")) as "Regular" | "Plus",
        durationMonths: plan.durationMonths,
        pricePKR: plan.pricePKR,
        monthlyEquivalentPKR:
          plan.monthlyEquivalentPKR || Math.round(plan.pricePKR / plan.durationMonths),
        badge: plan.badge,
        rawCount,
        scaledCount,
        percentage,
        color: style.color,
        border: style.border,
      };
    });
  }, [plans, members, totalMembersCount]);

  // Compute 2-Tier consolidated view (TriFit Plus VIP vs TriFit Regular)
  const tierSlices = useMemo<SliceData[]>(() => {
    const plusMembers = allSlices.filter((s) => s.category === "Plus");
    const regularMembers = allSlices.filter((s) => s.category === "Regular");

    const plusRaw = plusMembers.reduce((acc, s) => acc + s.rawCount, 0);
    const regularRaw = regularMembers.reduce((acc, s) => acc + s.rawCount, 0);
    const totalRaw = (plusRaw + regularRaw) || 1;
    const scaleFactor = totalMembersCount / totalRaw;

    return [
      {
        id: "tier-plus",
        name: "TriFit Plus (VIP Tier)",
        shortName: "TriFit Plus VIP",
        tier: "VIP",
        category: "Plus",
        durationMonths: 12,
        pricePKR: 155999,
        monthlyEquivalentPKR: 13000,
        badge: "Personal Training + Guests",
        rawCount: plusRaw,
        scaledCount: Math.round(plusRaw * scaleFactor),
        percentage: (plusRaw / totalRaw) * 100,
        color: "#FFD60A",
        border: "rgba(255, 214, 10, 0.5)",
      },
      {
        id: "tier-regular",
        name: "TriFit Regular Plans",
        shortName: "TriFit Regular",
        tier: "STANDARD",
        category: "Regular",
        durationMonths: 12,
        pricePKR: 122999,
        monthlyEquivalentPKR: 10250,
        badge: "Multi-Gym Access + Steam",
        rawCount: regularRaw,
        scaledCount: Math.round(regularRaw * scaleFactor),
        percentage: (regularRaw / totalRaw) * 100,
        color: "#94A3B8",
        border: "rgba(148, 163, 184, 0.5)",
      },
    ];
  }, [allSlices, totalMembersCount]);

  const activeSlices = viewMode === "all" ? allSlices : tierSlices;

  // Geometry calculations for Donut Arcs & Radial Pop-Out
  const cx = 110;
  const cy = 110;
  const R = 86; // Outer radius
  const r = 56; // Inner radius (donut hole r = 56)
  const popOffset = 8; // Pop outward offset in pixels

  const totalValue = activeSlices.reduce((acc, s) => acc + s.percentage, 0) || 100;

  let currentAngle = 0;
  const arcSegments = activeSlices.map((slice) => {
    const fraction = slice.percentage / totalValue;
    const angleSpan = fraction * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    currentAngle = endAngle;

    // Small gap padding between slices
    const gap = activeSlices.length > 1 ? 0.024 : 0;
    const a0 = startAngle + gap / 2;
    const a1 = Math.max(a0, endAngle - gap / 2);

    const x0 = cx + R * Math.sin(a0);
    const y0 = cy - R * Math.cos(a0);
    const x1 = cx + R * Math.sin(a1);
    const y1 = cy - R * Math.cos(a1);

    const ix1 = cx + r * Math.sin(a1);
    const iy1 = cy - r * Math.cos(a1);
    const ix0 = cx + r * Math.sin(a0);
    const iy0 = cy - r * Math.cos(a0);

    const largeArc = a1 - a0 > Math.PI ? 1 : 0;
    const pathD = `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 0 ${ix0.toFixed(2)} ${iy0.toFixed(2)} Z`;

    // Radial translation vector for "pop outward" elevation
    const midAngle = (startAngle + endAngle) / 2;
    const tx = popOffset * Math.sin(midAngle);
    const ty = -popOffset * Math.cos(midAngle);

    return {
      slice,
      pathD,
      tx,
      ty,
    };
  });

  const hoveredSlice = activeSlices.find((s) => s.id === hoveredSliceId) || null;

  const activeDisplaySlice = useMemo(() => {
    if (hoveredSlice) return hoveredSlice;
    if (selectedSliceId) {
      const found = activeSlices.find((s) => s.id === selectedSliceId);
      if (found) return found;
    }
    return activeSlices[0] || allSlices[0];
  }, [hoveredSlice, activeSlices, selectedSliceId, allSlices]);

  return (
    <div className="glass p-[22px] flex flex-col justify-between gap-4 h-full relative overflow-hidden">
      {/* CARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="card-title text-[var(--text)] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
              <span>Members by Subscription Tier</span>
            </h3>
            <span className="admin-chip !py-0.5 !px-2 text-[10.5px]">
              {selectedBranchName ? selectedBranchName.replace("TriFit ", "") : "Consolidated"}
            </span>
          </div>
          <p className="body-label text-xs mt-0.5">
            Active enrollment breakdown across official TriFit operating plans
          </p>
        </div>

        {/* View mode toggle: [ All 6 Plans | By Tier ] */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg glass text-[11px] font-semibold self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("all")}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer font-bold ${
              viewMode === "all"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            All 6 Plans
          </button>
          <button
            type="button"
            onClick={() => setViewMode("tier")}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer font-bold ${
              viewMode === "tier"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            By Tier
          </button>
        </div>
      </div>

      {/* CHART & INTERACTIVE LEGEND CONTAINER */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 my-1">
        {/* DONUT COLUMN (DONUT SVG ON TOP + TELEMETRY CARD BELOW) */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          {/* DONUT SVG WITH CLEAN CENTER HOLE */}
          <div className="relative w-[210px] h-[210px] shrink-0 flex items-center justify-center">
            <svg
              viewBox="0 0 220 220"
              className="w-full h-full overflow-visible"
              role="img"
              aria-label="Subscription Tier Donut Chart"
            >
              <defs>
                <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background circular guide ring */}
              <circle
                cx={cx}
                cy={cy}
                r={(R + r) / 2}
                fill="none"
                stroke="var(--line)"
                strokeWidth={R - r}
                opacity="0.25"
              />

              {/* Donut Segments with Radial "Pop Outward" Hover Animation & Click Pinning */}
              {arcSegments.map(({ slice, pathD, tx, ty }) => {
                const isHovered = hoveredSliceId === slice.id;
                const isSelected = selectedSliceId === slice.id;
                const hasHover = hoveredSliceId !== null;

                return (
                  <g
                    key={slice.id}
                    transform={isHovered ? `translate(${tx.toFixed(2)}, ${ty.toFixed(2)})` : "translate(0, 0)"}
                    style={{
                      transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredSliceId(slice.id)}
                    onMouseLeave={() => setHoveredSliceId(null)}
                    onClick={() => setSelectedSliceId(slice.id)}
                    opacity={hasHover && !isHovered ? 0.42 : 1}
                  >
                    <path
                      d={pathD}
                      fill={slice.color}
                      stroke={isHovered || isSelected ? "var(--accent)" : "rgba(0,0,0,0.3)"}
                      strokeWidth={isHovered || isSelected ? 2.5 : 1}
                      style={{
                        filter: isHovered || isSelected
                          ? `drop-shadow(0 0 10px ${slice.color}cc) drop-shadow(0 6px 14px rgba(0,0,0,0.55))`
                          : "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                        transition: "filter 0.25s ease, stroke-width 0.25s ease, stroke 0.25s ease",
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* SIMPLE TELEMETRY BELOW THE DONUT (NO CARD BOX, CLEAN DISPLAY) */}
          <div className="flex flex-col items-center text-center mt-1 min-h-[72px] justify-center transition-all duration-200">
            {hoveredSlice ? (
              <div className="animate-in fade-in duration-150 flex flex-col items-center">
                <span
                  className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 shadow-xs"
                  style={{
                    background: hoveredSlice.color === "#FFFFFF" ? "#FFFFFF" : hoveredSlice.color,
                    color:
                      hoveredSlice.color === "#FFFFFF" ||
                      hoveredSlice.color === "#FFD60A" ||
                      hoveredSlice.color === "#FBBF24" ||
                      hoveredSlice.color === "#F59E0B"
                        ? "#0A0A0C"
                        : "#FFFFFF",
                  }}
                >
                  {hoveredSlice.shortName}
                </span>
                <div className="text-[28px] leading-tight font-black text-[var(--text)] font-mono tracking-tight my-0.5">
                  {hoveredSlice.percentage.toFixed(1)}%
                </div>
                <div className="text-[11px] font-semibold text-[var(--muted)] flex items-center gap-1.5 font-mono">
                  <span>{hoveredSlice.scaledCount.toLocaleString()} members</span>
                  <span>•</span>
                  <span className="text-[#F59E0B] font-bold">PKR {(hoveredSlice.pricePKR / 1000).toFixed(0)}k</span>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-150 flex flex-col items-center">
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--accent)]">
                  Total Active
                </span>
                <div className="text-[32px] leading-none text-[var(--text)] font-black my-1 font-mono tracking-tight">
                  {totalMembersCount.toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-[var(--muted)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span>Active Members across Plans</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE LEGEND (Two-way cross-highlighting on hover & click) */}
        <div className="flex-1 w-full flex flex-col gap-1 min-w-0 max-h-[310px] overflow-y-auto pr-1">
          {activeSlices.map((slice) => {
            const isHovered = hoveredSliceId === slice.id;
            const isSelected = selectedSliceId === slice.id;
            const hasHover = hoveredSliceId !== null;

            return (
              <div
                key={slice.id}
                onMouseEnter={() => setHoveredSliceId(slice.id)}
                onMouseLeave={() => setHoveredSliceId(null)}
                onClick={() => setSelectedSliceId(slice.id)}
                className={`py-1.5 px-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 border ${
                  isHovered || isSelected
                    ? "bg-[var(--menu-hover)] border-[var(--accent)] shadow-sm scale-[1.01]"
                    : hasHover
                    ? "opacity-50 border-transparent hover:opacity-80"
                    : "border-transparent hover:bg-[var(--chip)]"
                }`}
              >
                {/* Color Dot & Title */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200 shadow-xs"
                    style={{
                      background: slice.color,
                      boxShadow: isHovered || isSelected ? `0 0 8px ${slice.color}` : "none",
                      transform: isHovered || isSelected ? "scale(1.25)" : "scale(1)",
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-[var(--text)] truncate">
                        {slice.name}
                      </span>
                      {slice.badge && (
                        <span className="text-[8.5px] px-1 py-0.2 rounded-full font-bold bg-[var(--chip)] text-[var(--accent)] shrink-0">
                          {slice.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[9.5px] text-[var(--muted)] font-mono flex items-center gap-1.5 leading-tight">
                      <span>PKR {slice.pricePKR.toLocaleString()}</span>
                      <span>•</span>
                      <span>PKR {slice.monthlyEquivalentPKR.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Percentage & Count Badge */}
                <div className="text-right shrink-0">
                  <div className="text-[11px] font-mono font-black text-[var(--text)]">
                    {slice.percentage.toFixed(1)}%
                  </div>
                  <div className="text-[9px] text-[var(--muted)] font-mono">
                    {slice.scaledCount.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER SUMMARY BAR */}
      <div className="pt-2.5 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Crown className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>TriFit Plus VIP: <strong>50%</strong></span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>TriFit Regular: <strong>50%</strong></span>
        </span>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
          100% Upfront Active
        </span>
      </div>
    </div>
  );
}
