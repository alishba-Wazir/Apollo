"use client";

import React, { useState, useMemo } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import { useApolloStore } from "@/lib/apollo-demo-store";
import { MemberCheckinModal } from "@/components/members/MemberCheckinModal";
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  Download,
  Search,
  Filter,
  Clock,
  Building2,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function BranchAttendancePage() {
  const {
    branches,
    selectedBranch,
    attendance,
  } = useApolloStore();

  const activeBranch = selectedBranch || branches[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [showCheckinModal, setShowCheckinModal] = useState(false);

  // Scoped strictly to active branch
  const branchAttendance = useMemo(() => {
    return attendance.filter((a) => a.branchId === activeBranch.id);
  }, [attendance, activeBranch.id]);

  const filteredLogs = useMemo(() => {
    return branchAttendance.filter((log) => {
      const matchSearch =
        log.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.memberCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.gateName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchMethod = methodFilter === "ALL" || log.method === methodFilter;
      return matchSearch && matchMethod;
    });
  }, [branchAttendance, searchQuery, methodFilter]);

  const handleExportCSV = () => {
    const headers = ["Member Code", "Member Name", "Gate Name", "Check In Time", "Method", "Club"];
    const rows = filteredLogs.map((l) => [
      `"${l.memberCode}"`,
      `"${l.memberName}"`,
      `"${l.gateName}"`,
      `"${l.checkInTime}"`,
      `"${l.method}"`,
      `"${l.branchName}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TriFit_${activeBranch.id}_GateLogs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <BranchPortalLayout activeItem="attendance">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Turnstile & Attendance Logs</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Live Gate Telemetry • {activeBranch.name}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Audit log of facial recognition terminals and speedgates at {activeBranch.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCheckinModal(true)}
              className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] dark:hover:bg-[#f5cf12] text-slate-950 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Simulate Passage</span>
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

        {/* Filter Bar */}
        <div className="glass-panel p-4 rounded-[18px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search member, gate, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-[10px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[12.5px] focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(["ALL", "TURNSTILE_FACE", "QR_CODE", "MANUAL_DESK"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-3 py-1.5 rounded-[9px] text-[11px] font-bold transition-all whitespace-nowrap ${
                  methodFilter === m
                    ? "bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-black"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400"
                }`}
              >
                {m === "ALL" ? "All Methods" : m.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="glass-panel rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-neutral-400 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Member</th>
                  <th className="px-4 py-3.5">Gate / Hardware</th>
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {log.memberName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Code: {log.memberCode}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-800 dark:text-neutral-200">
                        {log.gateName}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300">
                        {log.method.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-neutral-300 font-bold">
                      {log.checkInTime}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        GRANTED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <MemberCheckinModal isOpen={showCheckinModal} onClose={() => setShowCheckinModal(false)} />
      </div>
    </BranchPortalLayout>
  );
}
