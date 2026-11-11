"use client";

import React, { useState, useMemo } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import { useApolloStore, Member, MemberStatus } from "@/lib/apollo-demo-store";
import { MemberDetailModal } from "@/components/members/MemberDetailModal";
import { AddMemberModal } from "@/components/members/AddMemberModal";
import { MemberCheckinModal } from "@/components/members/MemberCheckinModal";
import { StatCard } from "@/components/ui/StatCard";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  QrCode,
  Download,
  Building2,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

export default function BranchMembersPage() {
  const {
    branches,
    selectedBranch,
    members,
    plans,
    trainers,
    deleteMember,
    changeMemberStatus,
  } = useApolloStore();

  const activeBranch = selectedBranch || branches[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);

  // Scoped to current branch
  const branchMembers = useMemo(() => {
    return members.filter((m) => m.branchId === activeBranch.id);
  }, [members, activeBranch.id]);

  const activeMembersCount = useMemo(() => {
    return branchMembers.filter((m) => m.status === "ACTIVE").length;
  }, [branchMembers]);

  const filteredMembers = useMemo(() => {
    return branchMembers.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery) ||
        m.memberCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "ALL" || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [branchMembers, searchQuery, statusFilter]);

  const handleExportCSV = () => {
    const headers = [
      "Member Code",
      "Full Name",
      "Email",
      "Phone",
      "Status",
      "Joining Date",
      "Expiry Date",
      "Fitness Goal",
      "Check-ins",
    ];

    const rows = filteredMembers.map((m) => [
      `"${m.memberCode}"`,
      `"${m.name}"`,
      `"${m.email}"`,
      `"${m.phone}"`,
      `"${m.status}"`,
      `"${m.joiningDate}"`,
      `"${m.expiryDate}"`,
      `"${m.fitnessGoal}"`,
      m.totalCheckins,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TriFit_${activeBranch.id}_Members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <BranchPortalLayout activeItem="members">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Branch Members Directory</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {branchMembers.length} Members • {activeBranch.name}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Manage enrollments, biometric access, and membership renewals strictly scoped to this club
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setShowAddMember(true)}
              className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] dark:hover:bg-[#f5cf12] text-slate-950 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Member</span>
            </button>

            <button
              onClick={() => setShowCheckin(true)}
              className="h-9 px-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span>Turnstile Check-in</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="h-9 w-9 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center shadow-sm transition-all"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Compact Member KPIs — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Total Registered"
            numericValue={branchMembers.length}
            icon={Users}
            variant="warning"
            sparklineData={[6, 7, 7, 8, branchMembers.length]}
            sparklineColor="#FFD91C"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                {activeMembersCount} Active
              </span>
            }
            footerRight="Branch roster"
          />

          <StatCard
            title="Active Passes"
            numericValue={activeMembersCount}
            icon={CheckCircle2}
            variant="warning"
            trend={{
              value: "Good",
              isPositive: true,
            }}
            sparklineData={[5, 6, 6, 7, activeMembersCount]}
            sparklineColor="#F59E0B"
            footerRight="Valid turnstile"
          />

          <StatCard
            title="VIP Tier 1 (Black Diamond)"
            numericValue={branchMembers.filter((m) => m.planId === "ELITE").length}
            icon={CreditCard}
            variant="warning"
            sparklineData={[2, 2, 3, 3, branchMembers.filter((m) => m.planId === "ELITE").length]}
            sparklineColor="#FBBF24"
            footerLeft={
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                All-Club Access
              </span>
            }
            footerRight="Premium tier"
          />

          <StatCard
            title="Personal Training Enrolled"
            numericValue={branchMembers.filter((m) => m.trainerId).length}
            icon={Building2}
            variant="warning"
            sparklineData={[3, 3, 4, 4, branchMembers.filter((m) => m.trainerId).length]}
            sparklineColor="#EAB308"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                1-on-1 Assigned
              </span>
            }
            footerRight="Floor coaching"
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 rounded-[18px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, CNIC, email, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-[10px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[12.5px] focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(["ALL", "ACTIVE", "EXPIRED", "SUSPENDED", "PENDING"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-[9px] text-[11px] font-bold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-black"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Member Table */}
        <div className="glass-panel rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-neutral-400 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Member</th>
                  <th className="px-4 py-3.5">Membership Plan</th>
                  <th className="px-4 py-3.5">Coach</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Check-ins</th>
                  <th className="px-4 py-3.5">Expiry</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {filteredMembers.map((m) => {
                  const plan = plans.find((p) => p.id === m.planId);
                  const coach = trainers.find((t) => t.id === m.trainerId);

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setSelectedMember(m)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-10 h-10 rounded-[12px] object-cover border border-slate-200 dark:border-white/10"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              {m.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              {m.memberCode} • {m.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-800 dark:text-neutral-200">
                          {plan?.name || "VIP"}
                        </span>
                        <div className="text-[10.5px] text-slate-400">
                          PKR {plan?.pricePKR.toLocaleString()}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-slate-800 dark:text-neutral-200 font-medium">
                          {coach?.name || "None (Self-Training)"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            m.status === "ACTIVE"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : m.status === "EXPIRED"
                              ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                              : "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {m.totalCheckins}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-neutral-400 text-[11.5px]">
                        {m.expiryDate}
                      </td>

                      <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedMember(m)}
                          className="px-3 py-1.5 rounded-[8px] bg-slate-100 dark:bg-white/10 hover:bg-amber-400 hover:text-slate-950 font-bold text-[11px] transition-all"
                        >
                          View 11 Tabs
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {selectedMember && (
          <MemberDetailModal
            member={selectedMember}
            isOpen={true}
            onClose={() => setSelectedMember(null)}
          />
        )}
        <AddMemberModal isOpen={showAddMember} onClose={() => setShowAddMember(false)} />
        <MemberCheckinModal isOpen={showCheckin} onClose={() => setShowCheckin(false)} />
      </div>
    </BranchPortalLayout>
  );
}
