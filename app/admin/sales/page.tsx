"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  Users,
  Filter,
  Phone,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserPlus,
  Clock,
  Send,
  Plus,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  branch: string;
  targetPlan: string;
  stage: "NEW" | "TOUR" | "TRIAL" | "PROPOSAL" | "WON";
  valuePKR: number;
}

interface UpsellDeal {
  id: string;
  memberName: string;
  phone: string;
  branch: string;
  type: "3M_TO_12M_ROLLOVER" | "FORMA_3D_PT" | "CORPORATE_BULK";
  dealTitle: string;
  stage: "IDENTIFIED" | "DIAGNOSTIC_BOOKED" | "PROPOSAL_SENT" | "NEGOTIATION" | "WON";
  valuePKR: number;
}

const INITIAL_UPSELL_DEALS: UpsellDeal[] = [
  { id: "up-1", memberName: "Zaid Khan", phone: "+92 300 8219472", branch: "Seaview DHA", type: "3M_TO_12M_ROLLOVER", dealTitle: "Roll 3M into TriFit Plus 12M + 12 PT", stage: "PROPOSAL_SENT", valuePKR: 80000 },
  { id: "up-2", memberName: "Bilal Tariq", phone: "+92 321 9988112", branch: "Clifton Flagship", type: "FORMA_3D_PT", dealTitle: "Forma 3D Plateau → 16-Week PT Hypertrophy", stage: "DIAGNOSTIC_BOOKED", valuePKR: 55000 },
  { id: "up-3", memberName: "Mariam Farooq", phone: "+92 333 8899221", branch: "AJ Tower Islamabad", type: "CORPORATE_BULK", dealTitle: "JS Bank Visa Platinum Annual Lock-in", stage: "NEGOTIATION", valuePKR: 101399 },
  { id: "up-4", memberName: "Shahzad Iqbal", phone: "+92 300 1122334", branch: "LuckyOne Mall", type: "3M_TO_12M_ROLLOVER", dealTitle: "TriFit Regular 3M → Plus 12M Rollover", stage: "IDENTIFIED", valuePKR: 90000 },
  { id: "up-5", memberName: "Dr. Fatima Noor", phone: "+92 321 4455889", branch: "Seaview DHA", type: "FORMA_3D_PT", dealTitle: "Spine & Core Reformer PT Package", stage: "WON", valuePKR: 65000 },
];

const INITIAL_LEADS: Lead[] = [
  { id: "lead-1", name: "Danyal Zafar", phone: "+92 300 4819283", source: "Instagram Ad", branch: "Seaview DHA", targetPlan: "TriFit Plus (12M)", stage: "NEW", valuePKR: 155999 },
  { id: "lead-2", name: "Areeba Sheikh", phone: "+92 321 8492019", source: "Walk-in Guest", branch: "Clifton Flagship", targetPlan: "TriFit Regular (6M)", stage: "TOUR", valuePKR: 84999 },
  { id: "lead-3", name: "Farhan Ali", phone: "+92 333 9182374", source: "Corporate Referral", branch: "LuckyOne Mall", targetPlan: "TriFit Plus (12M)", stage: "TRIAL", valuePKR: 155999 },
  { id: "lead-4", name: "Zoya Siddiqui", phone: "+92 301 2948192", source: "Google Maps", branch: "AJ Tower Islamabad", targetPlan: "TriFit Plus (3M)", stage: "PROPOSAL", valuePKR: 65999 },
  { id: "lead-5", name: "Khurram Nawaz", phone: "+92 345 1029384", source: "Friend Referral", branch: "Seaview DHA", targetPlan: "TriFit Plus (12M)", stage: "WON", valuePKR: 155999 },
  { id: "lead-6", name: "Marium Tariq", phone: "+92 312 9482019", source: "Website Lead", branch: "Clifton Flagship", targetPlan: "TriFit Regular (12M)", stage: "NEW", valuePKR: 122999 },
  { id: "lead-7", name: "Bilal Chaudhry", phone: "+92 302 9182746", source: "Instagram Ad", branch: "AJ Tower Islamabad", targetPlan: "TriFit Regular (3M)", stage: "TOUR", valuePKR: 52999 },
];

const FUNNEL_STAGES = [
  { stage: "Inquiries", count: 480, percentage: 100, color: "#38BDF8" },
  { stage: "Club Tours", count: 326, percentage: 68, color: "#06B6D4" },
  { stage: "Free Trial Pass", count: 211, percentage: 44, color: "#10B981" },
  { stage: "Price Proposal", count: 134, percentage: 28, color: "#F59E0B" },
  { stage: "Enrolled & Paid", count: 88, percentage: 18.4, color: "#FBBF24" },
];

export default function AdminSalesPage() {
  const [pipelineView, setPipelineView] = useState<"NEW_INQUIRIES" | "MEMBER_UPGRADES">("NEW_INQUIRIES");
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [upsellDeals, setUpsellDeals] = useState<UpsellDeal[]>(INITIAL_UPSELL_DEALS);
  const [selectedBranch, setSelectedBranch] = useState("ALL");

  const filteredLeads = leads.filter(
    (l) => selectedBranch === "ALL" || l.branch.toLowerCase().includes(selectedBranch.toLowerCase())
  );

  const filteredUpsellDeals = upsellDeals.filter(
    (d) => selectedBranch === "ALL" || d.branch.toLowerCase().includes(selectedBranch.toLowerCase())
  );

  const moveStage = (leadId: string, newStage: Lead["stage"]) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l)));
  };

  const moveUpsellStage = (dealId: string, newStage: UpsellDeal["stage"]) => {
    setUpsellDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
  };

  return (
    <AdminPortalLayout activeItem="sales">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[var(--accent)] text-[var(--on-accent)]">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="admin-page-title text-2xl font-bold tracking-tight text-[var(--text)]">
                Sales Pipeline & Conversion CRM
              </h1>
            </div>
            <p className="body-label text-xs sm:text-sm mt-1 text-[var(--muted)]">
              Multi-branch lead conversion Kanban: From digital inquiry to paid TriFit subscription.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/members/new"
              className="btn primary !h-[40px] !px-4 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Converted Lead</span>
            </Link>
          </div>
        </div>

        {/* PRIMARY PIPELINE TOGGLE: NEW INQUIRIES VS EXISTING MEMBER UPGRADES */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass border border-[var(--line)]">
          <button
            type="button"
            onClick={() => setPipelineView("NEW_INQUIRIES")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              pipelineView === "NEW_INQUIRIES"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>New Inquiries & Walk-In Kanban (480 Inquiries → 88 Won)</span>
          </button>
          <button
            type="button"
            onClick={() => setPipelineView("MEMBER_UPGRADES")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              pipelineView === "MEMBER_UPGRADES"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Member Upgrade & Renewal Pipeline (3M→12M Rollovers, PT Diagnostics)</span>
          </button>
        </div>

        {pipelineView === "NEW_INQUIRIES" ? (
          <>
            {/* SECTION 1: Conversion Funnel Bar Chart */}
            <div className="glass p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="card-title text-[var(--text)]">Membership Conversion Funnel (30d)</h3>
                  <p className="body-label text-xs mt-1 text-[var(--muted)]">
                    Lead progression velocity across all 4 flagship clubs
                  </p>
                </div>
                <span className="admin-chip font-mono text-[var(--accent)]">18.4% End-to-End Win Rate</span>
              </div>

              <div className="space-y-3 pt-2">
                {FUNNEL_STAGES.map((step) => (
                  <div key={step.stage} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[var(--text)] font-semibold">{step.stage}</span>
                      <span className="text-[var(--muted)]">
                        {step.count} leads ({step.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[var(--track)] h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${step.percentage}%`, background: step.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: Kanban Pipeline Board */}
            <div className="glass p-6 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="card-title text-[var(--text)]">Interactive Leads Kanban Board</h3>
                  <p className="body-label text-xs mt-1 text-[var(--muted)]">
                    Move leads across stages or trigger direct WhatsApp consultations
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--muted)]">Club Filter:</span>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] outline-none"
                  >
                    <option value="ALL">All Flagships</option>
                    <option value="Seaview">Seaview DHA</option>
                    <option value="Clifton">Clifton Flagship</option>
                    <option value="LuckyOne">LuckyOne Mall</option>
                    <option value="AJ Tower">AJ Tower Islamabad</option>
                  </select>
                </div>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                {[
                  { id: "NEW", title: "New Inquiries", badgeBg: "bg-cyan-500/20 text-cyan-400" },
                  { id: "TOUR", title: "Tour Booked", badgeBg: "bg-blue-500/20 text-blue-400" },
                  { id: "TRIAL", title: "Trial Workout", badgeBg: "bg-emerald-500/20 text-emerald-400" },
                  { id: "PROPOSAL", title: "Proposal Sent", badgeBg: "bg-amber-500/20 text-amber-400" },
                  { id: "WON", title: "Closed / Won", badgeBg: "bg-[var(--accent)]/20 text-[var(--accent)]" },
                ].map((col) => {
                  const colLeads = filteredLeads.filter((l) => l.stage === col.id);

                  return (
                    <div key={col.id} className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] flex flex-col gap-3 min-h-[300px]">
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                        <span className="font-bold text-xs text-[var(--text)]">{col.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeBg}`}>
                          {colLeads.length}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1">
                        {colLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--accent)]/40 transition-all space-y-2 text-xs"
                          >
                            <div className="font-bold text-[var(--text)]">{lead.name}</div>
                            <div className="text-[11px] text-[var(--muted)] font-mono">{lead.phone}</div>
                            <div className="text-[10px] text-[var(--accent)] font-semibold">{lead.targetPlan}</div>
                            <div className="text-[10.5px] font-mono text-[var(--muted)] flex justify-between">
                              <span>{lead.branch}</span>
                              <span className="text-[var(--text)] font-bold">PKR {(lead.valuePKR / 1000).toFixed(0)}k</span>
                            </div>

                            {/* Stage progress action buttons */}
                            <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-[10.5px]">
                              <button
                                type="button"
                                onClick={() => {
                                  const msg = encodeURIComponent(`Hi ${lead.name}, this is TriFit ${lead.branch}. We look forward to welcoming you for your club tour.`);
                                  window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
                                }}
                                className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>

                              {col.id !== "WON" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextStages: Record<Lead["stage"], Lead["stage"]> = {
                                      NEW: "TOUR",
                                      TOUR: "TRIAL",
                                      TRIAL: "PROPOSAL",
                                      PROPOSAL: "WON",
                                      WON: "WON",
                                    };
                                    moveStage(lead.id, nextStages[lead.stage]);
                                  }}
                                  className="text-[var(--accent)] font-bold hover:underline cursor-pointer"
                                >
                                  Advance →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* =========================================================================
             MEMBER UPGRADE & RENEWAL PIPELINE (ACCOUNTABILITY FOR EXPANDING SUBSCRIBERS)
             ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Upgrade Pipeline Summary Header */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="glass p-4 rounded-xl">
                <div className="text-[10.5px] uppercase font-bold text-[var(--muted)]">3M → 12M Rollover Pool</div>
                <div className="text-xl font-bold font-mono text-[var(--accent)] mt-1">1,602 Members</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">Month 2 active attenders</div>
              </div>
              <div className="glass p-4 rounded-xl">
                <div className="text-[10.5px] uppercase font-bold text-[var(--muted)]">Forma 3D PT Diagnostics</div>
                <div className="text-xl font-bold font-mono text-purple-400 mt-1">810 Plateaued</div>
                <div className="text-[10px] text-purple-300 mt-0.5">121 sessions booked</div>
              </div>
              <div className="glass p-4 rounded-xl">
                <div className="text-[10.5px] uppercase font-bold text-[var(--muted)]">Corporate Bulk Renewals</div>
                <div className="text-xl font-bold font-mono text-sky-400 mt-1">428 Cards</div>
                <div className="text-[10px] text-sky-300 mt-0.5">JS Bank 35% & ICAP deals</div>
              </div>
              <div className="glass p-4 rounded-xl">
                <div className="text-[10.5px] uppercase font-bold text-[var(--muted)]">Expansion Pipeline Value</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">PKR 8.39M</div>
                <div className="text-[10px] text-emerald-300 mt-0.5">Accountable sales target</div>
              </div>
            </div>

            {/* Member Upsell Deals Kanban */}
            <div className="glass p-6 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="card-title text-[var(--text)]">Existing Member Upgrade & Renewal Pipeline</h3>
                  <p className="body-label text-xs mt-1 text-[var(--muted)]">
                    Tracking active subscriber upsells across stages: Rollovers, PT Diagnostics & Corporate Expiries
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--muted)]">Club Filter:</span>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] outline-none"
                  >
                    <option value="ALL">All Flagships</option>
                    <option value="Seaview">Seaview DHA</option>
                    <option value="Clifton">Clifton Flagship</option>
                    <option value="LuckyOne">LuckyOne Mall</option>
                    <option value="AJ Tower">AJ Tower Islamabad</option>
                  </select>
                </div>
              </div>

              {/* 5-Column Upgrade Kanban */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                {[
                  { id: "IDENTIFIED", title: "1. Identified Pool", badgeBg: "bg-slate-500/20 text-slate-300" },
                  { id: "DIAGNOSTIC_BOOKED", title: "2. PT Diagnostic Booked", badgeBg: "bg-purple-500/20 text-purple-300" },
                  { id: "PROPOSAL_SENT", title: "3. Rollover Proposal", badgeBg: "bg-amber-500/20 text-amber-300" },
                  { id: "NEGOTIATION", title: "4. Partner Renewal", badgeBg: "bg-sky-500/20 text-sky-300" },
                  { id: "WON", title: "5. Upgraded & Closed", badgeBg: "bg-emerald-500/20 text-emerald-400" },
                ].map((col) => {
                  const colDeals = filteredUpsellDeals.filter((d) => d.stage === col.id);

                  return (
                    <div key={col.id} className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] flex flex-col gap-3 min-h-[300px]">
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                        <span className="font-bold text-xs text-[var(--text)]">{col.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeBg}`}>
                          {colDeals.length}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1">
                        {colDeals.map((deal) => (
                          <div
                            key={deal.id}
                            className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--accent)]/40 transition-all space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[var(--text)]">{deal.memberName}</span>
                              <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-[var(--chip)] text-[var(--accent)] font-mono font-bold">
                                {deal.type === "3M_TO_12M_ROLLOVER" ? "3M→12M" : deal.type === "FORMA_3D_PT" ? "3D PT" : "Corp"}
                              </span>
                            </div>
                            <div className="text-[11px] text-[var(--muted)] font-mono">{deal.phone}</div>
                            <div className="text-[10.5px] text-[var(--text)] font-semibold line-clamp-2">{deal.dealTitle}</div>
                            <div className="text-[10.5px] font-mono text-[var(--muted)] flex justify-between pt-1 border-t border-[var(--line)]">
                              <span>{deal.branch}</span>
                              <span className="text-emerald-400 font-bold">+PKR {(deal.valuePKR / 1000).toFixed(0)}k</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-1 text-[10.5px]">
                              <button
                                type="button"
                                onClick={() => {
                                  const msg = encodeURIComponent(`Hi ${deal.memberName}, this is TriFit ${deal.branch}. Regarding your subscription upgrade offer: ${deal.dealTitle}.`);
                                  window.open(`https://wa.me/${deal.phone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
                                }}
                                className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>

                              {col.id !== "WON" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextStages: Record<UpsellDeal["stage"], UpsellDeal["stage"]> = {
                                      IDENTIFIED: "DIAGNOSTIC_BOOKED",
                                      DIAGNOSTIC_BOOKED: "PROPOSAL_SENT",
                                      PROPOSAL_SENT: "NEGOTIATION",
                                      NEGOTIATION: "WON",
                                      WON: "WON",
                                    };
                                    moveUpsellStage(deal.id, nextStages[deal.stage]);
                                  }}
                                  className="text-[var(--accent)] font-bold hover:underline cursor-pointer"
                                >
                                  Advance →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}
