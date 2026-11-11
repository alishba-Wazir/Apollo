"use client";

import React, { useState, useEffect } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import {
  CalendarCheck,
  Users,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Moon,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Flame,
  Dumbbell,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatCard } from "@/components/ui/StatCard";

interface WaitlistMember {
  id: string;
  memberName: string;
  phone: string;
  planId: string;
  joinedAt: string;
}

interface GroupClassItem {
  id: string;
  title: string;
  studio: string;
  trainerName: string;
  trainerPhone: string;
  startsAt: string;
  durationMinutes: number;
  capacity: number;
  bookedCount: number;
  waitlistCount: number;
  waitlist: WaitlistMember[];
  prayerConflict: {
    hasConflict: boolean;
    prayerName?: string;
    prayerTime?: string;
    bufferMinutes?: number;
    overridden: boolean;
    overrideReason?: string;
  };
}

interface ClassSummary {
  totalClasses: number;
  totalCapacity: number;
  totalBooked: number;
  totalWaitlist: number;
  conflictCount: number;
  occupancyRate: number;
}

export default function BranchClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<GroupClassItem[]>([]);
  const [summary, setSummary] = useState<ClassSummary | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [overrideInput, setOverrideInput] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/branch/classes");
      if (res.ok) {
        const json = await res.json();
        setClasses(json.classes || []);
        setSummary(json.summary || null);
        if (json.classes && json.classes.length > 0 && !selectedClassId) {
          setSelectedClassId(json.classes[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load classes", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Handle FIFO Waitlist Promotion
  const handlePromoteWaitlist = async () => {
    if (!selectedClass || selectedClass.waitlist.length === 0) return;
    setIsPromoting(true);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/branch/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PROMOTE_WAITLIST",
          classId: selectedClass.id,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setActionSuccess(`🎉 Seat freed! ${result.promotedMember.memberName} promoted into ${selectedClass.title} via FIFO queue.`);
        await fetchClasses();
      } else {
        alert(result.error || "Promotion failed");
      }
    } catch (e: any) {
      alert(e.message || "Network error");
    } finally {
      setIsPromoting(false);
    }
  };

  // Handle Prayer Conflict Override
  const handleOverridePrayer = async () => {
    if (!selectedClass || !overrideInput.trim()) return;
    setIsOverriding(true);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/branch/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "OVERRIDE_PRAYER",
          classId: selectedClass.id,
          reason: overrideInput.trim(),
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setActionSuccess(`Prayer buffer override recorded with reason: "${overrideInput.trim()}". Audit log updated.`);
        setOverrideInput("");
        await fetchClasses();
      } else {
        alert(result.error || "Override failed");
      }
    } catch (e: any) {
      alert(e.message || "Network error");
    } finally {
      setIsOverriding(false);
    }
  };

  const conflictClasses = classes.filter((c) => c.prayerConflict.hasConflict && !c.prayerConflict.overridden);

  return (
    <BranchPortalLayout activeItem="classes">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Classes & Studio Allocations</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {user?.branchName || "Current Branch"}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Studio capacity, FIFO waitlists, trainer assignments, and automated capacity checks
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchClasses}
              disabled={isLoading}
              className="h-9 px-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
              <span>Refresh Schedule</span>
            </button>
          </div>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="p-3.5 rounded-[12px] bg-positive/10 border border-positive/30 text-positive text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Compact KPI Snapshot Cards — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Total Classes Today"
            numericValue={summary?.totalClasses ?? classes.length}
            variant="warning"
            icon={Layers}
            sparklineData={[4, 5, 5, 6, summary?.totalClasses ?? classes.length]}
            sparklineColor="#FFD91C"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                4 Studios
              </span>
            }
            footerRight="Group timetables"
          />

          <StatCard
            title="Studio Capacity Booked"
            value={`${summary?.occupancyRate ?? 91}%`}
            variant="warning"
            icon={Users}
            trend={{
              value: "High Load",
              isPositive: true,
            }}
            sparklineData={[80, 85, 88, summary?.occupancyRate ?? 91]}
            sparklineColor="#F59E0B"
            footerRight={`${summary?.totalBooked ?? 0}/${summary?.totalCapacity ?? 130} Booked`}
          />

          <StatCard
            title="FIFO Waitlisted"
            numericValue={summary?.totalWaitlist ?? 0}
            variant="warning"
            icon={Clock}
            sparklineData={[2, 4, 3, summary?.totalWaitlist ?? 0]}
            sparklineColor="#FBBF24"
            footerLeft={
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Auto-Promote
              </span>
            }
            footerRight="Queue active"
          />

          <StatCard
            title="Studio Utilization"
            value="88% Fill"
            variant="warning"
            icon={CalendarCheck}
            sparklineData={[75, 80, 84, 88]}
            sparklineColor="#FFD60A"
            footerLeft={
              <span className="font-semibold text-emerald-500">
                Optimal
              </span>
            }
            footerRight="High Demand"
          />
        </div>

        {/* Main 2-Column Split: Class Schedule & Selected Class Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Class Schedule List (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-4 border border-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-[13px] font-[900] text-text">Daily Class Schedule</span>
              <span className="text-[11px] text-text-muted">{classes.length} sessions scheduled</span>
            </div>

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-12 text-center text-text-muted text-[13px]">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
                  Loading schedule...
                </div>
              ) : (
                classes.map((cls) => {
                  const isSelected = selectedClass?.id === cls.id;
                  const isFull = cls.bookedCount >= cls.capacity;
                  const hasConflict = cls.prayerConflict.hasConflict && !cls.prayerConflict.overridden;
                  const isOverridden = cls.prayerConflict.overridden;

                  return (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setSelectedClassId(cls.id);
                        setActionSuccess(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-[14px] border transition-all ${
                        isSelected
                          ? "bg-accent/15 border-accent shadow-md ring-1 ring-accent/40"
                          : "bg-glass border-border hover:border-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12.5px] font-[900] text-accent px-2 py-0.5 rounded bg-accent/15">
                            {cls.startsAt}
                          </span>
                          <span className="text-[13.5px] font-[900] text-text">{cls.title}</span>
                        </div>

                        {isFull ? (
                          <span className="text-[9.5px] px-2 py-0.5 rounded font-bold uppercase bg-glass border border-border text-text-muted">
                            Full ({cls.waitlistCount} WL)
                          </span>
                        ) : (
                          <span className="text-[9.5px] px-2 py-0.5 rounded font-bold uppercase bg-positive/15 text-positive border border-positive/30">
                            Open
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 text-[11px] text-text-muted">
                        <span>Studio: <strong className="text-text">{cls.studio}</strong></span>
                        <span>{cls.trainerName}</span>
                      </div>

                      {/* Capacity Progress Bar */}
                      <div className="mt-2.5 pt-1.5 border-t border-border/40 space-y-1">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="text-text-muted">Seats Booked:</span>
                          <span className="font-bold text-text">
                            {cls.bookedCount} / {cls.capacity} ({Math.round((cls.bookedCount / cls.capacity) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isFull ? "bg-accent" : "bg-accent"
                            }`}
                            style={{ width: `${Math.min((cls.bookedCount / cls.capacity) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Class Deep Dive (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {selectedClass ? (
              <>
                {/* Class Overview Card */}
                <div className="glass-panel p-5 border border-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-border gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-[20px] font-[900] text-text">{selectedClass.title}</h2>
                        <span className="badge-yellow text-[10px] font-bold">
                          {selectedClass.durationMinutes} MINS
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-text-muted mt-1.5">
                        <span>Studio: <strong className="text-text">{selectedClass.studio}</strong></span>
                        <span>•</span>
                        <span>Coach: <strong className="text-text">{selectedClass.trainerName}</strong></span>
                        <span>•</span>
                        <span className="font-mono">{selectedClass.trainerPhone}</span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        Start Time
                      </span>
                      <span className="text-[18px] font-mono font-[900] text-accent">
                        {selectedClass.startsAt} PKT
                      </span>
                    </div>
                  </div>

                  {/* Seat Capacity Breakdown */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-[12px] bg-glass border border-border text-center">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block">
                        Capacity
                      </span>
                      <span className="text-[18px] font-[900] text-text">
                        {selectedClass.capacity}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block">
                        Confirmed Bookings
                      </span>
                      <span className="text-[18px] font-[900] text-accent">
                        {selectedClass.bookedCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block">
                        Waitlisted
                      </span>
                      <span className="text-[18px] font-[900] text-text">
                        {selectedClass.waitlistCount}
                      </span>
                    </div>
                  </div>

                  {/* FIFO Waitlist Queue & Simulation Controls */}
                  <div className="pt-2 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="text-[13.5px] font-[900] text-text uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-accent" />
                          FIFO Waitlist Queue ({selectedClass.waitlist.length})
                        </h3>
                        <p className="text-[11px] text-text-muted">
                          Strict First-In First-Out automated promotion with 15-minute claim expiry.
                        </p>
                      </div>

                      {selectedClass.waitlist.length > 0 && (
                        <button
                          onClick={handlePromoteWaitlist}
                          disabled={isPromoting}
                          className="px-3 py-1.5 rounded-[10px] bg-accent text-on-accent font-[800] text-[11.5px] hover:bg-accent/90 transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isPromoting ? "Promoting..." : "Simulate Seat Free & Promote #1"}</span>
                        </button>
                      )}
                    </div>

                    {selectedClass.waitlist.length === 0 ? (
                      <div className="p-6 text-center text-text-muted text-[12px] rounded-[12px] bg-glass border border-border">
                        Waitlist is empty. Any registered member can book immediate entry.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedClass.waitlist.map((m, index) => (
                          <div
                            key={m.id}
                            className={`p-3 rounded-[12px] border flex items-center justify-between transition-all ${
                              index === 0
                                ? "bg-accent/15 border-accent ring-1 ring-accent/30"
                                : "bg-glass border-border"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-glass border border-border flex items-center justify-center font-bold text-[11px] text-text">
                                #{index + 1}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-[13px] font-[800] text-text">
                                    {m.memberName}
                                  </strong>
                                  <span className="text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase bg-glass border border-border text-text-muted">
                                    {m.planId}
                                  </span>
                                </div>
                                <span className="text-[11px] text-text-muted font-mono">{m.phone}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-text-muted block">Joined Queue</span>
                              <span className="text-[11px] font-mono font-bold text-accent">
                                {m.joinedAt}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-panel p-12 text-center text-text-muted">
                Select a class from the schedule to inspect details.
              </div>
            )}
          </div>
        </div>
      </div>
    </BranchPortalLayout>
  );
}
