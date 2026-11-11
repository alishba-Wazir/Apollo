"use client";

import React, { useState } from "react";
import { MemberPortalLayout } from "@/components/layout/MemberPortalLayout";
import { ApolloSelect } from "@/components/ui/ApolloSelect";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  UserCheck,
  Plus,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Moon,
  Zap,
} from "lucide-react";

interface Booking {
  id: string;
  title: string;
  type: "PT" | "CLASS" | "SCAN";
  instructor: string;
  club: string;
  room: string;
  date: string;
  time: string;
  status: "CONFIRMED" | "COMPLETED" | "UPCOMING";
  notes?: string;
  ramadanShift?: boolean;
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-101",
    title: "1-on-1 Personal Training Session",
    type: "PT",
    instructor: "Coach Tariq (Senior PT)",
    club: "Seaview DHA (Flagship)",
    room: "Olympic Lifting & PT Zone",
    date: "Today, Nov 9",
    time: "07:00 PM - 08:30 PM",
    status: "CONFIRMED",
    notes: "Session #9 of 12. Focus: Heavy Bench & Hypertrophy Delts. Bring 4-digit OTP 8492.",
    ramadanShift: false,
  },
  {
    id: "BK-102",
    title: "Les Mills RPM Spin (Night Edition)",
    type: "CLASS",
    instructor: "Coach Sara",
    club: "Clifton Executive",
    room: "Spin Studio B",
    date: "Tomorrow, Nov 10",
    time: "10:15 PM - 11:00 PM",
    status: "UPCOMING",
    notes: "🌙 Shifted to post-Taraweeh night hours. Bike #08 reserved.",
    ramadanShift: true,
  },
  {
    id: "BK-103",
    title: "TechGIS F-Shaped 3D Body Scan",
    type: "SCAN",
    instructor: "Automated Kiosk #1",
    club: "Seaview DHA (Flagship)",
    room: "Lobby Telemetry Bay",
    date: "Wednesday, Nov 11",
    time: "05:00 PM - 05:15 PM",
    status: "UPCOMING",
    notes: "Milestone scan (15-day check-in). Mint dispenser reward voucher unlocks upon scan.",
    ramadanShift: false,
  },
  {
    id: "BK-104",
    title: "1-on-1 Personal Training Session",
    type: "PT",
    instructor: "Coach Tariq (Senior PT)",
    club: "Seaview DHA (Flagship)",
    room: "Olympic Lifting & PT Zone",
    date: "Thursday, Nov 12",
    time: "07:00 PM - 08:30 PM",
    status: "UPCOMING",
    notes: "Session #10 of 12. Focus: Posterior Chain & Deadlifts.",
    ramadanShift: false,
  },
  {
    id: "BK-105",
    title: "Les Mills BodyPump 124",
    type: "CLASS",
    instructor: "Coach Bilal",
    club: "Seaview DHA (Flagship)",
    room: "Main Aerobics Hall",
    date: "Friday, Nov 13",
    time: "09:45 PM - 10:45 PM",
    status: "UPCOMING",
    notes: "🌙 Post-Iftar High Energy Barbell session.",
    ramadanShift: true,
  },
];

export default function MemberSchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [filterType, setFilterType] = useState<"ALL" | "PT" | "CLASS" | "SCAN">("ALL");
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  // Form State
  const [bookType, setBookType] = useState<"PT" | "CLASS" | "SCAN">("CLASS");
  const [bookClub, setBookClub] = useState("Seaview DHA (Flagship)");
  const [bookSlot, setBookSlot] = useState("Tomorrow • 09:30 PM (Post-Taraweeh)");
  const [bookClassTitle, setBookClassTitle] = useState("Les Mills BodyPump");
  const [isJummahSelected, setIsJummahSelected] = useState(false);

  const filteredBookings = bookings.filter((b) => {
    if (filterType === "ALL") return true;
    return b.type === filterType;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: `BK-${Math.floor(200 + Math.random() * 800)}`,
      title:
        bookType === "PT"
          ? "1-on-1 Personal Training Session"
          : bookType === "SCAN"
          ? "TechGIS F-Shaped 3D Body Scan"
          : bookClassTitle,
      type: bookType,
      instructor: bookType === "PT" ? "Coach Tariq" : bookType === "SCAN" ? "Automated Kiosk" : "Coach Bilal",
      club: bookClub,
      room: bookType === "PT" ? "PT Floor" : bookType === "SCAN" ? "Kiosk Bay" : "Studio A",
      date: bookSlot.split("•")[0].trim(),
      time: bookSlot.split("•")[1]?.trim() || "08:00 PM",
      status: "CONFIRMED",
      notes: "Reserved via TriFit Member Portal.",
      ramadanShift: bookSlot.includes("Taraweeh") || bookSlot.includes("Night"),
    };

    setBookings([newBooking, ...bookings]);
    setShowBookModal(false);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(bookings.filter((b) => b.id !== id));
    setShowCancelModal(null);
  };

  return (
    <MemberPortalLayout activeItem="schedule">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              My Schedule & Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
              Manage personal training, studio classes & 3D body scans with Ramadan & Jummah alignment
            </p>
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#eab308] text-[#0B0B09] font-black text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            + Book Class / PT Slot
          </button>
        </div>

        {/* Jummah & Ramadan Timing Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-[#F5C518]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                🌙 Ramadan Night Shift Timetable Active
              </span>
              <p className="text-[11.5px] text-slate-600 dark:text-neutral-300 mt-0.5">
                Group classes run 21:45 - 01:00. Jummah prayer break (12:30 - 14:30 PKT) applies across all clubs on Fridays.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white dark:bg-black/40 text-amber-600 dark:text-[#FFD91C] border border-amber-500/30 self-start md:self-auto">
            Friday Prayer Aware
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: "All Bookings", count: bookings.length },
            { id: "PT", label: "1-on-1 PT Sessions", count: bookings.filter((b) => b.type === "PT").length },
            { id: "CLASS", label: "Studio Classes", count: bookings.filter((b) => b.type === "CLASS").length },
            { id: "SCAN", label: "3D Body Scans", count: bookings.filter((b) => b.type === "SCAN").length },
          ].map((pill) => {
            const isActive = filterType === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setFilterType(pill.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#F5C518] text-[#0B0B09] shadow-sm font-black"
                    : "bg-slate-100 dark:bg-white/5 text-text-muted border border-border hover:border-accent"
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-black/20 text-[#0B0B09]" : "bg-slate-100 dark:bg-white/10"
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {filteredBookings.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-4 sm:p-5 rounded-[22px] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-accent"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === "PT"
                      ? "bg-amber-500/15 text-amber-600 dark:text-[#F5C518] border border-amber-500/30"
                      : item.type === "CLASS"
                      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                      : "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                  }`}
                >
                  {item.type === "PT" && <Dumbbell className="w-6 h-6" />}
                  {item.type === "CLASS" && <Zap className="w-6 h-6" />}
                  {item.type === "SCAN" && <Sparkles className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span
                      className={`text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.status === "CONFIRMED"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.ramadanShift && (
                      <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#FFD91C] border border-amber-500/30 flex items-center gap-1">
                        <Moon className="w-3 h-3" /> Night Shift
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-neutral-300 font-medium">
                    Instructor: <strong className="text-slate-900 dark:text-white">{item.instructor}</strong> • {item.club} ({item.room})
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-neutral-400 pt-1">
                    <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-neutral-200">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {item.time}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 italic pt-1">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {item.type === "PT" && (
                  <span className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-[#F5C518] border border-amber-500/20 font-mono">
                    OTP: 8492
                  </span>
                )}
                <button
                  onClick={() => setShowCancelModal(item.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="glass-panel p-8 text-center rounded-[22px] text-text-muted text-xs">
              No bookings found in this category. Click "+ Book Class / PT Slot" to schedule one.
            </div>
          )}
        </div>

        {/* Modal: Book Slot */}
        {showBookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg glass-panel rounded-[22px] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-[#F5C518]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Book a Class, PT or 3D Body Scan
                    </h3>
                    <p className="text-xs text-slate-400">Multi-club reservation system</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBooking} className="space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Reservation Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "CLASS", label: "Studio Class" },
                      { id: "PT", label: "1-on-1 PT" },
                      { id: "SCAN", label: "3D Body Scan" },
                    ].map((tab) => (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => setBookType(tab.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          bookType === tab.id
                            ? "bg-[#F5C518] text-[#0B0B09] border-[#F5C518] font-black"
                            : "bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-400"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class selector if class */}
                {bookType === "CLASS" && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                      Select Group Class
                    </label>
                    <ApolloSelect
                      value={bookClassTitle}
                      onChange={(val) => setBookClassTitle(val)}
                      options={[
                        { value: "Les Mills BodyPump 124", label: "Les Mills BodyPump 124 (Full Body Barbell)" },
                        { value: "Les Mills RPM Spin", label: "Les Mills RPM Spin (High-Cadence Cardio)" },
                        { value: "Power Yoga & Mobility", label: "Power Yoga & Mobility Flow" },
                        { value: "HIIT Functional Circuit", label: "HIIT Functional Circuit" },
                      ]}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Club Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                    Select Club Location
                  </label>
                  <ApolloSelect
                    value={bookClub}
                    onChange={(val) => setBookClub(val)}
                    options={[
                      { value: "Seaview DHA (Flagship)", label: "Seaview DHA (Flagship) - Karachi" },
                      { value: "Clifton Executive", label: "Clifton Executive Club - Karachi" },
                      { value: "LuckyOne Mall", label: "LuckyOne Mall - Karachi" },
                      { value: "AJ Tower", label: "AJ Tower - Islamabad" },
                    ]}
                    className="w-full"
                  />
                </div>

                {/* Slot Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                    Select Available Date & Slot
                  </label>
                  <ApolloSelect
                    value={bookSlot}
                    onChange={(val) => {
                      setBookSlot(val);
                      setIsJummahSelected(val.includes("Jummah"));
                    }}
                    options={[
                      {
                        value: "Tomorrow • 09:30 PM (Post-Taraweeh Night Slot)",
                        label: "Tomorrow • 09:30 PM (Post-Taraweeh Night Slot) 🌙",
                      },
                      {
                        value: "Tomorrow • 10:45 PM (Post-Taraweeh Late Slot)",
                        label: "Tomorrow • 10:45 PM (Post-Taraweeh Late Slot) 🌙",
                      },
                      {
                        value: "Friday • 13:00 PM (Jummah Prayer Pause)",
                        label: "Friday • 13:00 PM (BLOCKED: Jummah Prayer 12:30 - 14:30)",
                      },
                      {
                        value: "Friday • 08:30 PM (Post-Jummah Night Session)",
                        label: "Friday • 08:30 PM (Post-Jummah Night Session)",
                      },
                      {
                        value: "Saturday • 11:30 AM (Morning Functional)",
                        label: "Saturday • 11:30 AM (Morning Functional)",
                      },
                    ]}
                    className="w-full"
                  />
                </div>

                {/* Jummah Warning */}
                {isJummahSelected && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      This time slot is blocked for Jummah prayers (12:30 - 14:30 PKT). Please pick a post-prayer or night shift slot.
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowBookModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isJummahSelected}
                    className="px-5 py-2 rounded-xl bg-[#F5C518] hover:bg-[#eab308] text-[#0B0B09] font-black text-xs shadow-md disabled:opacity-40"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Cancel Booking */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm glass-panel rounded-[22px] p-5 shadow-2xl space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Cancel Reservation?
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Are you sure you want to cancel this booking? This will release the spot back to the club waitlist.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancelBooking(showCancelModal)}
                  className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
}
