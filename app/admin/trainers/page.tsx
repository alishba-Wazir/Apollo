"use client";

import React, { useEffect, useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  Dumbbell,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Award,
  Calendar,
  Clock,
  Phone,
  ShieldAlert,
  Search,
  Filter,
  Star,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { BarGold } from "@/components/charts";
import { BarGoldPoint } from "@/lib/data";

interface AdminTrainer {
  id: string;
  name: string;
  phone: string;
  branchId: string;
  branchName: string;
  branchCity: string;
  certificateExpiry: string;
  daysUntilExpiry: number;
  certStatus: "VALID" | "EXPIRING_SOON" | "EXPIRED";
  shiftStatus: "ON_DUTY" | "OFF_DUTY";
  clientCount: number;
  sessionsDone: number;
  ptPackagesLeft: number;
  rating: number;
  attendanceRate: number;
  assignedMembersCount: number;
  bookingsCount: number;
}

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<AdminTrainer[]>([]);
  const [summary, setSummary] = useState<any>({
    totalTrainers: 0,
    onDutyCount: 0,
    certAlertsCount: 0,
    totalClientCount: 0,
    avgAttendance: 98.2,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ON_DUTY" | "EXPIRING">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchTrainers() {
      setIsLoading(true);
      try {
        const queryParam = selectedBranch !== "ALL" ? `?branchId=${selectedBranch}` : "";
        const res = await fetch(`/api/admin/trainers${queryParam}`);
        if (res.ok) {
          const data = await res.json();
          setTrainers(data.trainers || []);
          setSummary(data.summary || {});
        }
      } catch (err) {
        console.error("Failed to load admin trainers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrainers();
  }, [selectedBranch]);

  // Filter trainers based on search and sub-filter
  const filteredTrainers = trainers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.branchCity.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === "ON_DUTY") {
      return t.shiftStatus === "ON_DUTY";
    }
    if (selectedFilter === "EXPIRING") {
      return t.certStatus === "EXPIRING_SOON" || t.certStatus === "EXPIRED";
    }
    return true;
  });

  // Client counts per branch bar chart data
  const clientsPerBranchBars: BarGoldPoint[] = [
    {
      label: "Seaview (KHI)",
      value: trainers
        .filter((t) => t.branchId === "branch-seaview")
        .reduce((acc, t) => acc + t.clientCount, 0) || 56,
      formattedValue: "56 clients",
      sublabel: "4 Coaches",
      isPeak: true,
    },
    {
      label: "AJ Tower (ISB)",
      value: trainers
        .filter((t) => t.branchId === "branch-ajtower")
        .reduce((acc, t) => acc + t.clientCount, 0) || 44,
      formattedValue: "44 clients",
      sublabel: "3 Coaches",
    },
    {
      label: "Soha Mall (ISB)",
      value: trainers
        .filter((t) => t.branchId === "branch-sohamall")
        .reduce((acc, t) => acc + t.clientCount, 0) || 28,
      formattedValue: "28 clients",
      sublabel: "2 Coaches",
    },
  ];

  return (
    <AdminPortalLayout activeItem="trainers">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Network Trainers & Coaching Performance</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                {summary.totalTrainers || 9} Headcount • {summary.onDutyCount || 5} On Duty
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Coaching oversight, shift attendance, 1-on-1 personal training client loads, and certification compliance
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/branch/trainers"
              className="btn !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Branch Roster View</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />
            </Link>
          </div>
        </div>

        {/* 1. 4 Primary Compact KPI Cards — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Total Network Coaches"
            numericValue={summary.totalTrainers || 9}
            variant="warning"
            icon={Dumbbell}
            sparklineData={[7, 8, 8, 9, 9, summary.totalTrainers || 9]}
            sparklineColor="#FFD91C"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                {summary.onDutyCount || 5} on duty now
              </span>
            }
            footerRight="All 4 Clubs"
          />

          <StatCard
            title="Shift Attendance Rate"
            value={`${summary.avgAttendance || 98.2}%`}
            variant="warning"
            icon={Activity}
            trend={{
              value: "Zero no-shows",
              isPositive: true,
            }}
            sparklineData={[96, 97, 98, 98.2]}
            sparklineColor="#F59E0B"
            footerRight="30-day rolling"
          />

          <StatCard
            title="Active 1-on-1 PT Clients"
            numericValue={summary.totalClientCount || 128}
            variant="warning"
            icon={Users}
            trend={{
              value: "14.2 / coach",
              isPositive: true,
            }}
            sparklineData={[112, 118, 122, 125, summary.totalClientCount || 128]}
            sparklineColor="#FBBF24"
            footerRight="88% Capacity"
          />

          <StatCard
            title="Cert Expiry Alerts"
            numericValue={summary.certAlertsCount || 2}
            variant="warning"
            icon={ShieldAlert}
            sparklineData={[4, 3, 3, 2, summary.certAlertsCount || 2]}
            sparklineColor="#EAB308"
            footerLeft={
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Action req.
              </span>
            }
            footerRight="REPs renewals"
          />
        </div>

        {/* 2. Visual Analytics Section: Client Counts & Certificate Compliance Horizon */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Client Counts per Branch */}
          <div className="lg:col-span-5">
            <BarGold
              title="Coaching Clients by Branch"
              units="Clients"
              subtitle="Personal training client load distributed across club locations"
              data={clientsPerBranchBars}
              isSample={true}
            />
          </div>

          {/* Certificate Expiration Horizon */}
          <div className="lg:col-span-7 glass-panel p-5 border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-[700] text-text">Certificate Compliance Horizon</h3>
    
                </div>
                <span className="text-[11.5px] font-[700] text-accent">REPs / NASM / CPR</span>
              </div>
              <p className="text-[12.5px] text-text-muted mb-4">
                Network compliance radar tracking CPR/AED and personal trainer accreditation validity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-[14px] bg-glass border border-positive/30 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-[700] text-positive uppercase tracking-wider block">
                    Fully Compliant (&gt;60d)
                  </span>
                  <div className="text-[26px] font-[800] text-text my-1">7 Coaches</div>
                </div>
                <span className="text-[11px] text-text-muted">77.8% of coaching team</span>
              </div>

              <div className="p-4 rounded-[14px] bg-glass border border-amber-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-[700] text-amber-400 uppercase tracking-wider block">
                    Expiring Soon (&lt;45d)
                  </span>
                  <div className="text-[26px] font-[800] text-amber-400 my-1">2 Coaches</div>
                </div>
                <span className="text-[11px] text-text-muted">Renewal notice dispatched</span>
              </div>

              <div className="p-4 rounded-[14px] bg-glass border border-border flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-[700] text-text-muted uppercase tracking-wider block">
                    Expired / Lapsed
                  </span>
                  <div className="text-[26px] font-[800] text-text my-1">0 Coaches</div>
                </div>
                <span className="text-[11px] text-positive font-semibold">100% Valid Roster</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11.5px] text-text-muted">
              <span>Next expiring: Coach Bilal Tariq (32 days remaining)</span>
              <span className="text-accent font-semibold">Sponsorship Approved</span>
            </div>
          </div>
        </div>

        {/* 3. Filter Controls & Trainer Matrix Table */}
        <div className="glass-panel p-5 border border-border space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-[800] text-text flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent" />
                  Network Coach Directory ({filteredTrainers.length} Trainers)
                </h2>
  
              </div>
              <p className="text-[12.5px] text-text-muted mt-0.5">
                Attendance metrics, active client allocations, monthly sessions conducted, and accreditation expiry dates.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Branch Selector */}
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-glass border border-border rounded-[11px] px-3 py-1.5 text-[12px] font-[600] text-text focus:outline-none focus:border-accent"
              >
                <option value="ALL">All Branches (Network)</option>
                <option value="branch-seaview">Karachi — Seaview</option>
                <option value="branch-ajtower">Islamabad — AJ Tower</option>
                <option value="branch-sohamall">Islamabad — Soha Mall</option>
              </select>

              {/* Status Segmented Buttons */}
              <div className="flex items-center bg-glass p-0.5 rounded-[12px] border border-border text-[11.5px] font-[600]">
                <button
                  onClick={() => setSelectedFilter("ALL")}
                  className={`px-3 py-1 rounded-[10px] transition-all ${
                    selectedFilter === "ALL" ? "bg-accent text-on-accent font-[700]" : "text-text-muted"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter("ON_DUTY")}
                  className={`px-3 py-1 rounded-[10px] transition-all ${
                    selectedFilter === "ON_DUTY" ? "bg-accent text-on-accent font-[700]" : "text-text-muted"
                  }`}
                >
                  On Duty
                </button>
                <button
                  onClick={() => setSelectedFilter("EXPIRING")}
                  className={`px-3 py-1 rounded-[10px] transition-all ${
                    selectedFilter === "EXPIRING" ? "bg-accent text-on-accent font-[700]" : "text-text-muted"
                  }`}
                >
                  Expiring Certs
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[12px] font-[600] text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-3">Coach Name & Contact</th>
                  <th className="py-3 px-3">Branch & City</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Attendance</th>
                  <th className="py-3 px-3 text-right">Clients</th>
                  <th className="py-3 px-3 text-right">Sessions (Mo)</th>
                  <th className="py-3 px-3 text-right">PT Left</th>
                  <th className="py-3 px-3 text-center">Rating</th>
                  <th className="py-3 px-3 text-right">Certification Expiry</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-[13.5px]">
                {filteredTrainers.map((t) => (
                  <tr key={t.id} className="hover:bg-glass/80 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[11px] bg-accent/15 border border-accent/30 flex items-center justify-center font-[800] text-accent shrink-0">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-[700] text-text block">{t.name}</span>
                          <span className="text-[11.5px] text-text-muted flex items-center gap-1">
                            <Phone className="w-3 h-3 text-accent" />
                            {t.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-[600] text-text">{t.branchName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent border border-accent/30">
                          {t.branchCity}
                        </span>
                      </div>
                    </td>

                    {/* Shift Status */}
                    <td className="py-3.5 px-3 text-center">
                      {t.shiftStatus === "ON_DUTY" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[9px] text-[11px] font-[700] bg-positive/10 text-positive border border-positive/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                          ON DUTY
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[9px] text-[11px] font-[600] bg-glass text-text-muted border border-border">
                          OFF DUTY
                        </span>
                      )}
                    </td>

                    {/* Attendance Rate */}
                    <td className="py-3.5 px-3 text-right font-[700] text-text">
                      {t.attendanceRate}%
                      <span className="block text-[10.5px] text-text-muted font-normal">on-time</span>
                    </td>

                    {/* Client Count */}
                    <td className="py-3.5 px-3 text-right font-[700] text-accent">
                      {t.clientCount}
                      <span className="block text-[10.5px] text-text-muted font-normal">clients</span>
                    </td>

                    {/* Sessions Done */}
                    <td className="py-3.5 px-3 text-right font-[600] text-text">
                      {t.sessionsDone}
                    </td>

                    {/* PT Left */}
                    <td className="py-3.5 px-3 text-right font-[600] text-text">
                      {t.ptPackagesLeft}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1 text-[12px] font-[700] text-accent">
                        <Star className="w-3.5 h-3.5 fill-accent" />
                        <span>{t.rating}</span>
                      </div>
                    </td>

                    {/* Certificate Expiry */}
                    <td className="py-3.5 px-3 text-right">
                      {t.certStatus === "EXPIRING_SOON" ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-[700] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            {t.daysUntilExpiry}d left
                          </span>
                          <span className="block text-[10.5px] text-text-muted mt-0.5">
                            {new Date(t.certificateExpiry).toLocaleDateString("en-PK")}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[11.5px] font-[600] text-positive">
                            Valid ({t.daysUntilExpiry}d)
                          </span>
                          <span className="block text-[10.5px] text-text-muted">
                            {new Date(t.certificateExpiry).toLocaleDateString("en-PK")}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href="/branch/trainers"
                        className="btn-secondary text-[11.5px] py-1 px-2.5 inline-flex items-center gap-1"
                      >
                        <span>Schedule</span>
                        <ArrowRight className="w-3 h-3 text-accent" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. No-Show Guardrail Notice */}
        <div className="glass-panel p-4 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-[700] text-text">
                No-Show Alert & Coach Protection Guardrails
              </h4>
              <p className="text-[12px] text-text-muted mt-0.5">
                If a trainer has not checked in 15 to 30 minutes after shift start, APOLLO alerts the branch manager, drafts a polite WhatsApp inquiry for manager approval, and suggests reassignment of booked sessions. Discipline, penalty, or payroll deductions are strictly prohibited from automation.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-[700] px-2.5 py-1 rounded bg-accent/15 text-accent border border-accent/30 shrink-0">
            Manager Decides
          </span>
        </div>
      </div>
    </AdminPortalLayout>
  );
}