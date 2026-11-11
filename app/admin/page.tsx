"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  Users,
  CreditCard,
  TrendingUp,
  QrCode,
  Activity,
  Sparkles,
  Plus,
  Download,
  UserPlus,
  ChevronRight,
  ChevronDown,
  Clock,
  Building2,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Check,
  Zap,
  ArrowUpRight,
  Filter,
  X,
  Crown,
  Dumbbell,
  CupSoda,
} from "lucide-react";
import { AddMemberModal } from "@/components/members/AddMemberModal";
import { MemberCheckinModal } from "@/components/members/MemberCheckinModal";
import { SubscriptionDonutChart } from "@/components/dashboard/SubscriptionDonutChart";
import { ProteinRevenueChart } from "@/components/dashboard/ProteinRevenueChart";
import { CoachRosterModal } from "@/components/trainers/CoachRosterModal";
import { SubscriptionGrowthTrajectoryChart } from "@/components/dashboard/SubscriptionGrowthTrajectoryChart";
import { WeeklyRevenueStackedBar } from "@/components/charts/WeeklyRevenueStackedBar";

type DateFilterRange = "7d" | "30d" | "3m" | "6m" | "12m";

export default function AdminDashboardPage() {
  const {
    members,
    branches,
    trainers,
    payments,
    attendance,
    plans,
    currentBranchId,
    setCurrentBranchId,
    selectedBranch,
  } = useApolloStore();

  const [dateRange, setDateRange] = useState<DateFilterRange>("30d");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [approvedWinbackIds, setApprovedWinbackIds] = useState<Record<string, boolean>>({});

  // Custom Glass Dropdown State (Section 8)
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const branchMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (branchMenuRef.current && !branchMenuRef.current.contains(e.target as Node)) {
        setIsBranchMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter scoped to selected branch (if branch selector is used)
  const scopedMembers = useMemo(() => {
    return currentBranchId ? members.filter((m) => m.branchId === currentBranchId) : members;
  }, [members, currentBranchId]);

  const scopedTrainers = useMemo(() => {
    return currentBranchId ? trainers.filter((t) => t.branchId === currentBranchId) : trainers;
  }, [trainers, currentBranchId]);

  const scopedPayments = useMemo(() => {
    return currentBranchId ? payments.filter((p) => p.branchId === currentBranchId) : payments;
  }, [payments, currentBranchId]);

  const scopedAttendance = useMemo(() => {
    return currentBranchId ? attendance.filter((a) => a.branchId === currentBranchId) : attendance;
  }, [attendance, currentBranchId]);

  // Date range multiplier
  const rangeMultiplier = useMemo(() => {
    switch (dateRange) {
      case "7d":
        return 0.25;
      case "30d":
        return 1.0;
      case "3m":
        return 2.85;
      case "6m":
        return 5.6;
      case "12m":
        return 11.2;
      default:
        return 1.0;
    }
  }, [dateRange]);

  // Key KPI values
  const totalMembersCount = scopedMembers.length > 0 ? scopedMembers.length * 170 : 5420;
  const activeMembersCount = Math.round(totalMembersCount * 0.942);
  const baseMonthlyRevenue = scopedPayments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amountPKR, 0);
  const scaledRevenuePKR = Math.round((baseMonthlyRevenue > 0 ? baseMonthlyRevenue * 4.8 : 38600000) * rangeMultiplier);

  // Personal Training & Coaching deliveries
  const ptMetrics = useMemo(() => {
    if (selectedBranch) {
      const coachCount = scopedTrainers.length || 2;
      const sessions = coachCount * 240;
      const totalClients = coachCount * 28;
      return {
        sessions,
        coachCount,
        totalClients,
        label: `${coachCount} REPs certified coaches • 92% client renewal`,
      };
    }
    return {
      sessions: 1420,
      coachCount: 8,
      totalClients: 224,
      label: "8 REPs certified coaches • 88% client renewal",
    };
  }, [selectedBranch, scopedTrainers]);

  // Fuel Bar & Retail Nutrition collections
  const fuelBarMetrics = useMemo(() => {
    if (selectedBranch) {
      const branchRevenueMap: Record<string, { revM: number; shakes: number; margin: number }> = {
        "branch-seaview": { revM: 1.48, shakes: 1850, margin: 66 },
        "branch-clifton": { revM: 1.12, shakes: 1400, margin: 63 },
        "branch-ajtower": { revM: 0.98, shakes: 1220, margin: 64 },
        "branch-luckyone": { revM: 0.78, shakes: 980, margin: 61 },
      };
      const data = branchRevenueMap[selectedBranch.id] || { revM: 1.48, shakes: 1850, margin: 65 };
      return {
        revFormatted: `PKR ${data.revM.toFixed(2)}M`,
        shakes: data.shakes,
        margin: data.margin,
        label: `${data.shakes.toLocaleString()} shakes blended • ${data.margin}% gross margin`,
      };
    }
    return {
      revFormatted: "PKR 4.36M",
      shakes: 5450,
      margin: 64,
      label: "5,450 shakes blended • 64% margin • Top: Whey Gold",
    };
  }, [selectedBranch]);

  // Revenue bars data
  const weeklyRevenueBars = [
    { day: "Mon", amountM: 4.8, height: 60 },
    { day: "Tue", amountM: 5.6, height: 70 },
    { day: "Wed", amountM: 6.4, height: 80 },
    { day: "Thu", amountM: 6.1, height: 76 },
    { day: "Fri", amountM: 7.2, height: 90 },
    { day: "Sat", amountM: 8.8, height: 100 },
    { day: "Sun", amountM: 7.9, height: 88 },
  ];

  // Recent TriFit subscription activations & renewals feed - Dynamically filters by selected branch scope
  const recentActivations = useMemo(() => {
    if (selectedBranch) {
      const branchShort = selectedBranch.name.replace("TriFit ", "");
      return [
        {
          id: "act-1",
          name: "Hamza Malik",
          plan: "TriFit Plus (12M)",
          branch: branchShort,
          time: "Just now",
          status: "Active",
        },
        {
          id: "act-2",
          name: "Ayesha Khan",
          plan: "TriFit Regular (12M)",
          branch: branchShort,
          time: "2 mins ago",
          status: "Renewed",
        },
        {
          id: "act-3",
          name: "Bilal Tariq",
          plan: "TriFit Plus (6M)",
          branch: branchShort,
          time: "5 mins ago",
          status: "Active",
        },
        {
          id: "act-4",
          name: "Zainab Raza",
          plan: "TriFit Regular (3M)",
          branch: branchShort,
          time: "8 mins ago",
          status: "Active",
        },
        {
          id: "act-5",
          name: "Mustafa Qureshi",
          plan: "TriFit Plus (3M)",
          branch: branchShort,
          time: "12 mins ago",
          status: "Renewed",
        },
      ];
    }
    return [
      {
        id: "act-1",
        name: "Hamza Malik",
        plan: "TriFit Plus (12M)",
        branch: "Seaview DHA",
        time: "Just now",
        status: "Active",
      },
      {
        id: "act-2",
        name: "Ayesha Khan",
        plan: "TriFit Regular (12M)",
        branch: "Clifton Flagship",
        time: "2 mins ago",
        status: "Renewed",
      },
      {
        id: "act-3",
        name: "Bilal Tariq",
        plan: "TriFit Plus (6M)",
        branch: "AJ Tower Islamabad",
        time: "4 mins ago",
        status: "Active",
      },
      {
        id: "act-4",
        name: "Zainab Raza",
        plan: "TriFit Regular (3M)",
        branch: "LuckyOne Mall",
        time: "6 mins ago",
        status: "Active",
      },
      {
        id: "act-5",
        name: "Mustafa Qureshi",
        plan: "TriFit Plus (3M)",
        branch: "Clifton Flagship",
        time: "9 mins ago",
        status: "Renewed",
      },
    ];
  }, [selectedBranch]);

  return (
    <AdminPortalLayout activeItem="overview">
      <div className="flex flex-col gap-6 w-full">
        {/* =========================================================================
            HEADER: SPACE GROTESK 700 32PX PAGE TITLE + ACTION BUTTONS
           ========================================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="admin-page-title tracking-tight text-[var(--text)] whitespace-nowrap">
                Executive Dashboard
              </h1>
              <span className="admin-chip shrink-0">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
                Realtime Operations
              </span>
              {selectedBranch && (
                <button
                  type="button"
                  onClick={() => setCurrentBranchId(null)}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent)] text-[var(--on-accent)] hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                  title="Click to reset to Consolidated All Clubs view"
                >
                  <span>Scope: {selectedBranch.name.replace("TriFit ", "")}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="body-label text-[13.5px] mt-1 text-[var(--muted)] truncate max-w-xl">
              {selectedBranch
                ? `Club Scoped: ${selectedBranch.name} • ${selectedBranch.city} • Managed by ${selectedBranch.managerName}`
                : "Consolidated enterprise telemetry across 4 flagship clubs • Monday, Nov 10, 2026"}
            </p>
          </div>

          {/* Top Controls: Forced into one single horizontal row with visible dropdown overlay */}
          <div className="flex items-center gap-2 xl:gap-2.5 flex-nowrap overflow-visible py-1 shrink-0 z-30">
            {/* Custom Frosted Glass Dropdown per Section 8 */}
            <div className="relative shrink-0 z-50" ref={branchMenuRef}>
              <button
                type="button"
                onClick={() => setIsBranchMenuOpen((prev) => !prev)}
                className="select-btn text-xs !h-[42px] !px-3 shrink-0 cursor-pointer flex items-center gap-2 min-w-[170px] sm:min-w-[190px] justify-between"
                aria-haspopup="listbox"
                aria-expanded={isBranchMenuOpen}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[170px] text-xs font-semibold">
                    {selectedBranch ? selectedBranch.name.replace("TriFit ", "") : "All Flagships"}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-[var(--muted)] transition-transform duration-200 ${isBranchMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isBranchMenuOpen && (
                <div className="menu shadow-2xl min-w-[260px]" role="listbox">
                  <button
                    type="button"
                    role="option"
                    aria-selected={!currentBranchId}
                    onClick={() => {
                      setCurrentBranchId(null);
                      setIsBranchMenuOpen(false);
                    }}
                    className="menu-item w-full text-left"
                  >
                    <div>
                      <div className="font-bold">All Flagships</div>
                      <div className="text-[10.5px] opacity-75">Consolidated multi-club view</div>
                    </div>
                    {!currentBranchId && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                  <div className="w-full h-[1px] my-1" style={{ background: "var(--line)" }} />
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      role="option"
                      aria-selected={currentBranchId === b.id}
                      onClick={() => {
                        setCurrentBranchId(b.id);
                        setIsBranchMenuOpen(false);
                      }}
                      className="menu-item w-full text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{b.name.replace("TriFit ", "")}</div>
                        <div className="text-[10.5px] opacity-75 flex items-center gap-1.5">
                          <span>{b.city}</span>
                          <span>•</span>
                          <span>{b.capacity} Max</span>
                        </div>
                      </div>
                      {currentBranchId === b.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Selector Chips */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl glass text-xs font-semibold shrink-0 !h-[42px]">
              {(["7d", "30d", "3m", "6m", "12m"] as DateFilterRange[]).map((tab) => {
                const isActive = dateRange === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDateRange(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                      isActive
                        ? "shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                    style={
                      isActive
                        ? { background: "var(--accent)", color: "var(--on-accent)" }
                        : {}
                    }
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Section 4 Buttons: Aligned on the exact same row - Routable Page (No Modal) */}
            <Link
              href="/admin/members/new"
              className="btn primary !h-[42px] !px-3.5 text-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Add Member</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowCheckin(true)}
              className="btn !h-[42px] !px-3 text-xs whitespace-nowrap shrink-0"
              title="Member Pass & QR Check-in"
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span>Member Check-in</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            SECTION 6: KPI ROW (grid: repeat(auto-fit, minmax(210px, 1fr)); gap: 18px)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {/* KPI Card 1: Active Members */}
          <div className="glass p-[22px] flex flex-col justify-between gap-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="card-title text-[var(--text)]">Active Members</span>
              <span className="admin-chip">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span>+8.4%</span>
              </span>
            </div>

            <div className="my-1">
              <div className="kpi-value text-[var(--text)]">
                {activeMembersCount.toLocaleString()}
              </div>
              <p className="body-label text-xs mt-1">
                94.2% retention • {totalMembersCount.toLocaleString()} total enrolled
              </p>
            </div>

            <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: "94.2%", background: "var(--accent)" }}
              />
            </div>
          </div>

          {/* KPI Card 2: Monthly Recurring Revenue */}
          <div className="glass p-[22px] flex flex-col justify-between gap-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="card-title text-[var(--text)]">Monthly Revenue</span>
              <span className="admin-chip">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>+14.2%</span>
              </span>
            </div>

            <div className="my-1">
              <div className="kpi-value text-[var(--text)]">
                PKR {(scaledRevenuePKR / 1000000).toFixed(1)}M
              </div>
              <p className="body-label text-xs mt-1">
                PKR 1.28M today • 104% to quarterly goal
              </p>
            </div>

            <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: "88%", background: "var(--accent)" }}
              />
            </div>
          </div>

          {/* KPI Card 3: Total Coaches & Coaching Sessions (Routable Page - No Modal) */}
          <Link
            href="/admin/staff"
            className="glass p-[22px] flex flex-col justify-between gap-3 relative overflow-hidden group cursor-pointer hover:border-[var(--accent)] hover:scale-[1.01] transition-all"
            title="Click to view all individual coaches and client rosters"
          >
            <div className="flex items-center justify-between">
              <span className="card-title text-[var(--text)] flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[var(--accent)]" />
                <span>Total Coaches</span>
              </span>
              <span className="admin-chip flex items-center gap-1 group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)] transition-colors">
                <span>Inspect Roster</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            <div className="my-1">
              <div className="kpi-value text-[var(--text)] flex items-baseline gap-2">
                <span>{scopedTrainers.length} Coaches</span>
                <span className="text-xs font-mono font-bold text-emerald-400">REPs L3</span>
              </div>
              <p className="body-label text-xs mt-1 text-[var(--muted)]">
                {ptMetrics.totalClients} active PT clients • {ptMetrics.sessions.toLocaleString()} monthly sessions
              </p>
            </div>

            <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: "88%", background: "var(--accent)" }}
              />
            </div>
          </Link>

          {/* KPI Card 4: Fuel Bar & Retail Nutrition Collections */}
          <div className="glass p-[22px] flex flex-col justify-between gap-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="card-title text-[var(--text)] flex items-center gap-1.5">
                <CupSoda className="w-4 h-4 text-[var(--accent)]" />
                <span>Fuel Bar Sales</span>
              </span>
              <span className="admin-chip flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span>+19.4%</span>
              </span>
            </div>

            <div className="my-1">
              <div className="kpi-value text-[var(--text)]">
                {fuelBarMetrics.revFormatted}
              </div>
              <p className="body-label text-xs mt-1">
                {fuelBarMetrics.label}
              </p>
            </div>

            <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: "87%", background: "var(--accent)" }}
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 6: CHART ROW (protein revenue by branch flex: 1.5 1 440px | donut card flex: 1.3 1 380px)
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row gap-[18px]">
          {/* WIDE CHART CARD: PROTEIN & FUEL BAR REVENUE (MULTI-BRANCH COMPARISON OR INDIVIDUAL BRANCH SCOPE) */}
          <div className="flex-[1.5_1_440px] min-w-0">
            <ProteinRevenueChart
              branches={branches}
              selectedBranchId={currentBranchId}
              onSelectBranch={setCurrentBranchId}
              rangeMultiplier={rangeMultiplier}
            />
          </div>

          {/* MEMBERS BY SUBSCRIPTION TIER INTERACTIVE DONUT CARD (flex: 1.3 1 380px) */}
          <div className="flex-[1.3_1_380px] min-w-0">
            <SubscriptionDonutChart
              plans={plans}
              members={scopedMembers}
              totalMembersCount={activeMembersCount}
              selectedBranchName={selectedBranch?.name}
            />
          </div>
        </div>

        {/* =========================================================================
            SUBSCRIPTION GROWTH & REVENUE TRAJECTORY (REFERENCE DESIGN)
           ========================================================================= */}
        <SubscriptionGrowthTrajectoryChart selectedBranchName={selectedBranch?.name} />

        {/* =========================================================================
            WEEKLY REVENUE STACKED BAR (MEMBERSHIP DUES vs PT COACHING vs FUEL BAR)
           ========================================================================= */}
        <WeeklyRevenueStackedBar selectedBranchName={selectedBranch?.name} />

        {/* =========================================================================
            SECTION 6: BOTTOM ROW (recent activations list, quick-action buttons)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
          {/* 1. RECENT ACTIVATIONS LIST CARD */}
          <div className="glass p-[22px] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="card-title text-[var(--text)] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[var(--accent)]" />
                  <span>Recent Activations</span>
                </h3>
                <Link
                  href="/admin/members"
                  className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-0.5"
                >
                  <span>All Members</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="body-label text-xs mt-0.5">
                Live subscription provisioning feed across network
              </p>
            </div>

            <div className="space-y-2.5 my-1 divide-y divide-[var(--line)]">
              {recentActivations.map((act) => (
                <div key={act.id} className="pt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ background: "var(--chip)", color: "var(--text)" }}
                    >
                      {act.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-bold text-[var(--text)] leading-tight truncate">
                        {act.name}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] font-mono truncate">
                        {act.branch} • <span className="text-[var(--accent)] font-semibold">{act.plan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="admin-chip text-[10px] py-0.5 px-2">
                      {act.status}
                    </span>
                    <div className="text-[10px] text-[var(--muted)] mt-0.5 font-mono">
                      {act.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center border-t border-[var(--line)]">
              <span className="text-[11px] text-[var(--muted)]">
                Auto-synced with TriFit billing and member database
              </span>
            </div>
          </div>

          {/* 3. QUICK-ACTION BUTTONS CARD */}
          <div className="glass p-[22px] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="card-title text-[var(--text)] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[var(--accent)]" />
                  <span>Executive Actions</span>
                </h3>
                <span className="admin-chip">Admin v2.6</span>
              </div>
              <p className="body-label text-xs mt-0.5">
                Immediate command routines & member overrides
              </p>
            </div>

            <div className="flex flex-col gap-2.5 my-2">
              <button
                type="button"
                onClick={() => setShowAddMember(true)}
                className="btn primary w-full justify-start text-left"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span>+ Register New Member</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCheckin(true)}
                className="btn w-full justify-start text-left"
              >
                <QrCode className="w-4 h-4 shrink-0 text-[var(--accent)]" />
                <span>Issue Member Pass & Check-in</span>
              </button>

              <Link
                href="/admin/brain"
                className="btn w-full justify-start text-left text-decoration-none"
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[var(--accent)]" />
                <span>Run AI Retention Engine</span>
              </Link>

              <Link
                href="/admin/reports"
                className="btn w-full justify-start text-left text-decoration-none"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Export Audit Sheet (.CSV)</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Security Level: Tier 1</span>
              <span className="font-mono text-emerald-400 font-semibold">Encrypted</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MODALS
           ========================================================================= */}
        <AddMemberModal isOpen={showAddMember} onClose={() => setShowAddMember(false)} />
        <MemberCheckinModal isOpen={showCheckin} onClose={() => setShowCheckin(false)} />
        <CoachRosterModal
          isOpen={showCoachModal}
          onClose={() => setShowCoachModal(false)}
          trainers={trainers}
          branches={branches}
          selectedBranchId={currentBranchId}
        />
      </div>
    </AdminPortalLayout>
  );
}
