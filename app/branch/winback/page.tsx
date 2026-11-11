"use client";

import React, { useState, useEffect } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  RefreshCw,
  Search,
  Filter,
  Check,
  CheckCheck,
  Languages,
  UserCheck,
  AlertOctagon,
  ArrowRight,
  Flame,
  Dumbbell,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { MemberHabitDropChart } from "@/components/charts/MemberHabitDropChart";

interface ReplyTagData {
  id: string;
  reason: string;
  handedToHuman: boolean;
}

interface MessageData {
  id: string;
  direction: "OUTBOUND" | "INBOUND";
  body: string;
  language: string;
  status: string;
  approvedBy: string | null;
  sentAt: string | null;
  replyTags?: ReplyTagData[];
}

interface WinbackCase {
  id: string;
  memberId: string;
  flaggedAt: string;
  daysAway: number;
  normalVisitsPerWeek: number;
  status: "OPEN" | "CONTACTED" | "BROUGHT_BACK" | "CLOSED";
  resolvedAt?: string | null;
  member: {
    id: string;
    name: string;
    phone: string;
    goal: string;
    studio: string;
    planId: string;
    language: string;
    branchId: string;
    whatsappOptIn: boolean;
    status: string;
    frozenUntil?: string | null;
    branch: {
      id: string;
      name: string;
      city: string;
    };
    trainer?: {
      id: string;
      name: string;
      phone: string;
    } | null;
  };
  messages: MessageData[];
}

export default function BranchWinbackPage() {
  const { user } = useAuth();
  const [activeBrainTab, setActiveBrainTab] = useState<"absent" | "renewals">("absent");
  const [cases, setCases] = useState<WinbackCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isSimulatingReply, setIsSimulatingReply] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "CONTACTED" | "BROUGHT_BACK">("ALL");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ur">("en");
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [draftEditText, setDraftEditText] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [alertHandover, setAlertHandover] = useState<string | null>(null);

  // Branch Renewals State
  const [branchRenewals, setBranchRenewals] = useState<any>(null);
  const [loadingBranchRenewals, setLoadingBranchRenewals] = useState(false);
  const [renewalsLang, setRenewalsLang] = useState<"en" | "ur">("en");
  const [approvingRenewalId, setApprovingRenewalId] = useState<string | null>(null);
  const [approvedRenewals, setApprovedRenewals] = useState<Record<string, boolean>>({});

  const fetchBranchRenewals = async () => {
    setLoadingBranchRenewals(true);
    try {
      const res = await fetch("/api/renewals");
      if (res.ok) {
        const json = await res.json();
        setBranchRenewals(json);
      }
    } catch (e) {
      console.error("Failed to load branch renewals", e);
    } finally {
      setLoadingBranchRenewals(false);
    }
  };

  useEffect(() => {
    if (activeBrainTab === "renewals" && !branchRenewals) {
      fetchBranchRenewals();
    }
  }, [activeBrainTab]);

  const handleApproveBranchRenewal = async (memberId: string, memberName: string) => {
    setApprovingRenewalId(memberId);
    try {
      const res = await fetch("/api/renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          language: renewalsLang,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setApprovedRenewals((prev) => ({ ...prev, [memberId]: true }));
        setActionSuccess(data.message || `Renewal reminder approved for ${memberName}!`);
      } else {
        setActionSuccess(data.message || data.error || "Failed to approve renewal");
      }
    } catch (e: any) {
      setActionSuccess(e.message || "Network error approving renewal");
    } finally {
      setApprovingRenewalId(null);
    }
  };

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/winback");
      if (res.ok) {
        const data = await res.json();
        const loadedCases: WinbackCase[] = data.cases || [];
        setCases(loadedCases);
        if (loadedCases.length > 0 && !selectedCaseId) {
          setSelectedCaseId(loadedCases[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load winback cases", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const draftMessage =
    selectedCase?.messages?.find((m) => m.direction === "OUTBOUND" && m.status === "draft") ||
    selectedCase?.messages?.find((m) => m.direction === "OUTBOUND");

  useEffect(() => {
    if (selectedCase) {
      const draft = selectedCase.messages.find((m) => m.direction === "OUTBOUND" && m.status === "draft");
      if (draft) {
        setDraftEditText(draft.body);
        setSelectedLanguage((draft.language as "en" | "ur") || "en");
      } else if (selectedCase.messages.length > 0) {
        const outbound = selectedCase.messages.find((m) => m.direction === "OUTBOUND");
        if (outbound) {
          setDraftEditText(outbound.body);
          setSelectedLanguage((outbound.language as "en" | "ur") || "en");
        }
      }
      // Check if any inbound message triggered medical handover
      const medicalMsg = selectedCase.messages.find((m) =>
        m.replyTags?.some((t) => t.handedToHuman && t.reason === "injury")
      );
      if (medicalMsg) {
        setAlertHandover("Medical trigger active: member reported pain or injury. Human floor manager call required.");
      } else {
        setAlertHandover(null);
      }
    }
  }, [selectedCaseId, cases]);

  // Handle Approve and Send Demo Message
  const handleApprove = async () => {
    if (!selectedCase) return;
    setIsApproving(true);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/winback/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCase.id,
          messageId: draftMessage?.id,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setActionSuccess(
          `WhatsApp outreach approved and dispatched to ${selectedCase.member.name}. Audit log entry created.`
        );
        await fetchCases();
      } else {
        alert(result.error || "Approval failed");
      }
    } catch (e: any) {
      alert(e.message || "Approval network error");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Gemini Draft Regeneration or Language Switch
  const handleRegenerateDraft = async (lang: "en" | "ur") => {
    if (!selectedCase) return;
    setIsRegenerating(true);
    setActionSuccess(null);
    try {
      setSelectedLanguage(lang);
      const res = await fetch("/api/winback/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE_DRAFT",
          caseId: selectedCase.id,
          language: lang,
        }),
      });

      const result = await res.json();
      if (res.ok && result.message) {
        setDraftEditText(result.message.body);
        setIsEditingDraft(false);
        setActionSuccess(`Gemini drafted personalized outreach in ${lang === "ur" ? "Roman Urdu" : "English"}.`);
        await fetchCases();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Handle Save Edited Draft
  const handleSaveDraft = async () => {
    if (!selectedCase) return;
    try {
      const res = await fetch("/api/winback/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_DRAFT",
          caseId: selectedCase.id,
          editedText: draftEditText,
        }),
      });
      if (res.ok) {
        setIsEditingDraft(false);
        setActionSuccess("Draft message updated with your manual edits.");
        await fetchCases();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Simulated Member Reply Injection
  const handleSimulateReply = async (reason: "work" | "travel" | "injury" | "cost" | "boredom") => {
    if (!selectedCase) return;
    setIsSimulatingReply(true);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/winback/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SIMULATE_REPLY",
          caseId: selectedCase.id,
          replyReason: reason,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        if (result.tagged?.handedToHuman) {
          setAlertHandover(
            `CRITICAL MEDICAL HANDOVER: ${result.tagged.handoverReason || "Injury/pain detected."} Manager personal intervention required.`
          );
        }
        setActionSuccess(`Simulated reply injected: tagged as [${reason.toUpperCase()}].`);
        await fetchCases();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulatingReply(false);
    }
  };

  // Handle Simulate Member Check-In
  const handleSimulateCheckIn = async () => {
    if (!selectedCase) return;
    setIsCheckingIn(true);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/winback/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SIMULATE_CHECKIN",
          caseId: selectedCase.id,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setActionSuccess(`🎉 Member ${selectedCase.member.name} checked in! Case status marked BROUGHT_BACK.`);
        await fetchCases();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Filtering
  const filteredCases = cases.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.member.name.toLowerCase().includes(q) ||
      c.member.studio.toLowerCase().includes(q) ||
      c.member.goal.toLowerCase().includes(q) ||
      c.member.phone.includes(q);

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return c.status === statusFilter;
  });

  // Calculate Variance Multiplier
  const getVarianceRatio = (daysAway: number, normalVisitsPerWeek: number) => {
    const normalGapDays = Math.max(1, Math.round(7 / Math.max(1, normalVisitsPerWeek)));
    const ratio = (daysAway / normalGapDays).toFixed(1);
    return { ratio, normalGapDays };
  };

  const openCasesCount = cases.filter((c) => c.status === "OPEN").length;
  const contactedCasesCount = cases.filter((c) => c.status === "CONTACTED").length;
  const recoveredCasesCount = cases.filter((c) => c.status === "BROUGHT_BACK").length;

  return (
    <BranchPortalLayout activeItem="winback">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Win-back AI</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {user?.branchName || "Current Branch"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-[#FFD91C] border border-amber-500/20">
                100% Human Approved
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Intelligent churn prevention for members slipping away with personalized Gemini drafts
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchCases}
              disabled={isLoading}
              className="h-9 px-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation: 14-Day Absent Churn vs 7-Day Plan Renewal Reminders */}
        <div className="flex items-center gap-2 p-1.5 rounded-[16px] bg-slate-100 dark:bg-white/5 border border-border w-fit">
          <button
            onClick={() => setActiveBrainTab("absent")}
            className={`px-4 py-2 rounded-[12px] text-[12.5px] font-[800] flex items-center gap-2 transition-all ${
              activeBrainTab === "absent"
                ? "bg-[#FFD91C] text-[#0B0B09] shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>14-Day Absent Member Win-Back ({cases.length})</span>
          </button>
          <button
            onClick={() => setActiveBrainTab("renewals")}
            className={`px-4 py-2 rounded-[12px] text-[12.5px] font-[800] flex items-center gap-2 transition-all ${
              activeBrainTab === "renewals"
                ? "bg-[#FFD91C] text-[#0B0B09] shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Plan Renewal Reminders</span>
            {branchRenewals?.totalExpiringCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-accent text-on-accent font-mono font-bold">
                {branchRenewals.totalExpiringCount}
              </span>
            )}
          </button>
        </div>

        {activeBrainTab === "renewals" ? (
          /* =========================================================================
             BRANCH MANAGER VIEW: 7-DAY PLAN RENEWAL REMINDERS (SCOPED TO THIS CLUB)
             ========================================================================= */
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div className="glass-panel p-4 rounded-[20px]">
                <span className="text-[11px] font-[750] uppercase tracking-wider text-text-muted">
                  Expiring (Next 7 Days)
                </span>
                <div className="text-[26px] font-[900] text-text font-mono mt-1.5">
                  {branchRenewals?.totalExpiringCount || 0}
                </div>
                <span className="text-[10.5px] text-text-muted block mt-0.5">
                  Members up for renewal in {user?.branchName || "club"}
                </span>
              </div>

              <div className="glass-panel p-4 rounded-[20px]">
                <span className="text-[11px] font-[750] uppercase tracking-wider text-rose-500 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Visiting Less (High Churn)
                </span>
                <div className="text-[26px] font-[900] text-rose-500 font-mono mt-1.5">
                  {branchRenewals?.visitingLessCount || 0}
                </div>
                <span className="text-[10.5px] text-text-muted block mt-0.5">
                  Absent &gt;7 days or attendance drop
                </span>
              </div>

              <div className="glass-panel p-4 rounded-[20px]">
                <span className="text-[11px] font-[750] uppercase tracking-wider text-emerald-500">
                  Retainable Dues (PKR)
                </span>
                <div className="text-[26px] font-[900] text-emerald-500 font-mono mt-1.5">
                  PKR {((branchRenewals?.atRiskRevenuePKR || 0) / 1000).toLocaleString()}K
                </div>
                <span className="text-[10.5px] text-text-muted block mt-0.5">
                  Expiring package value
                </span>
              </div>

              <div className="glass-panel p-4 rounded-[20px]">
                <span className="text-[11px] font-[750] uppercase tracking-wider text-text-muted">
                  WhatsApp Opt-In Rate
                </span>
                <div className="text-[26px] font-[900] text-accent font-mono mt-1.5">
                  {branchRenewals?.members?.length
                    ? Math.round(
                        (branchRenewals.members.filter((m: any) => m.whatsappOptIn).length /
                          branchRenewals.members.length) *
                          100
                      )
                    : 100}
                  %
                </div>
                <span className="text-[10.5px] text-text-muted block mt-0.5">
                  Direct WhatsApp verified consent
                </span>
              </div>
            </div>

            {/* Language Toolbar */}
            <div className="glass-panel p-4 rounded-[20px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-[800] text-text flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Branch Renewal Reminders &amp; Manager Sign-Off</span>
                </h3>
                <p className="text-[12px] text-text-muted mt-0.5">
                  Review and authorize automated WhatsApp renewal messages for members expiring in the next 7 days.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11.5px] font-bold text-text-muted">Language:</span>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-[10px] border border-border">
                  <button
                    onClick={() => setRenewalsLang("en")}
                    className={`px-3 py-1 rounded-[7px] text-[11px] font-[800] transition-all ${
                      renewalsLang === "en"
                        ? "bg-accent text-on-accent shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setRenewalsLang("ur")}
                    className={`px-3 py-1 rounded-[7px] text-[11px] font-[800] transition-all ${
                      renewalsLang === "ur"
                        ? "bg-accent text-on-accent shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    Roman Urdu
                  </button>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              {loadingBranchRenewals && (
                <div className="glass-panel p-8 text-center text-text-muted text-[13px] rounded-[22px]">
                  Loading renewals for {user?.branchName || "your branch"}...
                </div>
              )}

              {!loadingBranchRenewals && branchRenewals?.members?.length === 0 && (
                <div className="glass-panel p-8 text-center text-text-muted text-[13px] rounded-[22px]">
                  No active memberships expiring in the next 7 days for {user?.branchName || "this club"}.
                </div>
              )}

              {branchRenewals?.members?.map((m: any) => {
                const isApproved = approvedRenewals[m.id];
                const draftText = renewalsLang === "en" ? m.draftEnglish : m.draftUrdu;

                return (
                  <div
                    key={m.id}
                    className="glass-panel p-5 rounded-[22px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-accent/40 transition-colors"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-[800] text-[15px] text-text">{m.name}</span>
                        <span className="text-[10px] font-mono text-text-muted">{m.phone}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 uppercase">
                          {m.planId} (PKR {m.planFeePKR.toLocaleString()})
                        </span>
                        <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-[#FFD91C] font-bold border border-amber-500/30">
                          Expires in {m.daysRemaining} day{m.daysRemaining > 1 ? "s" : ""}
                        </span>
                        {m.isVisitingLess && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Visiting Less ({m.daysAbsent}d away)
                          </span>
                        )}
                        {!m.whatsappOptIn && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-gray-400 border border-border uppercase">
                            No Opt-In
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-text-muted flex items-center gap-2">
                        <span>{m.branchName}</span>
                        <span>•</span>
                        <span>Trainer: Coach {m.trainerName}</span>
                      </div>

                      {/* WhatsApp Draft Preview */}
                      <div className="p-3 rounded-[14px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 text-[12px] text-text leading-relaxed font-sans">
                        <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>
                            Draft WhatsApp Reminder ({renewalsLang === "en" ? "English" : "Roman Urdu"})
                          </span>
                        </div>
                        <p>{draftText}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0 self-stretch lg:self-auto justify-end">
                      {isApproved ? (
                        <div className="px-4 py-2 rounded-[11px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approved &amp; Dispatched</span>
                        </div>
                      ) : !m.whatsappOptIn ? (
                        <div className="px-3.5 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text-muted text-[11px] font-bold">
                          Send Disabled (No Opt-in)
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApproveBranchRenewal(m.id, m.name)}
                          disabled={approvingRenewalId === m.id}
                          className="btn-primary px-4 py-2 text-[12px] font-[800] flex items-center gap-1.5 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {approvingRenewalId === m.id ? "Approving..." : "Approve WhatsApp Reminder"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* =========================================================================
             ORIGINAL 14-DAY ABSENT MEMBER WIN-BACK FLOW
             ========================================================================= */
          <>
            {/* Retention KPI Snapshot Bar — High Density 4-Card Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="glass-panel p-3.5 border border-border rounded-xl">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  Flagged in Queue
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[20px] font-black text-text">{cases.length}</span>
                  <span className="text-[10.5px] text-text-muted">members absent</span>
                </div>
              </div>

              <div className="glass-panel p-3.5 border border-amber-500/30 bg-amber-500/[0.03] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-[#FFD91C] tracking-wider block">
                  Pending Review
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[20px] font-black text-amber-600 dark:text-[#FFD91C]">{openCasesCount}</span>
                  <span className="text-[10.5px] text-amber-600/80 dark:text-[#FFD91C]/80 font-bold">action needed</span>
                </div>
              </div>

              <div className="glass-panel p-3.5 border border-border rounded-xl">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                  In Dialogue
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[20px] font-black text-accent">{contactedCasesCount}</span>
                  <span className="text-[10.5px] text-text-muted">outreach active</span>
                </div>
              </div>

              <div className="glass-panel p-3.5 border border-amber-500/30 bg-amber-500/5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-[#FFD91C] tracking-wider block">
                  Brought Back
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[20px] font-black text-amber-600 dark:text-[#FFD91C]">{recoveredCasesCount}</span>
                  <span className="text-[10.5px] text-slate-500 font-medium">turnstile check-in</span>
                </div>
              </div>
            </div>

        {/* Action Banners */}
        {actionSuccess && (
          <div className="p-3.5 rounded-[12px] bg-positive/10 border border-positive/30 text-positive text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {alertHandover && (
          <div className="p-4 rounded-[12px] bg-negative/15 border-2 border-negative/50 text-text text-[13px] font-medium flex items-start gap-3 animate-in fade-in">
            <AlertOctagon className="w-5 h-5 text-negative shrink-0 mt-0.5" />
            <div>
              <strong className="block text-negative font-[900] text-[13.5px]">
                MANDATORY HUMAN SUPERVISOR HANDOVER
              </strong>
              <p className="text-[12.5px] text-text-muted mt-0.5">
                {alertHandover} Automated AI responses are locked for medical safety.
              </p>
            </div>
          </div>
        )}

        {/* Main 2-Column Split: Absent Queue (5 cols) & Deep Dive / Chat (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Absent Members Queue */}
          <div className="lg:col-span-5 glass-panel p-4 border border-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-[900] text-text">Flagged Members</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold">
                  {filteredCases.length}
                </span>
              </div>
              <span className="text-[11px] text-text-muted">Variance &gt; 2.0x normal</span>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-[10px] bg-glass border border-border text-[11px]">
              {(["ALL", "OPEN", "CONTACTED", "BROUGHT_BACK"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 py-1 rounded-[8px] font-bold transition-all ${
                    statusFilter === tab
                      ? "bg-accent text-on-accent shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {tab === "ALL" ? "All" : tab === "OPEN" ? "Open" : tab === "CONTACTED" ? "In Chat" : "Recovered"}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member, studio, or goal..."
                className="w-full pl-8 pr-3 py-1.5 rounded-[10px] bg-glass border border-border text-[12px] text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              />
            </div>

            {/* Member Cards List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-12 text-center text-text-muted text-[13px]">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
                  Loading flagged members...
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="py-10 text-center text-text-muted text-[12.5px]">
                  No members found matching filter criteria.
                </div>
              ) : (
                filteredCases.map((c) => {
                  const isSelected = selectedCase?.id === c.id;
                  const { ratio, normalGapDays } = getVarianceRatio(c.daysAway, c.normalVisitsPerWeek);
                  const isRecovered = c.status === "BROUGHT_BACK";
                  const isContacted = c.status === "CONTACTED";

                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCaseId(c.id);
                        setActionSuccess(null);
                        setIsEditingDraft(false);
                      }}
                      className={`w-full text-left p-3 rounded-[12px] border transition-all ${
                        isSelected
                          ? "bg-accent/15 border-accent shadow-md ring-1 ring-accent/40"
                          : "bg-glass border-border hover:border-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-[900] text-text">{c.member.name}</span>
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase bg-glass border border-border text-text-muted">
                            {c.member.planId}
                          </span>
                        </div>

                        <span
                          className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase ${
                            isRecovered
                              ? "bg-positive/15 text-positive border border-positive/30"
                              : isContacted
                              ? "bg-accent/20 text-accent border border-accent/40"
                              : "bg-negative/15 text-negative border border-negative/30"
                          }`}
                        >
                          {isRecovered ? "Recovered" : isContacted ? "Contacted" : "Action Needed"}
                        </span>
                      </div>

                      {/* Variance Metric Highlight */}
                      <div className="flex items-center gap-2 mt-2 text-[11.5px]">
                        <span className="font-[900] text-negative">{c.daysAway} days absent</span>
                        <span className="text-text-muted">•</span>
                        <span className="px-1.5 py-0.5 rounded bg-negative/10 text-negative text-[10px] font-bold">
                          {ratio}x variance
                        </span>
                        <span className="text-text-muted text-[10.5px]">
                          (baseline: {c.normalVisitsPerWeek}x/wk)
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/40 text-[10.5px] text-text-muted">
                        <span>{c.member.studio}</span>
                        <span className="font-mono">{c.member.phone}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Case Deep Dive & Simulated WhatsApp Chat */}
          <div className="lg:col-span-7 space-y-5">
            {selectedCase ? (
              <>
                {/* Member Profile Snapshot & Guardrails Card */}
                <div className="glass-panel p-5 border border-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-border gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-[20px] font-[900] text-text">{selectedCase.member.name}</h2>
                        <span className="badge-yellow text-[10.5px] font-bold">
                          {selectedCase.member.planId} TIER
                        </span>
                        {selectedCase.status === "BROUGHT_BACK" && (
                          <span className="px-2 py-0.5 rounded-[6px] bg-positive/15 text-positive border border-positive/30 text-[10px] font-bold">
                            RECOVERED
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-text-muted mt-1.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-accent" />
                          {selectedCase.member.phone}
                        </span>
                        <span>•</span>
                        <span>Goal: <strong className="text-text font-bold">{selectedCase.member.goal}</strong></span>
                        <span>•</span>
                        <span>Studio: <strong className="text-text font-bold">{selectedCase.member.studio}</strong></span>
                        <span>•</span>
                        <span>Coach: <strong className="text-text font-bold">{selectedCase.member.trainer?.name || "Floor Staff"}</strong></span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        Preferred Language
                      </span>
                      <span className="text-[12px] font-bold text-accent uppercase">
                        {selectedCase.member.language === "ur" ? "Roman Urdu" : "English"}
                      </span>
                    </div>
                  </div>

                  {/* Attendance Habit Deterioration Chart */}
                  <MemberHabitDropChart
                    memberName={selectedCase.member.name}
                    normalVisits={selectedCase.normalVisitsPerWeek}
                    daysAway={selectedCase.daysAway}
                  />

                  {/* Section 3 Guardrail Compliance Status Strip */}
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider block mb-2">
                      Outreach Eligibility Guardrails (Automated Verification)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>WhatsApp Opt-in: Active</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>Status: Active Member</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>Not Frozen</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>14-day Cooldown: Clear</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>Quiet Hours: 07:00-22:00</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>Prayer Buffer: Clear</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated WhatsApp Mobile Phone Frame */}
                <div className="glass-panel p-5 border border-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-accent" />
                      <span className="text-[13px] font-[900] text-text">
                        WhatsApp Outreach Preview
                      </span>
                    </div>

                    {/* Language Switcher and Gemini Regeneration */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-[8px] bg-glass border border-border p-0.5 text-[11px]">
                        <button
                          onClick={() => handleRegenerateDraft("en")}
                          disabled={isRegenerating || selectedCase.status === "CONTACTED" || selectedCase.status === "BROUGHT_BACK"}
                          className={`px-2.5 py-1 rounded-[6px] font-bold transition-all ${
                            selectedLanguage === "en" ? "bg-accent text-on-accent" : "text-text-muted hover:text-text"
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => handleRegenerateDraft("ur")}
                          disabled={isRegenerating || selectedCase.status === "CONTACTED" || selectedCase.status === "BROUGHT_BACK"}
                          className={`px-2.5 py-1 rounded-[6px] font-bold transition-all ${
                            selectedLanguage === "ur" ? "bg-accent text-on-accent" : "text-text-muted hover:text-text"
                          }`}
                        >
                          Roman Urdu
                        </button>
                      </div>

                      <button
                        onClick={() => handleRegenerateDraft(selectedLanguage)}
                        disabled={isRegenerating || selectedCase.status === "CONTACTED" || selectedCase.status === "BROUGHT_BACK"}
                        className="btn-secondary text-[11px] px-2.5 py-1 flex items-center gap-1"
                        title="Regenerate message with Gemini"
                      >
                        <Sparkles className={`w-3 h-3 text-accent ${isRegenerating ? "animate-spin" : ""}`} />
                        <span>Regen</span>
                      </button>
                    </div>
                  </div>

                  {/* Editable Draft Text Area (only if in draft stage) */}
                  {selectedCase.status === "OPEN" && (
                    <div className="p-3 rounded-[12px] bg-glass border border-border/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-text-muted font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-accent" />
                          Gemini Draft (Editable before sending)
                        </span>
                        {!isEditingDraft ? (
                          <button
                            onClick={() => setIsEditingDraft(true)}
                            className="text-accent hover:underline text-[11px] font-bold"
                          >
                            Edit Text
                          </button>
                        ) : (
                          <button
                            onClick={handleSaveDraft}
                            className="text-positive hover:underline text-[11px] font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Save Changes
                          </button>
                        )}
                      </div>

                      {isEditingDraft ? (
                        <textarea
                          rows={3}
                          value={draftEditText}
                          onChange={(e) => setDraftEditText(e.target.value)}
                          className="w-full p-2.5 rounded-[8px] bg-background border border-border text-[12.5px] text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent leading-relaxed"
                        />
                      ) : (
                        <p className="text-[12.5px] text-text-muted italic leading-relaxed">
                          &quot;{draftEditText}&quot;
                        </p>
                      )}
                    </div>
                  )}

                  {/* PHONE CHAT SHELL */}
                  <div className="rounded-[22px] border-2 border-border bg-[#0B141B] text-[#E9EDEF] overflow-hidden shadow-2xl">
                    {/* Phone Top Notch / Speaker Bar */}
                    <div className="bg-[#1F2C34] px-4 py-1.5 flex items-center justify-between text-[10px] text-[#8696A0] border-b border-white/5">
                      <span className="font-mono">11:42</span>
                      <div className="w-16 h-3 bg-black/40 rounded-full mx-auto" />
                      <span>WhatsApp • TRI FIT</span>
                    </div>

                    {/* WhatsApp Business Header */}
                    <div className="bg-[#1F2C34] px-4 py-3 flex items-center justify-between border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-accent text-on-accent font-[900] flex items-center justify-center text-[12px] shadow-sm">
                          TF
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-[13px] text-white font-[800]">
                              {selectedCase.member.branch.name}
                            </strong>
                            <span className="text-[#00A884] text-[12px] font-bold" title="Verified Gym Account">
                              ✓
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8696A0] block">Official Business Account</span>
                        </div>
                      </div>

                      <span className="text-[9.5px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/20">
                        Official Channel
                      </span>
                    </div>

                    {/* Chat Messages Log */}
                    <div className="p-4 space-y-3.5 min-h-[220px] max-h-[360px] overflow-y-auto bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                      {/* Safety Encryption Notice */}
                      <div className="p-2 rounded-[8px] bg-[#182229] border border-white/5 text-[10px] text-[#8696A0] text-center max-w-[85%] mx-auto">
                        🔒 End-to-end encrypted outreach. Fully compliant with member messaging privacy policies.
                      </div>

                      {/* Render All Messages in Chronological Order */}
                      {selectedCase.messages.map((msg) => {
                        const isOutbound = msg.direction === "OUTBOUND";
                        const isDraft = msg.status === "draft";
                        const isDelivered = msg.status === "delivered";
                        const isSent = msg.status === "sent";

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOutbound ? "justify-end" : "justify-start"} animate-in fade-in`}
                          >
                            <div
                              className={`max-w-[85%] p-3.5 rounded-[16px] shadow-md text-[13px] leading-relaxed ${
                                isOutbound
                                  ? "bg-[#005C4B] text-white rounded-tr-none"
                                  : "bg-[#202C33] text-[#E9EDEF] rounded-tl-none border border-white/5"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.body}</p>

                              {/* Inbound Tag & Handover Badges */}
                              {msg.replyTags && msg.replyTags.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5">
                                  {msg.replyTags.map((tag) => (
                                    <span
                                      key={tag.id}
                                      className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase ${
                                        tag.handedToHuman
                                          ? "bg-negative text-white"
                                          : "bg-white/15 text-accent"
                                      }`}
                                    >
                                      TAG: {tag.reason}
                                      {tag.handedToHuman && " • MEDICAL HANDOVER"}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Timestamp and Ticks */}
                              <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-[#8696A0]">
                                <span>
                                  {msg.sentAt
                                    ? new Date(msg.sentAt).toLocaleTimeString("en-PK", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Draft"}
                                </span>
                                {isOutbound && (
                                  <span>
                                    {isDraft ? (
                                      <Clock className="w-3 h-3 text-[#8696A0] inline" />
                                    ) : (
                                      <span className="text-[#53BDEB] font-bold">✓✓</span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat Simulation Quick-Action Panel */}
                    <div className="p-3 bg-[#1F2C34] border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#8696A0]">
                        <span className="font-bold">Member Response Simulation (Sandbox)</span>
                        <span>Auto-send is OFF</span>
                      </div>

                      {/* Reply Simulation Buttons */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleSimulateReply("work")}
                          disabled={isSimulatingReply || selectedCase.status === "OPEN"}
                          className="px-2.5 py-1 rounded-[8px] bg-white/10 hover:bg-white/20 text-[11px] text-white disabled:opacity-40 transition-colors"
                        >
                          💼 Work / Audit
                        </button>
                        <button
                          onClick={() => handleSimulateReply("travel")}
                          disabled={isSimulatingReply || selectedCase.status === "OPEN"}
                          className="px-2.5 py-1 rounded-[8px] bg-white/10 hover:bg-white/20 text-[11px] text-white disabled:opacity-40 transition-colors"
                        >
                          ✈️ Travel (Lahore)
                        </button>
                        <button
                          onClick={() => handleSimulateReply("injury")}
                          disabled={isSimulatingReply || selectedCase.status === "OPEN"}
                          className="px-2.5 py-1 rounded-[8px] bg-negative/30 hover:bg-negative/40 text-negative border border-negative/40 text-[11px] font-bold disabled:opacity-40 transition-colors"
                        >
                          ⚠️ Injury (Pain trigger)
                        </button>
                        <button
                          onClick={() => handleSimulateReply("cost")}
                          disabled={isSimulatingReply || selectedCase.status === "OPEN"}
                          className="px-2.5 py-1 rounded-[8px] bg-white/10 hover:bg-white/20 text-[11px] text-white disabled:opacity-40 transition-colors"
                        >
                          💰 Budget / Cost
                        </button>
                        <button
                          onClick={() => handleSimulateReply("boredom")}
                          disabled={isSimulatingReply || selectedCase.status === "OPEN"}
                          className="px-2.5 py-1 rounded-[8px] bg-white/10 hover:bg-white/20 text-[11px] text-white disabled:opacity-40 transition-colors"
                        >
                          🎯 Lost Motivation
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Primary Workflow Actions (Approval & Check-In Simulation) */}
                  <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11.5px] text-text-muted">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                      <span>Manager sign-off required. No member receives unapproved messages.</span>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      {selectedCase.status === "OPEN" ? (
                        <button
                          onClick={handleApprove}
                          disabled={isApproving}
                          className="btn-primary text-[13px] py-2.5 px-5 flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isApproving ? "Dispatched..." : "Approve & Send Outreach"}</span>
                        </button>
                      ) : selectedCase.status === "CONTACTED" ? (
                        <button
                          onClick={handleSimulateCheckIn}
                          disabled={isCheckingIn}
                          className="px-5 py-2.5 rounded-[12px] bg-positive text-white font-[800] text-[13px] hover:bg-positive/90 transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>{isCheckingIn ? "Recording Check-in..." : "Simulate: Member Checks In"}</span>
                        </button>
                      ) : (
                        <div className="px-4 py-2 rounded-[12px] bg-positive/15 border border-positive/30 text-positive text-[12.5px] font-[800] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Case Resolved: Member Returned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-panel p-12 text-center text-text-muted">
                Select an absent member from the queue to view analytics and approve outreach.
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </BranchPortalLayout>
  );
}
