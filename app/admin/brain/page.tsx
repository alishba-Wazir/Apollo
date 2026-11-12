"use client";

import React, { useState, useEffect } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  BrainCircuit,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Clock,
  Send,
  Zap,
  TrendingUp,
  Activity,
  HeartPulse,
  UserCheck,
  Check,
  Moon,
  Gift,
  Flame,
  Award,
  Layers,
  Phone,
  BarChart3,
  Calendar,
  ScanLine,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatCard } from "@/components/ui/StatCard";
import { RadarRisk, FunnelSteps } from "@/components/charts";

interface ChurnRadarMember {
  id: string;
  name: string;
  phone: string;
  branch: string;
  daysAbsent: number;
  baselineVisitsPerWeek: number;
  tier: string;
  churnProbability: number;
  rootCause: string;
  status: "FLAGGED" | "MESSAGE_DRAFTED" | "BROUGHT_BACK";
}

interface WinbackMessageProposal {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  branch: string;
  daysAbsent: number;
  baseline: string;
  suggestedIncentive: string;
  whatsappMessageText: string;
  language: "Bilingual (Urdu / English)" | "English";
  status: "PENDING_APPROVAL" | "APPROVED" | "QUEUED_QUIET_HOURS";
}

interface TechGisRewardTrigger {
  id: string;
  memberName: string;
  phone: string;
  branch: string;
  milestoneTitle: string;
  metricAchieved: string;
  rewardOffered: string;
  triggeredAt: string;
  dispatched: boolean;
}

export default function AdminApolloBrainCrmPage() {
  const [topModule, setTopModule] = useState<"RETENTION" | "UPSELL">("RETENTION");
  const [activeTab, setActiveTab] = useState<"radar" | "renewals" | "whatsapp" | "techgis">("radar");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [preservedValuePKR, setPreservedValuePKR] = useState(1840000);
  const [approvedUpsellIds, setApprovedUpsellIds] = useState<Record<string, boolean>>({});

  // Renewals State
  const [renewalsData, setRenewalsData] = useState<any>(null);
  const [loadingRenewals, setLoadingRenewals] = useState(false);
  const [renewalsLanguage, setRenewalsLanguage] = useState<"en" | "ur">("en");
  const [approvingRenewalId, setApprovingRenewalId] = useState<string | null>(null);
  const [approvedRenewals, setApprovedRenewals] = useState<Record<string, boolean>>({});

  const fetchRenewals = async () => {
    setLoadingRenewals(true);
    try {
      const res = await fetch("/api/renewals");
      if (res.ok) {
        const json = await res.json();
        setRenewalsData(json);
      }
    } catch (e) {
      console.error("Failed to load renewals:", e);
    } finally {
      setLoadingRenewals(false);
    }
  };

  useEffect(() => {
    if (activeTab === "renewals" && !renewalsData) {
      fetchRenewals();
    }
  }, [activeTab]);

  const handleApproveRenewal = async (memberId: string, memberName: string) => {
    setApprovingRenewalId(memberId);
    try {
      const res = await fetch("/api/renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          language: renewalsLanguage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setApprovedRenewals((prev) => ({ ...prev, [memberId]: true }));
        showNotification(data.message || `Renewal reminder approved for ${memberName}!`);
      } else {
        showNotification(data.message || data.error || "Failed to approve renewal reminder");
      }
    } catch (e: any) {
      showNotification(e.message || "Network error approving reminder");
    } finally {
      setApprovingRenewalId(null);
    }
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. 14-Day Absent Member Churn Radar
  const [radarMembers, setRadarMembers] = useState<ChurnRadarMember[]>([
    {
      id: "RAD-01",
      name: "Hamza Tariq",
      phone: "0300-8271001",
      branch: "TRI FIT Seaview Flagship",
      daysAbsent: 16,
      baselineVisitsPerWeek: 4,
      tier: "TriFit Plus (12M)",
      churnProbability: 88,
      rootCause: "Post-travel inertia. Previously trained with Coach Faraz on leg press.",
      status: "MESSAGE_DRAFTED",
    },
    {
      id: "RAD-02",
      name: "Ayesha Siddiqui",
      phone: "0321-4455667",
      branch: "TRI FIT LuckyOne Mall",
      daysAbsent: 19,
      baselineVisitsPerWeek: 3,
      tier: "TriFit Regular (6M)",
      churnProbability: 92,
      rootCause: "Work schedule conflict during peak evening turnstile hours.",
      status: "MESSAGE_DRAFTED",
    },
    {
      id: "RAD-03",
      name: "Daniyal Khan",
      phone: "0333-5129033",
      branch: "TRI FIT AJ Tower (Islamabad)",
      daysAbsent: 22,
      baselineVisitsPerWeek: 5,
      tier: "TriFit Regular (3M)",
      churnProbability: 95,
      rootCause: "Spin studio pass expired; absence correlates with cancellation risk.",
      status: "MESSAGE_DRAFTED",
    },
    {
      id: "RAD-04",
      name: "Zainab Malik",
      phone: "0312-3344556",
      branch: "TRI FIT Clifton",
      daysAbsent: 14,
      baselineVisitsPerWeek: 3,
      tier: "TriFit Regular (6M)",
      churnProbability: 79,
      rootCause: "Morning workout schedule adjustment requested.",
      status: "MESSAGE_DRAFTED",
    },
    {
      id: "RAD-05",
      name: "Omer Sheikh",
      phone: "0300-9988112",
      branch: "TRI FIT Seaview Flagship",
      daysAbsent: 17,
      baselineVisitsPerWeek: 4,
      tier: "TriFit Plus (12M)",
      churnProbability: 84,
      rootCause: "Shoulder strain logged 18 days ago. Needs recovery therapy touchpoint.",
      status: "MESSAGE_DRAFTED",
    },
  ]);

  // 2. WhatsApp Business API Proposals
  const [proposals, setProposals] = useState<WinbackMessageProposal[]>([
    {
      id: "WB-101",
      memberId: "RAD-01",
      memberName: "Hamza Tariq",
      phone: "0300-8271001",
      branch: "Seaview Flagship (Karachi)",
      daysAbsent: 16,
      baseline: "4x/wk baseline",
      suggestedIncentive: "Complimentary PT Session + Recovery Lounge access",
      whatsappMessageText: "Assalam-o-Alaikum Hamza bhai! Hum ne notice kiya k aap Seaview Flagship pe 16 din se miss ho rahe hain. Coach Faraz aap k customized recovery program k sath tayar hain. Hum ne aap k account mein 1 Complimentary PT session add kar diya hai!",
      language: "Bilingual (Urdu / English)",
      status: "PENDING_APPROVAL",
    },
    {
      id: "WB-102",
      memberId: "RAD-02",
      memberName: "Ayesha Siddiqui",
      phone: "0321-4455667",
      branch: "LuckyOne Mall (Karachi)",
      daysAbsent: 19,
      baseline: "3x/wk baseline",
      suggestedIncentive: "15% Renewal Loyalty Perk + InBody 3D Scan",
      whatsappMessageText: "Salam Ayesha! We miss your energy at TRI FIT LuckyOne Mall. To support your fitness journey, your membership includes a free InBody Body Composition Scan and smoothie bar perk this week.",
      language: "English",
      status: "PENDING_APPROVAL",
    },
    {
      id: "WB-103",
      memberId: "RAD-03",
      memberName: "Daniyal Khan",
      phone: "0333-5129033",
      branch: "AJ Tower (Islamabad)",
      daysAbsent: 22,
      baseline: "5x/wk baseline",
      suggestedIncentive: "Priority Spin Studio booking + VIP Guest Pass",
      whatsappMessageText: "Assalam-o-Alaikum Daniyal bhai! AJ Tower Spin Studio miss kar raha hai aap ko. Come workout with a friend this weekend on our complimentary VIP Guest Pass!",
      language: "Bilingual (Urdu / English)",
      status: "PENDING_APPROVAL",
    },
  ]);

  // 3. TechGIS 3D Body Scan Milestone Rewards
  const [milestones, setMilestones] = useState<TechGisRewardTrigger[]>([
    {
      id: "MTR-501",
      memberName: "Omer Tariq",
      phone: "0300-8271011",
      branch: "TRI FIT Seaview Flagship",
      milestoneTitle: "-2.4% Visceral Body Fat Reduction",
      metricAchieved: "Body fat reduced from 22.8% to 20.4% in 30 days (TechGIS 3D Scan #04)",
      rewardOffered: "Complimentary Iso-Whey Protein Shake at TriFit Juice Bar",
      triggeredAt: "Today, 18:10 PKT",
      dispatched: false,
    },
    {
      id: "MTR-502",
      memberName: "Sana Mir",
      phone: "0321-7788990",
      branch: "TRI FIT Clifton",
      milestoneTitle: "10th Milestone 3D Body Scan Completed",
      metricAchieved: "Consistent posture and biometric tracking over 6 months",
      rewardOffered: "1 Free Private Reformer Pilates Session with Master Instructor",
      triggeredAt: "Today, 17:25 PKT",
      dispatched: false,
    },
    {
      id: "MTR-503",
      memberName: "Hamza Ali",
      phone: "0333-1122334",
      branch: "TRI FIT AJ Tower (Islamabad)",
      milestoneTitle: "Posture Alignment Score: 88/100 (+20 Pts)",
      metricAchieved: "Significant spinal symmetry improvement detected by TechGIS Top Camera sensor",
      rewardOffered: "TriFit Branded Athlete Duffel Bag",
      triggeredAt: "Yesterday, 19:40 PKT",
      dispatched: true,
    },
  ]);

  const handleApproveProposal = (id: string, name: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "QUEUED_QUIET_HOURS" } : p
      )
    );
    // Animate top Preserved Subscription Value counter ticking up live (+PKR 155,999)
    setPreservedValuePKR((prev) => prev + 155999);
    showNotification(`Approved message for ${name}. +PKR 155,999 preserved! Queued for dispatch at 07:01 PKT (respecting quiet hours).`);
  };

  const handleDispatchReward = (id: string, name: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, dispatched: true } : m))
    );
    showNotification(`WhatsApp milestone reward voucher dispatched to ${name}.`);
  };

  const pendingProposalsCount = proposals.filter((p) => p.status === "PENDING_APPROVAL").length;

  return (
    <AdminPortalLayout activeItem="brain">
      <div className="space-y-5">
        {/* Unboxed Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>AI CRM & Retention Radar</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                74.1% Recovery Rate
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              14-day absence radar, automated WhatsApp win-backs, and 3D scan rewards
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] text-xs font-mono">
              Auto-Send: <strong className="text-[var(--accent)]">Human Reviewed</strong>
            </span>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[var(--chip)] border border-[var(--accent)]/40 text-[var(--text)] text-[13px] font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* EXECUTIVE PRIMARY TABS: TAB A (RETENTION) VS TAB B (UPSELL & LOCK-IN) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass border border-[var(--line)]">
          <button
            type="button"
            onClick={() => setTopModule("RETENTION")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              topModule === "RETENTION"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Tab A: Churn Win-Back Radar (294 Flagged)</span>
          </button>
          <button
            type="button"
            onClick={() => setTopModule("UPSELL")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              topModule === "UPSELL"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>Tab B: Subscriber Upsell & Lock-In Engine (612 Ready to Upgrade)</span>
          </button>
        </div>

        {topModule === "RETENTION" && (
          <div className="space-y-5">
            {/* Quiet Hours Banner */}
            <div className="glass p-4 rounded-2xl border border-[var(--accent)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--chip)] border border-[var(--accent)]/30 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text)]">
                    🌙 PKT Quiet Hours Active: 22:00 – 07:00 PKT
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Strict cultural and ethical AI safety rule: All outbound member WhatsApp messages are silenced during resting hours. Approved win-backs dispatch at 07:01 PKT.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-[var(--accent)] bg-[var(--card)] border border-[var(--line)] px-2.5 py-1 rounded-lg shrink-0">
                0 Messages Sent at Night
              </span>
            </div>

        {/* 3 Horizontal Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("radar")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "radar"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>14-Day Absent Churn Radar ({radarMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("renewals")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "renewals"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>7-Day Plan Renewal Reminders</span>
            {renewalsData?.totalExpiringCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--card)] font-mono font-bold">
                {renewalsData.totalExpiringCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "whatsapp"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Win-Back Campaigns</span>
            {pendingProposalsCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--on-accent)] text-[var(--accent)] font-extrabold">
                {pendingProposalsCount} Awaiting Sign-Off
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("techgis")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "techgis"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>TechGIS 3D Scan Milestone Rewards</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--card)] font-mono">
              {milestones.length}
            </span>
          </button>
        </div>

        {/* =========================================================================
            SUB-TAB: 7-DAY PLAN RENEWAL REMINDERS (PART 2 FEATURE)
           ========================================================================= */}
        {activeTab === "renewals" && (
          <div className="space-y-4">
            {/* Standardized KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Expiring Next 7 Days"
                numericValue={renewalsData?.totalExpiringCount || 0}
                icon={Calendar}
                variant="warning"
                sparklineData={[4, 5, 5, 6, 7, renewalsData?.totalExpiringCount || 8]}
                sparklineColor="var(--accent)"
                footerLeft={
                  <span className="font-semibold text-[var(--accent)]">
                    Due Soon
                  </span>
                }
                footerRight="Active memberships"
              />

              <StatCard
                title="High Risk (Visiting Less)"
                numericValue={renewalsData?.visitingLessCount || 0}
                icon={AlertTriangle}
                variant="alert"
                sparklineData={[6, 5, 4, 4, 3, renewalsData?.visitingLessCount || 2]}
                sparklineColor="#F43F5E"
                footerLeft={
                  <span className="font-semibold text-rose-500">
                    High Churn
                  </span>
                }
                footerRight="Absent >7 days"
              />

              <StatCard
                title="Retainable Plan Revenue"
                value={`PKR ${((renewalsData?.atRiskRevenuePKR || 0) / 1000).toLocaleString()}K`}
                icon={TrendingUp}
                variant="success"
                sparklineData={[120, 140, 160, 180, 210]}
                sparklineColor="#10B981"
                footerLeft={
                  <span className="font-semibold text-emerald-500">
                    Retainable
                  </span>
                }
                footerRight="Monthly dues pipeline"
              />

              <StatCard
                title="WhatsApp Consent Rate"
                value={`${
                  renewalsData?.members?.length
                    ? Math.round(
                        (renewalsData.members.filter((m: any) => m.whatsappOptIn).length /
                          renewalsData.members.length) *
                          100
                      )
                    : 96
                }%`}
                icon={Phone}
                variant="info"
                sparklineData={[92, 94, 95, 96, 96]}
                sparklineColor="#0EA5E9"
                footerLeft={
                  <span className="font-semibold text-sky-500">
                    Compliant
                  </span>
                }
                footerRight="Opted-in with consent"
              />
            </div>

            {/* Filter & Language Control Toolbar */}
            <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--accent)]" />
                  <span>Upcoming 7-Day Plan Renewal Reminders</span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Members expiring within 7 days. High churn-risk members visiting less than baseline are flagged with customized win-back prompts.
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--muted)]">Draft Language:</span>
                <div className="flex items-center gap-1 bg-[var(--card)] p-1 rounded-xl border border-[var(--line)]">
                  <button
                    onClick={() => setRenewalsLanguage("en")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      renewalsLanguage === "en"
                        ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setRenewalsLanguage("ur")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      renewalsLanguage === "ur"
                        ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    Roman Urdu
                  </button>
                </div>
              </div>
            </div>

            {/* Expiring Members Card List */}
            <div className="space-y-3">
              {loadingRenewals && (
                <div className="glass p-8 text-center text-[var(--muted)] text-xs rounded-2xl">
                  Loading renewals telemetry from database...
                </div>
              )}

              {!loadingRenewals && renewalsData?.members?.length === 0 && (
                <div className="glass p-8 text-center text-[var(--muted)] text-xs rounded-2xl">
                  No active memberships expiring in the next 7 days.
                </div>
              )}

              {renewalsData?.members?.map((m: any) => {
                const isApproved = approvedRenewals[m.id];
                const draftText = renewalsLanguage === "en" ? m.draftEnglish : m.draftUrdu;

                return (
                  <div
                    key={m.id}
                    className="glass p-5 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-[var(--accent)]/40 transition-colors"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[var(--text)]">{m.name}</span>
                        <span className="text-[10px] font-mono text-[var(--muted)]">{m.phone}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30 uppercase">
                          {m.planId} (PKR {m.planFeePKR.toLocaleString()})
                        </span>
                        <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-[var(--chip)] text-[var(--accent)] font-bold border border-[var(--accent)]/30">
                          Expires in {m.daysRemaining} day{m.daysRemaining > 1 ? "s" : ""}
                        </span>
                        {m.isVisitingLess && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30 uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Visiting Less ({m.daysAbsent}d away)
                          </span>
                        )}
                        {!m.whatsappOptIn && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--card)] text-[var(--muted)] border border-[var(--line)] uppercase">
                            No Opt-In
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[var(--muted)] flex items-center gap-2">
                        <span>{m.branchName}</span>
                        <span>•</span>
                        <span>Assigned: Coach {m.trainerName}</span>
                      </div>

                      {/* WhatsApp Draft Preview */}
                      <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] leading-relaxed font-sans">
                        <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>Draft WhatsApp Reminder ({renewalsLanguage === "en" ? "English" : "Roman Urdu"})</span>
                        </div>
                        <p>{draftText}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0 self-stretch lg:self-auto justify-end">
                      {isApproved ? (
                        <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approved & Queued</span>
                        </div>
                      ) : !m.whatsappOptIn ? (
                        <div className="px-3.5 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] text-xs font-bold">
                          Send Disabled (No Opt-in)
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApproveRenewal(m.id, m.name)}
                          disabled={approvingRenewalId === m.id}
                          className="btn primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{approvingRenewalId === m.id ? "Approving..." : "Approve WhatsApp Reminder"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 1: 14-DAY ABSENT MEMBER CHURN RADAR
           ========================================================================= */}
        {activeTab === "radar" && (
          <div className="space-y-4">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="glass p-5 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Total Flagged At-Risk
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--accent)] mt-1">
                  294 Members
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">Absent &gt; 14 Days</div>
              </div>

              <div className="glass p-5 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Brought Back This Month
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  218 Members
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">74.1% Recovery Rate</div>
              </div>

              <div className="glass p-5 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Preserved Subscription Value
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-baseline gap-1.5">
                  <span>PKR {(preservedValuePKR / 1000000).toFixed(2)}M</span>
                  {preservedValuePKR > 1840000 && (
                    <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      +{(preservedValuePKR - 1840000).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">Direct LTV Saved</div>
              </div>

              <div className="glass p-5 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  WhatsApp Read Rate
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--text)] mt-1">
                  89.2%
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">Verified Delivery</div>
              </div>
            </div>

            {/* Radar & Win-back Funnel Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6">
                <RadarRisk
                  dataKey="churn_risk_radar"
                  subtitle="Multivariate dropout vectors evaluated by Apollo AI"
                  isSample={true}
                />
              </div>
              <div className="lg:col-span-6">
                <FunnelSteps
                  dataKey="winback_funnel"
                  subtitle="Automated WhatsApp outreach conversion progression"
                  isSample={true}
                />
              </div>
            </div>

            {/* Radar Member Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--card)] text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                      <th className="py-3 px-4">Member Name & Contact</th>
                      <th className="py-3 px-4">Home Club</th>
                      <th className="py-3 px-4 text-center">Absence & Baseline</th>
                      <th className="py-3 px-4 text-center">Churn Risk Score</th>
                      <th className="py-3 px-4">AI Diagnosed Root Cause</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)] text-xs">
                    {radarMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-[var(--card)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--text)]">{m.name}</div>
                          <div className="text-[11px] text-[var(--accent)] font-mono">{m.phone}</div>
                          <div className="text-[10px] text-[var(--muted)]">{m.tier}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-[var(--text)]">{m.branch.replace("TRI FIT ", "")}</span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-[var(--accent)]">{m.daysAbsent} days absent</div>
                          <div className="text-[10.5px] text-[var(--muted)]">{m.baselineVisitsPerWeek}x/week baseline</div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-bold font-mono">
                            {m.churnProbability}% RISK
                          </span>
                        </td>

                        <td className="py-3 px-4 text-[var(--muted)] max-w-sm">
                          <p className="text-xs line-clamp-2">{m.rootCause}</p>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setActiveTab("whatsapp");
                              showNotification(`Navigated to draft win-back proposal for ${m.name}`);
                            }}
                            className="btn primary !py-1 !px-2.5 text-xs font-bold"
                          >
                            Review Proposal
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 2: WHATSAPP WIN-BACK CAMPAIGNS
           ========================================================================= */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div className="glass p-5 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
                  <span>Automated WhatsApp Win-Back Proposals (Awaiting Human Approval)</span>
                </h3>
                <p className="body-label text-xs text-[var(--muted)] mt-1">
                  AI drafted personalized Urdu/English re-engagement proposals. Mandatory human review before WhatsApp dispatch.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                  AUTO-SEND: OFF
                </span>
              </div>
            </div>

            {/* Proposals Cards */}
            <div className="space-y-4">
              {proposals.map((item) => (
                <div
                  key={item.id}
                  className="glass p-5 rounded-2xl space-y-3.5 hover:border-[var(--accent)]/40 transition-all shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[var(--text)] text-sm">{item.memberName}</h4>
                        <span className="text-xs text-[var(--accent)] font-mono font-bold">({item.phone})</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--card)] text-[var(--muted)] border border-[var(--line)]">
                          {item.branch}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        <strong className="text-[var(--accent)]">{item.daysAbsent} days absent</strong> · {item.baseline}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--muted)]">
                        Language: <strong className="text-[var(--text)]">{item.language}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Proposed Incentive */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[var(--muted)] font-semibold">Tailored Incentive:</span>
                    <span className="font-bold text-[var(--accent)] bg-[var(--chip)] px-2.5 py-0.5 rounded-lg border border-[var(--accent)]/30">
                      {item.suggestedIncentive}
                    </span>
                  </div>

                  {/* WhatsApp Draft Preview */}
                  <div className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] font-sans text-xs text-[var(--text)] leading-relaxed relative">
                    <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>WhatsApp Cloud API Message Draft</span>
                    </div>
                    <p>{item.whatsappMessageText}</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                      <Moon className="w-3 h-3 text-[var(--accent)]" />
                      Approved messages queue for 07:01 PKT dispatch
                    </span>

                    <div className="flex items-center gap-2">
                      {item.status === "QUEUED_QUIET_HOURS" ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Approved (Queued for 07:01 PKT)</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveProposal(item.id, item.memberName)}
                          className="btn primary !py-1.5 !px-4 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Schedule</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 3: TECHGIS 3D BODY SCAN MILESTONE REWARDS
           ========================================================================= */}
        {activeTab === "techgis" && (
          <div className="space-y-4">
            <div className="glass p-5 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[var(--accent)]" />
                  <span>TechGIS F-Shaped 3D Kiosk Milestone Reward Triggers</span>
                </h3>
                <p className="body-label text-xs text-[var(--muted)] mt-1">
                  Biometric telemetry milestones automatically trigger reward vouchers to celebrate member transformation.
                </p>
              </div>

              <div className="text-xs text-[var(--muted)] font-mono">
                Sensor Array: 4K Depth Sensor + Ground Scale Telemetry
              </div>
            </div>

            {/* Milestone Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="glass p-5 rounded-2xl flex flex-col justify-between hover:border-[var(--accent)]/40 transition-all space-y-3.5 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)] mb-1">
                      <span>{m.branch}</span>
                      <span>{m.triggeredAt}</span>
                    </div>

                    <h4 className="font-bold text-sm text-[var(--text)] mt-1">
                      {m.memberName}
                    </h4>
                    <div className="text-xs text-[var(--accent)] font-mono font-bold">
                      {m.phone}
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-1">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{m.milestoneTitle}</span>
                      </div>
                      <p className="text-xs text-[var(--text)] leading-snug">
                        {m.metricAchieved}
                      </p>
                    </div>

                    <div className="mt-3 text-xs">
                      <span className="text-[var(--muted)] block font-semibold">Reward Voucher:</span>
                      <span className="font-bold text-[var(--accent)]">{m.rewardOffered}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--line)]">
                    {m.dispatched ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reward Dispatched via WhatsApp</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDispatchReward(m.id, m.memberName)}
                        className="btn primary w-full !py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Reward Voucher</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>
        )}

        {/* =========================================================================
            TOP MODULE B: SUBSCRIBER UPSELL & LOCK-IN ENGINE (612 READY TO UPGRADE)
           ========================================================================= */}
        {topModule === "UPSELL" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass p-5 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  3M → 12M Upgrade Candidates
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--accent)] mt-1">
                  1,602 Members
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">Month 2 • &gt;3.5x/wk visits</div>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Forma 3D Plateau Pool
                </span>
                <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                  810 Members
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">&lt;0.5% fat loss over 2 scans</div>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Corporate & Bank Card Expiries
                </span>
                <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
                  428 Members
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">JS Bank (30-40%) & ICAP</div>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Net AI Upsell Pipeline
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  PKR 8.39M
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">21.0x Apollo System ROI</div>
              </div>
            </div>

            {/* Forma 3D Scan → PT Upsell Funnel Telemetry */}
            <div className="glass p-5 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-cyan-400" />
                    <span>Forma 3D Kiosk Telemetry → PT Upsell Pipeline</span>
                  </h3>
                  <p className="body-label text-xs text-[var(--muted)] mt-0.5">
                    Real-time conversion funnel from hardware kiosk scans to high-margin Personal Training packages
                  </p>
                </div>
                <span className="admin-chip text-[11px] font-mono text-cyan-400 border-cyan-500/30">
                  Hardware Live: 4 Flagships
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--muted)]">1. Scans Completed</div>
                  <div className="text-xl font-bold font-mono text-[var(--text)] mt-1">1,420 Scans</div>
                  <div className="text-[10.5px] text-[var(--muted)] mt-0.5">30-day network total</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--muted)]">2. Plateaus Detected</div>
                  <div className="text-xl font-bold font-mono text-purple-400 mt-1">482 (34%)</div>
                  <div className="text-[10.5px] text-[var(--muted)] mt-0.5">&lt;0.5% body fat reduction</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--muted)]">3. PT Sessions Booked</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">121 Booked</div>
                  <div className="text-[10.5px] text-emerald-400 mt-0.5">25.1% diagnostic attach rate</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--accent)] mt-1">PKR 5.80M</div>
                  <div className="text-[10.5px] text-[var(--accent)] mt-0.5">PT packages + Annual lock-in</div>
                </div>
              </div>
            </div>

            {/* The 3 Actionable Upsell Buckets */}
            <div className="space-y-4">
              <h3 className="card-title text-[var(--text)] text-sm uppercase tracking-wider text-[var(--muted)]">
                Active AI Upsell & Lock-In Opportunities (612 Ready to Dispatch)
              </h3>

              {/* Bucket 1: Quarterly-to-Annual Lock-In */}
              <div className="glass p-5 rounded-2xl space-y-3 hover:border-[var(--accent)]/40 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 font-mono">
                        BUCKET 1: 3M → 12M ANNUAL LOCK-IN
                      </span>
                      <h4 className="font-bold text-sm text-[var(--text)]">Zaid Khan (Seaview DHA)</h4>
                      <span className="text-xs text-[var(--accent)] font-mono">0300-8219472</span>
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">
                      Currently on <strong className="text-[var(--text)]">TriFit Regular 3M</strong> (PKR 52,999) • Month 2 of 3 • 4.2x/wk high attendance.
                    </div>
                  </div>
                  <span className="admin-chip text-emerald-400 border-emerald-500/30 text-[10.5px]">
                    +PKR 80,000 Upfront Cash
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)]">
                  <div className="text-[10.5px] font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
                    Personalized WhatsApp Pitch:
                  </div>
                  <p>
                    "Salam Zaid! Coach Tariq has noticed your incredible 4.2x/wk discipline at Seaview DHA. As a top 5% active member, you are eligible to roll your remaining Month 3 balance into our TriFit Plus 12-Month VIP tier with 12 free PT sessions and multi-club passport access. Lock in for 12 months today for just PKR 80,000 net adjustment."
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[var(--muted)]">Locks in 9 additional months of retention</span>
                  {approvedUpsellIds["upsell-1"] ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>WhatsApp Offer Dispatched (+PKR 80,000)</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setApprovedUpsellIds((prev) => ({ ...prev, "upsell-1": true }));
                        setPreservedValuePKR((prev) => prev + 80000);
                        showNotification("1-Click WhatsApp offer dispatched to Zaid Khan (+PKR 80,000 locked in)!");
                      }}
                      className="btn primary !py-1.5 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>1-Click Dispatch WhatsApp Offer (+PKR 80k)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bucket 2: Forma 3D Plateau-to-PT Upsell */}
              <div className="glass p-5 rounded-2xl space-y-3 hover:border-[var(--accent)]/40 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 font-mono">
                        BUCKET 2: FORMA 3D PLATEAU → PT UPSELL
                      </span>
                      <h4 className="font-bold text-sm text-[var(--text)]">Bilal Tariq (Clifton Flagship)</h4>
                      <span className="text-xs text-[var(--accent)] font-mono">0321-9988112</span>
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">
                      Body fat unchanged at <strong className="text-rose-400">22.4% over last 2 scans</strong> • Attends 3x/wk but zero progressive overload.
                    </div>
                  </div>
                  <span className="admin-chip text-emerald-400 border-emerald-500/30 text-[10.5px]">
                    +PKR 55,000 PT Bundle
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)]">
                  <div className="text-[10.5px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                    Forma 3D Diagnostic PT Offer:
                  </div>
                  <p>
                    "Salam Bilal! Your Forma 3D Bio-Scan shows consistent effort but your fat loss has plateaued at 22.4% over 60 days. Master Coach Sarah has reviewed your posture telemetry and designed a 4-week Hypertrophy Breakout. Book your 1-on-1 PT consultation today + get 50% off your next annual renewal!"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[var(--muted)]">Overcomes churn driver: #3 Plateaued / Poor Results</span>
                  {approvedUpsellIds["upsell-2"] ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>PT Diagnostic Dispatched (+PKR 55,000)</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setApprovedUpsellIds((prev) => ({ ...prev, "upsell-2": true }));
                        setPreservedValuePKR((prev) => prev + 55000);
                        showNotification("Forma 3D PT Breakout offer dispatched to Bilal Tariq (+PKR 55,000)!");
                      }}
                      className="btn primary !py-1.5 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch PT Diagnostic Offer (+PKR 55k)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bucket 3: Corporate & Bank Card Renewal Engine */}
              <div className="glass p-5 rounded-2xl space-y-3 hover:border-[var(--accent)]/40 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/20 text-sky-300 font-mono">
                        BUCKET 3: JS BANK & ICAP RENEWAL LOCK
                      </span>
                      <h4 className="font-bold text-sm text-[var(--text)]">Mariam Farooq (AJ Tower Islamabad)</h4>
                      <span className="text-xs text-[var(--accent)] font-mono">0333-8899221</span>
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">
                      Enrolled via <strong className="text-[var(--text)]">JS Bank Visa Platinum (35% Partner Discount)</strong> • Expires in 21 days.
                    </div>
                  </div>
                  <span className="admin-chip text-emerald-400 border-emerald-500/30 text-[10.5px]">
                    +PKR 101,399 Renewal Lock
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)]">
                  <div className="text-[10.5px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                    Automated Bank Partner Renewal:
                  </div>
                  <p>
                    "Dear Mariam, your TriFit Plus membership via JS Bank Visa Platinum renews in 21 days. Enjoy your exclusive 35% discount (PKR 101,399 instead of PKR 155,999) with seamless 1-click renewal and automated gym turnstile pass re-activation."
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[var(--muted)]">Retains high-value corporate cardholder</span>
                  {approvedUpsellIds["upsell-3"] ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Partner Renewal Locked (+PKR 101,399)</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setApprovedUpsellIds((prev) => ({ ...prev, "upsell-3": true }));
                        setPreservedValuePKR((prev) => prev + 101399);
                        showNotification("JS Bank Partner renewal dispatched to Mariam Farooq (+PKR 101,399)!");
                      }}
                      className="btn primary !py-1.5 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Lock In JS Bank Renewal (+PKR 101k)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}
