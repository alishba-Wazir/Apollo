"use client";

import React, { useState, useEffect } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import {
  Dumbbell,
  Users,
  CalendarCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  RefreshCw,
  Award,
  ChevronRight,
  UserCheck,
  Sparkles,
  Calendar,
  Activity,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatCard } from "@/components/ui/StatCard";

interface BookingData {
  id: string;
  startsAt: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  member: {
    id: string;
    name: string;
    phone: string;
    goal: string;
    planId: string;
  };
}

interface ShiftData {
  id: string;
  startsAt: string;
  endsAt: string;
  checkedInAt?: string | null;
}

interface TrainerData {
  id: string;
  name: string;
  phone: string;
  certificateExpiry: string;
  daysUntilExpiry: number;
  certStatus: "VALID" | "EXPIRING_SOON" | "EXPIRED";
  shiftStatus: "ON_DUTY" | "PENDING_CHECKIN" | "OFF_DUTY";
  currentShift?: ShiftData | null;
  shifts: ShiftData[];
  bookings: BookingData[];
  assignedMembers: Array<{
    id: string;
    name: string;
    phone: string;
    goal: string;
    planId: string;
  }>;
  assignedMembersCount: number;
  utilizationRate: number;
}

interface SummaryData {
  totalTrainers: number;
  onDutyCount: number;
  certAlertsCount: number;
  totalBookingsCount: number;
}

export default function BranchTrainersPage() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/branch/trainers");
      if (res.ok) {
        const json = await res.json();
        setTrainers(json.trainers || []);
        setSummary(json.summary || null);
        if (json.trainers && json.trainers.length > 0 && !selectedTrainerId) {
          setSelectedTrainerId(json.trainers[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load trainers", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const selectedTrainer = trainers.find((t) => t.id === selectedTrainerId) || trainers[0];
  const expiringTrainers = trainers.filter((t) => t.certStatus === "EXPIRING_SOON" || t.certStatus === "EXPIRED");

  return (
    <BranchPortalLayout activeItem="trainers">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Trainers & Floor Coaching</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {user?.branchName || "Current Branch"}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Shift schedules, 1-on-1 member bookings, capacity utilization, and certification compliance
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchTrainers}
              disabled={isLoading}
              className="h-9 px-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
              <span>Refresh Roster</span>
            </button>
          </div>
        </div>

        {/* Compliance Warning Banner if Certifications Expiring */}
        {expiringTrainers.length > 0 && (
          <div className="p-4 rounded-[16px] bg-negative/10 border-2 border-negative/30 flex items-start gap-3 animate-in fade-in">
            <ShieldAlert className="w-5 h-5 text-negative shrink-0 mt-0.5" />
            <div>
              <strong className="text-[13.5px] font-[900] text-text block">
                Certificate Expiration Warning ({expiringTrainers.length} Trainer)
              </strong>
              <p className="text-[12px] text-text-muted mt-0.5">
                {expiringTrainers.map((t) => (
                  <span key={t.id} className="inline-block mr-3">
                    • <strong className="text-text font-bold">{t.name}</strong>: certification expires in{" "}
                    <span className="text-negative font-bold">{t.daysUntilExpiry} days</span> (
                    {new Date(t.certificateExpiry).toLocaleDateString("en-PK")})
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}

        {/* Compact KPI Snapshot Cards — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Total Coaches"
            numericValue={summary?.totalTrainers ?? trainers.length}
            variant="warning"
            icon={Users}
            sparklineData={[4, 5, 5, 6, summary?.totalTrainers ?? trainers.length]}
            sparklineColor="#FFD91C"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                Branch Roster
              </span>
            }
            footerRight="Floor & PT"
          />

          <StatCard
            title="Floor Coaches on Duty"
            numericValue={summary?.onDutyCount ?? 0}
            variant="warning"
            icon={Activity}
            trend={{
              value: "Active Now",
              isPositive: true,
            }}
            sparklineData={[2, 3, 3, summary?.onDutyCount ?? 0]}
            sparklineColor="#F59E0B"
            footerRight="On gym floor"
          />

          <StatCard
            title="PT Bookings Today"
            numericValue={summary?.totalBookingsCount ?? 0}
            variant="warning"
            icon={CalendarCheck}
            sparklineData={[12, 14, 15, summary?.totalBookingsCount ?? 0]}
            sparklineColor="#FBBF24"
            footerRight="1-on-1 PT sessions"
          />

          <StatCard
            title="Compliance Alerts"
            numericValue={summary?.certAlertsCount ?? 0}
            variant="warning"
            icon={Award}
            sparklineData={[1, 1, 0, summary?.certAlertsCount ?? 0]}
            sparklineColor="#EAB308"
            footerLeft={
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {summary?.certAlertsCount === 0 ? "All Valid" : "Renewals req."}
              </span>
            }
            footerRight="REPs / NASM"
          />
        </div>

        {/* Main 2-Column Split: Trainers Roster & Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Trainer Roster Cards (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-4 border border-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-[13px] font-[900] text-text">Coach Directory</span>
              <span className="text-[11px] text-text-muted">{trainers.length} active coaches</span>
            </div>

            <div className="space-y-2.5">
              {isLoading ? (
                <div className="py-12 text-center text-text-muted text-[13px]">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
                  Loading coaches...
                </div>
              ) : (
                trainers.map((t) => {
                  const isSelected = selectedTrainer?.id === t.id;
                  const isOnDuty = t.shiftStatus === "ON_DUTY";
                  const isExpiring = t.certStatus === "EXPIRING_SOON";

                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrainerId(t.id)}
                      className={`w-full text-left p-3.5 rounded-[14px] border transition-all ${
                        isSelected
                          ? "bg-accent/15 border-accent shadow-md ring-1 ring-accent/40"
                          : "bg-glass border-border hover:border-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-[900] text-text">{t.name}</span>
                        <span
                          className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase ${
                            isOnDuty
                              ? "bg-positive/15 text-positive border border-positive/30"
                              : "bg-glass border border-border text-text-muted"
                          }`}
                        >
                          {isOnDuty ? "On Duty" : "Off Duty"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-[11.5px] text-text-muted font-mono">
                        <Phone className="w-3.5 h-3.5 text-accent" />
                        <span>{t.phone}</span>
                      </div>

                      {/* Utilization & Expiry strip */}
                      <div className="mt-3 pt-2 border-t border-border/40 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-text-muted">Today&apos;s Booked Schedule:</span>
                          <span className="font-bold text-text">{t.utilizationRate}% ({t.bookings.length} sessions)</span>
                        </div>
                        <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-accent h-full rounded-full transition-all duration-500"
                            style={{ width: `${t.utilizationRate}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10.5px] pt-1">
                          <span className="text-text-muted">Assigned Members: <strong>{t.assignedMembersCount}</strong></span>
                          <span
                            className={`font-bold ${
                              isExpiring ? "text-negative" : "text-positive"
                            }`}
                          >
                            Cert: {isExpiring ? `${t.daysUntilExpiry}d left` : "Valid"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Coach Deep Dive Schedule & Members (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {selectedTrainer ? (
              <>
                {/* Profile Card */}
                <div className="glass-panel p-5 border border-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-border gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-[20px] font-[900] text-text">{selectedTrainer.name}</h2>
                        <span className="badge-yellow text-[10px] font-bold">CERTIFIED COACH</span>
                        {selectedTrainer.shiftStatus === "ON_DUTY" && (
                          <span className="px-2 py-0.5 rounded bg-positive/15 text-positive border border-positive/30 text-[10px] font-bold">
                            FLOOR ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-text-muted mt-1.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-accent" />
                          {selectedTrainer.phone}
                        </span>
                        <span>•</span>
                        <span>Certificate Expiry: <strong className="text-text">{new Date(selectedTrainer.certificateExpiry).toLocaleDateString("en-PK")}</strong></span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        Shift Window
                      </span>
                      <span className="text-[12px] font-mono font-bold text-accent">
                        {selectedTrainer.currentShift
                          ? `${new Date(selectedTrainer.currentShift.startsAt).toLocaleTimeString("en-PK", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} - ${new Date(selectedTrainer.currentShift.endsAt).toLocaleTimeString("en-PK", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "06:00 - 14:00 (Standard Shift)"}
                      </span>
                    </div>
                  </div>

                  {/* Daily 1-on-1 PT Booking Schedule */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-[13px] font-[900] text-text uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarCheck className="w-4 h-4 text-accent" />
                        Today&apos;s 1-on-1 Sessions ({selectedTrainer.bookings.length})
                      </h3>
                      <span className="text-[11px] text-text-muted">Pre-booked member slots</span>
                    </div>

                    {selectedTrainer.bookings.length === 0 ? (
                      <div className="p-6 text-center text-text-muted text-[12.5px] rounded-[12px] bg-glass border border-border">
                        No 1-on-1 sessions scheduled today. Coach is fully open for general floor supervision.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedTrainer.bookings.map((b) => (
                          <div
                            key={b.id}
                            className="p-3 rounded-[12px] bg-glass border border-border flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[12px] font-mono font-bold text-accent px-2 py-1 rounded bg-accent/10 border border-accent/20">
                                {new Date(b.startsAt).toLocaleTimeString("en-PK", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-[13px] font-[800] text-text">
                                    {b.member.name}
                                  </strong>
                                  <span className="text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase bg-glass border border-border text-text-muted">
                                    {b.member.planId}
                                  </span>
                                </div>
                                <span className="text-[11px] text-text-muted font-mono">{b.member.phone}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-glass border border-border text-text">
                                {b.member.goal}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  b.status === "COMPLETED"
                                    ? "bg-positive/15 text-positive border border-positive/30"
                                    : "bg-accent/15 text-accent border border-accent/30"
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assigned Members List */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-[13px] font-[900] text-text uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-accent" />
                        Assigned Member Cohort ({selectedTrainer.assignedMembersCount})
                      </h3>
                      <span className="text-[11px] text-text-muted">Roster tracking</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {selectedTrainer.assignedMembers.map((m) => (
                        <div
                          key={m.id}
                          className="p-2.5 rounded-[10px] bg-glass border border-border flex items-center justify-between text-[11.5px]"
                        >
                          <div>
                            <span className="font-[800] text-text block">{m.name}</span>
                            <span className="text-[10.5px] text-text-muted font-mono">{m.phone}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-accent/10 text-accent">
                            {m.goal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-panel p-12 text-center text-text-muted">
                Select a trainer from the directory to view schedule and compliance.
              </div>
            )}
          </div>
        </div>
      </div>
    </BranchPortalLayout>
  );
}
