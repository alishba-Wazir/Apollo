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
  const [activeTab, setActiveTab] = useState<"radar" | "renewals" | "whatsapp" | "techgis">("radar");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      tier: "Black Diamond VIP",
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
      tier: "Executive Gold",
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
      tier: "Prime Annual",
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
      tier: "Black Diamond VIP",
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
    showNotification(`Approved message for ${name}. Queued for dispatch at 07:01 PKT (respecting quiet hours).`);
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
                <div className="text-2xl font-bold font-mono text-[var(--text)] mt-1">
                  PKR 1.84M
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
    </AdminPortalLayout>
  );
}
