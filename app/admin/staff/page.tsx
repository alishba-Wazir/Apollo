"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, Staff, Trainer } from "@/lib/apollo-demo-store";
import {
  UserCog,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Dumbbell,
  ShieldCheck,
  ChevronRight,
  Send,
  Calendar,
  AlertTriangle,
  Award,
} from "lucide-react";

export default function AdminStaffPage() {
  const { staff, trainers, branches } = useApolloStore();

  const [activeTab, setActiveTab] = useState<"COACHES" | "OPERATIONS">("COACHES");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("ALL");
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");

  // Coach specialties
  const specialties = ["ALL", "Strength & Hypertrophy", "Stages RPM Cycling", "Reformer Pilates", "HYROX Conditioning", "Vinyasa Flow"];

  // Filtered coaches
  const filteredTrainers = useMemo(() => {
    return trainers.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q) || t.phone.includes(q);
      const matchesBranch = selectedBranchFilter === "ALL" || t.branchId === selectedBranchFilter;
      const matchesSpec = selectedSpecialty === "ALL" || t.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
      return matchesSearch && matchesBranch && matchesSpec;
    });
  }, [trainers, searchQuery, selectedBranchFilter, selectedSpecialty]);

  return (
    <AdminPortalLayout activeItem="staff">
      <div className="flex flex-col gap-6 w-full pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="admin-page-title text-2xl font-bold tracking-tight text-[var(--text)]">
                Staff & Master Coaches Roster
              </h1>
              <span className="admin-chip text-xs">
                {trainers.length} REPs Certified Coaches
              </span>
            </div>
            <p className="body-label text-xs sm:text-sm mt-1 text-[var(--muted)]">
              Real-time coach accountability, shift clock-ins, studio schedules & payroll dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl glass text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("COACHES")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "COACHES"
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                Coaches & Trainers ({trainers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("OPERATIONS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "OPERATIONS"
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                Club Operations ({staff.length})
              </button>
            </div>
          </div>
        </div>

        {/* Top 4 Attendance & Shift Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Active Clock-ins</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">100%</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5">8 of 8 on floor right now</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Absenteeism Rate</div>
            <div className="text-2xl font-bold font-mono text-[var(--text)] mt-1">0.4%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Zero unexcused absences</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Monthly PT Volume</div>
            <div className="text-2xl font-bold font-mono text-[var(--accent)] mt-1">1,420</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5">Delivered sessions (PKR 2.13M)</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Avg Client Renewal</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">91.8%</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">Industry top quartile</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="glass p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search coach by name, specialty, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* Specialty Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs py-1">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSpecialty === spec
                      ? "bg-[var(--accent)] text-[var(--on-accent)]"
                      : "bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {spec === "ALL" ? "All Specialties" : spec}
                </button>
              ))}
            </div>

            {/* Branch Selector */}
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] outline-none"
            >
              <option value="ALL">All Flagships</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name.replace("TriFit ", "")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content: Coaches Cards (No Modals - Clicking Inspect navigates to /admin/staff/[id]) */}
        {activeTab === "COACHES" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTrainers.map((coach) => {
              const branch = branches.find((b) => b.id === coach.branchId);

              return (
                <div
                  key={coach.id}
                  className="glass p-5 rounded-2xl flex flex-col justify-between gap-4 border border-[var(--card-border)] hover:border-[var(--accent)]/40 transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] font-bold font-mono flex items-center justify-center text-base shrink-0 shadow-md">
                          {coach.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <Link
                            href={`/admin/staff/${coach.id}`}
                            className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors block"
                          >
                            {coach.name}
                          </Link>
                          <div className="text-[11px] text-[var(--accent)] font-semibold mt-0.5 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>{coach.specialty}</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Clocked In
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-1.5 text-xs text-[var(--muted)] font-mono">
                      <div className="flex items-center justify-between">
                        <span>Assigned Flagship:</span>
                        <span className="text-[var(--text)] font-sans">{branch?.name.replace("TriFit ", "") || "Seaview"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active 1-on-1 Clients:</span>
                        <span className="text-[var(--text)] font-bold">{coach.activeClientsCount || 28} Clients</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Monthly PT Delivery:</span>
                        <span className="text-emerald-400 font-bold">64 Sessions</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>REPs Certification:</span>
                        <span className="text-[var(--accent)] font-bold">Level 3 Master</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Direct Routable Link (NO MODALS) */}
                  <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[var(--muted)]">{coach.phone}</span>

                    <Link
                      href={`/admin/staff/${coach.id}`}
                      className="btn primary !py-1.5 !px-3 text-xs flex items-center gap-1.5 cursor-pointer font-bold"
                    >
                      <span>Accountability Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Operations Staff List */
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[var(--line)] bg-[var(--card)] text-[var(--muted)] uppercase font-mono">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Branch</th>
                    <th className="py-3 px-4">Shift Schedule</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] font-mono">
                  {staff.map((s) => {
                    const branch = branches.find((b) => b.id === s.branchId);
                    return (
                      <tr key={s.id} className="hover:bg-[var(--card)] transition-colors">
                        <td className="py-3 px-4 font-bold text-[var(--text)] font-sans">{s.name}</td>
                        <td className="py-3 px-4 text-[var(--accent)] font-sans font-semibold">{s.role}</td>
                        <td className="py-3 px-4 font-sans text-[var(--text)]">{branch?.name.replace("TriFit ", "")}</td>
                        <td className="py-3 px-4 text-[var(--muted)]">{s.shift}</td>
                        <td className="py-3 px-4 text-[var(--text)]">{s.phone}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}
