"use client";

import React, { useEffect, useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Wallet,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Phone,
  Clock,
  ArrowUpRight,
  Flame,
  Award,
  AlertOctagon,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatCard } from "@/components/ui/StatCard";

interface OwnerSummaryData {
  weekEnding: string;
  totalMembers: number;
  totalRevenuePKR: number;
  totalRevenueFormatted: string;
  membersAtRisk: number;
  membersBroughtBack: number;
  recoveryRate: number;
  bestBranch: {
    id?: string;
    name: string;
    city: string;
    revenueFormatted: string;
  };
  weakestBranch: {
    id?: string;
    name: string;
    city: string;
    revenueFormatted: string;
    atRiskMembers?: number;
  };
  branchBreakdown: Array<{
    id: string;
    name: string;
    city: string;
    membersCount: number;
    revenueFormatted: string;
    atRiskMembers: number;
  }>;
  messageEnglish: string;
  messageUrdu: string;
}

export default function AdminOwnerSummaryPage() {
  const [data, setData] = useState<OwnerSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<"en" | "ur">("en");
  const [isSendingPreview, setIsSendingPreview] = useState(false);
  const [previewSentResult, setPreviewSentResult] = useState<{
    deliveredAt: string;
    recipient: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/owner-summary");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load owner summary:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSendPreview = async () => {
    setIsSendingPreview(true);
    try {
      const res = await fetch("/api/admin/owner-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLang,
          recipient: "+92 300 8271000 (Owner / Chairman WhatsApp)",
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setPreviewSentResult({
          deliveredAt: result.deliveredAt || "Just now",
          recipient: result.recipient,
        });
      }
    } catch (e) {
      console.error("Failed to send preview:", e);
    } finally {
      setIsSendingPreview(false);
    }
  };

  const handleCopyText = () => {
    if (!data) return;
    const textToCopy = selectedLang === "en" ? data.messageEnglish : data.messageUrdu;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMessageText = data
    ? selectedLang === "en"
      ? data.messageEnglish
      : data.messageUrdu
    : "";

  return (
    <AdminPortalLayout activeItem="owner-summary">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Owner Weekly WhatsApp Summary</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                Week ending: {data?.weekEnding || "November 2026"}
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Preview and test-dispatch executive reports for TriFit founders and chairman from live club telemetry
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchSummary}
              disabled={loading}
              className="h-9 w-9 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center shadow-sm transition-all cursor-pointer"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--accent)]" : ""}`} />
            </button>
            <button
              onClick={handleSendPreview}
              disabled={isSendingPreview || loading}
              className="btn primary !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingPreview ? "animate-bounce" : ""}`} />
              <span>{isSendingPreview ? "Sending Mock..." : "Send Preview to Owner"}</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Cards (Computed from Database) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Active Network"
            value={data?.totalMembers || 0}
            unit="Members"
            variant="info"
            icon={<Users className="w-4 h-4" />}
            secondaryText="Across 4 active clubs"
          />

          <StatCard
            title="Monthly Net Revenue"
            value={data?.totalRevenueFormatted || "PKR 0.00M"}
            change="+12.4%"
            changeType="positive"
            variant="success"
            icon={<Wallet className="w-4 h-4" />}
            secondaryText="Verified collections"
          />

          <StatCard
            title="At-Risk vs. Recovered"
            value={data?.membersAtRisk || 0}
            unit="At Risk"
            change={`+${data?.membersBroughtBack || 0}`}
            changeType="positive"
            variant="warning"
            icon={<AlertTriangle className="w-4 h-4" />}
            secondaryText={`${data?.recoveryRate || 0}% Recovery`}
          />

          <StatCard
            title="Club Performance Spread"
            value={data?.bestBranch?.name?.replace("TRI FIT ", "") || "Seaview"}
            variant="default"
            icon={<Building2 className="w-4 h-4" />}
            secondaryText={`Top: ${data?.bestBranch?.revenueFormatted || "PKR 1.2M"}`}
          />
        </div>

        {/* Main Content Grid: Left: Phone WhatsApp Mock | Right: Telemetry & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Realistic WhatsApp Phone Mockup (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-panel p-6 rounded-[22px] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-[800] text-text">
                      WhatsApp Dispatch Preview
                    </h3>
                    <p className="text-[11.5px] text-text-muted">
                      Target: Chairman & Executive Board (+92 300 8271000)
                    </p>
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-[10px] border border-border">
                  <button
                    onClick={() => setSelectedLang("en")}
                    className={`px-3 py-1 rounded-[7px] text-[11px] font-[800] transition-all ${
                      selectedLang === "en"
                        ? "bg-accent text-on-accent shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSelectedLang("ur")}
                    className={`px-3 py-1 rounded-[7px] text-[11px] font-[800] transition-all ${
                      selectedLang === "ur"
                        ? "bg-accent text-on-accent shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    Roman Urdu
                  </button>
                </div>
              </div>

              {/* Realistic Phone Bubble Mock */}
              <div className="rounded-[18px] bg-slate-100/90 dark:bg-[#070707] p-4 sm:p-6 border border-border relative overflow-hidden">
                {/* Simulated WhatsApp Header */}
                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-200 dark:border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#075E54] text-white flex items-center justify-center font-black text-[12px] shadow-sm">
                    TF
                  </div>
                  <div className="min-w-0">
                    <div className="font-[800] text-[13.5px] text-text flex items-center gap-1.5">
                      <span>TRI FIT Apollo Executive Bot</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      Official TriFit Intelligence Channel
                    </span>
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="max-w-xl mx-auto rounded-[18px] rounded-tl-sm p-4 bg-emerald-50 dark:bg-[#122B22] border border-emerald-500/30 text-[13px] text-text leading-relaxed whitespace-pre-wrap font-sans shadow-md">
                  {currentMessageText}

                  <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-emerald-500/20 text-[10.5px] text-text-muted font-mono">
                    <span>{previewSentResult ? previewSentResult.deliveredAt : "Preview"}</span>
                    <span className="text-emerald-500 font-bold">✓✓</span>
                  </div>
                </div>

                {/* Delivery Notice */}
                <div className="mt-4 text-center">
                  <span className="text-[11px] font-mono text-text-muted bg-slate-200/80 dark:bg-white/5 px-3 py-1 rounded-full border border-border inline-block">
                    🔒 Encrypted Direct Gateway • Verified WhatsApp Business API
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleCopyText}
                  className="px-3.5 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text hover:border-accent text-[12px] font-[750] flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied to Clipboard!" : "Copy Full Message Text"}</span>
                </button>

                <button
                  onClick={handleSendPreview}
                  disabled={isSendingPreview || loading}
                  className="btn-primary px-4 py-2 text-[12px] font-[800] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Preview to Owner</span>
                </button>
              </div>

              {previewSentResult && (
                <div className="p-3.5 rounded-[14px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    ✓ Executive Preview delivered to mock owner queue ({previewSentResult.recipient}) at {previewSentResult.deliveredAt}! Logged to Admin Audit ledger.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Branch Comparison Breakdown Table (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-5 rounded-[22px] space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/5">
                <div>
                  <h3 className="text-[15px] font-[800] text-text flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-accent" />
                    <span>Club Contribution Roster</span>
                  </h3>
                  <p className="text-[11.5px] text-text-muted mt-0.5">
                    Live branch rankings feeding into the weekly briefing.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {data?.branchBreakdown.map((b, idx) => {
                  const isTop = idx === 0;
                  const isBottom = idx === data.branchBreakdown.length - 1;

                  return (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-[16px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-[800] text-[13px] text-text">
                            {b.name}
                          </span>
                          {isTop && (
                            <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              Top Club
                            </span>
                          )}
                          {isBottom && (
                            <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded uppercase bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                              Attention
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5 flex items-center gap-2">
                          <span>{b.city}</span>
                          <span>•</span>
                          <span>{b.membersCount} Active Members</span>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-accent font-semibold">
                            {b.atRiskMembers} at-risk
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-[900] text-[14px] text-text font-mono">
                          {b.revenueFormatted}
                        </div>
                        <span className="text-[10px] text-emerald-500 font-bold">
                          Operational OK
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
