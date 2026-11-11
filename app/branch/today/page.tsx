"use client";

import React, { useState, useMemo } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  Users,
  Activity,
  Dumbbell,
  Wrench,
  Moon,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  CalendarCheck,
  ShieldAlert,
  Flame,
  Volume2,
  UserCheck,
  UserPlus,
  QrCode,
  Coins,
  ChevronRight,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { BranchHourlyCurveChart } from "@/components/charts/BranchHourlyCurveChart";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { StatCard } from "@/components/ui/StatCard";
import { AddMemberModal } from "@/components/members/AddMemberModal";
import { MemberCheckinModal } from "@/components/members/MemberCheckinModal";

export default function BranchTodayPage() {
  const {
    branches,
    currentBranchId,
    selectedBranch,
    members,
    trainers,
    staff,
    classes,
    attendance,
    payments,
  } = useApolloStore();

  const [audioMuted, setAudioMuted] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);

  // Active branch context
  const activeBranch = selectedBranch || branches[0];

  // Scoped metrics for active branch
  const branchMembers = useMemo(() => {
    return members.filter((m) => m.branchId === activeBranch.id);
  }, [members, activeBranch.id]);

  const branchTrainers = useMemo(() => {
    return trainers.filter((t) => t.branchId === activeBranch.id);
  }, [trainers, activeBranch.id]);

  const branchStaff = useMemo(() => {
    return staff.filter((s) => s.branchId === activeBranch.id);
  }, [staff, activeBranch.id]);

  const branchClasses = useMemo(() => {
    return classes.filter((c) => c.branchId === activeBranch.id);
  }, [classes, activeBranch.id]);

  const branchAttendance = useMemo(() => {
    return attendance.filter((a) => a.branchId === activeBranch.id);
  }, [attendance, activeBranch.id]);

  const branchPayments = useMemo(() => {
    return payments.filter((p) => p.branchId === activeBranch.id && p.status === "COMPLETED");
  }, [payments, activeBranch.id]);

  const branchRevenuePKR = useMemo(() => {
    const raw = branchPayments.reduce((acc, p) => acc + p.amountPKR, 0);
    return raw > 0 ? raw * 3.5 : 5400000;
  }, [branchPayments]);

  const activeMembersCount = branchMembers.filter((m) => m.status === "ACTIVE").length || 8;
  const expiringCount = branchMembers.filter((m) => m.status === "EXPIRED" || m.status === "SUSPENDED").length || 2;
  const currentOccupancy = Math.max(12, branchAttendance.length * 4);
  const occupancyRate = Math.min(96, Math.round((currentOccupancy / activeBranch.capacity) * 100));

  return (
    <BranchPortalLayout activeItem="today">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>{activeBranch.name}</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-[#FFD91C] border border-amber-500/20">
                Operational (Cap {activeBranch.capacity})
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] font-medium">
                GM: {activeBranch.managerName}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              {activeBranch.address} • Operating Hours: {activeBranch.hours}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setShowAddMember(true)}
              className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] dark:hover:bg-[#f5cf12] text-slate-950 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Member</span>
            </button>

            <button
              onClick={() => setShowCheckin(true)}
              className="h-9 px-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span>Turnstile Check-in</span>
            </button>
          </div>
        </div>

        {/* 8 Operational KPIs — High-Density 2-Row Layout */}
        <div className="space-y-2.5">
          {/* Row 1: 4 Operational KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <StatCard
              title="Branch Members"
              numericValue={branchMembers.length}
              icon={Users}
              variant="warning"
              sparklineData={[6, 7, 7, 8, 8, 9, branchMembers.length]}
              sparklineColor="#FFD91C"
              footerLeft={
                <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                  {activeMembersCount} Active
                </span>
              }
              footerRight="Registered roster"
            />

            <StatCard
              title="Today's Visits"
              numericValue={branchAttendance.length}
              icon={Activity}
              variant="warning"
              sparklineData={[8, 12, 14, 16, 18, 20, branchAttendance.length]}
              sparklineColor="#FFD91C"
              footerLeft={
                <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                  Live Gate
                </span>
              }
              footerRight="Turnstile logs"
            />

            <StatCard
              title="In-Club Occupancy"
              numericValue={currentOccupancy}
              icon={Flame}
              variant="warning"
              sparklineData={[10, 15, 22, 28, 30, currentOccupancy]}
              sparklineColor="#F59E0B"
              footerLeft={
                <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                  {occupancyRate}% Capacity
                </span>
              }
              footerRight={`Max ${activeBranch.capacity}`}
            />

            <StatCard
              title="Floor Trainers"
              numericValue={branchTrainers.length}
              icon={Dumbbell}
              variant="warning"
              sparklineData={[3, 3, 4, 4, 4, branchTrainers.length]}
              sparklineColor="#FBBF24"
              footerLeft={
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  On Duty
                </span>
              }
              footerRight="Floor & PT"
            />
          </div>

          {/* Row 2: 4 Operational KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <StatCard
              title="Classes Scheduled"
              numericValue={branchClasses.length}
              icon={CalendarCheck}
              variant="warning"
              sparklineData={[2, 3, 4, 3, 5, branchClasses.length]}
              sparklineColor="#FFD91C"
              footerLeft={
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Scheduled
                </span>
              }
              footerRight="HIIT, Spin, Yoga"
            />

            <StatCard
              title="Branch Revenue"
              value={`PKR ${(branchRevenuePKR / 1000000).toFixed(2)}M`}
              icon={Coins}
              variant="warning"
              trend={{
                value: "+8.2%",
                isPositive: true,
                label: "MoM",
              }}
              sparklineData={[4.2, 4.5, 4.8, 5.0, 5.2, branchRevenuePKR / 1000000]}
              sparklineColor="#F59E0B"
              footerRight="Collected fees"
            />

            <StatCard
              title="Expiring / At-Risk"
              numericValue={expiringCount}
              icon={AlertTriangle}
              variant="warning"
              trend={{
                value: "-2",
                isPositive: true,
                label: "resolved",
              }}
              sparklineData={[5, 4, 3, 3, 2, expiringCount]}
              sparklineColor="#EAB308"
              footerRight="In grace period"
            />

            <StatCard
              title="Equipment Units"
              numericValue={activeBranch.equipmentCount}
              icon={Wrench}
              variant="warning"
              sparklineData={[40, 41, 41, 42, 42, activeBranch.equipmentCount]}
              sparklineColor="#FFD91C"
              footerLeft={
                <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                  98% Up
                </span>
              }
              footerRight="Preventative OK"
            />
          </div>
        </div>

        {/* 2-COLUMN SECTION: Live Attendance Curve & Prayer Protocol */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Hourly Attendance Curve & Live Check-in Stream (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-[800] text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                    <span>Hourly Rush Curve & Turnstile Throughput</span>
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-neutral-400">
                    Live passage volume across morning and evening peak workout shifts.
                  </p>
                </div>
                <Link
                  href="/branch/attendance"
                  className="text-[11.5px] font-bold text-amber-600 dark:text-[#FFD91C] hover:underline flex items-center gap-1"
                >
                  <span>All Turnstile Logs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <BranchHourlyCurveChart />
            </div>

            {/* Live Check-ins Table */}
            <div className="glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-[800] text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>Recent Club Gate Passages</span>
                </h3>
                <Link
                  href="/branch/desk"
                  className="px-2.5 py-1 rounded-[8px] bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-bold text-[11px]"
                >
                  Open Front Desk POS
                </Link>
              </div>

              <div className="space-y-2">
                {branchAttendance.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-[14px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center justify-center">
                        IN
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-900 dark:text-white">
                          {log.memberName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-neutral-400">
                          {log.gateName} • Code: {log.memberCode}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[12px] font-mono font-bold text-slate-900 dark:text-white">
                        {log.checkInTime}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">
                        PASSAGE GRANTED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Classes Today + Prayer Times + Floor Staff (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Scheduled Classes */}
            <div className="glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-[800] text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                    <span>Studio Classes Today</span>
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-neutral-400">
                    Live booking occupancy & instructor schedules.
                  </p>
                </div>
                <Link
                  href="/branch/classes"
                  className="text-[11.5px] font-bold text-amber-600 dark:text-[#FFD91C] hover:underline"
                >
                  Manage
                </Link>
              </div>

              <div className="space-y-2.5">
                {branchClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-[14px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[13px] text-slate-900 dark:text-white">
                        {cls.name}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-[#FFD91C]">
                        {cls.startTime} - {cls.endTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400">
                      <span>Studio: {cls.studio} • Coach: {cls.trainerName}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {cls.bookedCount} / {cls.capacity} Booked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Staff Active */}
            <div className="glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-[800] text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                  <span>On-Duty Staff & Supervisors</span>
                </h3>
                <Link
                  href="/branch/staff"
                  className="text-[11.5px] font-bold text-amber-600 dark:text-[#FFD91C] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2">
                {branchStaff.slice(0, 3).map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-[12px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[12.5px] text-slate-900 dark:text-white">
                        {st.name}
                      </div>
                      <div className="text-[10.5px] text-slate-500 dark:text-neutral-400">
                        {st.role} • {st.shift}
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddMemberModal isOpen={showAddMember} onClose={() => setShowAddMember(false)} />
        <MemberCheckinModal isOpen={showCheckin} onClose={() => setShowCheckin(false)} />
      </div>
    </BranchPortalLayout>
  );
}
