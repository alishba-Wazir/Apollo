"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Dumbbell,
  Star,
  Users,
  Clock,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  Calendar,
  DollarSign,
  Award,
} from "lucide-react";
import type { Trainer, Branch } from "@/lib/apollo-demo-store";

interface CoachRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainers: Trainer[];
  branches: Branch[];
  selectedBranchId?: string | null;
}

export function CoachRosterModal({
  isOpen,
  onClose,
  trainers,
  branches,
  selectedBranchId,
}: CoachRosterModalProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBranchFilter, setActiveBranchFilter] = useState<string>(selectedBranchId || "ALL");
  const [contactedCoachName, setContactedCoachName] = useState<string | null>(null);

  // Sync active branch filter when prop changes
  React.useEffect(() => {
    if (selectedBranchId) {
      setActiveBranchFilter(selectedBranchId);
    }
  }, [selectedBranchId]);

  const specialties = useMemo(() => {
    const list = Array.from(new Set(trainers.map((t) => t.specialty.split("&")[0].trim())));
    return ["ALL", ...list];
  }, [trainers]);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((t) => {
      // Branch filter
      if (activeBranchFilter !== "ALL" && t.branchId !== activeBranchFilter) {
        return false;
      }
      // Specialty filter
      if (selectedSpecialty !== "ALL" && !t.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesSpec = t.specialty.toLowerCase().includes(q);
        const matchesBio = t.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesBio) return false;
      }
      return true;
    });
  }, [trainers, activeBranchFilter, selectedSpecialty, searchQuery]);

  if (!isOpen) return null;

  const handleContactCoach = (name: string, phone: string) => {
    setContactedCoachName(name);
    setTimeout(() => setContactedCoachName(null), 3000);
    // Can open WhatsApp or tel link
    if (typeof window !== "undefined") {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(name)},%20reaching%20out%20from%20TriFit%20Admin%20Portal`, "_blank");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border border-[var(--card-border)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-[var(--line)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              <Dumbbell className="w-5 h-5 font-black" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[18px] sm:text-[20px] font-black text-[var(--text)] tracking-tight">
                  Official Coaching Roster
                </h2>
                <span className="admin-chip !py-0.5 !px-2 text-[10.5px]">
                  {filteredTrainers.length} of {trainers.length} Active Coaches
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REPs Level 3 Certified
                </span>
              </div>
              <p className="body-label text-xs mt-0.5 text-[var(--muted)] truncate">
                High-performance personal trainers, Pilates reformists, and studio lead instructors
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOAST CONFIRMATION */}
        {contactedCoachName && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-2 text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Opened official TriFit WhatsApp direct line for <strong>{contactedCoachName}</strong></span>
          </div>
        )}

        {/* CONTROLS BAR: SEARCH + BRANCH FILTER + SPECIALTY CHIPS */}
        <div className="p-3 sm:p-4 border-b border-[var(--line)] flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between shrink-0 bg-[var(--card)]/40">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by coach name, specialty, or bio..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--card-border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Branch Filter Selector */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveBranchFilter("ALL")}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeBranchFilter === "ALL"
                  ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--text)] bg-[var(--card)]"
              }`}
            >
              All Flagships ({trainers.length})
            </button>
            {branches.map((b) => {
              const count = trainers.filter((t) => t.branchId === b.id).length;
              const isActive = activeBranchFilter === b.id;
              const shortName = b.name.replace("TriFit ", "").split("—")[0].trim();

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setActiveBranchFilter(b.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--text)] bg-[var(--card)]"
                  }`}
                >
                  {shortName} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* COACHES GRID LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredTrainers.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted)]">
              <Dumbbell className="w-10 h-10 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
              <p className="text-sm font-semibold">No coaches match your search criteria</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveBranchFilter("ALL");
                  setSelectedSpecialty("ALL");
                }}
                className="mt-2 text-xs text-[var(--accent)] hover:underline font-bold"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTrainers.map((coach) => {
                const branch = branches.find((b) => b.id === coach.branchId);
                const branchShort = branch ? branch.name.replace("TriFit ", "").split("—")[0].trim() : "Flagship";

                return (
                  <div
                    key={coach.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all duration-200 flex flex-col justify-between gap-3 group relative overflow-hidden"
                  >
                    {/* Top Row: Avatar + Info */}
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={coach.avatar}
                          alt={coach.name}
                          className="w-14 h-14 rounded-xl object-cover border border-[var(--line)] shadow-xs group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--card)]" title="Active On Roster" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <h3 className="text-[13.5px] font-bold text-[var(--text)] truncate">
                            {coach.name}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{coach.rating.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="text-[11px] font-semibold text-[var(--accent)] truncate mt-0.5">
                          {coach.specialty}
                        </div>

                        <div className="text-[10px] text-[var(--muted)] flex items-center gap-1.5 mt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-[var(--accent)]" />
                            <span>{branchShort}</span>
                          </span>
                          <span>•</span>
                          <span>{coach.experienceYears} yrs exp</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio snippet */}
                    <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed">
                      {coach.bio}
                    </p>

                    {/* Key Stats Pill Row */}
                    <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-lg bg-[var(--bg)]/70 text-center font-mono border border-[var(--line)] text-[10px]">
                      <div>
                        <div className="text-[var(--muted)] uppercase text-[9px] font-sans">Active PT</div>
                        <div className="text-[12px] font-bold text-[var(--text)] mt-0.5">
                          {coach.activeClientsCount} Clients
                        </div>
                      </div>
                      <div>
                        <div className="text-[var(--muted)] uppercase text-[9px] font-sans">Rate / Hr</div>
                        <div className="text-[12px] font-bold text-[var(--accent)] mt-0.5">
                          PKR {(coach.hourlyRatePKR / 1000).toFixed(1)}k
                        </div>
                      </div>
                      <div>
                        <div className="text-[var(--muted)] uppercase text-[9px] font-sans">Delivered</div>
                        <div className="text-[12px] font-bold text-emerald-400 mt-0.5">
                          {coach.completedSessions}
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--line)] text-xs">
                      <div className="text-[10.5px] text-[var(--muted)] font-mono">
                        {coach.weeklyHours} hrs/wk • {coach.commissionRate}% comm.
                      </div>

                      <button
                        type="button"
                        onClick={() => handleContactCoach(coach.name, coach.phone)}
                        className="btn primary !h-[32px] !px-2.5 text-[11px] font-bold flex items-center gap-1"
                        title="Open WhatsApp Line for Coach"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Contact Coach</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 sm:p-4 border-t border-[var(--line)] bg-[var(--card)]/40 flex items-center justify-between text-xs text-[var(--muted)] shrink-0">
          <span>TriFit Performance Staff Directory • Reps Certified v2.6</span>
          <button
            type="button"
            onClick={onClose}
            className="btn !h-[34px] !px-4 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
