"use client";

import React, { useState, useEffect } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Activity,
  AlertCircle,
  Moon,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AuditEntry {
  id: string;
  userId: string;
  role: string;
  action: string;
  target: string;
  details: string | null;
  at: string;
  user: {
    name: string;
    email: string;
    role: string;
    branchId: string | null;
  };
}

export default function AdminAuditPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/audit-log");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error("Failed to load audit logs", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesRole = roleFilter === "ALL" || log.role === roleFilter;
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <AdminPortalLayout activeItem="audit">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Settings & Audit Log</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                Immutable Activity History
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Server-side record of logins, role actions, approvals, dispatches, and configuration updates
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchLogs}
              disabled={isLoading}
              className="btn !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[var(--accent)]" : ""}`} />
              <span>Refresh Logs</span>
            </button>
          </div>
        </div>

        {/* Global Policy & Settings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 border border-border">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Sliders className="w-4 h-4" />
              <span className="text-[12px] font-bold uppercase tracking-wider">Auto-Send Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-negative/15 text-negative border border-negative/30">
                LOCKED: OFF
              </span>
              <span className="text-[12px] font-medium text-text">Strict Human Approval</span>
            </div>
            <p className="text-[11.5px] text-text-muted mt-1.5 leading-relaxed">
              Section 4 rule: Auto-send is permanently disabled by default. Every WhatsApp win-back message requires an explicit manager click.
            </p>
          </div>

          <div className="glass-panel p-4 border border-border">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Moon className="w-4 h-4" />
              <span className="text-[12px] font-bold uppercase tracking-wider">Quiet Hours Policy</span>
            </div>
            <div className="text-[13px] font-bold text-text">
              22:00 – 07:00 PKT
            </div>
            <p className="text-[11.5px] text-text-muted mt-1.5 leading-relaxed">
              No messages may be dispatched during night hours. Queue auto-pauses until morning opening.
            </p>
          </div>

          <div className="glass-panel p-4 border border-border">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-[12px] font-bold uppercase tracking-wider">RBAC Enforcement</span>
            </div>
            <div className="text-[13px] font-bold text-text">
              Server Guard Active
            </div>
            <p className="text-[11.5px] text-text-muted mt-1.5 leading-relaxed">
              Row-level branch isolation enforced on every API route via <code className="text-accent text-[11px]">enforceBranchScope()</code>.
            </p>
          </div>
        </div>

        {/* Audit Log Table Panel */}
        <div className="glass-panel p-5 border border-border space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search action, user, or target..."
                className="w-full pl-9 pr-3 py-1.5 rounded-[10px] bg-glass border border-border text-[12.5px] text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11.5px] font-bold text-text-muted">Role:</span>
              <div className="flex items-center gap-1 bg-glass p-1 rounded-[10px] border border-border">
                {["ALL", "ADMIN", "BRANCH_MANAGER"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold transition-all ${
                      roleFilter === role
                        ? "bg-accent text-on-accent"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    {role === "ALL" ? "All Roles" : role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-[12px] border border-border">
            <table className="w-full text-left border-collapse text-[12.5px]">
              <thead>
                <tr className="bg-glass/80 border-b border-border text-[11px] font-[800] text-text-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor / User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-text-muted">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
                      Loading audit log records...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-text-muted">
                      No audit events found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-glass/50 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap text-text-muted font-mono text-[11.5px]">
                        {new Date(log.at).toLocaleString("en-PK", {
                          timeZone: "Asia/Karachi",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-[700] text-text">{log.user?.name || "System"}</div>
                        <div className="text-[10.5px] text-text-muted font-mono">{log.user?.email || "internal"}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.role === "ADMIN"
                              ? "bg-accent/15 text-accent border border-accent/40"
                              : "bg-surface-subtle text-text border border-border"
                          }`}
                        >
                          {log.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-mono font-[700] text-[11.5px] text-text">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-text-muted text-[11.5px]">
                        {log.target}
                      </td>
                      <td className="py-2.5 px-3 text-text-muted max-w-xs truncate" title={log.details || ""}>
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[11.5px] text-text-muted pt-2">
            <span>Showing {filteredLogs.length} recorded events</span>
            <span>All times displayed in Pakistan Standard Time (PKT)</span>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
