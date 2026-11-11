"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, Trainer, Member } from "@/lib/apollo-demo-store";
import {
  ArrowLeft,
  UserCheck,
  Dumbbell,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Building2,
  Clock,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserPlus,
  RefreshCw,
  Award,
  Sparkles,
  ChevronRight,
  Calculator,
} from "lucide-react";

export default function TrainerAccountabilityPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params?.id as string;

  const { trainers, members, branches, updateMember } = useApolloStore();

  const [activeTab, setActiveTab] = useState<"ROSTER" | "TIMETABLE" | "PAYROLL">("ROSTER");
  const [reassignModalMember, setReassignModalMember] = useState<Member | null>(null);
  const [targetTrainerId, setTargetTrainerId] = useState<string>("");
  const [substituteClassId, setSubstituteClassId] = useState<string | null>(null);
  const [substituteTrainerId, setSubstituteTrainerId] = useState<string>("");
  const [whatsappSent, setWhatsappSent] = useState(false);

  // Find trainer or fallback
  const trainer: Trainer = useMemo(() => {
    const found = trainers.find((t) => t.id === staffId);
    if (found) return found;

    return {
      id: staffId || "trainer-1",
      name: "Coach Waleed Qureshi",
      email: "waleed.qureshi@trifit.com.pk",
      specialty: "Strength & Hypertrophy",
      branchId: "branch-seaview",
      experienceYears: 8,
      rating: 4.9,
      bio: "REPs Level 3 Certified Master Trainer with 8+ years elite biomechanics coaching experience.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      activeClientsCount: 28,
      completedSessions: 64,
      weeklyHours: 40,
      hourlyRatePKR: 1500,
      commissionRate: 40,
      phone: "+92 301 5543210",
      status: "ACTIVE",
    };
  }, [trainers, staffId]);

  const branch = branches.find((b) => b.id === trainer.branchId) || branches[0];

  // Assigned clients
  const assignedClients = useMemo(() => {
    return members.filter((m) => m.trainerId === trainer.id || m.id === "mem-1" || m.id === "mem-2");
  }, [members, trainer.id]);

  // Weekly classes schedule
  const [weeklyClasses, setWeeklyClasses] = useState([
    {
      id: "cls-1",
      title: "HIIT Woodway Burn",
      studio: "HIIT Studio (24 Woodway Curves)",
      day: "Monday & Wednesday",
      time: "07:00 AM - 08:00 AM",
      booked: 24,
      capacity: 24,
      substituteAssigned: null as string | null,
    },
    {
      id: "cls-2",
      title: "Stages RPM Sprint",
      studio: "Stages RPM Cycling Studio (28 Bikes)",
      day: "Tuesday & Thursday",
      time: "06:30 PM - 07:30 PM",
      booked: 26,
      capacity: 28,
      substituteAssigned: null as string | null,
    },
    {
      id: "cls-3",
      title: "HYROX Functional Conditioning",
      studio: "Functional Fitness Turf",
      day: "Saturday",
      time: "10:00 AM - 11:30 AM",
      booked: 30,
      capacity: 30,
      substituteAssigned: null as string | null,
    },
  ]);

  // Payroll Calculation State
  const baseSalaryPKR = 120000;
  const ptSessionCount = 68;
  const ptCommissionPerSessionPKR = 1500;
  const ptCommissionTotalPKR = ptSessionCount * ptCommissionPerSessionPKR;
  const studioClassesCount = 18;
  const studioCommissionPerClassPKR = 1200;
  const studioCommissionTotalPKR = studioClassesCount * studioCommissionPerClassPKR;
  const absenceDeductionsPKR = 0;
  const netDisbursablePayrollPKR = baseSalaryPKR + ptCommissionTotalPKR + studioCommissionTotalPKR - absenceDeductionsPKR;

  // Reassign client handler
  const handleConfirmReassign = () => {
    if (reassignModalMember && targetTrainerId) {
      updateMember(reassignModalMember.id, { trainerId: targetTrainerId });
      setReassignModalMember(null);
      alert(`Client ${reassignModalMember.name} successfully reassigned.`);
    }
  };

  // Assign substitute handler
  const handleConfirmSubstitute = () => {
    if (substituteClassId && substituteTrainerId) {
      const subTrainer = trainers.find((t) => t.id === substituteTrainerId);
      setWeeklyClasses((prev) =>
        prev.map((c) => (c.id === substituteClassId ? { ...c, substituteAssigned: subTrainer?.name || "Substitute" } : c))
      );
      setSubstituteClassId(null);
      alert(`Substitute confirmed: ${subTrainer?.name} has been notified via WhatsApp.`);
    }
  };

  // One-click WhatsApp payslip & schedule dispatch
  const handleSendWhatsApp = () => {
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3500);

    const message = encodeURIComponent(
      `TriFit Coach Notification\n` +
      `Coach: ${trainer.name} (${branch?.name.replace("TriFit ", "")})\n` +
      `Active Clients: ${assignedClients.length}\n` +
      `Conducted PT Sessions: ${ptSessionCount}\n` +
      `Net Disbursable Payroll: PKR ${netDisbursablePayrollPKR.toLocaleString()}\n` +
      `Access Roster: https://trifit.com.pk/trainer/${trainer.id}`
    );
    window.open(`https://wa.me/${trainer.phone.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  return (
    <AdminPortalLayout activeItem="staff">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <Link
            href="/admin/staff"
            className="btn !py-2 !px-3.5 text-xs text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-2 group transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Staff & Coaches Roster</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span>Admin</span>
            <span>/</span>
            <span>Staff</span>
            <span>/</span>
            <span className="text-[var(--accent)] font-semibold truncate max-w-[140px] sm:max-w-none">{trainer.name}</span>
          </div>
        </div>

        {/* Coach Hero Card */}
        <div className="glass p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center text-xl font-bold font-mono shrink-0 shadow-lg">
              {trainer.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
                  {trainer.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
                  REPs Level 3 Master Coach
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
                  Clocked-In (Active)
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-xs text-[var(--muted)] mt-1.5 flex-wrap font-mono">
                <span className="flex items-center gap-1.5 text-[var(--text)] font-semibold">
                  <Award className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {trainer.specialty}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {trainer.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {branch?.name.replace("TriFit ", "")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Dispatch */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="btn primary !py-2 !px-4 text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{whatsappSent ? "Dispatched!" : "Dispatch Schedule & Payslip via WhatsApp"}</span>
            </button>
          </div>
        </div>

        {/* Top 4 Accountability Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Assigned PT Clients</div>
            <div className="text-2xl font-bold font-mono text-[var(--text)] mt-1">{assignedClients.length}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Capacity: 30 Max (Optimal)</div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Monthly PT Sessions</div>
            <div className="text-2xl font-bold font-mono text-[var(--accent)] mt-1">{ptSessionCount}</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5 font-mono">Target: 60/mo (113% Pace)</div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Client Renewal Rate</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">92.4%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+4.1% vs club average</div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Net Payroll (Current Mo)</div>
            <div className="text-2xl font-bold font-mono text-[var(--accent)] mt-1">
              PKR {(netDisbursablePayrollPKR / 1000).toFixed(0)}k
            </div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5">Salary + Commissions</div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] pb-1 text-xs font-semibold">
          {[
            { id: "ROSTER", label: `Assigned Clients (${assignedClients.length})`, icon: Users },
            { id: "TIMETABLE", label: `Weekly Studio Timetable (${weeklyClasses.length})`, icon: Calendar },
            { id: "PAYROLL", label: "Attendance & Payroll Calculator (PKR)", icon: Calculator },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[var(--accent)] text-[var(--on-accent)] font-bold shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ASSIGNED CLIENT ROSTER */}
        {activeTab === "ROSTER" && (
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-[var(--text)]">Assigned Client Roster</h3>
                <p className="body-label text-xs mt-1 text-[var(--muted)]">
                  Active 1-on-1 PT clients with Forma 3D Bio-Scan telemetry and reassign workflow
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[var(--line)] text-[var(--muted)] uppercase font-mono bg-[var(--card)]">
                  <tr>
                    <th className="py-2.5 px-3">Client Name</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">3D Body Fat %</th>
                    <th className="py-2.5 px-3">Program Goal</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Accountability Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] font-mono">
                  {assignedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-[var(--card)] transition-colors">
                      <td className="py-3 px-3">
                        <Link href={`/admin/members/${client.id}`} className="font-bold text-[var(--text)] hover:text-[var(--accent)]">
                          {client.name}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-[var(--muted)]">{client.phone}</td>
                      <td className="py-3 px-3 text-cyan-400 font-bold">21.1% Fat</td>
                      <td className="py-3 px-3 font-sans text-[var(--text)]">Hypertrophy & Strength L3</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400">
                          Consistent
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setReassignModalMember(client)}
                          className="btn !py-1 !px-2.5 text-xs text-[var(--accent)] border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 cursor-pointer"
                        >
                          Reassign Client
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reassign Client Inline Workflow */}
            {reassignModalMember && (
              <div className="p-4 rounded-xl bg-[var(--chip)] border border-[var(--accent)]/30 space-y-3 mt-4">
                <div className="font-bold text-xs text-[var(--text)]">
                  Transfer Client &ldquo;{reassignModalMember.name}&rdquo; from {trainer.name} to:
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={targetTrainerId}
                    onChange={(e) => setTargetTrainerId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] outline-none"
                  >
                    <option value="">-- Select Replacement Coach --</option>
                    {trainers
                      .filter((t) => t.id !== trainer.id)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.specialty}) • {t.activeClientsCount} clients
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setReassignModalMember(null)}
                    className="btn !py-2 !px-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReassign}
                    className="btn primary !py-2 !px-4 text-xs font-bold"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WEEKLY STUDIO TIMETABLE & SUBSTITUTE WORKFLOW */}
        {activeTab === "TIMETABLE" && (
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-[var(--text)]">Weekly Signature Studio Class Timeline</h3>
                <p className="body-label text-xs mt-1 text-[var(--muted)]">
                  Live studio occupancy with instant &ldquo;Assign Substitute&rdquo; dispatch if coach is absent
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {weeklyClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--accent)]/40 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--text)]">{cls.title}</span>
                      {cls.substituteAssigned && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                          Substitute: {cls.substituteAssigned}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">{cls.studio}</div>
                    <div className="text-[11px] font-mono text-[var(--accent)] mt-0.5">
                      {cls.day} • {cls.time}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <div className="font-mono font-bold text-[var(--text)]">
                        {cls.booked} / {cls.capacity} Booked
                      </div>
                      <div className="text-[10px] text-emerald-400">92% Capacity</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSubstituteClassId(cls.id)}
                      className="btn !py-1.5 !px-3 text-xs text-[var(--accent)] border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 cursor-pointer"
                    >
                      Assign Substitute
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Substitute Assignment Modal / Inline Form */}
            {substituteClassId && (
              <div className="p-4 rounded-xl bg-[var(--chip)] border border-[var(--accent)]/30 space-y-3 mt-4">
                <div className="font-bold text-xs text-[var(--text)]">
                  Assign Certified Substitute Coach for Selected Session:
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={substituteTrainerId}
                    onChange={(e) => setSubstituteTrainerId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] outline-none"
                  >
                    <option value="">-- Choose Qualified Substitute --</option>
                    {trainers
                      .filter((t) => t.id !== trainer.id)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} • {t.specialty}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setSubstituteClassId(null)}
                    className="btn !py-2 !px-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSubstitute}
                    className="btn primary !py-2 !px-4 text-xs font-bold"
                  >
                    Confirm & Alert Substitute
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TIME, ATTENDANCE & PAYROLL CALCULATOR */}
        {activeTab === "PAYROLL" && (
          <div className="glass p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-[var(--text)]">Monthly Attendance & Payroll Ledger</h3>
                <p className="body-label text-xs mt-1 text-[var(--muted)]">
                  Automated computation: Base salary + PT session delivery + studio class incentives in PKR
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="btn primary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send WhatsApp Payslip</span>
              </button>
            </div>

            {/* Detailed Payroll Breakdown Matrix */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] font-mono">
                <div>
                  <div className="font-bold text-[var(--text)] font-sans">Base Monthly Retainer</div>
                  <div className="text-[11px] text-[var(--muted)]">Fixed salary for 160 contracted shift hours</div>
                </div>
                <div className="text-sm font-bold text-[var(--text)]">PKR {baseSalaryPKR.toLocaleString()}</div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] font-mono">
                <div>
                  <div className="font-bold text-[var(--text)] font-sans">Personal Training Commissions</div>
                  <div className="text-[11px] text-[var(--muted)]">{ptSessionCount} sessions @ PKR 1,500 / session</div>
                </div>
                <div className="text-sm font-bold text-emerald-400">+PKR {ptCommissionTotalPKR.toLocaleString()}</div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] font-mono">
                <div>
                  <div className="font-bold text-[var(--text)] font-sans">Group Signature Studio Incentive</div>
                  <div className="text-[11px] text-[var(--muted)]">{studioClassesCount} classes @ PKR 1,200 / class</div>
                </div>
                <div className="text-sm font-bold text-cyan-400">+PKR {studioCommissionTotalPKR.toLocaleString()}</div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] font-mono">
                <div>
                  <div className="font-bold text-[var(--text)] font-sans">Absence / Late Deductions</div>
                  <div className="text-[11px] text-[var(--muted)]">0 unexcused absences (100% punctuality)</div>
                </div>
                <div className="text-sm font-bold text-[var(--muted)]">-PKR 0</div>
              </div>

              {/* Total Disbursable */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)] font-mono">
                <div>
                  <div className="font-bold text-base text-[var(--text)] font-sans">Net Disbursable Compensation</div>
                  <div className="text-xs text-[var(--muted)]">Bank Al Habib Direct Wire Ref: SAL-2026-NOV</div>
                </div>
                <div className="text-xl font-bold text-[var(--accent)]">
                  PKR {netDisbursablePayrollPKR.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}
