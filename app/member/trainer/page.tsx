"use client";

import React, { useState } from "react";
import { MemberPortalLayout } from "@/components/layout/MemberPortalLayout";
import {
  UserCheck,
  Send,
  MessageSquare,
  KeyRound,
  Copy,
  RefreshCw,
  Star,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  X,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "COACH" | "MEMBER";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m-1",
    sender: "COACH",
    text: "Assalam-o-Alaikum Zubair! Excellent form on your 100kg incline barbell press yesterday. Muscle contraction on the upper chest looked dialed in.",
    time: "Yesterday 08:45 PM",
  },
  {
    id: "m-2",
    sender: "MEMBER",
    text: "Walekum Assalam coach! Thanks! Legs felt a little tight this morning though. Anything I should do before today's session?",
    time: "10:15 AM",
  },
  {
    id: "m-3",
    sender: "COACH",
    text: "Do 5 minutes on the foam roller before 07:00 PM and hydrate with 500ml water + electrolytes. Also bring your 4-digit OTP so I can close out today's session #9.",
    time: "10:45 AM",
  },
];

const AVAILABLE_COACHES = [
  {
    id: "c-1",
    name: "Coach Tariq",
    title: "Senior PT (Tier 3)",
    specialty: "Hypertrophy & Strength",
    rating: "4.92",
    clients: "14",
    club: "Seaview DHA (Flagship)",
    assigned: true,
  },
  {
    id: "c-2",
    name: "Coach Sara",
    title: "Master Coach (Tier 3)",
    specialty: "Spin, HIIT & Female Conditioning",
    rating: "4.96",
    clients: "18",
    club: "Clifton Executive",
    assigned: false,
  },
  {
    id: "c-3",
    name: "Coach Bilal",
    title: "Performance Coach (Tier 2)",
    specialty: "Powerlifting & BodyPump",
    rating: "4.88",
    clients: "12",
    club: "Seaview DHA (Flagship)",
    assigned: false,
  },
  {
    id: "c-4",
    name: "Coach Hamza",
    title: "Mobility & Rehab PT (Tier 2)",
    specialty: "Post-Injury & Functional",
    rating: "4.85",
    clients: "10",
    club: "LuckyOne Mall",
    assigned: false,
  },
];

export default function MemberTrainerPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [otpCode, setOtpCode] = useState("8492");
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [isRefreshingOtp, setIsRefreshingOtp] = useState(false);
  const [showChangeTrainerModal, setShowChangeTrainerModal] = useState(false);
  const [trainerRequestSent, setTrainerRequestSent] = useState(false);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "MEMBER",
      text: inputMessage.trim(),
      time: "Just now",
    };

    setMessages([...messages, newMsg]);
    setInputMessage("");

    // Simulate instant coach acknowledgment
    setTimeout(() => {
      const coachReply: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: "COACH",
        text: "Got it Zubair! See you at the gym floor.",
        time: "Just now",
      };
      setMessages((prev) => [...prev, coachReply]);
    }, 1500);
  };

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText(otpCode);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleRefreshOtp = () => {
    setIsRefreshingOtp(true);
    setTimeout(() => {
      setOtpCode(String(Math.floor(1000 + Math.random() * 9000)));
      setIsRefreshingOtp(false);
    }, 400);
  };

  return (
    <MemberPortalLayout activeItem="trainer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              My Trainer & Live Chat
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
              1-on-1 coaching relationship, live chat and session verification OTP
            </p>
          </div>

          <button
            onClick={() => setShowChangeTrainerModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-border text-xs font-bold text-text hover:border-accent shadow-sm transition-all self-start sm:self-auto"
          >
            <UserCheck className="w-4 h-4 text-accent" />
            + Change / Add Coach
          </button>
        </div>

        {/* Top Split: Assigned Coach Card + OTP Badge Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Coach Profile Card */}
          <div className="lg:col-span-7 glass-panel p-5 rounded-[22px] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center font-black text-lg text-amber-600 dark:text-[#F5C518]">
                    CT
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-black text-slate-900 dark:text-white">
                        Coach Tariq
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        ASSIGNED PT
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                      Tier 3 Senior Coach • CSCS & REPs Level 4 Certified
                    </p>
                    <div className="flex items-center gap-3 text-xs mt-1">
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" /> 4.92 (48 Reviews)
                      </span>
                      <span className="text-slate-400 dark:text-neutral-500">•</span>
                      <span className="text-slate-600 dark:text-neutral-300 font-semibold">
                        Seaview DHA (Flagship)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                    Remaining
                  </span>
                  <span className="text-base font-black text-amber-600 dark:text-[#FFD91C]">
                    8 / 12 Sessions
                  </span>
                </div>
              </div>

              {/* Specializations & Bio */}
              <div className="mt-3.5 space-y-2">
                <p className="text-xs text-slate-600 dark:text-neutral-300">
                  Focusing on heavy compound lifting, lean hypertrophy progression, and customized Pakistani nutrition splits (Roti, Daal Chawal, Chicken Karahi).
                </p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {["Hypertrophy", "Strength", "Desi Macros", "3D Biomechanics", "Injury Rehab"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg text-[10.5px] font-semibold bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Next session: <strong className="text-slate-800 dark:text-neutral-200">Today at 07:00 PM</strong>
              </span>
              <span className="text-emerald-500 font-bold">● Active on Gym Floor</span>
            </div>
          </div>

          {/* 4-Digit Verification OTP Card */}
          <div className="lg:col-span-5 glass-panel p-5 rounded-[22px] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-[#F5C518]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    4-Digit Session OTP
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                    Client-Verification Security Code
                  </p>
                </div>
              </div>

              <button
                onClick={handleRefreshOtp}
                disabled={isRefreshingOtp}
                className="text-slate-400 hover:text-amber-500 transition-colors"
                title="Regenerate OTP"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshingOtp ? "animate-spin text-amber-500" : ""}`} />
              </button>
            </div>

            {/* OTP Large Display */}
            <div className="py-4 text-center">
              <div className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200/80 dark:border-amber-500/30 shadow-inner">
                {otpCode.split("").map((digit, idx) => (
                  <span
                    key={idx}
                    className="w-10 h-12 flex items-center justify-center text-2xl font-black font-mono text-slate-900 dark:text-[#FFD91C] bg-white dark:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm"
                  >
                    {digit}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  onClick={handleCopyOtp}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-[#F5C518] hover:bg-amber-500/20 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedOtp ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/5 text-[11px] text-slate-600 dark:text-neutral-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Provide this OTP to Coach Tariq after finishing your workout. This logs attendance and releases their PKR 1,500 session commission.
              </span>
            </div>
          </div>
        </div>

        {/* Live WhatsApp-Style Chat Panel */}
        <div className="glass-panel rounded-[22px] p-0 overflow-hidden flex flex-col h-[480px]">
          {/* Chat Header */}
          <div className="p-3.5 bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-[#F5C518] font-black flex items-center justify-center text-xs">
                  CT
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#161510] absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  Coach Tariq (Senior PT)
                </h3>
                <span className="text-[10px] text-emerald-500 font-semibold block">
                  Online • Typically replies in 5m
                </span>
              </div>
            </div>

            <span className="text-[10.5px] font-mono text-slate-400">
              End-to-End Encrypted Coach Channel
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-black/20">
            {messages.map((m) => {
              const isMe = m.sender === "MEMBER";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs ${
                      isMe
                        ? "bg-[#F5C518] text-[#0B0B09] font-medium rounded-br-none shadow-sm"
                        : "bg-white dark:bg-[#1E1C15] text-slate-800 dark:text-neutral-200 border border-slate-200/80 dark:border-white/10 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p>{m.text}</p>
                    <span
                      className={`text-[9.5px] mt-1 block text-right font-mono ${
                        isMe ? "text-[#0B0B09]/70" : "text-slate-400 dark:text-neutral-500"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Chips */}
          <div className="p-2 bg-slate-100/60 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              "Confirming today's 07:00 PM slot 👍",
              "Can you review my 3D body scan?",
              "Question about Iftar meal protein",
              "My legs are still sore from deadlifts",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setInputMessage(chip);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-300 hover:border-amber-500/40 whitespace-nowrap shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-50 dark:bg-white/[0.02] border-t border-border dark:border-white/5 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Message Coach Tariq..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl btn-primary transition-all disabled:opacity-40 shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Modal: Change / Add Coach */}
        {showChangeTrainerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg glass-panel rounded-[22px] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      TriFit Certified Coach Directory
                    </h3>
                    <p className="text-xs text-slate-400">Request trainer re-assignment</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowChangeTrainerModal(false);
                    setTrainerRequestSent(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {trainerRequestSent ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Re-assignment Request Submitted
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
                    The Branch General Manager will review your request and confirm your coach onboarding within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setShowChangeTrainerModal(false);
                      setTrainerRequestSent(false);
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#F5C518] text-[#0B0B09] font-black text-xs"
                  >
                    Close Directory
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Select a coach from your home club or reciprocal network to submit a coaching transfer request:
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {AVAILABLE_COACHES.map((coach) => (
                      <div
                        key={coach.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 font-bold flex items-center justify-center text-xs">
                            {coach.name.slice(6, 8)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900 dark:text-white">
                                {coach.name}
                              </span>
                              <span className="text-[9.5px] font-semibold text-amber-600 dark:text-[#FFD91C]">
                                ★ {coach.rating}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-neutral-400 block">
                              {coach.specialty} • {coach.club}
                            </span>
                          </div>
                        </div>

                        {coach.assigned ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                            Current Coach
                          </span>
                        ) : (
                          <button
                            onClick={() => setTrainerRequestSent(true)}
                            className="text-[10.5px] font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-[#F5C518] hover:text-[#0B0B09] text-slate-700 dark:text-neutral-200 border border-slate-200 dark:border-white/10 transition-all"
                          >
                            Request
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
}
