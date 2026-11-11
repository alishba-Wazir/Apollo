"use client";

import React, { useState, useMemo } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  TrendingUp,
  Coins,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldCheck,
  Sliders,
  RefreshCw,
  Clock,
  Send,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { BarGold, AreaTrend } from "@/components/charts";
import { BarGoldPoint, AreaTrendPoint } from "@/lib/data";

interface OverdueAccount {
  id: string;
  memberName: string;
  phone: string;
  branchName: string;
  branchCity: string;
  planName: string;
  amountPKR: number;
  daysOverdue: number;
  reminderStatus: "PENDING_APPROVAL" | "REMINDER_SENT" | "SETTLED";
}

export default function AdminRevenuePage() {
  // Baseline Network Telemetry
  const activeMembers = 3840;
  const baseMonthlyPricePKR = 14900; // PKR 14,900 / month
  const currentMRRPKR = 18450000; // PKR 18,450,000 / month

  // Interactive Pricing Slider State (PKR)
  const [simulatedPrice, setSimulatedPrice] = useState<number>(14900);
  const [activePlanTab, setActivePlanTab] = useState<string>("ALL");

  // Elasticity calculation engine (matches pricing-simulator.test.ts specifications)
  const simulationResults = useMemo(() => {
    const priceDelta = simulatedPrice - baseMonthlyPricePKR;
    const priceChangePct = priceDelta / baseMonthlyPricePKR;

    // Churn elasticity factor: 0.42% churn per 1% price hike, 0.15% retention gain per 1% discount
    const churnPct = priceDelta > 0 ? priceChangePct * 0.42 : priceChangePct * 0.15;
    const projectedMembers = Math.max(500, Math.round(activeMembers * (1 - churnPct)));
    const membersLost = activeMembers - projectedMembers;
    
    // Scale new price across existing MRR structure
    const priceMultiplier = simulatedPrice / baseMonthlyPricePKR;
    const projectedMRR = Math.round(currentMRRPKR * (projectedMembers / activeMembers) * priceMultiplier);
    const netMRRDelta = projectedMRR - currentMRRPKR;

    let verdict: { title: string; color: string; type: "positive" | "warning" | "neutral" } = {
      title: "Current Baseline Pricing",
      color: "text-accent",
      type: "neutral",
    };

    if (netMRRDelta > 500000 && membersLost < 200) {
      verdict = {
        title: "Optimal Margin Expansion",
        color: "text-positive",
        type: "positive",
      };
    } else if (membersLost > 350) {
      verdict = {
        title: "High Member Churn Risk",
        color: "text-negative",
        type: "warning",
      };
    } else if (netMRRDelta < 0) {
      verdict = {
        title: "Revenue Contraction Warning",
        color: "text-negative",
        type: "warning",
      };
    }

    return {
      projectedMembers,
      membersLost,
      projectedMRR,
      netMRRDelta,
      churnRatePct: +(churnPct * 100).toFixed(1),
      verdict,
    };
  }, [simulatedPrice]);

  // 1. MRR by Plan Bar Data (PKR)
  const mrrByPlanData: BarGoldPoint[] = [
    {
      label: "BLACK (Elite)",
      value: 8200000,
      formattedValue: "PKR 8.2M",
      sublabel: "1,140 Members",
      isPeak: true,
    },
    {
      label: "PLATINUM (Standard)",
      value: 6450000,
      formattedValue: "PKR 6.45M",
      sublabel: "1,520 Members",
    },
    {
      label: "FOUNDER (Annual)",
      value: 3800000,
      formattedValue: "PKR 3.8M",
      sublabel: "1,180 Members",
    },
  ];

  // 2. 6-Month Revenue Forecast Line (Historical + Predictive in PKR Millions)
  const revenueForecastData: AreaTrendPoint[] = [
    { label: "Aug (Act)", value: 16400000, formattedValue: "PKR 16.4M" },
    { label: "Sep (Act)", value: 17100000, formattedValue: "PKR 17.1M" },
    { label: "Oct (Act)", value: 17900000, formattedValue: "PKR 17.9M" },
    { label: "Nov (Cur)", value: 18450000, formattedValue: "PKR 18.45M" },
    { label: "Dec (Est)", value: 19300000, formattedValue: "PKR 19.3M" },
    { label: "Jan (Est)", value: 20100000, formattedValue: "PKR 20.1M" },
    { label: "Feb (Est)", value: 21000000, formattedValue: "PKR 21.0M" },
  ];

  // 3. Unpaid Balances List (Simulated / Seeded accounts in PKR)
  const [overdueAccounts, setOverdueAccounts] = useState<OverdueAccount[]>([
    {
      id: "od-1",
      memberName: "Hamza Shafqat",
      phone: "0300-8271044",
      branchName: "Seaview Flagship",
      branchCity: "Karachi",
      planName: "BLACK Elite",
      amountPKR: 24000,
      daysOverdue: 14,
      reminderStatus: "PENDING_APPROVAL",
    },
    {
      id: "od-2",
      memberName: "Daniyal Abbasi",
      phone: "0300-8271089",
      branchName: "AJ Tower",
      branchCity: "Islamabad",
      planName: "PLATINUM",
      amountPKR: 14900,
      daysOverdue: 22,
      reminderStatus: "REMINDER_SENT",
    },
    {
      id: "od-3",
      memberName: "Mariam Baig",
      phone: "0300-8271112",
      branchName: "Soha Mall",
      branchCity: "Islamabad",
      planName: "PLATINUM",
      amountPKR: 14900,
      daysOverdue: 8,
      reminderStatus: "PENDING_APPROVAL",
    },
    {
      id: "od-4",
      memberName: "Zainab Malik",
      phone: "0300-8271167",
      branchName: "Seaview Flagship",
      branchCity: "Karachi",
      planName: "BLACK Elite",
      amountPKR: 24000,
      daysOverdue: 35,
      reminderStatus: "REMINDER_SENT",
    },
    {
      id: "od-5",
      memberName: "Usman Ghani",
      phone: "0300-8271201",
      branchName: "AJ Tower",
      branchCity: "Islamabad",
      planName: "FOUNDER",
      amountPKR: 12500,
      daysOverdue: 5,
      reminderStatus: "PENDING_APPROVAL",
    },
  ]);

  const handleApproveReminder = (id: string) => {
    setOverdueAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, reminderStatus: "REMINDER_SENT" } : acc
      )
    );
  };

  const totalOverduePKR = overdueAccounts.reduce((sum, a) => sum + a.amountPKR, 0);

  return (
    <AdminPortalLayout activeItem="revenue">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Coins className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Revenue, MRR & Pricing Simulator</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                PKR Financial Telemetry
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Consolidated MRR, 6-month cashflow forecast, pricing elasticity modeling, and delinquent balance collections
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSimulatedPrice(baseMonthlyPricePKR)}
              className="btn !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Reset Simulator</span>
            </button>
          </div>
        </div>

        {/* 1. 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Monthly Recurring Revenue"
            value="PKR 18.45M"
            change="+12.4%"
            changeType="positive"
            variant="success"
            icon={<Coins className="w-4 h-4" />}
            secondaryText="MoM Velocity • 3 Clubs"
          />

          <StatCard
            title="Avg Revenue Per Member"
            value="PKR 4,804"
            change="+6.2%"
            changeType="positive"
            variant="warning"
            icon={<Users className="w-4 h-4" />}
            secondaryText="Blended baseline"
          />

          <StatCard
            title="Unpaid / Overdue Dues"
            value={`PKR ${(totalOverduePKR / 1000).toFixed(0)}k`}
            change={`${overdueAccounts.length} Pending`}
            changeType="negative"
            variant="alert"
            icon={<AlertTriangle className="w-4 h-4" />}
            secondaryText="Automated reminders active"
          />

          <StatCard
            title="Annual Run-Rate (ARR)"
            value="PKR 221.4M"
            change="Beat Target"
            changeType="positive"
            variant="info"
            icon={<TrendingUp className="w-4 h-4" />}
            secondaryText="Target: PKR 210M"
          />
        </div>

        {/* 2. Visual Charts: MRR by Plan Bars & 6-Month Forecast Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MRR by Plan Tier Bars */}
          <div className="lg:col-span-5">
            <BarGold
              title="MRR by Plan Tier"
              units="PKR Millions"
              subtitle="Monthly revenue contribution across plans"
              data={mrrByPlanData.map((d) => ({
                label: d.label.split(" ")[0],
                value: +(d.value / 1000000).toFixed(2),
                formattedValue: d.formattedValue,
                isPeak: d.label.includes("BLACK"),
              }))}
              isSample={true}
            />
          </div>

          {/* 6-Month Revenue Forecast Line */}
          <div className="lg:col-span-7">
            <AreaTrend
              title="6-Month Revenue & Expansion Forecast"
              units="PKR Millions"
              subtitle="Historical monthly revenue tracking with zero-baseline"
              data={revenueForecastData.map((d) => ({
                label: d.label.split(" ")[0],
                value: +(d.value / 1000000).toFixed(2),
                formattedValue: d.formattedValue,
              }))}
              isSample={true}
            />
          </div>
        </div>

        {/* 3. Interactive Pricing Slider & Churn Elasticity Engine */}
        <div className="glass-panel p-6 border border-border space-y-6 bg-accent/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-accent" />
                <h3 className="text-[17px] font-[800] text-text">
                  Dynamic Pricing Slider & Churn Elasticity Simulator
                </h3>
              </div>
              <p className="text-[12.5px] text-text-muted mt-1 max-w-2xl">
                Simulate adjusting standard membership dues across all clubs. Live mathematical feedback computes predicted member attrition, net MRR expansion or loss, and margin feasibility.
              </p>
            </div>

            {/* Verdict Badge */}
            <div className="px-3 py-1.5 rounded-[12px] bg-glass border border-border flex items-center gap-2">
              <span className="text-[11px] font-[600] text-text-muted">Algorithm Verdict:</span>
              <span className={`text-[12.5px] font-[800] ${simulationResults.verdict.color}`}>
                {simulationResults.verdict.title}
              </span>
            </div>
          </div>

          {/* The Slider Control */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-[600] text-text-muted">Adjust Monthly Price:</span>
              <span className="text-[22px] font-[900] text-accent tracking-tight">
                PKR {simulatedPrice.toLocaleString()} / mo
              </span>
            </div>

            <input
              type="range"
              min={10000}
              max={25000}
              step={500}
              value={simulatedPrice}
              onChange={(e) => setSimulatedPrice(Number(e.target.value))}
              className="w-full h-3 bg-border rounded-lg appearance-none cursor-pointer accent-[#FFD91C]"
            />

            <div className="flex items-center justify-between text-[11px] text-text-muted font-medium">
              <span>PKR 10,000 (Discount)</span>
              <span className="text-text font-bold">Baseline: PKR 14,900</span>
              <span>PKR 25,000 (Premium Surge)</span>
            </div>
          </div>

          {/* Simulation Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Output 1: Projected MRR */}
            <div className="p-4 rounded-[16px] bg-glass border border-border flex flex-col justify-between">
              <span className="text-[11.5px] font-[700] text-text-muted uppercase tracking-wider">
                Projected Monthly MRR
              </span>
              <div className="text-[26px] font-[900] text-text my-1">
                PKR {(simulationResults.projectedMRR / 1000000).toFixed(2)}M
              </div>
              <div className="flex items-center gap-1.5 text-[11.5px]">
                {simulationResults.netMRRDelta >= 0 ? (
                  <span className="text-positive font-bold flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +PKR {(simulationResults.netMRRDelta / 1000).toFixed(0)}k / mo
                  </span>
                ) : (
                  <span className="text-negative font-bold flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    -PKR {Math.abs(Math.round(simulationResults.netMRRDelta / 1000))}k / mo
                  </span>
                )}
                <span className="text-text-muted">vs current</span>
              </div>
            </div>

            {/* Output 2: Members Lost (Attrition) */}
            <div className="p-4 rounded-[16px] bg-glass border border-border flex flex-col justify-between">
              <span className="text-[11.5px] font-[700] text-text-muted uppercase tracking-wider">
                Projected Member Churn
              </span>
              <div className="text-[26px] font-[900] text-text my-1">
                {simulationResults.membersLost > 0 ? (
                  <span className="text-negative">-{simulationResults.membersLost} Members</span>
                ) : simulationResults.membersLost < 0 ? (
                  <span className="text-positive">+{Math.abs(simulationResults.membersLost)} Members</span>
                ) : (
                  <span className="text-text">0 Attrition</span>
                )}
              </div>
              <span className="text-[11.5px] text-text-muted">
                {simulationResults.churnRatePct}% predicted churn velocity
              </span>
            </div>

            {/* Output 3: Remaining Active Members */}
            <div className="p-4 rounded-[16px] bg-glass border border-border flex flex-col justify-between">
              <span className="text-[11.5px] font-[700] text-text-muted uppercase tracking-wider">
                Retained Membership Base
              </span>
              <div className="text-[26px] font-[900] text-accent my-1">
                {simulationResults.projectedMembers.toLocaleString()} Members
              </div>
              <span className="text-[11.5px] text-text-muted">
                From {activeMembers.toLocaleString()} starting cohort
              </span>
            </div>
          </div>
        </div>

        {/* 4. Unpaid Balances Matrix & Collections Table */}
        <div className="glass-panel p-5 border border-border space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent" />
                <h3 className="text-[16px] font-[800] text-text">
                  Delinquent Accounts & Unpaid Dues Management
                </h3>
              </div>
              <p className="text-[12.5px] text-text-muted mt-0.5">
                Outstanding dues tracking across all clubs with 1-click manager payment reminder approvals.
              </p>
            </div>

            <div className="text-[11.5px] text-text-muted bg-glass px-3 py-1.5 rounded-[11px] border border-border">
              Total Overdue: <strong className="text-accent font-bold">PKR {totalOverduePKR.toLocaleString()}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[12px] font-[600] text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-3">Member & Contact</th>
                  <th className="py-3 px-3">Branch Location</th>
                  <th className="py-3 px-3">Plan Tier</th>
                  <th className="py-3 px-3 text-right">Overdue Dues</th>
                  <th className="py-3 px-3 text-center">Days Overdue</th>
                  <th className="py-3 px-3 text-center">Outreach Status</th>
                  <th className="py-3 px-3 text-right">Manager Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-[13.5px]">
                {overdueAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-glass/80 transition-colors">
                    {/* Name */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-[700] text-text block">{account.memberName}</span>
                        <span className="text-[11px] text-text-muted">{account.phone}</span>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-[600] text-text">{account.branchName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent border border-accent/30">
                          {account.branchCity}
                        </span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-3 font-[500] text-text-muted">
                      {account.planName}
                    </td>

                    {/* Amount in PKR */}
                    <td className="py-3 px-3 text-right font-[700] text-accent">
                      PKR {account.amountPKR.toLocaleString()}
                    </td>

                    {/* Days Overdue */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-[8px] text-[11px] font-[700] ${
                          account.daysOverdue > 30
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : account.daysOverdue > 15
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-glass text-text-muted border border-border"
                        }`}
                      >
                        {account.daysOverdue} days
                      </span>
                    </td>

                    {/* Outreach Status */}
                    <td className="py-3 px-3 text-center">
                      {account.reminderStatus === "REMINDER_SENT" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-[700] text-positive bg-positive/10 px-2 py-0.5 rounded border border-positive/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Dispatched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-[600] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      {account.reminderStatus === "PENDING_APPROVAL" ? (
                        <button
                          onClick={() => handleApproveReminder(account.id)}
                          className="btn-primary text-[11px] py-1 px-2.5 inline-flex items-center gap-1 font-[700]"
                        >
                          <Send className="w-3 h-3" />
                          <span>Approve SMS</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-text-muted">Logged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Payment Security & Zero Card Storage Notice */}
        <div className="glass-panel p-4 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-[700] text-text">
                Payment Gateway & Security Compliance
              </h4>
              <p className="text-[12px] text-text-muted mt-0.5">
                Bank-grade 256-bit encryption. FBR & SRB POS integration certified. All financial collections and automated reminders follow human-in-the-loop validation with audit trail logging.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-[700] px-2.5 py-1 rounded bg-accent/15 text-accent border border-accent/30 shrink-0">
            PCI-DSS Certified
          </span>
        </div>
      </div>
    </AdminPortalLayout>
  );
}