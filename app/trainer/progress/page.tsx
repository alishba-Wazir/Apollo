"use client";

import React, { useState, useMemo } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import { useApolloStore, Member, MemberAssessment } from "@/lib/apollo-demo-store";
import {
  TrendingUp,
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Plus,
  Scale,
  Search,
  Sliders,
  Sparkles,
  User,
  Zap,
  ChevronRight,
  Heart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  XCircle,
} from "lucide-react";

export default function TrainerProgressPage() {
  const { members, assessments, addAssessment } = useApolloStore();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    members[0]?.id || "mem-1"
  );
  const [searchMemberQuery, setSearchMemberQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State for new assessment
  const [newWeight, setNewWeight] = useState(78.5);
  const [newBodyFat, setNewBodyFat] = useState(17.8);
  const [newMuscleMass, setNewMuscleMass] = useState(35.2);
  const [newVisceralFat, setNewVisceralFat] = useState(6);
  const [newNotes, setNewNotes] = useState("Lean mass preserved. Water retention normal.");

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3800);
  };

  const selectedMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId) || members[0];
  }, [members, selectedMemberId]);

  // Client assessments
  const clientAssessments = useMemo(() => {
    return assessments.filter((a) => a.memberId === selectedMember?.id);
  }, [assessments, selectedMember]);

  // Handle logging check-in
  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const calculatedBmi = Number((Number(newWeight) / (1.78 * 1.78)).toFixed(1));
    addAssessment({
      memberId: selectedMember.id,
      date: new Date().toISOString().split("T")[0],
      weightKg: Number(newWeight),
      bodyFatPercent: Number(newBodyFat),
      muscleMassKg: Number(newMuscleMass),
      visceralFat: Number(newVisceralFat),
      bmi: calculatedBmi,
      bloodPressure: "120/78 mmHg",
      notes: newNotes,
    });

    notify(`Biometric check-in recorded for ${selectedMember.name}.`);
    setIsLogModalOpen(false);
  };

  // Personal Record Mock Data per client
  const [prRecords, setPrRecords] = useState([
    { exercise: "Barbell Back Squat", currentPr: "145 kg", previousPr: "135 kg", date: "2026-11-01", change: "+10 kg" },
    { exercise: "Conventional Deadlift", currentPr: "180 kg", previousPr: "170 kg", date: "2026-10-24", change: "+10 kg" },
    { exercise: "Barbell Bench Press", currentPr: "110 kg", previousPr: "105 kg", date: "2026-11-04", change: "+5 kg" },
    { exercise: "Strict Overhead Press", currentPr: "72.5 kg", previousPr: "70 kg", date: "2026-10-18", change: "+2.5 kg" },
    { exercise: "Weighted Pull-ups", currentPr: "+25 kg (5 reps)", previousPr: "+20 kg", date: "2026-11-02", change: "+5 kg" },
  ]);

  return (
    <TrainerPortalLayout activeItem="progress">
      <div className="space-y-6">
        {/* Toast Notification */}
        {actionNotice && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#050505] dark:bg-white text-white dark:text-[#050505] font-semibold text-xs shadow-2xl border border-[#FFD91C] animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#FFD91C] shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E8E5] dark:border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-text-muted">
                Biometrics & Performance
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-[11px] font-bold text-[#FFD91C] bg-[#FFD91C]/10 dark:bg-[#FFD91C]/20 px-2 py-0.5 rounded-full">
                InBody 770 Bio-Scanner
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-text tracking-tight">
              Client Transformation & Progress Tracker
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Analyze multi-week body composition curves, lean muscle accrual, fat loss velocity, and strength progression metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD91C] text-[#050505] text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log Biometric Check-in</span>
            </button>
          </div>
        </div>

        {/* Client Selection Strip */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[#FFD91C]/20 text-[#050505] dark:text-[#FFD91C] flex items-center justify-center font-black text-sm shrink-0">
              {selectedMember?.name?.charAt(0) || "M"}
            </div>
            <div>
              <div className="text-sm font-extrabold text-text flex items-center gap-2">
                <span>{selectedMember?.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-text-muted">
                  {selectedMember?.memberCode}
                </span>
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                Goal: <span className="text-text font-semibold">{selectedMember?.fitnessGoal || "Hypertrophy & Conditioning"}</span>
              </div>
            </div>
          </div>

          {/* Quick Member Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-text-muted font-medium">Select Athlete:</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-xs font-semibold text-text focus:outline-none"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.memberCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Biometric Metric Grid (4 Balanced Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Body Weight
              </span>
              <span className="p-2 rounded-xl bg-[#FFD91C]/10 text-text">
                <Scale className="w-4 h-4 text-[#FFD91C]" />
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-text tracking-tight">
                  {clientAssessments[0]?.weightKg || 78.5} kg
                </span>
                <span className="text-xs font-bold text-emerald-500 flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" /> -4.2 kg
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Target: 75.0 kg (92% reached)</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Body Fat %
              </span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-text tracking-tight">
                  {clientAssessments[0]?.bodyFatPercent || 17.8}%
                </span>
                <span className="text-xs font-bold text-emerald-500 flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" /> -5.2%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Starting: 23.0% (InBody scan)</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Skeletal Muscle Mass
              </span>
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Dumbbell className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-text tracking-tight">
                  {clientAssessments[0]?.muscleMassKg || 35.2} kg
                </span>
                <span className="text-xs font-bold text-blue-500 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +2.1 kg
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Hypertrophic lean gain</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Visceral Fat Level
              </span>
              <span className="p-2 rounded-xl bg-[#FFD91C]/10 text-text">
                <Flame className="w-4 h-4 text-[#FFD91C]" />
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-text tracking-tight">
                  Level {clientAssessments[0]?.visceralFat || 6}
                </span>
                <span className="text-xs font-bold text-emerald-500">Optimal Range (1-9)</span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Cardiovascular risk: LOW</p>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Strength PR Board + Habit Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Strength PR Board (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FFD91C]" />
                <h3 className="text-sm font-bold text-text">Compound Strength & PR Progression</h3>
              </div>
              <span className="text-[11px] text-text-muted font-mono">1RM VERIFIED</span>
            </div>

            <div className="space-y-2.5">
              {prRecords.map((pr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-text">
                      <Dumbbell className="w-4 h-4 text-[#FFD91C]" />
                    </div>
                    <div>
                      <div className="font-bold text-text">{pr.exercise}</div>
                      <div className="text-[10px] text-text-muted">Recorded on {pr.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-black text-text text-sm">{pr.currentPr}</div>
                      <div className="text-[10px] text-text-muted line-through">Prev: {pr.previousPr}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[11px] border border-emerald-500/20">
                      {pr.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habit & Adherence Widget (1 Col) */}
          <div className="rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E8E8E5] dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FFD91C]" />
                  <h3 className="text-sm font-bold text-text">Protocol Adherence</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  94% Score
                </span>
              </div>

              <div className="space-y-3.5 mt-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-text">Weekly Workout Attendance</span>
                    <span className="text-text font-mono font-bold">4 / 4 sessions</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#FFD91C] rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-text">Daily Protein Target (160g)</span>
                    <span className="text-text font-mono font-bold">92% Met</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-text">Sleep Architecture (7.5 hrs)</span>
                    <span className="text-text font-mono font-bold">88% Target</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-text">Hydration (3.5L Daily)</span>
                    <span className="text-text font-mono font-bold">96% Met</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#FFD91C] rounded-full" style={{ width: "96%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E8E5] dark:border-white/10 text-center">
              <span className="text-[11px] text-text-muted">Coach Review: Excellent compliance streak. Ready for progressive overload.</span>
            </div>
          </div>
        </div>

        {/* Historical Assessment Log Table */}
        <div className="rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#E8E8E5] dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD91C]" />
              <h3 className="text-sm font-bold text-text">InBody Biometric Scan History</h3>
            </div>
            <span className="text-xs text-text-muted font-medium">
              {clientAssessments.length} logged evaluations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E5] dark:border-white/10 bg-[#F7F7F5]/80 dark:bg-[#121210]/60 text-text-muted font-semibold uppercase tracking-wider text-[10.5px]">
                  <th className="py-3 px-5">Check-in Date</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Body Fat %</th>
                  <th className="py-3 px-4">Skeletal Muscle</th>
                  <th className="py-3 px-4">Visceral Fat</th>
                  <th className="py-3 px-4">Coach Analysis</th>
                  <th className="py-3 px-5 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5] dark:divide-white/10">
                {clientAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-text-muted">
                      No biometric evaluations logged for this athlete yet. Click &quot;Log Biometric Check-in&quot; to begin tracking.
                    </td>
                  </tr>
                ) : (
                  clientAssessments.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-5 font-bold text-text">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#FFD91C]" />
                          <span>{a.date}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-text">{a.weightKg} kg</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-500">{a.bodyFatPercent}%</td>
                      <td className="py-3.5 px-4 font-mono text-text">{a.muscleMassKg} kg</td>
                      <td className="py-3.5 px-4 font-mono text-text">Level {a.visceralFat}</td>
                      <td className="py-3.5 px-4 text-text-muted max-w-xs truncate">{a.notes}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => notify(`Exported PDF Report for ${selectedMember?.name} (${a.date})`)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#F7F7F5] dark:bg-[#181816] hover:bg-[#FFD91C] hover:text-[#050505] text-text font-bold text-xs border border-[#E8E8E5] dark:border-white/10 transition-colors"
                        >
                          InBody PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Log Biometric Check-In */}
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8E8E5] dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#FFD91C]/20 text-[#050505] dark:text-[#FFD91C]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text">Log InBody 770 Check-In</h3>
                    <p className="text-[11px] text-text-muted">Athlete: {selectedMember?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLogModalOpen(false)}
                  className="p-1 text-text-muted hover:text-text rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAssessment} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">Scale Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-text focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-text mb-1">Body Fat %</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newBodyFat}
                      onChange={(e) => setNewBodyFat(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-text focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">Skeletal Muscle Mass (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newMuscleMass}
                      onChange={(e) => setNewMuscleMass(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-text focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-text mb-1">Visceral Fat Rating (1-20)</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={newVisceralFat}
                      onChange={(e) => setNewVisceralFat(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-text focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-text mb-1">Coach Notes & Adjustments</label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-text focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E8E5] dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-text-muted hover:text-text font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FFD91C] text-[#050505] font-bold hover:brightness-105"
                  >
                    Record Check-in
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TrainerPortalLayout>
  );
}
