"use client";

import React, { useEffect, useState } from "react";
import {
  Moon,
  VolumeX,
  Volume2,
  Clock,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Bell,
  Sliders,
  RefreshCw,
  MapPin,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BranchPrayerSchedule } from "@/app/api/admin/prayer/route";

interface PrayerAndRamadanViewProps {
  embedded?: boolean;
}

export const PrayerAndRamadanView: React.FC<PrayerAndRamadanViewProps> = ({ embedded = false }) => {
  const [schedules, setSchedules] = useState<BranchPrayerSchedule[]>([]);
  const [networkSummary, setNetworkSummary] = useState({
    totalBranches: 5,
    ramadanModeActiveBranches: 0,
    audioDuckingEnabledCount: 5,
    quietHoursWindow: "22:00 - 07:00 PKT (Network-wide)",
  });
  const [isNetworkRamadanActive, setIsNetworkRamadanActive] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await fetch("/api/admin/prayer");
        if (res.ok) {
          const data = await res.json();
          setSchedules(data.schedules || []);
          if (data.networkSummary) {
            setNetworkSummary(data.networkSummary);
            setIsNetworkRamadanActive(data.networkSummary.ramadanModeActiveBranches > 0);
          }
        }
      } catch (err) {
        console.error("Failed to load admin prayer schedules:", err);
      }
    }
    fetchSchedules();
  }, []);

  // Toggle Ramadan Mode Network-wide
  const handleToggleNetworkRamadan = async () => {
    const nextState = !isNetworkRamadanActive;
    setIsNetworkRamadanActive(nextState);
    setIsUpdating(true);

    try {
      const res = await fetch("/api/admin/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applyNetworkWide: true,
          settings: { ramadanMode: nextState },
        }),
      });

      if (res.ok) {
        setSchedules((prev) =>
          prev.map((s) => ({ ...s, ramadanMode: nextState }))
        );
        setNotification(
          nextState
            ? "Ramadan Mode ACTIVATED network-wide. Outreach paused during fast; operating hours shifted to 21:00 - 04:00 PKT."
            : "Standard Operational Mode restored network-wide (06:00 - 23:00 PKT)."
        );
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      console.error("Failed to toggle network ramadan mode", e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle Ramadan Mode for a single branch
  const handleToggleBranchRamadan = async (branchId: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    setSchedules((prev) =>
      prev.map((s) => (s.branchId === branchId ? { ...s, ramadanMode: nextVal } : s))
    );

    try {
      await fetch("/api/admin/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          settings: { ramadanMode: nextVal },
        }),
      });
    } catch (e) {
      console.error("Failed to update branch ramadan setting", e);
    }
  };

  // Toggle Audio Ducking for a single branch
  const handleToggleAudioDucking = async (branchId: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    setSchedules((prev) =>
      prev.map((s) => (s.branchId === branchId ? { ...s, audioDucking: nextVal } : s))
    );

    try {
      await fetch("/api/admin/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          settings: { audioDucking: nextVal },
        }),
      });
    } catch (e) {
      console.error("Failed to update audio ducking", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner if not embedded */}
      {!embedded && (
        <div className="glass-panel p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-border">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                FAITH & LOCALIZATION PROTOCOLS
              </span>
              <span className="text-text-muted text-[11px]">•</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                QUIET HOURS: 22:00 - 07:00 PKT
              </span>
            </div>
            <h1 className="text-[23px] sm:text-[28px] font-[800] text-text tracking-[-0.025em] flex items-center gap-2.5">
              <Moon className="w-6 h-6 text-accent shrink-0" />
              <span>Prayer Times, Ramadan & Messaging Schedule per Branch</span>
            </h1>
            <p className="text-[13.5px] text-text-muted mt-1 max-w-3xl">
              Network-level governance of city-specific Islamic prayer timetables, Ramadan operational mode shifts, automated studio audio-ducking, and Win-back AI messaging muting across Karachi and Islamabad clubs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/branch/prayer"
              className="btn-secondary text-[12.5px] py-2 px-3.5 flex items-center gap-1.5 font-[600]"
            >
              <span>Branch View</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </Link>
          </div>
        </div>
      )}

      {/* Floating Notification */}
      {notification && (
        <div className="p-3.5 rounded-[14px] bg-accent/15 border border-accent/40 text-text text-[13px] font-[600] flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-accent shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Configured Branches (Fixed subtitle per requirement) */}
        <div className="glass-panel p-5 flex flex-col justify-between border border-border hover:border-accent/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[12px] font-[700] uppercase tracking-wider">
              Configured Branches
            </span>
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="text-[30px] font-[800] text-text tracking-[-0.03em] my-1">
            <AnimatedCounter value={5} suffix=" Clubs" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11.5px]">
            <span className="text-positive font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-positive" />
              Karachi (3) & Islamabad (2) Localized
            </span>
            <span className="text-text-muted">Active</span>
          </div>
        </div>

        {/* KPI 2: Ramadan Mode Status */}
        <div className="glass-panel p-5 flex flex-col justify-between border border-border hover:border-accent/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[12px] font-[700] uppercase tracking-wider">
              Ramadan Operational Mode
            </span>
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
              <Moon className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="text-[26px] font-[800] text-text tracking-[-0.03em] my-1 flex items-center gap-2">
            {isNetworkRamadanActive ? (
              <span className="text-accent flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                ACTIVE
              </span>
            ) : (
              <span className="text-text-muted">STANDARD</span>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11.5px]">
            <span className="text-text-muted">
              {isNetworkRamadanActive ? "Night Shift: 21:00 - 04:00" : "Hours: 06:00 - 23:00 PKT"}
            </span>
            <span className="text-accent font-semibold">Master Switch</span>
          </div>
        </div>

        {/* KPI 3: Audio Ducking */}
        <div className="glass-panel p-5 flex flex-col justify-between border border-border hover:border-accent/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[12px] font-[700] uppercase tracking-wider">
              Audio Auto-Ducking
            </span>
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
              <VolumeX className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="text-[30px] font-[800] text-text tracking-[-0.03em] my-1">
            100%
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11.5px]">
            <span className="text-positive font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-positive" />
              20-min Congregation Mute
            </span>
            <span className="text-text-muted">Studio PA</span>
          </div>
        </div>

        {/* KPI 4: Quiet Hours Guardrail */}
        <div className="glass-panel p-5 flex flex-col justify-between border border-border hover:border-accent/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[12px] font-[700] uppercase tracking-wider">
              Outreach Quiet Hours
            </span>
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="text-[24px] sm:text-[26px] font-[800] text-text tracking-[-0.03em] my-1">
            22:00 – 07:00
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11.5px]">
            <span className="text-positive font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-positive" />
              0 msgs allowed at night
            </span>
            <span className="text-text-muted">Strict Guardrail</span>
          </div>
        </div>
      </div>

      {/* 2. Network-Wide Ramadan Master Control Panel */}
      <div className="glass-panel p-6 border border-border bg-accent/5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-accent" />
              <h3 className="text-[17px] font-[800] text-text">
                Ramadan Operational Protocol & Network Master Switch
              </h3>

            </div>
            <p className="text-[13px] text-text-muted max-w-2xl">
              Activating Ramadan Mode automatically shifts gym access hours across Karachi and Islamabad clubs to the night shift (21:00 to 04:00 with Sehri buffet access), pauses all Win-back AI outreach during fasting hours, and schedules Iftar break buffer at 17:45.
            </p>
          </div>

          {/* Master Toggle Button */}
          <button
            onClick={handleToggleNetworkRamadan}
            disabled={isUpdating}
            className={`px-5 py-3 rounded-[14px] text-[13px] font-[800] flex items-center gap-2.5 transition-all shrink-0 ${
              isNetworkRamadanActive
                ? "bg-accent text-on-accent shadow-[0_4px_16px_rgba(255,217,28,0.4)]"
                : "btn-secondary text-text"
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>
              {isNetworkRamadanActive
                ? "Ramadan Mode ACTIVE (Click to Restore Standard)"
                : "Activate Ramadan Mode Network-Wide"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-[12px] bg-glass border border-border text-[12px]">
            <strong className="text-text block font-[700] mb-0.5">Operating Hours Shift</strong>
            <span className="text-text-muted">
              {isNetworkRamadanActive
                ? "21:00 - 04:00 PKT (Night & Sehri Access)"
                : "06:00 - 23:00 PKT (Standard Operations)"}
            </span>
          </div>

          <div className="p-3.5 rounded-[12px] bg-glass border border-border text-[12px]">
            <strong className="text-text block font-[700] mb-0.5">Outreach Muting Rule</strong>
            <span className="text-text-muted">
              {isNetworkRamadanActive
                ? "Outreach paused during daylight fasting (05:00 - 18:00)"
                : "Outreach allowed 07:00 - 22:00 outside prayer buffers"}
            </span>
          </div>

          <div className="p-3.5 rounded-[12px] bg-glass border border-border text-[12px]">
            <strong className="text-text block font-[700] mb-0.5">Iftar & Taraweeh Buffers</strong>
            <span className="text-text-muted">
              {isNetworkRamadanActive
                ? "Complimentary dates/water + Taraweeh class shift active"
                : "Standard class timings active"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Schedule per Branch Directory Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-[800] text-text flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              Prayer Timetables & Branch Controls ({schedules.length || 5} Clubs)
            </h2>
            <p className="text-[12.5px] text-text-muted mt-0.5">
              Exact city-calculated astronomical prayer times, automated audio ducking, and branch-specific overrides.
            </p>
          </div>
          <div className="text-[11.5px] text-text-muted font-mono hidden sm:block">
            Coordinates: Karachi (24.86°N), Islamabad (33.68°N)
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {schedules.map((schedule) => {
            const isRamadan = schedule.ramadanMode;
            const isDucking = schedule.audioDucking;

            return (
              <div
                key={schedule.branchId}
                className="glass-panel p-5 border border-border flex flex-col justify-between hover:border-accent/30 transition-all space-y-4"
              >
                {/* Branch Header */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-[800] text-[15.5px] text-text">
                          {schedule.branchName}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent border border-accent/30">
                          {schedule.branchCity}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-accent" />
                        <span>{schedule.branchCity} Central Operations</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Mode Tag */}
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`text-[10.5px] font-[800] px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                        isRamadan
                          ? "bg-accent text-on-accent"
                          : "bg-glass border border-border text-text-muted"
                      }`}
                    >
                      <Moon className="w-3 h-3" />
                      <span>{isRamadan ? "Ramadan Hours: 21:00 - 04:00" : "Standard: 06:00 - 23:00"}</span>
                    </span>
                  </div>
                </div>

                {/* Islamic Prayer Timetable Grid */}
                <div className="space-y-1.5 bg-glass p-3 rounded-[12px] border border-border/70 text-[12px]">
                  <div className="text-[10.5px] font-[700] uppercase tracking-wider text-text-muted flex items-center justify-between pb-1 border-b border-border/40">
                    <span>Prayer</span>
                    <span>Azan Time</span>
                    <span>Audio Mute Window</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-text">Fajr</span>
                    <span className="font-mono text-accent font-bold">{schedule.fajr}</span>
                    <span className="text-[11px] text-text-muted">05:15 - 05:40</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-text">Dhuhr</span>
                    <span className="font-mono text-accent font-bold">{schedule.dhuhr}</span>
                    <span className="text-[11px] text-text-muted">12:30 - 12:55</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-text">Asr</span>
                    <span className="font-mono text-accent font-bold">{schedule.asr}</span>
                    <span className="text-[11px] text-text-muted">15:45 - 16:10</span>
                  </div>
                  <div className="flex items-center justify-between py-1 bg-accent/5 px-1 rounded">
                    <span className="font-bold text-accent">Maghrib (Iftar)</span>
                    <span className="font-mono text-accent font-extrabold">{schedule.maghrib}</span>
                    <span className="text-[11px] text-accent font-semibold">17:45 - 18:20</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-text">Isha (Taraweeh)</span>
                    <span className="font-mono text-accent font-bold">{schedule.isha}</span>
                    <span className="text-[11px] text-text-muted">19:15 - 20:30</span>
                  </div>
                </div>

                {/* Individual Controls */}
                <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                  {/* Branch Ramadan Toggle */}
                  <button
                    onClick={() => handleToggleBranchRamadan(schedule.branchId, isRamadan)}
                    className={`text-[11px] font-[700] px-2.5 py-1.5 rounded-[9px] flex items-center gap-1.5 transition-all ${
                      isRamadan
                        ? "bg-accent/20 text-accent border border-accent/40"
                        : "bg-glass border border-border text-text-muted hover:text-text"
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>{isRamadan ? "Ramadan: ON" : "Ramadan: OFF"}</span>
                  </button>

                  {/* Branch Audio Ducking Toggle */}
                  <button
                    onClick={() => handleToggleAudioDucking(schedule.branchId, isDucking)}
                    className={`text-[11px] font-[700] px-2.5 py-1.5 rounded-[9px] flex items-center gap-1.5 transition-all ${
                      isDucking
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-glass border border-border text-text-muted hover:text-text"
                    }`}
                  >
                    {isDucking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isDucking ? "Audio Ducking: ON" : "Audio Ducking: OFF"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
