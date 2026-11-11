"use client";

import React, { useState } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Building2,
  Dumbbell,
  AlertCircle,
} from "lucide-react";

interface Appointment {
  id: string;
  clientName: string;
  memberCode: string;
  time: string;
  duration: string;
  type: "1-on-1 Personal Training" | "Body Composition Evaluation" | "Mobility & Rehab" | "Strength Assessment";
  studio: string;
  status: "CONFIRMED" | "COMPLETED" | "RESCHEDULED";
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    clientName: "Zaid Khan",
    memberCode: "TF-10201",
    time: "07:00 AM - 08:00 AM",
    duration: "60 min",
    type: "1-on-1 Personal Training",
    studio: "PT Studio Alpha",
    status: "CONFIRMED",
    dayOfWeek: "Mon",
  },
  {
    id: "apt-2",
    clientName: "Alishba Khan",
    memberCode: "TF-10202",
    time: "09:30 AM - 10:30 AM",
    duration: "60 min",
    type: "Body Composition Evaluation",
    studio: "TechGIS Kiosk Room",
    status: "CONFIRMED",
    dayOfWeek: "Mon",
  },
  {
    id: "apt-3",
    clientName: "Hamza Rauf",
    memberCode: "TF-10203",
    time: "05:00 PM - 06:00 PM",
    duration: "60 min",
    type: "1-on-1 Personal Training",
    studio: "Olympic Powerlifting Platform",
    status: "COMPLETED",
    dayOfWeek: "Mon",
  },
  {
    id: "apt-4",
    clientName: "Daniyal Khan",
    memberCode: "TF-10204",
    time: "07:30 PM - 08:30 PM",
    duration: "60 min",
    type: "Strength Assessment",
    studio: "Functional Turf Area",
    status: "CONFIRMED",
    dayOfWeek: "Tue",
  },
  {
    id: "apt-5",
    clientName: "Fatima Noor",
    memberCode: "TF-10205",
    time: "06:30 PM - 07:30 PM",
    duration: "60 min",
    type: "Mobility & Rehab",
    studio: "Studio Beta (Pilates)",
    status: "CONFIRMED",
    dayOfWeek: "Wed",
  },
];

export default function TrainerCalendarPage() {
  const { members } = useApolloStore();
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedDay, setSelectedDay] = useState<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun">("Mon");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [newClientName, setNewClientName] = useState(members[0]?.name || "Zaid Khan");
  const [newTime, setNewTime] = useState("08:00 AM - 09:00 AM");
  const [newType, setNewType] = useState<Appointment["type"]>("1-on-1 Personal Training");
  const [newStudio, setNewStudio] = useState("PT Studio Alpha");

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCompleteAppointment = (id: string) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: "COMPLETED" } : a))
    );
    showNotification("Appointment marked as completed! 1 PT session credited.");
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: newClientName,
      memberCode: `TF-${Math.floor(10000 + Math.random() * 90000)}`,
      time: newTime,
      duration: "60 min",
      type: newType,
      studio: newStudio,
      status: "CONFIRMED",
      dayOfWeek: selectedDay,
    };
    setAppointments([...appointments, newApt]);
    setShowAddModal(false);
    showNotification(`New session scheduled with ${newClientName}!`);
  };

  const daysList: Array<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"> = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  const currentDayAppointments = appointments.filter((a) => a.dayOfWeek === selectedDay);

  return (
    <TrainerPortalLayout activeItem="calendar">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Training Calendar & Appointments</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                November 2026
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Manage client appointments, 1-on-1 personal training hours, and studio room allocations
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] dark:hover:bg-[#f5cf12] text-slate-950 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book PT Session</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12.5px] font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Day Pills */}
        <div className="glass-panel p-2.5 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex items-center justify-between gap-1 overflow-x-auto">
          {daysList.map((day) => {
            const count = appointments.filter((a) => a.dayOfWeek === day).length;
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? "bg-[#FFD91C] text-[#050505] font-black shadow-sm"
                    : "text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5 font-bold"
                }`}
              >
                <div className="text-[12px] uppercase">{day}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{count} Sessions</div>
              </button>
            );
          })}
        </div>

        {/* Appointments List for Selected Day */}
        <div className="space-y-3.5">
          {currentDayAppointments.length > 0 ? (
            currentDayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="glass-panel p-5 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/15 text-amber-700 dark:text-[#FFD91C] flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="text-[16px] font-[800] text-text">{apt.clientName}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-text-muted">
                        {apt.memberCode}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          apt.status === "COMPLETED"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="text-[12px] font-semibold text-amber-600 dark:text-[#FFD91C] mt-1">
                      {apt.type} • {apt.duration}
                    </div>

                    <div className="text-[11.5px] text-text-muted mt-1 flex items-center gap-3">
                      <span>⏰ {apt.time}</span>
                      <span>•</span>
                      <span>📍 {apt.studio}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.status !== "COMPLETED" && (
                    <button
                      onClick={() => handleCompleteAppointment(apt.id)}
                      className="btn-primary"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Delivered</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl border border-border text-text-muted space-y-2">
              <Calendar className="w-8 h-8 text-text-muted mx-auto" />
              <div className="font-bold text-[14px]">No Appointments for {selectedDay}</div>
              <p className="text-[12px]">Click &quot;Book PT Session&quot; above to schedule a client session for this day.</p>
            </div>
          )}
        </div>

        {/* Modal: Book Appointment */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel p-6 rounded-[24px] bg-white dark:bg-[#0D0D0B] border border-border shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-[17px] font-[800] text-text">Book Personal Training Session</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="space-y-3.5 text-[12.5px]">
                <div>
                  <label className="font-bold text-text block mb-1">Select Client</label>
                  <select
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-text"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.memberCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-text block mb-1">Session Timing</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-text font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-text block mb-1">Session Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-text"
                  >
                    <option value="1-on-1 Personal Training">1-on-1 Personal Training</option>
                    <option value="Body Composition Evaluation">Body Composition Evaluation</option>
                    <option value="Mobility & Rehab">Mobility & Rehab</option>
                    <option value="Strength Assessment">Strength Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-text block mb-1">Studio Room</label>
                  <input
                    type="text"
                    value={newStudio}
                    onChange={(e) => setNewStudio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-text"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TrainerPortalLayout>
  );
}
