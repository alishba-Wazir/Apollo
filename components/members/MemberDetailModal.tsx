"use client";

import React, { useState } from "react";
import {
  X,
  User,
  ShieldCheck,
  CreditCard,
  QrCode,
  Dumbbell,
  TrendingUp,
  Activity,
  Utensils,
  UserCheck,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Member, useApolloStore } from "@/lib/apollo-demo-store";
import { ApolloSelect } from "@/components/ui/ApolloSelect";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, isOpen, onClose }) => {
  const {
    branches,
    plans,
    trainers,
    payments,
    attendance,
    assessments,
    workouts,
    updateMember,
    changeMemberStatus,
    renewMembership,
    recordPayment,
    refundPayment,
    assignTrainerToMember,
    addAssessment,
  } = useApolloStore();

  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "personal"
    | "membership"
    | "payments"
    | "attendance"
    | "workouts"
    | "progress"
    | "assessments"
    | "nutrition"
    | "trainer"
    | "timeline"
  >("overview");

  // Local state for actions
  const [isRenewing, setIsRenewing] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(22000);
  const [paymentMethod, setPaymentMethod] = useState<"IBFT_BANK" | "CREDIT_CARD" | "CASH">("IBFT_BANK");
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(member?.trainerId || "");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Assessment Form
  const [isAddingAssessment, setIsAddingAssessment] = useState(false);
  const [newWeight, setNewWeight] = useState(85.0);
  const [newBodyFat, setNewBodyFat] = useState(14.0);
  const [newMuscle, setNewMuscle] = useState(41.5);
  const [assessmentNotes, setAssessmentNotes] = useState("");

  if (!isOpen || !member) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const branch = branches.find((b) => b.id === member.branchId) || branches[0];
  const plan = plans.find((p) => p.id === member.planId) || plans[0];
  const trainer = trainers.find((t) => t.id === member.trainerId);

  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const memberAttendance = attendance.filter((a) => a.memberId === member.id);
  const memberAssessments = assessments.filter((a) => a.memberId === member.id);
  const memberWorkouts = workouts.filter((w) => w.assignedMemberId === member.id || w.id === "wk-01");

  // Weight progress mock data
  const weightProgressData = [
    { month: "Aug", weight: 88.5, bodyFat: 16.2 },
    { month: "Sep", weight: 87.1, bodyFat: 15.0 },
    { month: "Oct", weight: 86.4, bodyFat: 13.8 },
    { month: "Nov", weight: 85.2, bodyFat: 13.2 },
  ];

  const handleRenew = (months: number) => {
    renewMembership(member.id, months);
    showToast(`Successfully renewed membership for ${months} month(s)!`);
    setIsRenewing(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    recordPayment({
      memberId: member.id,
      memberName: member.name,
      branchId: member.branchId,
      planName: plan.name,
      amountPKR: Number(paymentAmount),
      paymentMethod,
      status: "COMPLETED",
      notes: "Manual front-desk recorded payment",
    });
    showToast(`Payment of PKR ${Number(paymentAmount).toLocaleString()} recorded!`);
    setIsAddingPayment(false);
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    addAssessment({
      memberId: member.id,
      date: new Date().toISOString().split("T")[0],
      weightKg: Number(newWeight),
      bodyFatPercent: Number(newBodyFat),
      muscleMassKg: Number(newMuscle),
      visceralFat: 5,
      bmi: Number((Number(newWeight) / (1.78 * 1.78)).toFixed(1)),
      bloodPressure: "120/80",
      notes: assessmentNotes || "Periodic inBody scan assessment",
    });
    showToast("New TechGIS scan recorded successfully!");
    setIsAddingAssessment(false);
  };

  const handleTrainerChange = (newTId: string) => {
    setSelectedTrainerId(newTId);
    assignTrainerToMember(member.id, newTId === "NONE" ? null : newTId);
    showToast(newTId === "NONE" ? "Trainer unassigned" : "Trainer assigned successfully!");
  };

  const TABS = [
    { id: "overview", label: "1. Overview", icon: User },
    { id: "personal", label: "2. Personal Info", icon: Phone },
    { id: "membership", label: "3. Membership", icon: ShieldCheck },
    { id: "payments", label: "4. Payments", icon: CreditCard },
    { id: "attendance", label: "5. Attendance", icon: QrCode },
    { id: "workouts", label: "6. Workout History", icon: Dumbbell },
    { id: "progress", label: "7. Fitness Progress", icon: TrendingUp },
    { id: "assessments", label: "8. Assessments", icon: Activity },
    { id: "nutrition", label: "9. Nutrition", icon: Utensils },
    { id: "trainer", label: "10. Trainer", icon: UserCheck },
    { id: "timeline", label: "11. Activity Timeline", icon: Clock },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0D0D0B] text-text border border-slate-200 dark:border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-accent text-on-accent font-bold text-[13px] shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-accent shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-[17px] font-extrabold text-text">{member.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-accent font-bold">
                  {member.memberCode}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    member.status === "ACTIVE"
                      ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                      : member.status === "EXPIRED"
                      ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <div className="text-[11.5px] text-text-muted mt-0.5 flex items-center gap-2">
                <span>{branch.name}</span>
                <span>•</span>
                <span className="text-accent font-semibold">{plan.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRenewing(!isRenewing)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-on-accent text-[12px] font-bold shadow-sm hover:bg-accent/90 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Renew Plan</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 11 Tabs Strip */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-slate-100/50 dark:bg-black/20 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-accent text-on-accent font-bold shadow-sm"
                    : "text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container with Smooth Apple Transitions */}
        <div key={activeTab} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 animate-apollo-fade">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Total Check-ins</span>
                  <div className="text-[20px] font-black text-accent mt-0.5">{member.totalCheckins}</div>
                  <span className="text-[10px] text-emerald-500 font-semibold">Active Streak</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">3D Body Scans</span>
                  <div className="text-[20px] font-black text-text mt-0.5">{member.bioScanCount} Scans</div>
                  <span className="text-[10px] text-accent font-semibold">TechGIS Biometric</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Assigned Coach</span>
                  <div className="text-[14px] font-bold text-text mt-1 truncate">
                    {trainer?.name || "Self-Guided"}
                  </div>
                  <span className="text-[10px] text-text-muted">Personal Trainer</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Days Until Expiry</span>
                  <div className="text-[20px] font-black text-text mt-0.5">
                    {Math.max(0, Math.ceil((new Date(member.expiryDate).getTime() - new Date().getTime()) / 86400000))} Days
                  </div>
                  <span className="text-[10px] text-accent font-mono">{member.expiryDate}</span>
                </div>
              </div>

              {/* Status and Actions Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border border-accent/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-[15px] font-bold text-text">Membership Control Panel</h4>
                  <p className="text-[12.5px] text-text-muted mt-1">
                    Manage member access status across TriFit turnstiles and biometric gate readers.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      changeMemberStatus(member.id, "ACTIVE");
                      showToast("Member status set to ACTIVE");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[12px] font-bold hover:bg-emerald-500/30 transition-all"
                  >
                    Activate Access
                  </button>
                  <button
                    onClick={() => {
                      changeMemberStatus(member.id, "SUSPENDED");
                      showToast("Member frozen/suspended for 30 days");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[12px] font-bold hover:bg-amber-500/30 transition-all"
                  >
                    Freeze / Suspend
                  </button>
                  <button
                    onClick={() => {
                      changeMemberStatus(member.id, "EXPIRED");
                      showToast("Member marked as EXPIRED");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[12px] font-bold hover:bg-rose-500/30 transition-all"
                  >
                    Deactivate
                  </button>
                </div>
              </div>

              {/* Bio & Fitness Focus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-3">
                  <h4 className="text-[13px] font-bold text-text">Fitness Profile</h4>
                  <div className="space-y-2 text-[12.5px]">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Primary Goal:</span>
                      <span className="font-bold text-accent">{member.fitnessGoal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Experience Level:</span>
                      <span className="font-semibold text-text">{member.fitnessLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Studio Zone:</span>
                      <span className="font-semibold text-text">{member.studio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Assigned Locker:</span>
                      <span className="font-mono font-bold text-text">{member.lockerNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-3">
                  <h4 className="text-[13px] font-bold text-text">Coaching & Medical Notes</h4>
                  <p className="text-[12.5px] text-text-muted leading-relaxed">
                    {member.notes || "No special medical contraindications recorded. Regular blood pressure check recommended before high-intensity lifting."}
                  </p>
                  <div className="pt-2 text-[11px] text-text-muted flex items-center justify-between border-t border-border">
                    <span>Member since: {member.joiningDate}</span>
                    <span className="text-emerald-500 font-semibold">Biometrics Consented</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFORMATION */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold text-text">Identity & Emergency Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-2 text-[12.5px]">
                  <span className="text-[11px] font-bold uppercase text-accent">Member Identity</span>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-muted">Full Name:</span>
                    <span className="font-bold text-text">{member.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-muted">Email Address:</span>
                    <span className="font-semibold text-text">{member.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-muted">Phone Number:</span>
                    <span className="font-mono font-bold text-accent">{member.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-muted">CNIC (Pakistan):</span>
                    <span className="font-mono text-text">{member.cnic}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-text-muted">Date of Birth:</span>
                    <span className="text-text">{member.dob} (Age {new Date().getFullYear() - new Date(member.dob).getFullYear()})</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-2 text-[12.5px]">
                  <span className="text-[11px] font-bold uppercase text-accent">Emergency Contact & Residence</span>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-muted">Contact Person:</span>
                    <span className="font-bold text-text">{member.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-muted">Relationship:</span>
                    <span className="font-semibold text-text">{member.emergencyContact.relationship}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-muted">Emergency Phone:</span>
                    <span className="font-mono font-bold text-accent">{member.emergencyContact.phone}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-text-muted block mb-1">Residential Address:</span>
                    <span className="text-text font-medium">{member.address}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEMBERSHIP OPERATIONS */}
          {activeTab === "membership" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-bold text-text">{plan.name}</h3>
                    <p className="text-[12.5px] text-text-muted mt-0.5">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-black text-accent">
                      PKR {plan.pricePKR.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-text-muted">per {plan.durationMonths} month(s)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                  <div>
                    <span className="text-text-muted block">Start Date:</span>
                    <span className="font-bold text-text font-mono">{member.startDate}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Expiry Date:</span>
                    <span className="font-bold text-accent font-mono">{member.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Renewal Grace:</span>
                    <span className="font-semibold text-text">{plan.renewalGraceDays} days</span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Status:</span>
                    <span className="font-bold text-emerald-500">{member.status}</span>
                  </div>
                </div>
              </div>

              {/* Operations Buttons */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-border space-y-3">
                <h4 className="text-[13px] font-bold text-text">Execute Membership Operations</h4>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleRenew(1)}
                    className="px-3.5 py-2 rounded-xl bg-accent text-on-accent text-[12.5px] font-bold shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Renew 1 Month (+PKR {plan.pricePKR.toLocaleString()})</span>
                  </button>
                  <button
                    onClick={() => handleRenew(12)}
                    className="px-3.5 py-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-text text-[12.5px] font-bold transition-all"
                  >
                    Renew 1 Year Annual Pass
                  </button>
                  <button
                    onClick={() => {
                      changeMemberStatus(member.id, "SUSPENDED");
                      showToast("Membership suspended / frozen");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[12.5px] font-bold hover:bg-amber-500/25 transition-all"
                  >
                    Suspend Membership
                  </button>
                  <button
                    onClick={() => {
                      changeMemberStatus(member.id, "ACTIVE");
                      showToast("Membership activated");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[12.5px] font-bold hover:bg-emerald-500/25 transition-all"
                  >
                    Activate Membership
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS & INVOICES */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-text">Payment Transactions & Dues</h3>
                <button
                  onClick={() => setIsAddingPayment(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-on-accent text-[12px] font-bold shadow-sm hover:bg-accent/90 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>
              </div>

              {/* Record Payment Form Modal */}
              {isAddingPayment && (
                <form
                  onSubmit={handleRecordPayment}
                  className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-accent/40 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-[13px] font-bold text-accent">Record New Payment for {member.name}</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingPayment(false)}
                      className="text-text-muted hover:text-text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
                    <div>
                      <label className="block text-text-muted mb-1">Amount (PKR):</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1">Payment Method:</label>
                      <ApolloSelect
                        value={paymentMethod}
                        onChange={(val) => setPaymentMethod(val as any)}
                        options={[
                          { value: "IBFT_BANK", label: "IBFT Direct Bank Transfer" },
                          { value: "CREDIT_CARD", label: "Credit / Debit Card" },
                          { value: "CASH", label: "Cash Front-Desk" },
                        ]}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPayment(false)}
                      className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-text-muted hover:text-text"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-accent text-on-accent text-[12px] font-bold shadow-sm"
                    >
                      Save Transaction
                    </button>
                  </div>
                </form>
              )}

              {/* Payments Table */}
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-slate-50 dark:bg-white/[0.04] text-text-muted border-b border-border">
                    <tr>
                      <th className="p-3">Invoice No</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {memberPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                        <td className="p-3 font-mono font-bold text-accent">{p.invoiceNo}</td>
                        <td className="p-3 font-medium text-text">{p.planName}</td>
                        <td className="p-3 text-text-muted font-mono">{p.paymentMethod}</td>
                        <td className="p-3 font-bold text-text">PKR {p.amountPKR.toLocaleString()}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              p.status === "COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-500"
                                : p.status === "REFUNDED"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {p.status === "COMPLETED" && (
                            <button
                              onClick={() => {
                                refundPayment(p.id, "Cancellation refund");
                                showToast(`Refund processed for ${p.invoiceNo}`);
                              }}
                              className="text-[11px] font-bold text-rose-500 hover:underline"
                            >
                              Process Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ATTENDANCE & GATE HISTORY */}
          {activeTab === "attendance" && (
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold text-text">Biometric Turnstile & Check-in History</h3>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-slate-50 dark:bg-white/[0.04] text-text-muted border-b border-border">
                    <tr>
                      <th className="p-3">Date & Timestamp</th>
                      <th className="p-3">Branch Location</th>
                      <th className="p-3">Turnstile Gate</th>
                      <th className="p-3">Verification Method</th>
                      <th className="p-3">Checkout Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {memberAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-text-muted">
                          No recent turnstile visits recorded.
                        </td>
                      </tr>
                    ) : (
                      memberAttendance.map((att) => (
                        <tr key={att.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                          <td className="p-3 font-semibold text-text">{att.checkInTime}</td>
                          <td className="p-3 text-text-muted">{att.branchName}</td>
                          <td className="p-3 font-mono text-accent">{att.gateName}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10.5px] font-mono">
                              {att.method}
                            </span>
                          </td>
                          <td className="p-3 text-text-muted">
                            {att.checkOutTime || (
                              <span className="text-emerald-500 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                In Club Now
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: WORKOUT HISTORY */}
          {activeTab === "workouts" && (
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold text-text">Assigned Workout Routines</h3>
              <div className="space-y-3">
                {memberWorkouts.map((wk) => (
                  <div key={wk.id} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[14px] font-bold text-accent">{wk.title}</h4>
                        <span className="text-[11px] text-text-muted">
                          {wk.goal} • {wk.durationMinutes} mins • {wk.daysPerWeek} days/week
                        </span>
                      </div>
                      {wk.isAiGenerated && (
                        <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent font-mono text-[10px] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Apollo AI Generated
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                      {wk.exercises.map((ex, i) => (
                        <div key={i} className="flex items-center justify-between text-[12px] p-2 rounded-xl bg-black/5 dark:bg-white/5">
                          <div>
                            <span className="font-bold text-text">{ex.name}</span>
                            <span className="text-text-muted block text-[11px]">{ex.instructions}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-accent">{ex.sets} sets × {ex.reps}</span>
                            <span className="text-[10px] text-text-muted block">Rest: {ex.restSeconds}s</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FITNESS PROGRESS (Interactive Charts) */}
          {activeTab === "progress" && (
            <div className="space-y-5">
              <h3 className="text-[15px] font-bold text-text">Body Composition & Strength Progression</h3>
              
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                <span className="text-[12px] font-bold text-text-muted uppercase">Weight Progression (kg)</span>
                <div className="h-56 w-full mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightProgressData}>
                      <defs>
                        <linearGradient id="progGold" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFD91C" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FFD91C" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} domain={[80, 92]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0D0D0B",
                          borderColor: "rgba(255,255,255,0.2)",
                          borderRadius: 12,
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#FFD91C"
                        strokeWidth={2.5}
                        fill="url(#progGold)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Start Weight</span>
                  <div className="text-[18px] font-bold text-text">88.5 kg</div>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Current Weight</span>
                  <div className="text-[18px] font-bold text-accent">85.2 kg</div>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Body Fat Drop</span>
                  <div className="text-[18px] font-bold text-emerald-500">-3.0%</div>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Lean Muscle Gain</span>
                  <div className="text-[18px] font-bold text-accent">+1.4 kg</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ASSESSMENTS (TechGIS / InBody 3D) */}
          {activeTab === "assessments" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-text">TechGIS 3D & InBody 770 Scan Records</h3>
                <button
                  onClick={() => setIsAddingAssessment(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-on-accent text-[12px] font-bold shadow-sm hover:bg-accent/90 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Scan</span>
                </button>
              </div>

              {isAddingAssessment && (
                <form
                  onSubmit={handleSaveAssessment}
                  className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-accent/40 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-[13px] font-bold text-accent">Record 3D Biometric Scan</span>
                    <button type="button" onClick={() => setIsAddingAssessment(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
                    <div>
                      <label className="block text-text-muted mb-1">Weight (kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newWeight}
                        onChange={(e) => setNewWeight(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-text font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1">Body Fat %:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newBodyFat}
                        onChange={(e) => setNewBodyFat(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-text font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1">Muscle Mass (kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newMuscle}
                        onChange={(e) => setNewMuscle(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-text font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 text-[12px]">Assessment Notes:</label>
                    <input
                      type="text"
                      value={assessmentNotes}
                      onChange={(e) => setAssessmentNotes(e.target.value)}
                      placeholder="e.g. Visceral fat reduced to level 4. Posture symmetry improved."
                      className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-text text-[12px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAssessment(false)}
                      className="px-3 py-1 text-[12px] text-text-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-accent text-on-accent text-[12px] font-bold shadow-sm"
                    >
                      Save Scan Data
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {memberAssessments.map((asm) => (
                  <div key={asm.id} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-accent font-mono text-[13px]">{asm.date}</span>
                      <span className="text-[11px] text-text-muted">TechGIS Station 01</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[12px] pt-2 border-t border-border">
                      <div>
                        <span className="text-text-muted block text-[10.5px]">Weight:</span>
                        <span className="font-bold text-text">{asm.weightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[10.5px]">Body Fat:</span>
                        <span className="font-bold text-accent">{asm.bodyFatPercent}%</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[10.5px]">Muscle Mass:</span>
                        <span className="font-bold text-text">{asm.muscleMassKg} kg</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[10.5px]">BMI:</span>
                        <span className="font-bold text-text">{asm.bmi}</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[10.5px]">Blood Pressure:</span>
                        <span className="font-bold text-text">{asm.bloodPressure}</span>
                      </div>
                    </div>
                    {asm.notes && (
                      <p className="text-[11.5px] text-text-muted mt-2 pt-1 border-t border-border/40">
                        {asm.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: NUTRITION */}
          {activeTab === "nutrition" && (
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold text-text">Caloric Targets & Pakistani Diet Plan</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Daily Target</span>
                  <div className="text-[20px] font-black text-accent mt-0.5">2,450 kcal</div>
                  <span className="text-[10px] text-text-muted">Lean Hypertrophy</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Protein</span>
                  <div className="text-[20px] font-black text-text mt-0.5">180g</div>
                  <span className="text-[10px] text-emerald-500 font-semibold">2.1g/kg LBM</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Carbohydrates</span>
                  <div className="text-[20px] font-black text-text mt-0.5">240g</div>
                  <span className="text-[10px] text-text-muted">Complex Grain/Roti</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                  <span className="text-[11px] text-text-muted">Healthy Fats</span>
                  <div className="text-[20px] font-black text-text mt-0.5">65g</div>
                  <span className="text-[10px] text-text-muted">Olive Oil/Almonds</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[12.5px] space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-500">
                  <Sparkles className="w-4 h-4" />
                  <span>Optimal Workout Meal Timing</span>
                </div>
                <p className="text-text-muted leading-relaxed">
                  <strong>Pre-Workout (60-90 min):</strong> Oats with whey protein isolate, sliced banana, and 500ml electrolyte water for glycogen replenishment.
                  <br />
                  <strong>Post-Workout Recovery (within 45 min):</strong> High-grade whey isolate shake, grilled chicken breast with brown rice, and steamed green vegetables.
                </p>
              </div>
            </div>
          )}

          {/* TAB 10: TRAINER ASSIGNMENT */}
          {activeTab === "trainer" && (
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold text-text">Assigned Coach & Private Coaching</h3>
              
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-4">
                <label className="block text-[13px] font-bold text-text">Change / Reassign Coach:</label>
                <ApolloSelect
                  value={selectedTrainerId || "NONE"}
                  onChange={(val) => handleTrainerChange(val)}
                  options={[
                    { value: "NONE", label: "No Assigned Trainer (Self-Guided)" },
                    ...trainers.map((t) => ({
                      value: t.id,
                      label: `${t.name} — ${t.specialty} (${branches.find((b) => b.id === t.branchId)?.name || ""})`,
                    })),
                  ]}
                  searchable={true}
                  className="w-full"
                />

                {trainer && (
                  <div className="pt-3 border-t border-border flex items-start gap-4">
                    <img
                      src={trainer.avatar}
                      alt={trainer.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-accent"
                    />
                    <div>
                      <h4 className="text-[15px] font-bold text-text">{trainer.name}</h4>
                      <p className="text-[12px] text-accent font-semibold">{trainer.specialty}</p>
                      <p className="text-[11.5px] text-text-muted mt-1 leading-relaxed">{trainer.bio}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-text-muted">
                        <span>⭐ {trainer.rating} Rating</span>
                        <span>•</span>
                        <span>{trainer.experienceYears} Years Experience</span>
                        <span>•</span>
                        <span>Rate: PKR {trainer.hourlyRatePKR.toLocaleString()}/hr</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 11: ACTIVITY TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-3">
              <h3 className="text-[15px] font-bold text-text">Chronological Audit Timeline</h3>
              <div className="relative pl-6 space-y-4 border-l-2 border-accent/30 text-[12px]">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                  <span className="font-mono text-accent font-bold text-[11px]">Today at 08:30 AM</span>
                  <p className="text-text font-semibold">Checked in at {branch.name} via Turnstile Alpha</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-background" />
                  <span className="font-mono text-text-muted font-bold text-[11px]">2026-11-01 10:14 AM</span>
                  <p className="text-text font-semibold">Payment of PKR 35,000 received (INV-2026-0891)</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-background" />
                  <span className="font-mono text-text-muted font-bold text-[11px]">2026-10-15</span>
                  <p className="text-text font-semibold">InBody 770 Scan completed (Weight: 86.4 kg, Fat: 13.8%)</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-neutral-400 ring-4 ring-background" />
                  <span className="font-mono text-text-muted font-bold text-[11px]">2023-02-10</span>
                  <p className="text-text font-semibold">Member joined TriFit Pakistan (Seaview DHA Flagship)</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between text-[12px] text-text-muted">
          <span>Member ID: {member.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-text font-bold transition-all"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
