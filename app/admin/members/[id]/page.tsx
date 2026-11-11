"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, Member } from "@/lib/apollo-demo-store";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  CreditCard,
  Activity,
  Dumbbell,
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Download,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingDown,
  Layers,
  ChevronRight,
  Eye,
  Check,
  Hash,
} from "lucide-react";

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params?.id as string;

  const { members, branches, plans, trainers, payments, attendance, updateMember } = useApolloStore();

  const [activeTab, setActiveTab] = useState<"BIOSCAN" | "ATTENDANCE" | "LEDGER" | "COACH">("BIOSCAN");
  const [bioView, setBioView] = useState<"FRONT" | "SIDE" | "BACK">("FRONT");
  const [selectedTrainer, setSelectedTrainer] = useState<string>("");
  const [isReassigning, setIsReassigning] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  // Resolve member or fallback mock
  const member = useMemo(() => {
    const found = members.find((m) => m.id === memberId);
    if (found) return found;

    // Fallback demo member if accessed directly
    return {
      id: memberId || "mem-demo",
      name: "Sarah Ahmed Khan",
      email: "sarah.ahmed@example.com",
      phone: "+92 300 8219472",
      cnic: "42201-8392182-4",
      branchId: "branch-seaview",
      planId: "plan-plus-12m",
      status: "ACTIVE" as const,
      joiningDate: "2026-02-14",
      trainerId: "trainer-1",
    };
  }, [members, memberId]);

  const branch = branches.find((b) => b.id === member.branchId) || branches[0];
  const plan = plans.find((p) => p.id === member.planId) || plans[0];
  const assignedCoach = trainers.find((t) => t.id === (member.trainerId || "trainer-1")) || trainers[0];

  const memberPayments = useMemo(() => {
    return payments.filter((p) => p.memberId === member.id || p.memberId === "mem-1");
  }, [payments, member.id]);

  const memberAttendance = useMemo(() => {
    return attendance.filter((a) => a.memberId === member.id || a.memberId === "mem-1");
  }, [attendance, member.id]);

  // Handle reassigning coach
  const handleSaveCoach = () => {
    if (selectedTrainer) {
      updateMember(member.id, { trainerId: selectedTrainer });
      setIsReassigning(false);
    }
  };

  const handleSendWhatsApp = () => {
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3500);
    const msg = encodeURIComponent(
      `Hello ${member.name}, this is TriFit ${branch?.name || "Flagship"}. Your Forma 3D Bio-Scan results (Body Fat: 21.1%, Weight: 62.8 kg) have been reviewed by your coach. View your telemetry: https://trifit.com.pk/portal/${member.id}`
    );
    window.open(`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
  };

  return (
    <AdminPortalLayout activeItem="members">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <Link
            href="/admin/members"
            className="btn !py-2 !px-3.5 text-xs text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-2 group transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Members CRM</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span>Admin</span>
            <span>/</span>
            <span>Members</span>
            <span>/</span>
            <span className="text-[var(--accent)] font-semibold truncate max-w-[140px] sm:max-w-none">{member.name}</span>
          </div>
        </div>

        {/* Member Hero Card */}
        <div className="glass p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/30 to-amber-500/10 border border-[var(--accent)]/40 flex items-center justify-center text-xl font-bold font-mono text-[var(--accent)] shrink-0 shadow-lg">
              {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
                  {member.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {member.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
                  {plan?.name || "TriFit Plus (12M)"}
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-xs text-[var(--muted)] mt-1.5 flex-wrap font-mono">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {member.cnic || "42201-8392182-4"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {member.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {branch?.name.replace("TriFit ", "")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="btn !py-2 !px-3.5 text-xs flex items-center gap-1.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{whatsappSent ? "WhatsApp Sent!" : "WhatsApp Dossier"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReassigning(true)}
              className="btn !py-2 !px-3.5 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Dumbbell className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Reassign Coach</span>
            </button>
          </div>
        </div>

        {/* Top 4 Realtime Telemetry Stats (Obsidian HUD) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Body Fat %</div>
            <div className="text-2xl font-bold font-mono text-[var(--accent)] mt-1">21.1%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              <span>-2.4% vs last scan</span>
            </div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Current Weight</div>
            <div className="text-2xl font-bold font-mono text-[var(--text)] mt-1">62.8 kg</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5 font-mono">BMI 20.83 • Normal</div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Skeletal Muscle</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">28.4 kg</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+0.8 kg gain (Optimal)</div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Check-in Frequency</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">4.2x / wk</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5">Hyper-Active Cohort</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: "BIOSCAN", label: "Forma 3D Digital Twin", icon: ScanLine },
            { id: "ATTENDANCE", label: "Attendance & Studio Heatmap", icon: Activity },
            { id: "LEDGER", label: "Dues & Payment Ledger", icon: CreditCard },
            { id: "COACH", label: "Assigned Coach & Workout Notes", icon: Dumbbell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--accent)] text-[var(--on-accent)] font-bold shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: FORMA 3D DIGITAL TWIN & BODY SCAN */}
        {activeTab === "BIOSCAN" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 3D Holographic Avatar Canvas (7 cols) */}
            <div className="lg:col-span-7 glass p-6 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
                      <ScanLine className="w-4 h-4" />
                    </span>
                    <h3 className="card-title text-[var(--text)]">Forma 3D Holographic Digital Twin</h3>
                  </div>
                  <p className="body-label text-xs mt-1 text-[var(--muted)]">
                    Scanned at TriFit Seaview Kiosk #01 • 4K Optical Depth & Dual-Frequency BIA
                  </p>
                </div>

                {/* Perspective Toggles */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs">
                  {(["FRONT", "SIDE", "BACK"] as const).map((view) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => setBioView(view)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        bioView === view
                          ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                          : "text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>

              {/* Realistic 3D Holographic Human Avatar Visualizer */}
              <div className="relative h-[380px] w-full rounded-2xl bg-gradient-to-b from-black/40 via-black/20 to-transparent border border-[var(--line)] flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Radial grid aura */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,214,10,0.1)_0%,_transparent_70%)] pointer-events-none" />

                {/* Perspective body mesh rendering */}
                <div className="relative z-10 flex flex-col items-center">
                  <svg
                    className="w-44 h-80 text-[var(--accent)] drop-shadow-[0_0_15px_rgba(255,214,10,0.5)] animate-pulse"
                    viewBox="0 0 100 200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    {/* Head */}
                    <circle cx="50" cy="22" r="14" stroke="currentColor" fill="var(--chip)" />
                    {/* Neck */}
                    <line x1="50" y1="36" x2="50" y2="44" stroke="currentColor" />
                    {/* Torso & Shoulders */}
                    <path
                      d="M26 48 L74 48 L68 110 L32 110 Z"
                      stroke="currentColor"
                      fill="var(--chip)"
                    />
                    {/* Chest line */}
                    <path d="M34 65 Q50 72 66 65" stroke="currentColor" strokeDasharray="2 2" />
                    {/* Core grid */}
                    <line x1="50" y1="48" x2="50" y2="110" stroke="currentColor" strokeDasharray="3 3" />
                    <line x1="38" y1="85" x2="62" y2="85" stroke="currentColor" strokeDasharray="2 2" />
                    {/* Arms */}
                    <line x1="26" y1="48" x2="14" y2="105" stroke="currentColor" />
                    <line x1="74" y1="48" x2="86" y2="105" stroke="currentColor" />
                    {/* Hands */}
                    <circle cx="14" cy="110" r="3" stroke="currentColor" fill="currentColor" />
                    <circle cx="86" cy="110" r="3" stroke="currentColor" fill="currentColor" />
                    {/* Pelvis */}
                    <path d="M32 110 L68 110 L60 130 L40 130 Z" stroke="currentColor" fill="var(--chip)" />
                    {/* Legs */}
                    <path d="M40 130 L36 185" stroke="currentColor" />
                    <path d="M60 130 L64 185" stroke="currentColor" />
                    {/* Feet */}
                    <line x1="36" y1="185" x2="28" y2="187" stroke="currentColor" strokeWidth="2" />
                    <line x1="64" y1="185" x2="72" y2="187" stroke="currentColor" strokeWidth="2" />
                  </svg>

                  {/* Floating Telemetry Tags */}
                  <div className="absolute top-14 left-4 glass px-2.5 py-1 rounded-lg text-[10px] font-mono border-[var(--card-border)] text-[var(--accent)]">
                    Chest: 14.2% Fat
                  </div>
                  <div className="absolute top-36 right-4 glass px-2.5 py-1 rounded-lg text-[10px] font-mono border-[var(--card-border)] text-amber-500">
                    Visceral: Level 3
                  </div>
                  <div className="absolute bottom-16 left-4 glass px-2.5 py-1 rounded-lg text-[10px] font-mono border-[var(--card-border)] text-emerald-500">
                    Quads: 28.4 kg Muscle
                  </div>
                </div>

                {/* Base scanning ring glow */}
                <div className="absolute bottom-2 w-48 h-6 rounded-full bg-[var(--accent)]/15 blur-md" />
              </div>

              {/* Angle orientation info */}
              <div className="flex items-center justify-between text-xs text-[var(--muted)] pt-2 border-t border-[var(--line)]">
                <span className="font-mono">Orientation: {bioView} Perspective (360° LiDAR calibrated)</span>
                <span className="text-[var(--accent)] font-semibold">Tolerance: ±0.3% margin</span>
              </div>
            </div>

            {/* Right: Segmental Breakdown & Posture Alignment (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Segmental Muscle & Fat */}
              <div className="glass p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Segmental Body Composition</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[var(--muted)]">Upper Body (Chest & Arms)</span>
                      <span className="font-mono font-bold text-[var(--text)]">14.2% Fat • 6.4 kg Muscle</span>
                    </div>
                    <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: "72%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[var(--muted)]">Core & Abdominal Trunk</span>
                      <span className="font-mono font-bold text-[var(--text)]">19.8% Fat • 14.1 kg Muscle</span>
                    </div>
                    <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: "64%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[var(--muted)]">Lower Body (Quads & Glutes)</span>
                      <span className="font-mono font-bold text-[var(--text)]">16.5% Fat • 7.9 kg Muscle</span>
                    </div>
                    <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: "84%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Posture & Alignment Telemetry */}
              <div className="glass p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>LiDAR Posture Alignment</span>
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                    <div className="text-[10.5px] text-[var(--muted)]">Cervical Spine</div>
                    <div className="font-mono font-bold text-emerald-500 mt-0.5">+1.2° (Normal)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                    <div className="text-[10.5px] text-[var(--muted)]">Shoulder Level</div>
                    <div className="font-mono font-bold text-emerald-500 mt-0.5">Symmetrical (0.3°)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                    <div className="text-[10.5px] text-[var(--muted)]">Pelvic Tilt</div>
                    <div className="font-mono font-bold text-amber-500 mt-0.5">0.8° Anterior</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                    <div className="text-[10.5px] text-[var(--muted)]">Knee Tracking</div>
                    <div className="font-mono font-bold text-emerald-500 mt-0.5">Neutral Plane</div>
                  </div>
                </div>
              </div>

              {/* Re-Scan Action */}
              <div className="p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-[var(--text)]">Schedule Next 3D Scan</div>
                  <div className="text-[11px] text-[var(--muted)]">Recommended every 28 days</div>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Forma 3D Kiosk scan token queued for Sarah Ahmed Khan.")}
                  className="btn primary !py-1.5 !px-3 text-xs"
                >
                  Queue Scan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE & STUDIO HEATMAP */}
        {activeTab === "ATTENDANCE" && (
          <div className="glass p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-[var(--text)]">12-Week Attendance Heatmap</h3>
                <p className="body-label text-xs mt-1 text-[var(--muted)]">
                  Turnstile check-ins and Signature Studio participation across TriFit clubs
                </p>
              </div>
              <span className="admin-chip font-mono text-emerald-400">94.2% Consistency</span>
            </div>

            {/* Heatmap Grid (12 columns, 7 rows Mon-Sun) */}
            <div className="overflow-x-auto py-2">
              <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[500px]">
                {Array.from({ length: 84 }).map((_, i) => {
                  const hasAttended = (i * 7 + 3) % 4 !== 0;
                  const intensity = hasAttended ? (i % 3 === 0 ? "bg-[var(--accent)]" : "bg-emerald-500/80") : "bg-[var(--track)]";

                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${intensity} hover:scale-125 transition-transform cursor-pointer`}
                      title={`Day ${i + 1}: ${hasAttended ? "Workout Completed" : "Rest Day"}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Studio breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--line)] text-xs">
              <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                <div className="text-[var(--muted)]">HIIT Woodway</div>
                <div className="font-bold text-sm font-mono text-[var(--text)] mt-1">12 Sessions</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                <div className="text-[var(--muted)]">Stages RPM Cycling</div>
                <div className="font-bold text-sm font-mono text-[var(--text)] mt-1">8 Sessions</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                <div className="text-[var(--muted)]">Allegro 2 Pilates</div>
                <div className="font-bold text-sm font-mono text-[var(--text)] mt-1">6 Sessions</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                <div className="text-[var(--muted)]">Manduka Yoga</div>
                <div className="font-bold text-sm font-mono text-[var(--text)] mt-1">4 Sessions</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DUES & PAYMENT LEDGER */}
        {activeTab === "LEDGER" && (
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-[var(--text)]">Dues Ledger & Billing History</h3>
                <p className="body-label text-xs mt-1 text-[var(--muted)]">
                  Pakistan tax compliant receipts (Sindh Sales Tax / FBR registered)
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert("Exporting official tax invoice PDF...")}
                className="btn text-xs !py-1.5 !px-3 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Statement</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[var(--line)] text-[var(--muted)] uppercase font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Plan / Item</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Amount (PKR)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] font-mono">
                  <tr>
                    <td className="py-3 px-3 text-[var(--accent)] font-bold">INV-2026-981</td>
                    <td className="py-3 px-3 text-[var(--text)]">2026-02-14</td>
                    <td className="py-3 px-3 font-sans text-[var(--text)]">TriFit Plus (12M Upfront)</td>
                    <td className="py-3 px-3">PayFast Online</td>
                    <td className="py-3 px-3 font-bold text-[var(--text)]">PKR 155,999</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400">
                        PAID
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-[var(--accent)] font-bold">INV-2026-442</td>
                    <td className="py-3 px-3 text-[var(--text)]">2026-03-01</td>
                    <td className="py-3 px-3 font-sans text-[var(--text)]">Fuel Bar: 2x Whey Gold Tubs</td>
                    <td className="py-3 px-3">POS Card</td>
                    <td className="py-3 px-3 font-bold text-[var(--text)]">PKR 34,000</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400">
                        PAID
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNED COACH & TRAINING NOTES */}
        {activeTab === "COACH" && (
          <div className="glass p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-[var(--text)]">Assigned Personal Trainer</h3>
                <p className="body-label text-xs mt-1 text-[var(--muted)]">
                  REPs certified coach overseeing hypertrophy & biomechanics programming
                </p>
              </div>

              <Link
                href={`/admin/staff/${assignedCoach.id}`}
                className="btn text-xs !py-1.5 !px-3 flex items-center gap-1.5"
              >
                <span>View Coach Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] font-bold flex items-center justify-center font-mono">
                  {assignedCoach.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--text)]">{assignedCoach.name}</div>
                  <div className="text-xs text-[var(--muted)]">{assignedCoach.specialty} • REPs Level 3</div>
                  <div className="text-[11px] font-mono text-[var(--accent)] mt-0.5">{assignedCoach.phone}</div>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="admin-chip text-emerald-400">92% Client Retention</span>
              </div>
            </div>

            {/* Coach Reassignment Selector */}
            {isReassigning && (
              <div className="p-4 rounded-xl bg-white/5 border border-[var(--accent)]/40 space-y-3">
                <div className="font-bold text-xs text-[var(--text)]">Select New Coach for {member.name}</div>
                <select
                  value={selectedTrainer}
                  onChange={(e) => setSelectedTrainer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-[var(--text)] outline-none"
                >
                  <option value="">-- Choose Coach --</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialty})
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsReassigning(false)}
                    className="btn !py-1 !px-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCoach}
                    className="btn primary !py-1 !px-3 text-xs"
                  >
                    Confirm Reassignment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}
