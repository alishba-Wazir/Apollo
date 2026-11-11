"use client";

import React, { useEffect, useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  Users2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ArrowRight,
  Clock,
  MessageSquare,
  Activity,
  HeartPulse,
  Briefcase,
  Plane,
  Frown,
  Coins,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { BarGold, AreaTrend, Dial } from "@/components/charts";
import { BarGoldPoint, AreaTrendPoint } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";

interface BranchWinbackMetric {
  id: string;
  name: string;
  city: string;
  type: string;
  flaggedAbsent: number;
  approvedDispatches: number;
  deliveredCount: number;
  repliesReceived: number;
  broughtBackCount: number;
  recoveryRate: number;
  preservedRevenuePKR: number;
  medicalHandovers: number;
}

export default function AdminWinbackResultsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  useEffect(() => {
    // Simulated load matching network data
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }));
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Multi-branch Win-back telemetry (Sample / Seeded data across network)
  const branchMetrics: BranchWinbackMetric[] = [
    {
      id: "branch-seaview",
      name: "TRI FIT Seaview Flagship",
      city: "Karachi",
      type: "Flagship Club",
      flaggedAbsent: 132,
      approvedDispatches: 128,
      deliveredCount: 126,
      repliesReceived: 104,
      broughtBackCount: 98,
      recoveryRate: 74.2,
      preservedRevenuePKR: 1764000,
      medicalHandovers: 7,
    },
    {
      id: "branch-ajtower",
      name: "TRI FIT AJ Tower",
      city: "Islamabad",
      type: "Premium Club",
      flaggedAbsent: 94,
      approvedDispatches: 90,
      deliveredCount: 89,
      repliesReceived: 73,
      broughtBackCount: 68,
      recoveryRate: 72.3,
      preservedRevenuePKR: 1224000,
      medicalHandovers: 5,
    },
    {
      id: "branch-sohamall",
      name: "TRI FIT Soha Mall",
      city: "Islamabad",
      type: "Boutique Club",
      flaggedAbsent: 68,
      approvedDispatches: 66,
      deliveredCount: 65,
      repliesReceived: 56,
      broughtBackCount: 52,
      recoveryRate: 76.5,
      preservedRevenuePKR: 936000,
      medicalHandovers: 4,
    },
  ];

  // Aggregated Network Totals
  const totalBroughtBack = branchMetrics.reduce((acc, b) => acc + b.broughtBackCount, 0); // 218
  const totalFlagged = branchMetrics.reduce((acc, b) => acc + b.flaggedAbsent, 0); // 294
  const totalPreservedPKR = branchMetrics.reduce((acc, b) => acc + b.preservedRevenuePKR, 0); // PKR 3,924,000
  const avgRecoveryRate = +(
    (totalBroughtBack / totalFlagged) * 100
  ).toFixed(1); // 74.1%
  const totalMedicalHandovers = branchMetrics.reduce((acc, b) => acc + b.medicalHandovers, 0); // 16

  // 1. Members Brought Back per Branch (Gradient Bars)
  const membersBroughtBackBars: BarGoldPoint[] = [
    {
      label: "Seaview (KHI)",
      value: 98,
      formattedValue: "98 mbrs",
      sublabel: "74.2% rate",
    },
    {
      label: "AJ Tower (ISB)",
      value: 68,
      formattedValue: "68 mbrs",
      sublabel: "72.3% rate",
    },
    {
      label: "Soha Mall (ISB)",
      value: 52,
      formattedValue: "52 mbrs",
      sublabel: "76.5% rate",
    },
  ];

  // 2. Reasons Members Were Away (Bars / Breakdown)
  const awayReasons = [
    {
      label: "Work & Long Hours",
      count: 82,
      percentage: 37.6,
      icon: <Briefcase className="w-4 h-4 text-accent" />,
      action: "Flexible off-peak passes suggested",
    },
    {
      label: "Travel & Vacation",
      count: 54,
      percentage: 24.8,
      icon: <Plane className="w-4 h-4 text-accent" />,
      action: "Courtesy account freeze offered",
    },
    {
      label: "Boredom & Motivation",
      count: 41,
      percentage: 18.8,
      icon: <Frown className="w-4 h-4 text-accent" />,
      action: "Complimentary trainer refresh booked",
    },
    {
      label: "Cost & Budget",
      count: 25,
      percentage: 11.5,
      icon: <Coins className="w-4 h-4 text-accent" />,
      action: "Downgrade or loyalty discount review",
    },
    {
      label: "Injury & Physical Pain",
      count: 16,
      percentage: 7.3,
      icon: <HeartPulse className="w-4 h-4 text-negative" />,
      action: "Mandatory human floor handover (no AI advice)",
      isMedical: true,
    },
  ];

  // 3. Line Chart: Brought-Back Rate Trend Over 6 Months (Percentage)
  const broughtBackRateTrend: AreaTrendPoint[] = [
    { label: "Jun", value: 58, formattedValue: "58.0%" },
    { label: "Jul", value: 62, formattedValue: "62.5%" },
    { label: "Aug", value: 66, formattedValue: "66.0%" },
    { label: "Sep", value: 69, formattedValue: "69.4%" },
    { label: "Oct", value: 72, formattedValue: "72.1%" },
    { label: "Nov (Est)", value: 74, formattedValue: "74.1%" },
  ];

  return (
    <AdminPortalLayout activeItem="winback-results">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Users2 className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Win-back AI Enterprise Results & Recovery</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                100% Human Approved
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Member recovery analytics across Karachi and Islamabad clubs with categorized absence root causes
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin/audit"
              className="btn !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Outreach Audit Log</span>
            </Link>
          </div>
        </div>

        {/* 1. 4 Primary KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Members Brought Back"
            value={totalBroughtBack}
            unit={`/ ${totalFlagged}`}
            change="Verified"
            changeType="positive"
            variant="success"
            icon={<CheckCircle2 className="w-4 h-4" />}
            secondaryText="Turnstile check-ins"
          />

          <StatCard
            title="Recovery Success Rate"
            value={avgRecoveryRate}
            unit="%"
            change="+16.1%"
            changeType="positive"
            variant="warning"
            icon={<TrendingUp className="w-4 h-4" />}
            secondaryText="Goal: 70% (Exceeded)"
          />

          <StatCard
            title="Revenue Preserved (PKR)"
            value="PKR 3.92M"
            change="PKR 18k / mbr"
            changeType="positive"
            variant="default"
            icon={<Coins className="w-4 h-4" />}
            secondaryText="Retained member LTV"
          />

          <StatCard
            title="Medical Floor Handovers"
            value={totalMedicalHandovers}
            change="100% Compliant"
            changeType="positive"
            variant="info"
            icon={<HeartPulse className="w-4 h-4" />}
            secondaryText="Human escort protocol"
          />
        </div>

        {/* 2. Primary Visuals: Members Brought Back per Branch & Reasons Members Were Away */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Members Brought Back per Branch Bars */}
          <div className="lg:col-span-5">
            <BarGold
              title="Members Brought Back per Branch"
              units="Members"
              subtitle="Previously absent members re-entering clubs via Apollo AI"
              data={membersBroughtBackBars.map((b) => ({
                label: b.label.replace("TRI FIT ", "").split(" ")[0],
                value: b.value,
                formattedValue: `${b.value} members`,
                isPeak: b.label.includes("Seaview"),
              }))}
              isSample={true}
            />
          </div>

          {/* Reasons Members Were Away (Bars / Category Distribution) */}
          <div className="lg:col-span-7 glass-panel p-5 border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-[700] text-text">Reasons Members Were Away</h3>
    
                </div>
                <span className="text-[11.5px] font-[600] text-text-muted">
                  Gemini Tagged Replies ({totalBroughtBack} Responses)
                </span>
              </div>
              <p className="text-[12.5px] text-text-muted mb-4">
                Categorized root causes identified in member WhatsApp responses and corresponding operational counter-measures.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {awayReasons.map((reason, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="font-[600] text-text flex items-center gap-2">
                      {reason.icon}
                      <span>{reason.label}</span>
                      {reason.isMedical && (
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-negative/15 text-negative border border-negative/30">
                          SAFETY RULE
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11.5px] text-text-muted">{reason.count} members</span>
                      <span className="font-[700] text-text w-12 text-right">
                        {reason.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar with 9px 9px 3px 3px curvature */}
                  <div className="w-full h-3 bg-border/40 rounded-[9px_9px_3px_3px] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        reason.isMedical
                          ? "bg-gradient-to-r from-red-500 to-rose-600"
                          : "bg-gradient-to-r from-[#FFD91C] to-[#D4B000]"
                      }`}
                      style={{
                        width: `${reason.percentage}%`,
                        borderRadius: "9px 9px 3px 3px",
                      }}
                    />
                  </div>

                  <span className="text-[10.5px] text-text-muted/80 block pl-6">
                    ↳ Countermeasure: {reason.action}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11.5px] text-text-muted">
              <span>Primary driver: Work & Workload (37.6%)</span>
              <span className="text-positive font-semibold">100% Addressed</span>
            </div>
          </div>
        </div>

        {/* 3. Line Chart: Brought-Back Rate 6-Month Trajectory */}
        <div>
          <AreaTrend
            title="Brought-Back Rate Progression (6-Month Trajectory)"
            units="% Recovery"
            subtitle="Monthly member recovery rate tracking with zero baseline"
            data={broughtBackRateTrend.map((d) => ({
              label: d.label,
              value: d.value,
              formattedValue: `${d.value}% recovery`,
            }))}
            isSample={true}
          />
        </div>

        {/* 4. Cross-Branch Performance Matrix Table */}
        <div className="glass-panel p-5 border border-border space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-[800] text-text flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent" />
                  Branch Win-Back Performance Matrix
                </h2>
  
              </div>
              <p className="text-[12.5px] text-text-muted mt-0.5">
                Full telemetry from initial absenteeism detection to manager approval, WhatsApp delivery, and physical turnstile return.
              </p>
            </div>

            <div className="text-[11.5px] text-text-muted bg-glass px-3 py-1.5 rounded-[11px] border border-border">
              Total Revenue Saved: <strong className="text-text font-bold">PKR 3,924,000</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[12px] font-[600] text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-3">Branch & City</th>
                  <th className="py-3 px-3 text-right">Flagged</th>
                  <th className="py-3 px-3 text-right">Approved</th>
                  <th className="py-3 px-3 text-right">Delivered</th>
                  <th className="py-3 px-3 text-right">Replies</th>
                  <th className="py-3 px-3 text-right">Brought Back</th>
                  <th className="py-3 px-3 text-center">Recovery %</th>
                  <th className="py-3 px-3 text-right">Revenue Saved</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-[13.5px]">
                {branchMetrics.map((b) => (
                  <tr key={b.id} className="hover:bg-glass/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[11px] bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-[700] text-text">{b.name}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                              {b.city}
                            </span>
                          </div>
                          <span className="text-[11.5px] text-text-muted block mt-0.5">
                            {b.type} • {b.medicalHandovers} medical handovers
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-[600] text-text">
                      {b.flaggedAbsent}
                    </td>

                    <td className="py-3.5 px-3 text-right font-[600] text-accent">
                      {b.approvedDispatches}
                      <span className="block text-[10.5px] text-text-muted font-normal">
                        100% human
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-[500] text-text">
                      {b.deliveredCount}
                    </td>

                    <td className="py-3.5 px-3 text-right font-[600] text-text">
                      {b.repliesReceived}
                      <span className="block text-[10.5px] text-text-muted font-normal">
                        {((b.repliesReceived / b.deliveredCount) * 100).toFixed(0)}% resp
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-[700] text-positive">
                      {b.broughtBackCount}
                      <span className="block text-[10.5px] text-text-muted font-normal">
                        turnstile verified
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-[13px] font-[800] text-positive">
                          {b.recoveryRate}%
                        </span>
                        <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${b.recoveryRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-[700] text-text">
                      PKR {(b.preservedRevenuePKR / 1000000).toFixed(2)}M
                      <span className="block text-[10.5px] text-text-muted font-normal">
                        PKR {b.preservedRevenuePKR.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href="/branch/winback"
                        className="btn-secondary text-[11.5px] py-1.5 px-2.5 inline-flex items-center gap-1"
                      >
                        <span>Inspect Branch</span>
                        <ArrowRight className="w-3 h-3 text-accent" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Guardrail Integrity & Compliance Banner */}
        <div className="glass-panel p-4 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-[700] text-text">
                APOLLO Win-Back AI Guardrails & Human-in-the-Loop Active
              </h4>
              <p className="text-[12px] text-text-muted mt-0.5">
                Auto-send is disabled network-wide. Every message draft requires explicit manager review. Quiet hours (22:00–07:00 PKT) and prayer buffers are strictly respected. Pain or injury triggers mandatory physical staff referral with zero AI advice.
              </p>
            </div>
          </div>
          <Link
            href="/admin/audit"
            className="btn-primary text-[11.5px] py-1.5 px-3 shrink-0 whitespace-nowrap"
          >
            Audit History
          </Link>
        </div>
      </div>
    </AdminPortalLayout>
  );
}