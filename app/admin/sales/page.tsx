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
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedBranch, setSelectedBranch] = useState("ALL");

  const filteredLeads = leads.filter(
    (l) => selectedBranch === "ALL" || l.branch.toLowerCase().includes(selectedBranch.toLowerCase())
  );

  const moveStage = (leadId: string, newStage: Lead["stage"]) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l)));
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
              className="btn primary !h-[40px] !px-4 text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Converted Lead</span>
            </Link>
          </div>
        </div>

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
                            className="text-emerald-400 hover:underline flex items-center gap-1"
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
                              className="text-[var(--accent)] font-bold hover:underline"
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
    </AdminPortalLayout>
  );
}
