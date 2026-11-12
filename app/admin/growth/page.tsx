"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { BranchLeakageCharts } from "@/components/charts/BranchLeakageCharts";
import { SubscriptionGrowthTrajectoryChart } from "@/components/dashboard/SubscriptionGrowthTrajectoryChart";
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Zap,
  DollarSign,
  Users,
  Building2,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function GrowthAndLeakagePage() {
  const [retentionLift, setRetentionLift] = useState(2.0); // +2% lift
  const [atRiskMRRPKR, setAtRiskMRRPKR] = useState(3930000);
  const [reassignedWaleed, setReassignedWaleed] = useState(false);
  const [growthToast, setGrowthToast] = useState<string | null>(null);

  // Revenue simulator calculation
  const currentMRRPKR = 38600000;
  const simulatedLiftPKR = Math.round(currentMRRPKR * (retentionLift / 100) * 12);

  const handleExecuteReassignment = () => {
    setAtRiskMRRPKR(3440000);
    setReassignedWaleed(true);
    setGrowthToast("14 at-risk clients successfully reassigned from Coach Waleed to Coach Sarah! At-Risk MRR reduced by PKR 490,000.");
    setTimeout(() => setGrowthToast(null), 4000);
  };

  return (
    <AdminPortalLayout activeItem="growth">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
        {/* Toast Alert */}
        {growthToast && (
          <div className="p-3.5 rounded-2xl bg-[var(--chip)] border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>{growthToast}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[var(--accent)] text-[var(--on-accent)]">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h1 className="admin-page-title text-2xl font-bold tracking-tight text-[var(--text)]">
                Subscription Pipeline & Branch Leakage
              </h1>
            </div>
            <p className="body-label text-xs sm:text-sm mt-1 text-[var(--muted)]">
              Diagnostic telemetry: Member churn reasons, trainer correlation, and predictive retention simulation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="admin-chip text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              108% Target Trajectory Pace
            </span>
          </div>
        </div>

        {/* Top 4 Growth Telemetry KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Net Growth Velocity</div>
            <div className="text-2xl font-bold font-mono text-[var(--accent)] mt-1">+142 / mo</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">New joins outpace exits 2.4x</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Total Leakage Rate</div>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">4.2%</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5 font-mono">228 cancellations (30d)</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">At-Risk MRR Pool</div>
            <div className="text-2xl font-bold font-mono text-[var(--text)] mt-1">
              PKR {(atRiskMRRPKR / 1000000).toFixed(2)}M
            </div>
            <div className={`text-[10px] mt-0.5 font-semibold ${reassignedWaleed ? "text-emerald-400" : "text-amber-400"}`}>
              {reassignedWaleed ? "Reduced by PKR 490k (Audit Active)" : "Scanned by AI Retention Engine"}
            </div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Winback Success</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">34.6%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">79 recovered via WhatsApp</div>
          </div>
        </div>

        {/* SECTION 1: Branch Leakage Charts (Requested Donut + Horizontal Bar Combo) */}
        <BranchLeakageCharts
          reassignedWaleed={reassignedWaleed}
          onExecuteReassignment={handleExecuteReassignment}
          onActionClick={(msg) => {
            setGrowthToast(msg);
            setTimeout(() => setGrowthToast(null), 3500);
          }}
        />

        {/* SECTION 2: Annual Trajectory Chart */}
        <SubscriptionGrowthTrajectoryChart />

        {/* SECTION 3: Interactive Revenue Simulator */}
        <div className="glass p-6 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="card-title text-[var(--text)]">Retention Lift & Revenue Simulator</h3>
              </div>
              <p className="body-label text-xs mt-1 text-[var(--muted)]">
                Model financial returns across Seaview, Clifton, LuckyOne & AJ Tower by improving coach onboarding
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[var(--muted)] font-mono">Annualized Incremental ARR:</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                +PKR {(simulatedLiftPKR / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text)]">Target Retention Rate Lift:</span>
              <span className="font-bold font-mono text-[var(--accent)]">+{retentionLift.toFixed(1)}%</span>
            </div>

            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={retentionLift}
              onChange={(e) => setRetentionLift(parseFloat(e.target.value))}
              className="w-full h-2 bg-[var(--track)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />

            <div className="flex justify-between text-[10px] font-mono text-[var(--muted)]">
              <span>+0.5% (Modest)</span>
              <span>+2.0% (TriFit Standard)</span>
              <span>+6.0% (Elite Operations)</span>
            </div>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
