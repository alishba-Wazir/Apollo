"use client";

import React, { useState, useEffect } from "react";
import { MemberPortalLayout } from "@/components/layout/MemberPortalLayout";
import { StatCard } from "@/components/ui/StatCard";
import {
  QrCode,
  Flame,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  Users,
  Moon,
  Zap,
} from "lucide-react";

interface VisitRecord {
  date: number;
  dayName: string;
  club: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  gate: string;
  type: string;
}

const ATTENDANCE_HISTORY: Record<number, VisitRecord> = {
  1: { date: 1, dayName: "Sun", club: "Seaview Flagship", checkIn: "06:14 PM", checkOut: "07:42 PM", duration: "1h 28m", gate: "Turnstile #02 (Optical)", type: "Strength & Conditioning" },
  2: { date: 2, dayName: "Mon", club: "Seaview Flagship", checkIn: "07:05 PM", checkOut: "08:35 PM", duration: "1h 30m", gate: "Turnstile #01 (Face-ID)", type: "1-on-1 PT with Coach Tariq" },
  3: { date: 3, dayName: "Tue", club: "Clifton Executive", checkIn: "06:45 PM", checkOut: "08:00 PM", duration: "1h 15m", gate: "Turnstile #01 (Optical)", type: "Les Mills RPM Spin" },
  4: { date: 4, dayName: "Wed", club: "Seaview Flagship", checkIn: "07:12 PM", checkOut: "08:40 PM", duration: "1h 28m", gate: "Turnstile #03 (Optical)", type: "Hypertrophy Chest & Delts" },
  6: { date: 6, dayName: "Fri", club: "Seaview Flagship", checkIn: "08:30 PM", checkOut: "10:00 PM", duration: "1h 30m", gate: "Turnstile #02 (Face-ID)", type: "Post-Jummah Night Session" },
  7: { date: 7, dayName: "Sat", club: "Clifton Executive", checkIn: "11:20 AM", checkOut: "12:45 PM", duration: "1h 25m", gate: "Turnstile #02 (Optical)", type: "Leg Day & Base Weight Scan" },
  8: { date: 8, dayName: "Sun", club: "Seaview Flagship", checkIn: "06:30 PM", checkOut: "07:55 PM", duration: "1h 25m", gate: "Turnstile #01 (Face-ID)", type: "Active Recovery & Mobility" },
  9: { date: 9, dayName: "Mon", club: "Seaview Flagship", checkIn: "07:00 PM", checkOut: "08:30 PM", duration: "1h 30m", gate: "Turnstile #02 (Optical)", type: "1-on-1 PT with Coach Tariq (Today)" },
};

export default function MemberVisitsPage() {
  const [countdown, setCountdown] = useState(24);
  const [tokenSeed, setTokenSeed] = useState("TF-PASS-8842-9901");
  const [attendance, setAttendance] = useState<Record<number, VisitRecord>>(ATTENDANCE_HISTORY);
  const [selectedVisit, setSelectedVisit] = useState<VisitRecord | null>(ATTENDANCE_HISTORY[9]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);

  useEffect(() => {
    async function loadMemberVisits() {
      try {
        const res = await fetch("/api/member/me");
        if (res.ok) {
          const data = await res.json();
          if (data.member) {
            setMemberData(data.member);
            if (data.member.visits && data.member.visits.length > 0) {
              const mapped: Record<number, VisitRecord> = {};
              data.member.visits.slice(0, 30).forEach((v: any) => {
                const dt = new Date(v.checkedInAt);
                const dayNum = dt.getDate();
                mapped[dayNum] = {
                  date: dayNum,
                  dayName: dt.toLocaleDateString("en-PK", { weekday: "short" }),
                  club: data.member.branch?.name?.replace("TRI FIT ", "") || "Seaview Flagship",
                  checkIn: dt.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
                  checkOut: new Date(dt.getTime() + 90 * 60000).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
                  duration: "1h 30m",
                  gate: "Turnstile #01 (Optical)",
                  type: "Strength & Conditioning",
                };
              });
              setAttendance(mapped);
              const latestDay = Object.keys(mapped).map(Number).sort((a, b) => b - a)[0];
              if (latestDay) {
                setSelectedVisit(mapped[latestDay]);
              }
            }
          }
        }
      } catch (e) {
        console.error("Failed to load member visits:", e);
      }
    }
    loadMemberVisits();
  }, []);

  // Rotating QR countdown simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTokenSeed(`TF-PASS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTokenSeed(`TF-PASS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
      setCountdown(30);
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <MemberPortalLayout activeItem="visits">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                My Visits, Streak & Gate Pass
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-700 dark:text-[#F5C518] border border-amber-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
              Multi-club optical turnstile gate pass & verified ZKTeco biometric logs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Seaview DHA (Flagship)
            </span>
          </div>
        </div>

        {/* 3 Compact KPI Cards — High Density */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <StatCard
            title="Total Days Visited"
            value={`${memberData?.totalVisits ?? Object.keys(attendance).length} Days`}
            icon={CalendarIcon}
            variant="warning"
            trend={{
              value: "+3",
              isPositive: true,
              label: "vs last mo",
            }}
            sparklineData={[12, 14, 15, 17, 18, memberData?.totalVisits ?? 19]}
            sparklineColor="#FFD91C"
            footerRight={`Target: 22 (${Math.min(100, Math.round(((memberData?.totalVisits ?? 19) / 22) * 100))}% achieved)`}
          />

          <StatCard
            title="Current Streak"
            value={`${memberData?.streakDays ?? 6} Days`}
            icon={Flame}
            variant="warning"
            trend={{
              value: "Hot Streak",
              isPositive: true,
            }}
            sparklineData={[1, 2, 3, 4, 5, memberData?.streakDays ?? 6]}
            sparklineColor="#F59E0B"
            footerRight="Personal Best: 14 Days"
          />

          <StatCard
            title="Turnstile Access"
            value="All 5 Clubs"
            icon={ShieldCheck}
            variant="warning"
            sparklineData={[5, 5, 5, 5, 5]}
            sparklineColor="#FBBF24"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                Active Access
              </span>
            }
            footerRight="Reciprocal Privileges"
          />
        </div>

        {/* Dynamic Gate Pass & Crowd Meter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Dynamic Turnstile QR Pass */}
          <div className="lg:col-span-5 glass-panel p-5 rounded-[22px] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-[#F5C518]">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Turnstile Digital Pass
                  </h3>
                  <p className="text-[10.5px] text-slate-400 dark:text-neutral-500">
                    ZKTeco & Hikvision Optical Compatible
                  </p>
                </div>
              </div>

              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-[#F5C518] hover:underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {/* QR Visual Container */}
            <div className="py-5 flex flex-col items-center">
              <div className="relative p-3.5 rounded-2xl bg-white border-2 border-slate-900/10 dark:border-amber-500/40 shadow-lg group">
                {/* Simulated Animated Scan Line */}
                <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-transparent via-[#F5C518] to-transparent shadow-[0_0_12px_#F5C518] animate-[bounce_2.5s_infinite] pointer-events-none opacity-80" />

                {/* SVG High-Contrast QR Code Mock */}
                <div className="w-44 h-44 bg-slate-950 rounded-xl p-2.5 flex flex-col justify-between">
                  {/* Top row */}
                  <div className="flex justify-between">
                    <div className="w-12 h-12 bg-white rounded-md p-1.5 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[3px] p-1 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 bg-white rounded-[2px]" />
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-md p-1.5 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[3px] p-1 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 bg-white rounded-[2px]" />
                      </div>
                    </div>
                  </div>

                  {/* Center TriFit logo watermark */}
                  <div className="self-center px-2 py-0.5 rounded bg-[#F5C518] text-[#0B0B09] font-black text-[9px] tracking-wider font-mono shadow">
                    TRI FIT
                  </div>

                  {/* Bottom row */}
                  <div className="flex justify-between items-end">
                    <div className="w-12 h-12 bg-white rounded-md p-1.5 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[3px] p-1 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 bg-white rounded-[2px]" />
                      </div>
                    </div>
                    {/* Simulated data matrix dots */}
                    <div className="grid grid-cols-4 gap-1 w-14 h-12 p-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-sm" />
                      <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-sm" />
                      <span className="w-1.5 h-1.5 bg-white rounded-sm" />
                      <span className="w-1.5 h-1.5 bg-white rounded-sm" />
                      <span className="w-1.5 h-1.5 bg-white rounded-sm" />
                      <span className="w-1.5 h-1.5 bg-white rounded-sm" />
                      <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-sm" />
                      <span className="w-1.5 h-1.5 bg-white rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rolling Token & Countdown Bar */}
              <div className="w-full max-w-[220px] mt-3 space-y-1.5 text-center">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-neutral-400">
                  <span className="font-semibold">{tokenSeed}</span>
                  <span className="font-extrabold text-amber-600 dark:text-[#FFD91C]">
                    {countdown}s
                  </span>
                </div>
                {/* Countdown progress line */}
                <div className="w-full h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F5C518] transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(countdown / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/5 text-[11px] text-slate-600 dark:text-neutral-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Hold screen 4 inches from optical gate turnstiles. Face-ID turnstile lanes will automatically recognize you without scanning.
              </span>
            </div>
          </div>

          {/* Live Club Crowd Meter & Night Shift */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Ramadan Night Shift Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-[#F5C518]">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      🌙 Ramadan Night Shift Active
                    </span>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-neutral-300 mt-0.5">
                    Extended Taraweeh hours: Open 21:30 - 03:00 PKT. Shake bar & Suhoor meals available.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono font-bold text-amber-600 dark:text-[#FFD91C]">
                Closing 03:00 AM
              </span>
            </div>

            {/* Live Crowd Meter Card */}
            <div className="glass-panel p-5 rounded-[22px] flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Live Club Floor Meter (Seaview DHA)
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Moderate Rush (68%)
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    <span>136 Members Checked In</span>
                    <span>Max Floor Cap: 200</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden flex">
                    <div className="w-[68%] bg-gradient-to-r from-emerald-500 to-[#F5C518] rounded-full" />
                  </div>
                </div>

                {/* Sub-areas */}
                <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/60 dark:border-white/5">
                    <span className="text-slate-400 dark:text-neutral-500 block text-[10px]">Free Weights</span>
                    <span className="font-extrabold text-amber-600 dark:text-[#FFD91C]">74% Busy</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/60 dark:border-white/5">
                    <span className="text-slate-400 dark:text-neutral-500 block text-[10px]">Cardio Deck</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">42% (Open)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/60 dark:border-white/5">
                    <span className="text-slate-400 dark:text-neutral-500 block text-[10px]">3D Kiosk Queue</span>
                    <span className="font-extrabold text-slate-700 dark:text-neutral-200">1 Member waiting</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-neutral-400">
                  Optimal visit slot today: <strong className="text-slate-800 dark:text-neutral-200 font-bold">22:00 - 23:30</strong>
                </span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> High Energy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 30-Day Attendance Calendar */}
        <div className="glass-panel p-5 rounded-[22px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                30-Day Attendance Log & Gate History
              </h2>
              <p className="text-xs text-slate-400 dark:text-neutral-500">
                November 2026 • Verified ZKTeco optical & biometric timestamps
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Visited (8)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-neutral-800 inline-block" />
                Rest Day (1)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full border border-dashed border-slate-300 dark:border-neutral-700 inline-block" />
                Remaining (21)
              </span>
            </div>
          </div>

          {/* Calendar Grid (30 Days) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const visit = attendance[day];
              const isPast = day <= 9;
              const isAttended = Boolean(visit);
              const isSelected = selectedVisit?.date === day;

              return (
                <button
                  key={day}
                  onClick={() => visit && setSelectedVisit(visit)}
                  disabled={!visit}
                  className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[78px] ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 shadow-[0_0_12px_rgba(245,197,24,0.3)]"
                      : isAttended
                      ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer"
                      : isPast
                      ? "border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] opacity-50 cursor-default"
                      : "border-dashed border-slate-200 dark:border-white/10 opacity-30 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-black font-mono text-slate-800 dark:text-neutral-200">
                      Nov {day}
                    </span>
                    {isAttended && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    )}
                  </div>

                  {isAttended ? (
                    <div className="mt-1">
                      <span className="text-[9.5px] font-bold text-slate-900 dark:text-white block truncate">
                        {visit.checkIn}
                      </span>
                      <span className="text-[8.5px] font-medium text-slate-500 dark:text-neutral-400 block truncate">
                        {visit.duration}
                      </span>
                    </div>
                  ) : isPast ? (
                    <span className="text-[9px] font-semibold text-slate-400 dark:text-neutral-500 mt-auto">
                      Rest Day
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-300 dark:text-neutral-600 mt-auto">
                      Upcoming
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Visit Detail Inspector */}
          {selectedVisit && (
            <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5C518] text-[#0B0B09] flex items-center justify-center font-black">
                  {selectedVisit.date}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedVisit.type} • {selectedVisit.club}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Check-in: <strong className="text-slate-800 dark:text-neutral-200">{selectedVisit.checkIn}</strong> • Check-out: <strong className="text-slate-800 dark:text-neutral-200">{selectedVisit.checkOut}</strong> ({selectedVisit.duration})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 font-semibold">
                  {selectedVisit.gate}
                </span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Biometrics Verified
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </MemberPortalLayout>
  );
}
