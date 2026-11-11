"use client";

import React, { useEffect, useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  CheckCircle2,
  Building2,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Phone,
  Clock,
  Award,
} from "lucide-react";
import { FunnelSteps } from "@/components/charts";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatCard } from "@/components/ui/StatCard";

interface FunnelData {
  selectedBranchId: string | null;
  networkFunnel: {
    enquiriesCount: number;
    toursCount: number;
    trialsCount: number;
    joinedCount: number;
    overallConversionRate: number;
    funnelSteps: Array<{
      step: string;
      count: number;
      rate: number;
    }>;
  };
  branchBreakdown: Array<{
    branchId: string;
    branchName: string;
    city: string;
    enquiriesCount: number;
    toursCount: number;
    trialsCount: number;
    joinedCount: number;
    overallConversionRate: number;
    funnelSteps: Array<{
      step: string;
      count: number;
      rate: number;
    }>;
  }>;
  topConvertingBranch: {
    branchId: string;
    branchName: string;
    overallConversionRate: number;
  };
  recentLeads: Array<{
    id: string;
    name: string;
    phone: string;
    stage: "ENQUIRY" | "TOUR_BOOKED" | "TRIAL_ATTENDED" | "JOINED";
    branchId: string;
    branchName: string;
    createdAt: string;
  }>;
}

export default function AdminTourConversionFunnelPage() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [advancingLeadId, setAdvancingLeadId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchFunnelData = async (branchId: string = "ALL") => {
    setLoading(true);
    try {
      const url = branchId !== "ALL" ? `/api/admin/funnel?branchId=${branchId}` : "/api/admin/funnel";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load conversion funnel data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunnelData(selectedBranchId);
  }, [selectedBranchId]);

  const handleAdvanceStage = async (leadId: string, currentStage: string) => {
    let nextStage = "TOUR_BOOKED";
    if (currentStage === "ENQUIRY") nextStage = "TOUR_BOOKED";
    else if (currentStage === "TOUR_BOOKED") nextStage = "TRIAL_ATTENDED";
    else if (currentStage === "TRIAL_ATTENDED") nextStage = "JOINED";
    else return;

    setAdvancingLeadId(leadId);
    try {
      const res = await fetch("/api/admin/funnel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, nextStage }),
      });
      if (res.ok) {
        setActionSuccess(`Lead advanced to ${nextStage.replace("_", " ")}!`);
        setTimeout(() => setActionSuccess(null), 3000);
        await fetchFunnelData(selectedBranchId);
      }
    } catch (e) {
      console.error("Failed to advance lead:", e);
    } finally {
      setAdvancingLeadId(null);
    }
  };

  // Determine active funnel stats
  const activeFunnel =
    selectedBranchId === "ALL"
      ? data?.networkFunnel
      : data?.branchBreakdown.find((b) => b.branchId === selectedBranchId) || data?.networkFunnel;

  const filteredLeads = (data?.recentLeads || []).filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <AdminPortalLayout activeItem="funnel">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Trial & Tour Conversion Funnel</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                {activeFunnel?.overallConversionRate || 0}% Overall Conversion
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Track walk-in and online lead progression across clubs: Enquiry → Tour → Free Trial → Joined
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Branch Selector Dropdown */}
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="h-9 px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] font-semibold text-xs shadow-sm focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="ALL">All Clubs (Network Funnel)</option>
              {data?.branchBreakdown.map((b) => (
                <option key={b.branchId} value={b.branchId}>
                  {b.branchName}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchFunnelData(selectedBranchId)}
              disabled={loading}
              className="h-9 w-9 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center shadow-sm transition-all cursor-pointer"
              title="Refresh Funnel Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--accent)]" : ""}`} />
            </button>
          </div>
        </div>

        {/* 4-Step KPI Conversion Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="1. Initial Enquiries"
            value={activeFunnel?.enquiriesCount || 0}
            unit="Leads"
            variant="info"
            icon={<Users className="w-4 h-4" />}
            secondaryText="100% Base Volume"
          />

          <StatCard
            title="2. Club Tours Booked"
            value={activeFunnel?.toursCount || 0}
            unit="Tours"
            change={`${activeFunnel?.enquiriesCount ? Math.round(((activeFunnel.toursCount || 0) / activeFunnel.enquiriesCount) * 100) : 0}%`}
            changeType="positive"
            variant="warning"
            icon={<CalendarCheck className="w-4 h-4" />}
            secondaryText="Floor Walkthroughs"
          />

          <StatCard
            title="3. Free Trials Attended"
            value={activeFunnel?.trialsCount || 0}
            unit="Trials"
            change={`${activeFunnel?.enquiriesCount ? Math.round(((activeFunnel.trialsCount || 0) / activeFunnel.enquiriesCount) * 100) : 0}%`}
            changeType="positive"
            variant="warning"
            icon={<Award className="w-4 h-4" />}
            secondaryText="Completed 1-day pass"
          />

          <StatCard
            title="4. Paid Members Joined"
            value={activeFunnel?.joinedCount || 0}
            unit="Members"
            change={`${activeFunnel?.overallConversionRate || 0}%`}
            changeType="positive"
            variant="success"
            icon={<CheckCircle2 className="w-4 h-4" />}
            secondaryText="Converted to Members"
          />
        </div>

        {/* 2-Column Section: Visual Funnel Chart + Club Conversion Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Funnel Steps Chart Component (7 Cols) */}
          <div className="lg:col-span-7">
            <FunnelSteps
              data={activeFunnel?.funnelSteps || []}
              title={`Lead Conversion Funnel — ${
                selectedBranchId === "ALL"
                  ? "Network-Wide"
                  : data?.branchBreakdown.find((b) => b.branchId === selectedBranchId)?.branchName || ""
              }`}
              units="Leads"
              subtitle="Step-by-step progression from initial walk-in enquiry to verified paid membership"
            />
          </div>

          {/* Branch-by-Branch Conversion Comparison Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-5 rounded-[22px] space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/5">
                <div>
                  <h3 className="text-[15px] font-[800] text-text flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-accent" />
                    <span>Conversion by Branch</span>
                  </h3>
                  <p className="text-[11.5px] text-text-muted mt-0.5">
                    Conversion rate benchmarking across all 4 active clubs.
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-on-accent">
                  4 Active Clubs
                </span>
              </div>

              <div className="space-y-3">
                {data?.branchBreakdown.map((b) => {
                  const isTop = b.branchId === data?.topConvertingBranch?.branchId;

                  return (
                    <div
                      key={b.branchId}
                      onClick={() => setSelectedBranchId(b.branchId)}
                      className={`p-3.5 rounded-[16px] border transition-all cursor-pointer ${
                        selectedBranchId === b.branchId
                          ? "bg-accent/10 border-accent shadow-sm"
                          : "bg-slate-50 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/5 hover:border-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-[800] text-[13px] text-text">
                            {b.branchName}
                          </span>
                          {isTop && (
                            <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Award className="w-3 h-3" /> Top Converter
                            </span>
                          )}
                        </div>
                        <span className="text-[15px] font-[900] text-text font-mono">
                          {b.overallConversionRate}%
                        </span>
                      </div>

                      <div className="text-[11px] text-text-muted mt-1 flex items-center gap-2">
                        <span>{b.enquiriesCount} Enquiries</span>
                        <span>•</span>
                        <span>{b.toursCount} Tours</span>
                        <span>•</span>
                        <span className="text-emerald-500 font-bold">{b.joinedCount} Joined</span>
                      </div>

                      {/* Mini conversion progress bar */}
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-amber-600 rounded-full transition-all"
                          style={{ width: `${Math.min(b.overallConversionRate * 3.5, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Lead Progression Pipeline Table */}
        <div className="glass-panel p-6 rounded-[22px] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border dark:border-white/5">
            <div>
              <h3 className="text-[16px] font-[800] text-text flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span>Recent Lead Progression Pipeline</span>
              </h3>
              <p className="text-[12px] text-text-muted mt-0.5">
                Real-time lead status tracking. Click stage action to advance customer down the funnel.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by name, phone..."
                className="w-full pl-9 pr-3 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-[12px] text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {actionSuccess && (
            <div className="p-3 rounded-[12px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border dark:border-white/10 text-[11px] font-[750] text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-3">Lead Name</th>
                  <th className="py-3 px-3">WhatsApp Phone</th>
                  <th className="py-3 px-3">Club</th>
                  <th className="py-3 px-3">Current Funnel Stage</th>
                  <th className="py-3 px-3 text-right">Advance Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-white/5 text-[12.5px]">
                {filteredLeads.map((lead) => {
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-[800] text-text">{lead.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{lead.id}</div>
                      </td>

                      <td className="py-3 px-3 font-mono text-text-muted text-[12px]">
                        {lead.phone}
                      </td>

                      <td className="py-3 px-3 font-medium text-text">
                        {lead.branchName}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            lead.stage === "JOINED"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : lead.stage === "TRIAL_ATTENDED"
                              ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                              : lead.stage === "TOUR_BOOKED"
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                              : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-300 border border-border"
                          }`}
                        >
                          {lead.stage.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        {lead.stage === "JOINED" ? (
                          <span className="text-[11px] font-bold text-emerald-500 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Converted Member
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAdvanceStage(lead.id, lead.stage)}
                            disabled={advancingLeadId === lead.id}
                            className="px-3 py-1.5 rounded-[9px] bg-accent text-on-accent text-[11px] font-[800] hover:opacity-90 transition-opacity inline-flex items-center gap-1 shadow-sm"
                          >
                            <span>
                              {lead.stage === "ENQUIRY"
                                ? "Book Tour →"
                                : lead.stage === "TOUR_BOOKED"
                                ? "Start Trial →"
                                : "Mark Joined ✓"}
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
