"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, Member } from "@/lib/apollo-demo-store";
import { ApolloSelect } from "@/components/ui/ApolloSelect";
import {
  MemberPerformanceDistribution,
  MemberCategoryKey,
} from "@/components/charts/MemberPerformanceDistribution";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Building2,
  UserPlus,
  Eye,
  RefreshCw,
  Sparkles,
  Activity,
  ScanLine,
  Download,
  Phone,
  Hash,
  ChevronRight,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

export default function AdminMembersPage() {
  const { members, branches, plans, trainers } = useApolloStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState<MemberCategoryKey>("ALL");

  // Filter members by query, branch, and category
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        (m.cnic && m.cnic.includes(q)) ||
        m.id.toLowerCase().includes(q);

      const matchesBranch = selectedBranchFilter === "ALL" || m.branchId === selectedBranchFilter;

      // Category match
      let matchesCategory = true;
      if (selectedCategory === "HYPER_ACTIVE") {
        matchesCategory = m.status === "ACTIVE";
      } else if (selectedCategory === "CONSISTENT") {
        matchesCategory = m.status === "ACTIVE";
      } else if (selectedCategory === "PLATEAUED") {
        matchesCategory = m.status === "ACTIVE";
      } else if (selectedCategory === "FADING") {
        matchesCategory = m.status === "EXPIRED" || m.status === "SUSPENDED" || m.status === "INACTIVE";
      }

      return matchesSearch && matchesBranch && matchesCategory;
    });
  }, [members, searchQuery, selectedBranchFilter, selectedCategory]);

  return (
    <AdminPortalLayout activeItem="members">
      <div className="flex flex-col gap-6 w-full pb-16">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="admin-page-title text-2xl font-bold tracking-tight text-[var(--text)]">
                Member Directory & CRM
              </h1>
              <span className="admin-chip text-xs">
                {members.length.toLocaleString()} Active Profiles
              </span>
            </div>
            <p className="body-label text-xs sm:text-sm mt-1 text-[var(--muted)]">
              Multi-club performance directory with Forma 3D Bio-Scan integration & biometric gate access.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* NO POP-UP MODAL: Routable Add Member Page */}
            <Link
              href="/admin/members/new"
              className="btn primary !h-[42px] !px-4 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Member</span>
            </Link>
          </div>
        </div>

        {/* SECTION: Member Performance Distribution (Requested Donut Chart) */}
        <MemberPerformanceDistribution
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Directory Controls: Search, Branch Filter & Stats */}
        <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search by name, CNIC, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] outline-none"
            />
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ApolloSelect
              value={selectedBranchFilter}
              onChange={(v) => setSelectedBranchFilter(v)}
              options={[
                { value: "ALL", label: "All Flagships (Consolidated)" },
                ...branches.map((b) => ({ value: b.id, label: b.name.replace("TriFit ", "") })),
              ]}
              className="text-xs"
            />

            {/* Reset Filters */}
            {(searchQuery || selectedBranchFilter !== "ALL" || selectedCategory !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBranchFilter("ALL");
                  setSelectedCategory("ALL");
                }}
                className="btn !py-2 !px-3 text-xs flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Member Directory Table (No Modals - Each Row Links to /admin/members/[id]) */}
        <div className="glass rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-[var(--line)] bg-[var(--card)] text-[var(--muted)] uppercase font-mono tracking-wider">
                <tr>
                  <th className="py-3 px-4">Member / Dossier</th>
                  <th className="py-3 px-4">CNIC & Phone</th>
                  <th className="py-3 px-4">Club Scope</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Assigned Coach</th>
                  <th className="py-3 px-4">Forma 3D Fat %</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredMembers.map((m) => {
                  const branch = branches.find((b) => b.id === m.branchId);
                  const plan = plans.find((p) => p.id === m.planId);
                  const coach = trainers.find((t) => t.id === m.trainerId);

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-[var(--card)] transition-colors group cursor-pointer"
                    >
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <Link href={`/admin/members/${m.id}`} className="block">
                          <div className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                            {m.name}
                          </div>
                          <div className="text-[10.5px] font-mono text-[var(--muted)]">
                            {m.id} • Joined {m.joiningDate}
                          </div>
                        </Link>
                      </td>

                      {/* CNIC & Phone */}
                      <td className="py-3 px-4 font-mono">
                        <div className="text-[var(--text)] flex items-center gap-1">
                          <Hash className="w-3 h-3 text-[var(--accent)]" />
                          <span>{m.cnic || "42201-XXXXXXX-X"}</span>
                        </div>
                        <div className="text-[10.5px] text-[var(--muted)]">{m.phone}</div>
                      </td>

                      {/* Branch */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-[var(--text)]">
                          {branch?.name.replace("TriFit ", "") || "Seaview DHA"}
                        </span>
                      </td>

                      {/* Plan */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                          {plan?.name || "TriFit Plus (12M)"}
                        </span>
                      </td>

                      {/* Coach */}
                      <td className="py-3 px-4">
                        {coach ? (
                          <div className="text-[var(--text)] font-semibold">{coach.name}</div>
                        ) : (
                          <span className="text-[var(--muted)] italic">Unassigned</span>
                        )}
                      </td>

                      {/* 3D Bio-Scan Telemetry */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                          <ScanLine className="w-3.5 h-3.5" />
                          <span>21.1% Fat</span>
                        </div>
                        <div className="text-[10px] text-[var(--muted)]">62.8 kg • Optimal</div>
                      </td>

                      {/* Action: Dedicated Page Link (No Modal) */}
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/members/${m.id}`}
                          className="btn !py-1 !px-2.5 text-xs text-[var(--accent)] inline-flex items-center gap-1 group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)] transition-all"
                        >
                          <span>Inspect Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
