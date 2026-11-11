"use client";

import React, { useState, useMemo } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import { useApolloStore, GymClass } from "@/lib/apollo-demo-store";
import { ApolloSelect } from "@/components/ui/ApolloSelect";
import {
  CalendarCheck,
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Flame,
  Award,
  Sparkles,
  ChevronRight,
  UserCheck,
  Download,
  AlertCircle,
  Building2,
  TrendingUp,
} from "lucide-react";

export default function TrainerClassesPage() {
  const { classes, branches, trainers, members, addClass, updateClass, cancelClass } = useApolloStore();

  const [selectedDay, setSelectedDay] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedClassForRoster, setSelectedClassForRoster] = useState<GymClass | null>(null);

  // New Class Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTrainerName, setNewTrainerName] = useState("Tariq Mahmood");
  const [newRoom, setNewRoom] = useState("Studio Alpha (Main Ex)");
  const [newDay, setNewDay] = useState("Monday");
  const [newTime, setNewTime] = useState("06:30 PM - 07:30 PM");
  const [newCapacity, setNewCapacity] = useState(25);
  const [newCategory, setNewCategory] = useState("HIIT & Conditioning");

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3800);
  };

  // Filtered Classes
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchSearch =
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.studio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "ALL" || cls.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [classes, searchQuery, selectedCategory]);

  // Aggregate Metrics
  const totalBooked = classes.reduce((sum, c) => sum + c.bookedCount, 0);
  const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
  const overallFillRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
  const activeClassesCount = classes.filter((c) => c.status !== "CANCELLED").length;

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addClass({
      branchId: branches[0]?.id || "br-isb-f8",
      name: newTitle.trim(),
      trainerId: trainers.find((t) => t.name === newTrainerName)?.id || "tr-tariq",
      trainerName: newTrainerName,
      studio: newRoom,
      startTime: "06:30 PM",
      endTime: "07:30 PM",
      daysOfWeek: ["Mon", "Wed", "Fri"],
      capacity: Number(newCapacity),
      category: (newCategory.includes("Spin") ? "Spin & RPM" : newCategory.includes("HIIT") ? "HIIT" : "Yoga & Pilates") as any,
      status: "SCHEDULED",
    });

    notify(`Studio class "${newTitle}" scheduled successfully.`);
    setIsScheduleModalOpen(false);
    setNewTitle("");
  };

  const handleCancel = (cls: GymClass) => {
    if (confirm(`Cancel "${cls.name}"? Enrolled participants will be notified.`)) {
      cancelClass(cls.id);
      notify(`Class "${cls.name}" has been marked CANCELLED.`);
    }
  };

  const handleComplete = (cls: GymClass) => {
    updateClass(cls.id, { status: "COMPLETED" });
    notify(`Class "${cls.name}" marked COMPLETED. Attendance recorded.`);
  };

  return (
    <TrainerPortalLayout activeItem="classes">
      <div className="space-y-6">
        {/* Toast Notification */}
        {actionNotice && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#050505] dark:bg-white text-white dark:text-[#050505] font-semibold text-xs shadow-2xl border border-[#FFD91C] animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-[#FFD91C] shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E8E5] dark:border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-text-muted">
                Studio Management
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-[11px] font-bold text-[#FFD91C] bg-[#FFD91C]/10 dark:bg-[#FFD91C]/20 px-2 py-0.5 rounded-full">
                Interactive Schedule
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-text tracking-tight">
              Studio Classes & Group Rosters
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Manage multi-branch studio sessions, track member enrollments, monitor studio capacities, and dispatch instructor assignments.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD91C] text-[#050505] text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule Studio Class</span>
            </button>
          </div>
        </div>

        {/* Balanced KPI Row (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[132px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Active Classes
              </span>
              <span className="p-2 rounded-xl bg-[#FFD91C]/10 text-text">
                <CalendarCheck className="w-4 h-4 text-[#FFD91C]" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-text tracking-tight">
                {activeClassesCount}
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Scheduled across all 3 studios</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[132px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Avg Studio Fill Rate
              </span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-text tracking-tight">
                {overallFillRate}%
              </div>
              <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">+4.2% vs last week</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[132px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Total Booked Members
              </span>
              <span className="p-2 rounded-xl bg-[#FFD91C]/10 text-text">
                <Users className="w-4 h-4 text-[#FFD91C]" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-text tracking-tight">
                {totalBooked}
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Confirmed slot reservations</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[132px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Capacity Headroom
              </span>
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Building2 className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-text tracking-tight">
                {Math.max(0, totalCapacity - totalBooked)}
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Seats open across upcoming sessions</p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-[#F7F7F5] dark:bg-[#050505] px-3 py-2 rounded-xl border border-[#E8E8E5] dark:border-white/10">
            <Search className="w-4 h-4 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search by class name, trainer, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-text placeholder-text-muted focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {["ALL", "Spin & RPM", "HIIT & Conditioning", "BodyPump & Strength", "Mind & Body Yoga"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] shadow-sm"
                    : "bg-[#F7F7F5] dark:bg-[#151515] text-text-muted hover:text-text border border-[#E8E8E5] dark:border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Classes Table */}
        <div className="rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#E8E8E5] dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD91C]" />
              <h3 className="text-sm font-bold text-text">Weekly Studio Schedule & Rosters</h3>
              <span className="text-xs text-text-muted font-medium">({filteredClasses.length} sessions)</span>
            </div>
            <span className="text-[11px] text-text-muted font-mono">LIVE STUDIO SYNC</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E5] dark:border-white/10 bg-[#F7F7F5]/80 dark:bg-[#121210]/60 text-text-muted font-semibold uppercase tracking-wider text-[10.5px]">
                  <th className="py-3 px-5">Session & Format</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Location / Studio</th>
                  <th className="py-3 px-4">Schedule Time</th>
                  <th className="py-3 px-4">Booking Occupancy</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5] dark:divide-white/10">
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-text-muted">
                      No studio classes match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((cls) => {
                    const fillPercent = Math.round((cls.bookedCount / cls.capacity) * 100);
                    const isFull = cls.bookedCount >= cls.capacity;

                    return (
                      <tr
                        key={cls.id}
                        className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-text text-sm">{cls.name}</div>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-text-muted bg-[#F7F7F5] dark:bg-[#181816] px-2 py-0.5 rounded border border-[#E8E8E5] dark:border-white/10">
                            {cls.category || "Group Fitness"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-text">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#FFD91C]/20 text-[#050505] dark:text-[#FFD91C] flex items-center justify-center font-bold text-[10px]">
                              {cls.trainerName.charAt(0)}
                            </div>
                            <span>{cls.trainerName}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                            <span>{cls.studio}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-text">
                            <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                            <span>06:30 PM - 07:30 PM</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1.5 min-w-[130px]">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-text">
                                {cls.bookedCount} / {cls.capacity}
                              </span>
                              <span className={`font-semibold ${isFull ? "text-amber-500" : "text-text-muted"}`}>
                                {fillPercent}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isFull ? "bg-amber-500" : "bg-[#FFD91C]"
                                }`}
                                style={{ width: `${Math.min(100, fillPercent)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                              cls.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : cls.status === "CANCELLED"
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {cls.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedClassForRoster(cls)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#F7F7F5] dark:bg-[#181816] hover:bg-black/10 dark:hover:bg-white/10 text-text font-bold text-xs border border-[#E8E8E5] dark:border-white/10 transition-colors"
                            >
                              Roster ({cls.bookedCount})
                            </button>

                            {cls.status === "SCHEDULED" && (
                              <>
                                <button
                                  onClick={() => handleComplete(cls)}
                                  title="Mark Completed"
                                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleCancel(cls)}
                                  title="Cancel Class"
                                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Studio Class Modal */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8E8E5] dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#FFD91C]/20 text-[#050505] dark:text-[#FFD91C]">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-text">Schedule Studio Class</h3>
                </div>
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="p-1 text-text-muted hover:text-text rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-text mb-1">Class Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RPM Sprint 45 or HIIT Bootcamp"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-text focus:outline-none focus:border-[#FFD91C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">Category</label>
                    <ApolloSelect
                      value={newCategory}
                      onChange={(val) => setNewCategory(val)}
                      options={[
                        { value: "Spin & RPM", label: "Spin & RPM" },
                        { value: "HIIT & Conditioning", label: "HIIT & Conditioning" },
                        { value: "BodyPump & Strength", label: "BodyPump & Strength" },
                        { value: "Mind & Body Yoga", label: "Mind & Body Yoga" },
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-text mb-1">Lead Instructor</label>
                    <ApolloSelect
                      value={newTrainerName}
                      onChange={(val) => setNewTrainerName(val)}
                      options={trainers.map((t) => ({
                        value: t.name,
                        label: `${t.name} (${t.specialty})`,
                      }))}
                      searchable={true}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">Studio / Room</label>
                    <ApolloSelect
                      value={newRoom}
                      onChange={(val) => setNewRoom(val)}
                      options={[
                        { value: "Studio Alpha (Main Ex)", label: "Studio Alpha (Main Ex)" },
                        { value: "RPM Spin Dome", label: "RPM Spin Dome" },
                        { value: "Functional Turf 2", label: "Functional Turf 2" },
                        { value: "Mind & Body Sanctuary", label: "Mind & Body Sanctuary" },
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-text mb-1">Max Capacity</label>
                    <input
                      type="number"
                      min={5}
                      max={50}
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-text focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E8E5] dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-text-muted hover:text-text font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FFD91C] text-[#050505] font-bold hover:brightness-105"
                  >
                    Publish to Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Class Roster Modal */}
        {selectedClassForRoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E8E5] dark:border-white/10 pb-3">
                <div>
                  <div className="text-xs font-bold text-[#FFD91C] uppercase tracking-wider">
                    Enrolled Attendees
                  </div>
                  <h3 className="text-lg font-bold text-text">
                    {selectedClassForRoster.name} — {selectedClassForRoster.studio}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedClassForRoster(null)}
                  className="p-1 text-text-muted hover:text-text rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {members.slice(0, selectedClassForRoster.bookedCount).map((member, i) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F7F7F5] dark:bg-[#181816] border border-[#E8E8E5] dark:border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FFD91C]/20 text-text font-bold flex items-center justify-center text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-text">{member.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{member.memberCode} • {member.phone}</div>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E8E8E5] dark:border-white/10 flex justify-between items-center text-xs">
                <span className="text-text-muted">
                  Showing {selectedClassForRoster.bookedCount} registered athletes
                </span>
                <button
                  onClick={() => {
                    notify("Attendance export generated.");
                    setSelectedClassForRoster(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FFD91C] text-[#050505] font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TrainerPortalLayout>
  );
}
