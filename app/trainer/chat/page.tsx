"use client";

import React, { useState } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import {
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  KeyRound,
  Send,
  UserCheck,
  Sparkles,
  Phone,
  Check,
  X,
  Dumbbell,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "TRAINER" | "CLIENT";
  text: string;
  timestamp: string;
}

interface PtSlot {
  id: string;
  time: string;
  clientName: string;
  status: "COMPLETED" | "CONFIRMED" | "OPEN";
  workoutFocus: string;
  otpVerified?: boolean;
}

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "Zaid Khan": [
    { id: "m1", sender: "CLIENT", text: "Salam Coach! Did the deadlift set yesterday, hamstrings feel solid.", timestamp: "10:14 AM" },
    { id: "m2", sender: "TRAINER", text: "Walaikum Assalam Zaid! Great work. Today we've got heavy squats and core at 5 PM. Don't skip your pre-workout meal.", timestamp: "10:20 AM" },
    { id: "m3", sender: "CLIENT", text: "Got it Coach! I'll have the sweet potato and egg whites. My OTP for today's session is ready.", timestamp: "10:25 AM" },
  ],
  "Alishba Khan": [
    { id: "m4", sender: "CLIENT", text: "Coach Tariq, can we shift tomorrow's session 30 mins later due to Maghrib prayer?", timestamp: "Yesterday" },
    { id: "m5", sender: "TRAINER", text: "Absolutely Alishba. Shifted to 19:15 PKT right after Iftar & Maghrib prayer.", timestamp: "Yesterday" },
  ],
};

const INITIAL_SCHEDULE: PtSlot[] = [
  { id: "sl-1", time: "07:00 - 08:00 AM", clientName: "Hamza Rauf", status: "COMPLETED", workoutFocus: "Chest & Heavy Triceps", otpVerified: true },
  { id: "sl-2", time: "11:00 - 12:00 PM", clientName: "Daniyal Khan", status: "COMPLETED", workoutFocus: "Core Stability & HIIT", otpVerified: true },
  { id: "sl-3", time: "05:00 - 06:00 PM", clientName: "Zaid Khan", status: "CONFIRMED", workoutFocus: "Quads & Bulgarian Split Squats", otpVerified: false },
  { id: "sl-4", time: "07:15 - 08:15 PM", clientName: "Alishba Khan", status: "CONFIRMED", workoutFocus: "Glute Hypertrophy & Pull", otpVerified: false },
  { id: "sl-5", time: "09:30 - 10:30 PM", clientName: "Open / Walk-in Slot", status: "OPEN", workoutFocus: "Post-Taraweeh Night PT", otpVerified: false },
];

export default function TrainerChatPage() {
  const [selectedClient, setSelectedClient] = useState("Zaid Khan");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [schedule, setSchedule] = useState<PtSlot[]>(INITIAL_SCHEDULE);

  // OTP Verification Modal
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [verifyingSlotId, setVerifyingSlotId] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "TRAINER",
      text: inputText,
      timestamp: "Just now",
    };

    setMessages({
      ...messages,
      [selectedClient]: [...(messages[selectedClient] || []), newMsg],
    });
    setInputText("");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.length < 4) return;

    setSchedule(prev =>
      prev.map(slot => (slot.id === verifyingSlotId ? { ...slot, status: "COMPLETED", otpVerified: true } : slot))
    );

    setOtpSuccessMsg(`✓ 4-Digit OTP (${otpInput}) Verified! Session logged to Head Office. Commission PKR 1,500 credited.`);
    setTimeout(() => {
      setOtpSuccessMsg(null);
      setIsOtpModalOpen(false);
      setOtpInput("");
    }, 2000);
  };

  return (
    <TrainerPortalLayout activeItem="chat">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Client Chat & PT Booking Schedule</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                WhatsApp Bridge Active
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Real-time member messaging, daily 1-on-1 timetable, and 4-digit client OTP session verification
            </span>
          </div>
        </div>

        {/* 2-Column Split: Chat on Left (7 Cols) | PT Calendar on Right (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Chat Window (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-4 rounded-[18px] border border-border flex flex-col h-[600px] justify-between">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 text-accent font-[800] text-[14px] flex items-center justify-center">
                  {selectedClient.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-[15px] font-[800] text-text leading-tight">{selectedClient}</h3>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online via TriFit App
                  </span>
                </div>
              </div>

              {/* Client Selector Pills */}
              <div className="flex items-center gap-1.5">
                {Object.keys(messages).map(clientName => (
                  <button
                    key={clientName}
                    onClick={() => setSelectedClient(clientName)}
                    className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold transition-all ${
                      selectedClient === clientName
                        ? "bg-accent text-on-accent"
                        : "bg-slate-100 dark:bg-white/5 text-text-muted hover:text-text"
                    }`}
                  >
                    {clientName.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {(messages[selectedClient] || []).map((msg) => {
                const isMe = msg.sender === "TRAINER";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-[15px] text-[12.5px] leading-relaxed ${
                        isMe
                          ? "bg-[#F5C518] text-[#0B0B09] font-medium rounded-br-[2px]"
                          : "bg-slate-100 dark:bg-white/10 text-text font-normal rounded-bl-[2px]"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-text-muted mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-border flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${selectedClient}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text text-[13px] focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="p-2 rounded-[11px] bg-accent text-on-accent hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Daily PT Schedule & Verify OTP (5 Cols) */}
          <div className="lg:col-span-5 glass-panel p-4 rounded-[18px] border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-[800] text-text flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Today's 1-on-1 PT Schedule</span>
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Verify 4-digit client OTP upon completion to claim PKR commissions.
                </p>
              </div>
            </div>

            {/* Schedule List */}
            <div className="space-y-2.5">
              {schedule.map((slot) => {
                const isConfirmed = slot.status === "CONFIRMED";
                const isDone = slot.status === "COMPLETED";

                return (
                  <div
                    key={slot.id}
                    className="p-3 rounded-[14px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11.5px] font-mono text-amber-600 dark:text-[#FFD91C] font-bold">
                        {slot.time}
                      </span>
                      <span
                        className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                          isDone
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : isConfirmed
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                            : "bg-slate-200 dark:bg-white/10 text-text-muted"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <div>
                      <div className="text-[13px] font-[800] text-text">{slot.clientName}</div>
                      <div className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1.5">
                        <Dumbbell className="w-3 h-3 text-accent" />
                        <span>{slot.workoutFocus}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-1.5 border-t border-border flex items-center justify-between text-[11px]">
                      {isDone ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>OTP Verified · PKR 1,500 Earned</span>
                        </span>
                      ) : isConfirmed ? (
                        <button
                          onClick={() => {
                            setVerifyingSlotId(slot.id);
                            setIsOtpModalOpen(true);
                          }}
                          className="w-full py-1.5 rounded-[9px] bg-accent text-on-accent font-extrabold flex items-center justify-center gap-1.5 hover:opacity-90 shadow-sm"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Verify 4-Digit Client OTP</span>
                        </button>
                      ) : (
                        <span className="text-text-muted italic">Slot open for bookings</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MODAL: Verify 4-Digit Client OTP */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-sm bg-white dark:bg-[#12110c] border border-slate-200 dark:border-amber-950/40 rounded-[22px] p-6 shadow-2xl">
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-text-muted"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-2 text-accent">
                <KeyRound className="w-5 h-5" />
                <h3 className="text-[17px] font-[800] text-text">Verify Client Session OTP</h3>
              </div>
              <p className="text-[12px] text-text-muted mb-4">
                Ask the client to display the 4-digit code generated in their <strong>TriFit Member Portal</strong>.
              </p>

              {otpSuccessMsg ? (
                <div className="p-4 rounded-[14px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold text-[13px]">
                  {otpSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1 text-center">
                      Enter 4-Digit Client OTP
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 8492"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full text-center text-[26px] tracking-widest font-mono font-extrabold py-2.5 rounded-[12px] bg-slate-100 dark:bg-white/5 border border-border text-text focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-[12px] bg-[#F5C518] text-[#0B0B09] font-extrabold text-[13px] shadow-sm hover:opacity-90"
                  >
                    Confirm & Complete PT Session
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </TrainerPortalLayout>
  );
}
