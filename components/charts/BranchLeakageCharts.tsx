"use client";

import React, { useState } from "react";
import { AlertTriangle, TrendingDown, Users, UserX, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";

interface ChurnReason {
  id: string;
  reason: string;
  percentage: number;
  count: number;
  color: string;
}

const CHURN_REASONS: ChurnReason[] = [
  { id: "reloc", reason: "Relocation / Travel", percentage: 38, count: 182, color: "#F59E0B" },
  { id: "fin", reason: "Financial / Price Sensitivity", percentage: 27, count: 129, color: "#EF4444" },
  { id: "results", reason: "Plateaued / Poor Results", percentage: 19, count: 91, color: "#8B5CF6" },
  { id: "staff", reason: "Ignored by Staff / Coach Inattention", percentage: 16, count: 77, color: "#06B6D4" },
];

interface TrainerChurn {
  id: string;
  name: string;
  specialty: string;
  activeClients: number;
  cancellations: number;
  churnRate: number;
  status: "CRITICAL" | "ELEVATED" | "NOMINAL";
}

const TRAINER_CHURN_DATA: TrainerChurn[] = [
  { id: "t-1", name: "Coach Waleed Q.", specialty: "Strength & Hypertrophy", activeClients: 32, cancellations: 7, churnRate: 17.9, status: "CRITICAL" },
  { id: "t-2", name: "Coach Bilal Khan", specialty: "Stages RPM Cycling", activeClients: 45, cancellations: 6, churnRate: 11.8, status: "ELEVATED" },
  { id: "t-3", name: "Coach Hamza Tariq", specialty: "HYROX Conditioning", activeClients: 38, cancellations: 3, churnRate: 7.3, status: "NOMINAL" },
  { id: "t-4", name: "Coach Maria Ahmed", specialty: "Reformer Pilates", activeClients: 29, cancellations: 1, churnRate: 3.3, status: "NOMINAL" },
  { id: "t-5", name: "Coach Sarah Siddiqui", specialty: "Vinyasa Flow", activeClients: 26, cancellations: 0, churnRate: 1.2, status: "NOMINAL" },
];

interface BranchLeakage {
  branchId: string;
  name: string;
  lostMembers: number;
  leakageRate: number;
  mrrLostPKR: number;
}

const BRANCH_LEAKAGE_DATA: BranchLeakage[] = [
  { branchId: "luckyone", name: "LuckyOne Mall Karachi", lostMembers: 164, leakageRate: 5.8, mrrLostPKR: 1280000 },
  { branchId: "clifton", name: "Clifton Flagship Karachi", lostMembers: 138, leakageRate: 4.6, mrrLostPKR: 1140000 },
  { branchId: "ajtower", name: "AJ Tower Islamabad", lostMembers: 104, leakageRate: 4.1, mrrLostPKR: 890000 },
  { branchId: "seaview", name: "Seaview DHA Karachi", lostMembers: 73, leakageRate: 2.8, mrrLostPKR: 620000 },
];

export function BranchLeakageCharts() {
  const [activeReason, setActiveReason] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"TRAINERS" | "BRANCHES">("TRAINERS");

  // SVG Donut calculation
  const totalChurn = CHURN_REASONS.reduce((acc, r) => acc + r.count, 0);
  let accumulatedAngle = 0;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      {/* Left Column: Churn by Reason Interactive Donut (5 cols) */}
      <div className="lg:col-span-5 glass p-5 sm:p-6 rounded-2xl flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-500/15 text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="card-title text-[var(--text)]">Churn by Reason</h3>
            </div>
            <span className="admin-chip text-[11px] text-red-400 border-red-500/30">
              {totalChurn} Cancellations (30d)
            </span>
          </div>
          <p className="body-label text-xs mt-1 text-[var(--muted)]">
            Member exit interview telemetry across all 4 clubs
          </p>
        </div>

        {/* SVG Donut */}
        <div className="flex items-center justify-center py-2 relative">
          <svg className="w-44 h-44 -rotate-90 transform overflow-visible" viewBox="0 0 160 160">
            {CHURN_REASONS.map((item) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedAngle / 100) * circumference);
              accumulatedAngle += item.percentage;
              const isSelected = activeReason === item.id;

              return (
                <circle
                  key={item.id}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isSelected ? 18 : 14}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 8px ${item.color})` : "none",
                  }}
                  onMouseEnter={() => setActiveReason(item.id)}
                  onMouseLeave={() => setActiveReason(null)}
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">Top Leak</span>
            <span className="text-xl font-bold font-mono text-[var(--text)]">38%</span>
            <span className="text-[10px] text-[var(--accent)] font-semibold">Relocation</span>
          </div>
        </div>

        {/* Reason Legend List */}
        <div className="space-y-2 pt-2 border-t border-[var(--line)] text-xs">
          {CHURN_REASONS.map((item) => {
            const isSelected = activeReason === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveReason(item.id)}
                onMouseLeave={() => setActiveReason(null)}
                className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                  isSelected ? "bg-[var(--chip)] shadow-xs" : "hover:bg-[var(--card)]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-[var(--text)] truncate font-medium">{item.reason}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono">
                  <span className="text-[var(--muted)]">{item.count} users</span>
                  <span className="font-bold text-[var(--text)]">{item.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Trainer-Churn Correlation & Branch Leakage (7 cols) */}
      <div className="lg:col-span-7 glass p-5 sm:p-6 rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
                <Users className="w-4 h-4" />
              </span>
              <h3 className="card-title text-[var(--text)]">
                {activeView === "TRAINERS" ? "Trainer-Churn Correlation" : "Branch Leakage Comparison"}
              </h3>
            </div>
            <p className="body-label text-xs mt-1 text-[var(--muted)]">
              {activeView === "TRAINERS"
                ? "Flagging coach rosters with statistically high client cancellation rates"
                : "MRR and member leakage rate across the 4 flagship clubs"}
            </p>
          </div>

          {/* Toggle between views */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs">
            <button
              type="button"
              onClick={() => setActiveView("TRAINERS")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeView === "TRAINERS"
                  ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              Coaches
            </button>
            <button
              type="button"
              onClick={() => setActiveView("BRANCHES")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeView === "BRANCHES"
                  ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              Branches
            </button>
          </div>
        </div>

        {/* Content based on Active View */}
        {activeView === "TRAINERS" ? (
          <div className="space-y-3 py-1">
            {TRAINER_CHURN_DATA.map((t) => {
              const barColor =
                t.status === "CRITICAL"
                  ? "bg-red-500"
                  : t.status === "ELEVATED"
                  ? "bg-amber-500"
                  : "bg-emerald-500";

              return (
                <div key={t.id} className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--card-border)] transition-all">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text)]">{t.name}</span>
                      <span className="text-[11px] text-[var(--muted)]">({t.specialty})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[var(--muted)]">
                        {t.cancellations} cancels / {t.activeClients} clients
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold ${
                          t.status === "CRITICAL"
                            ? "bg-red-500/20 text-red-400"
                            : t.status === "ELEVATED"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {t.churnRate}% Churn
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-[var(--track)] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${Math.min(t.churnRate * 4, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3 py-1">
            {BRANCH_LEAKAGE_DATA.map((b) => (
              <div key={b.branchId} className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--card-border)] transition-all">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text)]">{b.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-red-400">
                      -PKR {(b.mrrLostPKR / 1000).toLocaleString()}k MRR
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-[var(--chip)] text-[var(--text)]">
                      {b.leakageRate}%
                    </span>
                  </div>
                </div>

                {/* Horizontal Bar */}
                <div className="w-full bg-[var(--track)] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-amber-500"
                    style={{ width: `${(b.leakageRate / 8) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actionable Footer */}
        <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AI recommendation: Reassign 14 at-risk clients under Coach Waleed to Coach Sarah.</span>
          </div>
          <button
            type="button"
            className="btn !py-1 !px-3 text-xs shrink-0 flex items-center gap-1.5"
            onClick={() => alert("Intervention triggered: At-risk members queued for VIP coaching review.")}
          >
            <span>Execute Reassignment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
