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

interface PlanCliffData {
  id: string;
  name: string;
  members: number;
  upfrontPKR: number;
  churnRate: number;
  cliffStage: string;
  status: "CRITICAL" | "ELEVATED" | "NOMINAL" | "ANCHOR";
}

const PLAN_CLIFF_DATA: PlanCliffData[] = [
  { id: "reg-3m", name: "TriFit Regular (3M)", members: 961, upfrontPKR: 52999, churnRate: 9.8, cliffStage: "Day-90 Drop-Off Cliff", status: "CRITICAL" },
  { id: "plus-3m", name: "TriFit Plus (3M)", members: 641, upfrontPKR: 65999, churnRate: 7.4, cliffStage: "Month 2 Plateau Risk", status: "CRITICAL" },
  { id: "reg-6m", name: "TriFit Regular (6M)", members: 824, upfrontPKR: 86999, churnRate: 4.1, cliffStage: "Mid-Tier Habitual", status: "ELEVATED" },
  { id: "plus-6m", name: "TriFit Plus (6M)", members: 712, upfrontPKR: 108999, churnRate: 3.2, cliffStage: "Consistent Routine", status: "NOMINAL" },
  { id: "reg-12m", name: "TriFit Regular (12M)", members: 1142, upfrontPKR: 122999, churnRate: 1.9, cliffStage: "High Annual Loyalty", status: "NOMINAL" },
  { id: "plus-12m", name: "TriFit Plus (12M) + PT Bundle", members: 844, upfrontPKR: 155999, churnRate: 0.6, cliffStage: "Near-Zero Churn Anchor", status: "ANCHOR" },
];

interface BranchLeakageChartsProps {
  reassignedWaleed?: boolean;
  onExecuteReassignment?: () => void;
  onActionClick?: (msg: string) => void;
}

export function BranchLeakageCharts({
  reassignedWaleed = false,
  onExecuteReassignment,
  onActionClick,
}: BranchLeakageChartsProps) {
  const [activeReason, setActiveReason] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"TRAINERS" | "BRANCHES" | "PLAN_CLIFFS">("TRAINERS");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const triggerAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
    if (onActionClick) onActionClick(msg);
  };

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
            <span className="admin-chip text-[11px] text-amber-400 border-amber-500/30">
              90-Day Cumulative Exits ({totalChurn})
            </span>
          </div>
          <p className="body-label text-xs mt-1 text-[var(--muted)]">
            90-Day member exit interview telemetry across all 4 clubs
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

        {/* Reason Legend List with Actionable Save Flows */}
        <div className="space-y-2 pt-2 border-t border-[var(--line)] text-xs">
          {actionNotice && (
            <div className="p-2 rounded-lg bg-[var(--chip)] border border-[var(--accent)] text-[11px] text-[var(--accent)] font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}

          {CHURN_REASONS.map((item) => {
            const isSelected = activeReason === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveReason(item.id)}
                onMouseLeave={() => setActiveReason(null)}
                className={`p-2 rounded-xl transition-all ${
                  isSelected ? "bg-[var(--chip)] shadow-xs" : "hover:bg-[var(--card)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-[var(--text)] truncate font-bold">{item.reason}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-[var(--muted)]">{item.count} users</span>
                    <span className="font-bold text-[var(--text)]">{item.percentage}%</span>
                  </div>
                </div>

                {/* Actionable Save/Down-Tier Flows */}
                {item.id === "fin" && (
                  <div className="mt-1.5 pt-1.5 border-t border-[var(--line)]/50 flex justify-end">
                    <button
                      type="button"
                      onClick={() => triggerAction("Dispatched Auto-Offer: Down-Tier to Regular 12M (PKR 10,250/mo) or JS Bank 30%-40% Partner Rate!")}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer"
                    >
                      Auto-Pitch Down-Tier (PKR 10,250/mo) or JS Bank 30%-40% Card →
                    </button>
                  </div>
                )}

                {item.id === "reloc" && (
                  <div className="mt-1.5 pt-1.5 border-t border-[var(--line)]/50 flex justify-end">
                    <button
                      type="button"
                      onClick={() => triggerAction("Dispatched Offer: Paid Membership Freeze or Islamabad/Karachi Passport Transfer!")}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border border-sky-500/30 transition-all cursor-pointer"
                    >
                      Pitch Karachi/Islamabad Passport Transfer or Paid Freeze →
                    </button>
                  </div>
                )}

                {item.id === "results" && (
                  <div className="mt-1.5 pt-1.5 border-t border-[var(--line)]/50 flex justify-end">
                    <button
                      type="button"
                      onClick={() => triggerAction("Dispatched Auto-Booking: Complimentary Forma 3D Scan + 3-Session PT Intro Bundle!")}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 transition-all cursor-pointer"
                    >
                      Auto-Book Free Forma 3D Scan + PT Bundle →
                    </button>
                  </div>
                )}

                {item.id === "staff" && (
                  <div className="mt-1.5 pt-1.5 border-t border-[var(--line)]/50 flex justify-end">
                    <button
                      type="button"
                      onClick={() => triggerAction("Dispatched Task: VIP Floor Concierge Check-in & Coach Reassignment Review!")}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all cursor-pointer"
                    >
                      Reassign Coach / VIP Floor Concierge Check-in →
                    </button>
                  </div>
                )}
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
                {activeView === "TRAINERS"
                  ? "Trainer-Churn Correlation"
                  : activeView === "BRANCHES"
                  ? "Branch Leakage Comparison"
                  : "Plan Cliff Leakage (3M vs 12M)"}
              </h3>
            </div>
            <p className="body-label text-xs mt-1 text-[var(--muted)]">
              {activeView === "TRAINERS"
                ? "Flagging coach rosters with statistically high client cancellation rates"
                : activeView === "BRANCHES"
                ? "MRR and member leakage rate across the 4 flagship clubs"
                : "Tracking Day-90 quarterly expiration cliff vs 12-month annual lock-in stability"}
            </p>
          </div>

          {/* Toggle between views */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs shrink-0 flex-wrap">
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
            <button
              type="button"
              onClick={() => setActiveView("PLAN_CLIFFS")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeView === "PLAN_CLIFFS"
                  ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              Plan Cliffs (3M vs 12M)
            </button>
          </div>
        </div>

        {/* Content based on Active View */}
        {activeView === "TRAINERS" ? (
          <div className="space-y-3 py-1">
            {TRAINER_CHURN_DATA.map((t) => {
              const isWaleed = t.id === "t-1";
              const isReassigned = isWaleed && reassignedWaleed;

              const barColor = isReassigned
                ? "bg-emerald-500"
                : t.status === "CRITICAL"
                ? "bg-red-500"
                : t.status === "ELEVATED"
                ? "bg-amber-500"
                : "bg-emerald-500";

              return (
                <div key={t.id} className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--card-border)] transition-all">
                  <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text)]">{t.name}</span>
                      <span className="text-[11px] text-[var(--muted)]">({t.specialty})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[var(--muted)]">
                        {isReassigned ? "0 cancels / 18 clients" : `${t.cancellations} cancels / ${t.activeClients} clients`}
                      </span>
                      {isReassigned ? (
                        <span className="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          14 Clients Reassigned • Audit Scheduled
                        </span>
                      ) : (
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
                      )}
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-[var(--track)] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${isReassigned ? 15 : Math.min(t.churnRate * 4, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeView === "BRANCHES" ? (
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
        ) : (
          /* PLAN CLIFFS (3M vs 12M) VIEW */
          <div className="space-y-2.5 py-1">
            {PLAN_CLIFF_DATA.map((p) => {
              const barColor =
                p.status === "CRITICAL"
                  ? "bg-red-500"
                  : p.status === "ELEVATED"
                  ? "bg-amber-500"
                  : p.status === "ANCHOR"
                  ? "bg-emerald-400"
                  : "bg-emerald-500";

              return (
                <div key={p.id} className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--card-border)] transition-all">
                  <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text)]">{p.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--chip)] text-[var(--muted)] font-medium">
                        {p.cliffStage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[var(--muted)]">
                        {p.members.toLocaleString()} members • PKR {(p.upfrontPKR / 1000).toFixed(0)}k upfront
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold ${
                          p.status === "CRITICAL"
                            ? "bg-red-500/20 text-red-400"
                            : p.status === "ELEVATED"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {p.churnRate}% Churn
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-[var(--track)] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${Math.min(p.churnRate * 8.5, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {/* 1-Click Executive Offer Dispatch */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
              <div className="text-xs">
                <span className="font-bold text-amber-300 block">3-Month Renewal Drop-Off Pool (1,602 Members)</span>
                <span className="text-[11px] text-[var(--muted)]">
                  7.4%–9.8% churn happens at Day 90. Locking into 12M cuts churn by 80% and protects upfront cash flow.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  triggerAction("Auto-Dispatched Day-60 Roll-In Offer to 1,602 Quarterly Members via WhatsApp & Member App!")
                }
                className="btn primary !py-1.5 !px-3 text-[11px] font-bold shrink-0 cursor-pointer shadow-sm"
              >
                Roll Day-60 Members to 12M →
              </button>
            </div>
          </div>
        )}

        {/* Actionable Footer */}
        <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {activeView === "PLAN_CLIFFS"
                ? "AI strategy: Converting 1,602 quarterly members to 12M annual lock-in unlocks +PKR 5.00M in protected MRR."
                : "AI recommendation: Reassign 14 at-risk clients under Coach Waleed to Coach Sarah."}
            </span>
          </div>
          {activeView === "PLAN_CLIFFS" ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1.5 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1,602 Members Monitored</span>
            </span>
          ) : reassignedWaleed ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1.5 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>14 Clients Reassigned (-PKR 490k Risk)</span>
            </span>
          ) : (
            <button
              type="button"
              className="btn primary !py-1.5 !px-3.5 text-xs shrink-0 flex items-center gap-1.5 cursor-pointer font-bold"
              onClick={onExecuteReassignment}
            >
              <span>Execute Reassignment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
