"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Clock,
  Flame,
  Users,
  BrainCircuit,
  Coins,
} from "lucide-react";

interface ExecutiveSelfFundingSimulatorProps {
  className?: string;
}

export function ExecutiveSelfFundingSimulator({ className = "" }: ExecutiveSelfFundingSimulatorProps) {
  // Live Cohort Sliders (default calibrated to the TriFit network)
  const [churnSaveRate, setChurnSaveRate] = useState<number>(35); // 35% of 294 at-risk members
  const [upgradeRate, setUpgradeRate] = useState<number>(20); // 20% of 1,602 3-Month members
  const [ptUpsellRate, setPtUpsellRate] = useState<number>(18); // 18% of 810 plateaued members

  // Static Live Cohorts from TriFit Flagship Network
  const AT_RISK_COHORT = 294; // Members absent > 14 days
  const THREE_MONTH_COHORT = 1602; // Members on 3M plans
  const PLATEAUED_COHORT = 810; // Members with zero bio-scan progress

  // Pricing constants (PKR)
  const AVG_ANNUAL_DUES_MONTHLY = 10250; // PKR 122,999 / 12
  const NET_UPGRADE_CASH = 80000; // Net upfront cash collected on 3M -> 12M rollover
  const PT_PACK_VALUE = 48000; // 12-session PT pack value
  const APOLLO_MONTHLY_COST = 400000; // PKR 400,000 / month

  // Calculations
  const metrics = useMemo(() => {
    // 1. Churn Recovery Value (Monthly)
    const membersSaved = Math.round((churnSaveRate / 100) * AT_RISK_COHORT);
    const churnSavedPKR = Math.round(membersSaved * AVG_ANNUAL_DUES_MONTHLY * 12 / 12); // monthly dues protected
    const annualizedChurnSavedPKR = membersSaved * 122999;

    // 2. 3M -> 12M Upgrade Acceleration (Upfront Cash Normalized Monthly)
    const membersUpgraded = Math.round((upgradeRate / 100) * THREE_MONTH_COHORT);
    const upgradeCashTotal = membersUpgraded * NET_UPGRADE_CASH;
    const upgradeMonthlyImpact = Math.round(upgradeCashTotal / 12);

    // 3. Plateau-to-PT Upsells
    const ptClientsConverted = Math.round((ptUpsellRate / 100) * PLATEAUED_COHORT);
    const ptCashTotal = ptClientsConverted * PT_PACK_VALUE;
    const ptMonthlyImpact = Math.round(ptCashTotal / 12);

    // Total Monthly AI Impact
    const totalMonthlyImpactPKR = churnSavedPKR + upgradeMonthlyImpact + ptMonthlyImpact;
    // Daily velocity
    const dailyVelocityPKR = Math.max(1, totalMonthlyImpactPKR / 30);
    // Days to pay for Apollo
    const daysToBreakeven = (APOLLO_MONTHLY_COST / dailyVelocityPKR).toFixed(1);
    // Net ROI
    const roiMultiplier = (totalMonthlyImpactPKR / APOLLO_MONTHLY_COST).toFixed(1);

    return {
      membersSaved,
      churnSavedPKR,
      annualizedChurnSavedPKR,
      membersUpgraded,
      upgradeCashTotal,
      upgradeMonthlyImpact,
      ptClientsConverted,
      ptCashTotal,
      ptMonthlyImpact,
      totalMonthlyImpactPKR,
      dailyVelocityPKR,
      daysToBreakeven,
      roiMultiplier,
    };
  }, [churnSaveRate, upgradeRate, ptUpsellRate]);

  return (
    <div
      className={`glass rounded-2xl p-5 sm:p-6 border border-[var(--accent)]/30 relative overflow-hidden shadow-2xl ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(7, 8, 11, 0.95) 40%, rgba(5, 6, 8, 0.98) 100%)",
      }}
    >
      {/* Background Radial Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--line)] relative z-10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-1.5 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] font-black text-xs flex items-center gap-1 shadow-md">
              <Sparkles className="w-4 h-4" />
              <span>CEO SELF-FUNDING SIMULATOR</span>
            </span>
            <span className="admin-chip !py-0.5 !px-2.5 text-xs text-emerald-400 border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry Calibrated
            </span>
            <span className="text-xs text-[var(--muted)] font-mono">
              Apollo Subscription: <strong>PKR 400,000 / mo</strong>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--text)] tracking-tight mt-1.5 flex items-center gap-2">
            <span>Proof of Value: Apollo Self-Funds in</span>
            <span className="text-[var(--accent)] underline decoration-[var(--accent)]/40 font-mono">
              {metrics.daysToBreakeven} Days
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {metrics.roiMultiplier}x Net ROI
            </span>
          </h2>
          <p className="body-label text-xs mt-0.5 text-[var(--muted)] max-w-2xl">
            Simulate cash recovery across TriFit's 3 priority subscriber pools: 14+ day dormant members, 3-Month renewal rollovers, and Forma 3D bio-scan plateaus.
          </p>
        </div>

        {/* Live Top Summary Card */}
        <div className="flex items-center gap-3 bg-[var(--card)]/90 border border-[var(--line)] rounded-xl p-3 shrink-0 backdrop-blur-md">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">
              Projected Monthly AI Lift
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 leading-none mt-0.5">
              +PKR {(metrics.totalMonthlyImpactPKR / 1000000).toFixed(2)}M
              <span className="text-xs text-[var(--muted)] font-normal">/mo</span>
            </div>
            <div className="text-[10px] text-[var(--accent)] font-mono mt-0.5">
              PKR {(metrics.dailyVelocityPKR / 1000).toFixed(0)}k cash velocity / day
            </div>
          </div>
          <Link
            href="/admin/brain"
            className="btn primary !h-[42px] !px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
          >
            <span>Deploy AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3 Interactive Sliders & Output Cohort Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 relative z-10">
        {/* POOL 1: 14-DAY ABSENT MEMBERS (294 AT-RISK) */}
        <div className="p-4 rounded-xl bg-[var(--card)]/80 border border-[var(--line)] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-red-400" />
                <span>14+ Day Absent Churn</span>
              </span>
              <span className="text-[10.5px] font-mono text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">
                294 Pool
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-1">
              Automated WhatsApp incentive triggers with personalized coach outreach.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--muted)]">Recovery Rate:</span>
              <span className="text-[var(--accent)] font-bold">{churnSaveRate}% ({metrics.membersSaved} saved)</span>
            </div>
            <input
              type="range"
              min="10"
              max="65"
              step="5"
              value={churnSaveRate}
              onChange={(e) => setChurnSaveRate(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[var(--track)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>

          <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--muted)]">Protected Value:</span>
            <span className="text-emerald-400 font-bold">+PKR {(metrics.annualizedChurnSavedPKR / 1000000).toFixed(2)}M/yr</span>
          </div>
        </div>

        {/* POOL 2: 3-MONTH TO 12-MONTH ROLLOVERS (1,602 POOL) */}
        <div className="p-4 rounded-xl bg-[var(--card)]/80 border border-[var(--line)] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>3M → 12M Upgrade Rollover</span>
              </span>
              <span className="text-[10.5px] font-mono text-[var(--accent)] font-bold bg-[var(--accent)]/10 px-2 py-0.5 rounded">
                1,602 Pool
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-1">
              Roll Month-2 active members into 12M plans to lock retention and collect upfront cash.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--muted)]">Upgrade Conversion:</span>
              <span className="text-[var(--accent)] font-bold">{upgradeRate}% ({metrics.membersUpgraded} upgraded)</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="5"
              value={upgradeRate}
              onChange={(e) => setUpgradeRate(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[var(--track)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>

          <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--muted)]">Upfront Cash Added:</span>
            <span className="text-emerald-400 font-bold">+PKR {(metrics.upgradeCashTotal / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        {/* POOL 3: FORMA 3D PLATEAU-TO-PT UPSELL (810 POOL) */}
        <div className="p-4 rounded-xl bg-[var(--card)]/80 border border-[var(--line)] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                <span>Forma 3D "Plateau-to-PT"</span>
              </span>
              <span className="text-[10.5px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                810 Pool
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-1">
              Members with zero bio-scan progress targeted with 1-on-1 coach packages.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--muted)]">PT Pack Uptake:</span>
              <span className="text-cyan-400 font-bold">{ptUpsellRate}% ({metrics.ptClientsConverted} clients)</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="3"
              value={ptUpsellRate}
              onChange={(e) => setPtUpsellRate(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[var(--track)] rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--muted)]">PT Revenue Generated:</span>
            <span className="text-emerald-400 font-bold">+PKR {(metrics.ptCashTotal / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>

      {/* Footer Executive Bottom Line Bar */}
      <div className="mt-4 pt-3.5 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[var(--muted)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            CEO Strategic Formula: <strong>PKR {metrics.totalMonthlyImpactPKR.toLocaleString()}</strong> monthly impact vs <strong>PKR 400,000</strong> Apollo fee = <strong>{metrics.daysToBreakeven} Days to Pay Off</strong>.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/growth"
            className="text-[var(--accent)] hover:underline font-mono text-[11px] flex items-center gap-1 font-bold"
          >
            <span>Inspect Churn Leakage Telemetry</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
