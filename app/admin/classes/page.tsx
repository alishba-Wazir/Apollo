"use client";

import React, { useState, useMemo } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, GymClass } from "@/lib/apollo-demo-store";
import {
  Dumbbell,
  Calendar,
  Clock,
  Building2,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Moon,
  VolumeX,
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Download,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatCard } from "@/components/ui/StatCard";

export default function AdminClassesAndTrainersPage() {
  const {
    branches,
    classes: storeClasses,
    trainers: storeTrainers,
    addClass,
    cancelClass,
  } = useApolloStore();

  const [activeTab, setActiveTab] = useState<"classes" | "trainers">("classes");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState("");
  const [newCategory, setNewCategory] = useState<GymClass["category"]>("HIIT");
  const [newBranchId, setNewBranchId] = useState(branches[0]?.id || "branch-seaview");
  const [newStudio, setNewStudio] = useState("Studio Alpha (Sound-Damped)");
  const [newTrainerId, setNewTrainerId] = useState(storeTrainers[0]?.id || "");
  const [newStartTime, setNewStartTime] = useState("21:15");
  const [newEndTime, setNewEndTime] = useState("22:00");
  const [newCapacity, setNewCapacity] = useState(30);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredClasses = useMemo(() => {
    return storeClasses.filter((c) => {
      if (selectedBranchFilter === "ALL") return true;
      return c.branchId === selectedBranchFilter;
    });
  }, [storeClasses, selectedBranchFilter]);

  // Total PT payouts across all coaches
  const totalCommissionPoolPKR = useMemo(() => {
    return storeTrainers.reduce((sum, t) => {
      const earned = t.completedSessions * t.hourlyRatePKR * (t.commissionRate / 100);
      return sum + earned;
    }, 0);
  }, [storeTrainers]);

  const totalNetPayrollPKR = useMemo(() => {
    return storeTrainers.reduce((sum, t) => {
      const earned = t.completedSessions * t.hourlyRatePKR * (t.commissionRate / 100);
      const baseSalary = 75000;
      return sum + baseSalary + earned;
    }, 0);
  }, [storeTrainers]);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const selectedTrainer = storeTrainers.find((t) => t.id === newTrainerId);

    addClass({
      name: newClassName,
      category: newCategory,
      branchId: newBranchId,
      studio: newStudio,
      trainerId: newTrainerId,
      trainerName: selectedTrainer?.name || "Senior Coach",
      startTime: newStartTime,
      endTime: newEndTime,
      daysOfWeek: ["Mon", "Wed", "Fri"],
      capacity: Number(newCapacity) || 25,
      status: "SCHEDULED",
    });

    setShowAddClassModal(false);
    setNewClassName("");
    showNotification(`Class "${newClassName}" successfully scheduled and broadcast to mobile timetable!`);
  };

  const handleCancelClass = (id: string, name: string) => {
    cancelClass(id);
    showNotification(`Class "${name}" has been cancelled. Automated push alerts dispatched.`);
  };

  const handleExportPayrollCSV = () => {
    const headers = [
      "Trainer Name",
      "Branch",
      "Specialty",
      "Sessions Completed",
      "Hourly Rate (PKR)",
      "Commission Split",
      "Base Salary (PKR)",
      "Total Net Pay (PKR)",
    ];

    const rows = storeTrainers.map((t) => {
      const branchName = branches.find((b) => b.id === t.branchId)?.name || "TriFit Club";
      const comm = t.completedSessions * t.hourlyRatePKR * (t.commissionRate / 100);
      const net = 75000 + comm;
      return [
        `"${t.name}"`,
        `"${branchName}"`,
        `"${t.specialty}"`,
        t.completedSessions,
        t.hourlyRatePKR,
        `"${t.commissionRate}%"`,
        75000,
        net,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TriFit_Trainer_Payroll_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Trainer payroll CSV exported with FBR withholding tax breakdown.");
  };

  return (
    <AdminPortalLayout activeItem="classes">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Classes & Trainers</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                {storeTrainers.length} Certified Coaches
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Studio timetables & automated trainer PT payroll across 4 flagship clubs
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setShowAddClassModal(true)}
              className="btn primary !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Studio Class</span>
            </button>

            <button
              onClick={handleExportPayrollCSV}
              className="btn !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Export Payroll CSV</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 2 Horizontal Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2">
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "classes"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Group Class Schedules ({storeClasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("trainers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "trainers"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Trainer PT Roster & Automated Commission Calculator ({storeTrainers.length})</span>
          </button>
        </div>

        {/* =========================================================================
            SUB-TAB 1: GROUP CLASS SCHEDULES
           ========================================================================= */}
        {activeTab === "classes" && (
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-[18px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-[700] text-slate-700 dark:text-neutral-300">Filter Branch:</span>
                <button
                  onClick={() => setSelectedBranchFilter("ALL")}
                  className={`px-3 py-1 rounded-[8px] text-[11.5px] font-[600] transition-all ${
                    selectedBranchFilter === "ALL"
                      ? "bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-bold"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400"
                  }`}
                >
                  All Clubs
                </button>
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranchFilter(b.id)}
                    className={`px-3 py-1 rounded-[8px] text-[11.5px] font-[600] transition-all ${
                      selectedBranchFilter === b.id
                        ? "bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-bold"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400"
                    }`}
                  >
                    {b.name.replace("TriFit ", "").split(" —")[0]}
                  </button>
                ))}
              </div>

              <div className="text-[11.5px] text-slate-500 dark:text-neutral-400 font-mono">
                {filteredClasses.length} Scheduled Sessions Active
              </div>
            </div>

            {/* Class Timetable Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((c) => {
                const fillPct = (c.bookedCount / c.capacity) * 100;
                const branchObj = branches.find((b) => b.id === c.branchId);

                return (
                  <div
                    key={c.id}
                    className="glass-panel p-5 rounded-[20px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 flex flex-col justify-between hover:border-amber-400/40 transition-all space-y-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-[#FFD91C] border border-amber-400/40">
                          {c.category}
                        </span>
                        <button
                          onClick={() => handleCancelClass(c.id, c.name)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                          title="Cancel Class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="card-title text-[var(--text)] leading-snug">
                        {c.name}
                      </h3>

                      <div className="text-xs text-[var(--muted)] mt-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{branchObj?.name.replace("TriFit ", "")} · {c.studio}</span>
                      </div>
                    </div>

                    {/* Time & Instructor */}
                    <div className="space-y-1.5 bg-[var(--card)] p-3 rounded-xl border border-[var(--line)] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">Class Timing:</span>
                        <span className="font-mono text-[var(--text)] font-bold text-xs">
                          {c.startTime} - {c.endTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[var(--line)]">
                        <span className="text-[var(--muted)]">Coach:</span>
                        <span className="font-bold text-[var(--text)]">{c.trainerName}</span>
                      </div>
                    </div>

                    {/* Booking Fill Capacity Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-[var(--muted)] font-semibold">Studio Fill</span>
                        <span className="font-bold text-[var(--text)]">
                          {c.bookedCount} / {c.capacity} ({fillPct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[var(--card)] border border-[var(--line)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            fillPct >= 95 ? "bg-rose-500" : "bg-[var(--accent)]"
                          }`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-neutral-400 flex items-center gap-1">
                        <VolumeX className="w-3 h-3 text-emerald-500" />
                        Auto-Mute Azan
                      </span>
                      <button
                        onClick={() => showNotification(`Waitlist confirmed for ${c.name}. Push alerts dispatched.`)}
                        className="text-amber-600 dark:text-[#FFD91C] hover:underline font-bold"
                      >
                        Manage Waitlist
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 2: TRAINER PT ROSTER & COMMISSION CALCULATOR
           ========================================================================= */}
        {activeTab === "trainers" && (
          <div className="space-y-4">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Total Completed PT Sessions"
                value={`${storeTrainers.reduce((s, t) => s + t.completedSessions, 0)}`}
                unit="Sessions"
                change="+14.2%"
                changeType="positive"
                variant="success"
                icon={<Award className="w-4 h-4" />}
                secondaryText="MoM Growth"
              />

              <StatCard
                title="PT Commission Pool"
                value={`PKR ${(totalCommissionPoolPKR / 1000000).toFixed(2)}M`}
                change="+8.5%"
                changeType="positive"
                variant="warning"
                icon={<DollarSign className="w-4 h-4" />}
                secondaryText="Avg 38% Commission Split"
              />

              <StatCard
                title="Total Projected Net Payroll"
                value={`PKR ${(totalNetPayrollPKR / 1000000).toFixed(2)}M`}
                variant="info"
                icon={<Calculator className="w-4 h-4" />}
                secondaryText="Base Salary + Commissions"
              />
            </div>

            {/* Trainer Roster Table */}
            <div className="glass-panel rounded-[20px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Trainer & Branch</th>
                      <th className="py-3.5 px-4">Specialization</th>
                      <th className="py-3.5 px-4 text-center">Sessions Delivered</th>
                      <th className="py-3.5 px-4 text-right">Base Salary</th>
                      <th className="py-3.5 px-4 text-right">Commission Rate</th>
                      <th className="py-3.5 px-4 text-right">PT Commission</th>
                      <th className="py-3.5 px-4 text-right">Total Net Payout</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {storeTrainers.map((t) => {
                      const branchName = branches.find((b) => b.id === t.branchId)?.name || "TriFit Club";
                      const commissionEarned = t.completedSessions * t.hourlyRatePKR * (t.commissionRate / 100);
                      const totalPayout = 75000 + commissionEarned;

                      return (
                        <tr key={t.id} className="hover:bg-[var(--card)] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[var(--text)]">{t.name}</div>
                            <div className="text-[10.5px] text-[var(--accent)] font-semibold">{branchName.replace("TriFit ", "")}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-xs font-semibold text-[var(--text)]">{t.specialty}</div>
                            <div className="text-[10.5px] text-[var(--muted)]">{t.experienceYears} Years Exp • ⭐ {t.rating}</div>
                          </td>

                          <td className="py-3.5 px-4 text-center font-bold font-mono">
                            <span className="px-2.5 py-1 rounded-md bg-[var(--card)] border border-[var(--line)] text-[var(--text)]">
                              {t.completedSessions}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono text-[var(--muted)]">
                            PKR 75,000
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono text-[var(--muted)]">
                            {t.commissionRate}% (PKR {t.hourlyRatePKR.toLocaleString()}/hr)
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[var(--accent)]">
                            PKR {Math.round(commissionEarned).toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-xs">
                            PKR {Math.round(totalPayout).toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10.5px] font-bold">
                              ACTIVE
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Schedule Class */}
        {showAddClassModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass bg-[var(--bg)] border border-[var(--card-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <h3 className="card-title text-[var(--text)]">
                  Schedule Studio Class
                </h3>
                <button
                  onClick={() => setShowAddClassModal(false)}
                  className="btn !py-1 !px-2.5 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-[var(--muted)] block mb-1">
                    Class Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Les Mills BodyPump 129"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--muted)] block mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="HIIT">HIIT & Conditioning</option>
                      <option value="Spin & RPM">Spin & RPM Studio</option>
                      <option value="Yoga & Pilates">Yoga & Pilates</option>
                      <option value="Strength">Strength & Les Mills</option>
                      <option value="Combat / Boxing">Combat / Boxing</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--muted)] block mb-1">
                      Host Club
                    </label>
                    <select
                      value={newBranchId}
                      onChange={(e) => setNewBranchId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name.replace("TriFit ", "")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--muted)] block mb-1">
                      Assigned Coach
                    </label>
                    <select
                      value={newTrainerId}
                      onChange={(e) => setNewTrainerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    >
                      {storeTrainers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--muted)] block mb-1">
                      Studio Room
                    </label>
                    <input
                      type="text"
                      value={newStudio}
                      onChange={(e) => setNewStudio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[var(--muted)] block mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--muted)] block mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--muted)] block mb-1">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--line)] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="btn !py-2 !px-4 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn primary !py-2 !px-4 text-xs font-bold"
                  >
                    Schedule & Broadcast
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}
