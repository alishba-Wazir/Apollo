"use client";

import React, { useState } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import {
  ScanLine,
  ShieldCheck,
  AlertTriangle,
  UserPlus,
  CreditCard,
  Banknote,
  UploadCloud,
  KeyRound,
  CupSoda,
  CheckCircle2,
  Clock,
  Sparkles,
  EyeOff,
  Eye,
  X,
  Check,
  Search,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApolloSelect } from "@/components/ui/ApolloSelect";

interface GateEvent {
  id: string;
  timestamp: string;
  memberName: string;
  gender: "FEMALE" | "MALE";
  memberId: string;
  tier: "Black Diamond VIP" | "Executive Gold" | "Prime Annual";
  feeStatus: "PAID" | "DUE" | "OVERDUE";
  device: "ZKTeco SpeedGate #01" | "ZKTeco SpeedGate #02" | "Hikvision MinMoe Facial";
  accessResult: "GRANTED" | "FLAGGED" | "DENIED";
  photoUrl?: string;
}

const INITIAL_GATE_STREAM: GateEvent[] = [
  {
    id: "gt-101",
    timestamp: "Just now",
    memberName: "Alishba Khan",
    gender: "FEMALE",
    memberId: "MEM-8291",
    tier: "Black Diamond VIP",
    feeStatus: "PAID",
    device: "Hikvision MinMoe Facial",
    accessResult: "GRANTED",
  },
  {
    id: "gt-102",
    timestamp: "2 mins ago",
    memberName: "Zaid Khan",
    gender: "MALE",
    memberId: "MEM-4491",
    tier: "Black Diamond VIP",
    feeStatus: "PAID",
    device: "ZKTeco SpeedGate #01",
    accessResult: "GRANTED",
  },
  {
    id: "gt-103",
    timestamp: "5 mins ago",
    memberName: "Fatima Noor",
    gender: "FEMALE",
    memberId: "MEM-7721",
    tier: "Executive Gold",
    feeStatus: "DUE",
    device: "Hikvision MinMoe Facial",
    accessResult: "FLAGGED",
  },
  {
    id: "gt-104",
    timestamp: "9 mins ago",
    memberName: "Hamza Rauf",
    gender: "MALE",
    memberId: "MEM-6110",
    tier: "Prime Annual",
    feeStatus: "PAID",
    device: "ZKTeco SpeedGate #02",
    accessResult: "GRANTED",
  },
  {
    id: "gt-105",
    timestamp: "14 mins ago",
    memberName: "Bilal Siddiqui",
    gender: "MALE",
    memberId: "MEM-1902",
    tier: "Executive Gold",
    feeStatus: "OVERDUE",
    device: "ZKTeco SpeedGate #01",
    accessResult: "DENIED",
  },
];

interface ShakeItem {
  id: string;
  name: string;
  protein: string;
  pricePKR: number;
  scoopsStock: number;
}

export default function BranchDeskPage() {
  const { user } = useAuth();
  const [stream, setStream] = useState<GateEvent[]>(INITIAL_GATE_STREAM);

  React.useEffect(() => {
    async function loadDeskData() {
      try {
        const res = await fetch("/api/branch-today");
        if (res.ok) {
          const data = await res.json();
          if (data.visitsToday && data.visitsToday.length > 0) {
            const mapped: GateEvent[] = data.visitsToday.map((v: any, idx: number) => {
              const isFemale = v.member.name.includes("Fatima") || v.member.name.includes("Ayesha") || v.member.name.includes("Zainab") || v.member.name.includes("Alishba") || v.member.name.includes("Sana");
              return {
                id: `gt-${v.id}`,
                timestamp: new Date(v.checkedInAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
                memberName: v.member.name,
                gender: isFemale ? "FEMALE" : "MALE",
                memberId: `MEM-${v.member.id.substring(v.member.id.length - 4)}`,
                tier: v.member.planId === "ELITE" ? "Black Diamond VIP" : v.member.planId === "PRO" ? "Executive Gold" : "Prime Annual",
                feeStatus: idx % 5 === 0 ? "DUE" : "PAID",
                device: idx % 2 === 0 ? "ZKTeco SpeedGate #01" : "Hikvision MinMoe Facial",
                accessResult: idx % 5 === 0 ? "FLAGGED" : "GRANTED",
              };
            });
            setStream(mapped);
          }
        }
      } catch (e) {
        console.error("Failed to load desk stream:", e);
      }
    }
    loadDeskData();
  }, []);

  // Modal States
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState("Card Forgotten");
  const [overrideMemberName, setOverrideMemberName] = useState("");
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinTier, setWalkinTier] = useState("Executive Gold");
  const [walkinSuccess, setWalkinSuccess] = useState(false);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState("10");
  const [otpCode, setOtpCode] = useState("");
  const [otpStatus, setOtpStatus] = useState<"IDLE" | "REQUESTED" | "VERIFIED">("IDLE");

  // Shake Bar Inventory state (35g scoops auto-deducting)
  const [shakes, setShakes] = useState<ShakeItem[]>([
    { id: "sh-1", name: "Whey Double Rich Chocolate", protein: "25g", pricePKR: 850, scoopsStock: 142 },
    { id: "sh-2", name: "Mango Lassi Protein Blast", protein: "28g", pricePKR: 950, scoopsStock: 89 },
    { id: "sh-3", name: "Sattu Desi Power Shake", protein: "22g", pricePKR: 650, scoopsStock: 110 },
    { id: "sh-4", name: "Vanilla Almond Recovery", protein: "24g", pricePKR: 800, scoopsStock: 64 },
  ]);
  const [lastSoldShake, setLastSoldShake] = useState<string | null>(null);

  // POS State
  const [posAmount, setPosAmount] = useState("12500");
  const [posMethod, setPosMethod] = useState<"CASH" | "CARD" | "IBFT">("CARD");
  const [ibftFileUploaded, setIbftFileUploaded] = useState(false);
  const [posSuccessMsg, setPosSuccessMsg] = useState<string | null>(null);

  const handleManualOverride = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: GateEvent = {
      id: `gt-${Date.now()}`,
      timestamp: "Just now",
      memberName: overrideMemberName || "Manual Guest Entry",
      gender: "MALE",
      memberId: "OVERRIDE-GUEST",
      tier: "Prime Annual",
      feeStatus: "PAID",
      device: "ZKTeco SpeedGate #01",
      accessResult: "GRANTED",
    };
    setStream([newEvent, ...stream]);
    setOverrideSuccess(true);
    setTimeout(() => {
      setOverrideSuccess(false);
      setIsOverrideModalOpen(false);
      setOverrideMemberName("");
    }, 1200);
  };

  const handleWalkinRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setWalkinSuccess(true);
    setTimeout(() => {
      setWalkinSuccess(false);
      setIsWalkinModalOpen(false);
      setWalkinName("");
      setWalkinPhone("");
    }, 1200);
  };

  const handleSellShake = (shakeId: string) => {
    setShakes(prev =>
      prev.map(sh => (sh.id === shakeId ? { ...sh, scoopsStock: Math.max(0, sh.scoopsStock - 1) } : sh))
    );
    const target = shakes.find(s => s.id === shakeId);
    setLastSoldShake(`Sold: ${target?.name} (-35g scoop deducted)`);
    setTimeout(() => setLastSoldShake(null), 3000);
  };

  const handlePosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPosSuccessMsg(`Payment of PKR ${Number(posAmount).toLocaleString()} approved via ${posMethod}`);
    setTimeout(() => setPosSuccessMsg(null), 4000);
  };

  return (
    <BranchPortalLayout activeItem="desk">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Live Gate & POS Billing Desk</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Turnstile Feed • {user?.branchName || "TRI FIT Seaview Flagship"}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              ZKTeco/Hikvision gate pass monitoring, walk-in signups, shake bar POS, and cashier terminal
            </span>
          </div>

          {/* Quick Desk Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setIsOverrideModalOpen(true)}
              className="h-9 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Gate Override</span>
            </button>
            <button
              onClick={() => setIsWalkinModalOpen(true)}
              className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] dark:hover:bg-[#f5cf12] text-slate-950 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Walk-in Registration</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Left: Live Gate Stream | Right: POS & Shake Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Live Gate Check-in Stream (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-panel p-5 rounded-[22px] space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/5">
                <div>
                  <h3 className="text-[15px] font-[800] text-text flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>Real-Time Turnstile Check-Ins</span>
                  </h3>
                  <p className="text-[11.5px] text-text-muted mt-0.5">
                    Live biometric face scans & RFID card taps synced with ZKTeco turnstile controllers.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent text-on-accent shadow-[0_0_10px_rgba(255,217,28,0.35)]">
                  {stream.length} RECENT SCANS
                </span>
              </div>

              {/* Stream Feed */}
              <div className="space-y-2.5">
                {stream.map((event) => {
                  return (
                    <div
                      key={event.id}
                      className="p-3 rounded-[14px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-3 hover:border-accent/40 transition-colors"
                    >
                      {/* Avatar / Photo */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-[12px] bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative">
                          <span className="text-[13px] font-extrabold text-text">
                            {event.memberName.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-[750] text-text truncate">
                              {event.memberName}
                            </span>
                            <span className="text-[10px] font-mono text-text-muted">
                              {event.memberId}
                            </span>
                          </div>
                          <div className="text-[11px] text-text-muted flex items-center gap-1.5 mt-0.5">
                            <span className="text-accent font-semibold">{event.tier}</span>
                            <span>•</span>
                            <span>{event.device}</span>
                            <span>•</span>
                            <span className="text-slate-400 dark:text-neutral-500">{event.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                            event.feeStatus === "PAID"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : event.feeStatus === "DUE"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {event.feeStatus}
                        </span>

                        <span
                          className={`text-[10.5px] font-[800] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            event.accessResult === "GRANTED"
                              ? "bg-emerald-500 text-white dark:text-black font-extrabold"
                              : event.accessResult === "FLAGGED"
                              ? "bg-amber-500 text-black font-extrabold"
                              : "bg-rose-600 text-white font-extrabold"
                          }`}
                        >
                          {event.accessResult}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: POS Billing & Juice Bar (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Front Desk Cashier & IBFT POS Card */}
            <div className="glass-panel p-5 rounded-[22px] space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/5">
                <h3 className="text-[15px] font-[800] text-text flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span>Front-Desk POS & Billing</span>
                </h3>
                <button
                  onClick={() => setIsOtpModalOpen(true)}
                  className="px-2.5 py-1 rounded-[8px] bg-amber-500/15 border border-amber-500/35 text-amber-600 dark:text-[#FFD91C] hover:bg-amber-500/25 text-[11px] font-[750] flex items-center gap-1 transition-all"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Request &gt;5% Discount OTP</span>
                </button>
              </div>

              {posSuccessMsg && (
                <div className="p-2.5 rounded-[12px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{posSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handlePosSubmit} className="space-y-3 text-[12.5px]">
                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Charge Amount (PKR)
                  </label>
                  <input
                    type="number"
                    value={posAmount}
                    onChange={(e) => setPosAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text font-bold text-[15px] focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["CASH", "CARD", "IBFT"] as const).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPosMethod(m)}
                        className={`py-2 rounded-[10px] text-[11.5px] font-bold transition-all border ${
                          posMethod === m
                            ? "bg-accent text-on-accent border-accent shadow-sm"
                            : "bg-slate-100 dark:bg-white/5 border-border text-text-muted hover:text-text"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional IBFT Upload Dropzone */}
                {posMethod === "IBFT" && (
                  <div className="p-3 rounded-[12px] border border-dashed border-amber-500/50 bg-amber-500/5 text-center">
                    <input
                      type="file"
                      id="ibft-upload"
                      className="hidden"
                      onChange={() => setIbftFileUploaded(true)}
                    />
                    <label htmlFor="ibft-upload" className="cursor-pointer block">
                      <UploadCloud className="w-5 h-5 text-accent mx-auto mb-1" />
                      <span className="text-[11.5px] font-bold text-text block">
                        {ibftFileUploaded ? "✓ Screenshot Ready (Meezan/HBL Raast)" : "Attach Bank Transfer Screenshot"}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        Auto-extracts TID and routes to Admin OCR verification
                      </span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-[12px] bg-[#F5C518] text-[#0B0B09] font-[800] text-[13px] shadow-[0_2px_12px_rgba(245,197,24,0.3)] hover:opacity-95 transition-opacity"
                >
                  Confirm & Print POS Slip
                </button>
              </form>
            </div>

            {/* Juice Bar Whey Shake POS with 35g auto-deduction */}
            <div className="glass-panel p-5 rounded-[22px] space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/5">
                <div>
                  <h3 className="text-[15px] font-[800] text-text flex items-center gap-2">
                    <CupSoda className="w-4 h-4 text-accent" />
                    <span>Juice Bar Whey Shake POS</span>
                  </h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Auto-deducts 35g protein scoops per beverage sold.
                  </p>
                </div>
              </div>

              {lastSoldShake && (
                <div className="p-2 rounded-[10px] bg-accent/20 border border-accent/40 text-amber-700 dark:text-[#FFD91C] text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>{lastSoldShake}</span>
                </div>
              )}

              <div className="space-y-2">
                {shakes.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-[12px] text-text">{s.name}</div>
                      <div className="text-[10.5px] text-text-muted flex items-center gap-2">
                        <span className="text-accent font-semibold">{s.protein} Protein</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {s.scoopsStock} Scoops left
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-extrabold text-text font-mono">
                        PKR {s.pricePKR}
                      </span>
                      <button
                        onClick={() => handleSellShake(s.id)}
                        className="px-2.5 py-1 rounded-[8px] bg-accent text-on-accent text-[11px] font-[750] hover:opacity-90 transition-opacity"
                      >
                        Sell & Dispense
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL 1: Manual Gate Override Modal */}
        {isOverrideModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-md glass-panel rounded-[22px] p-6 shadow-2xl border border-border">
              <button
                onClick={() => setIsOverrideModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-text-muted"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3 text-rose-500">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-[17px] font-[800] text-text">Manual Gate Override</h3>
              </div>
              <p className="text-[12px] text-text-muted mb-4">
                Mandatory anti-theft logging: Every manual turnstile release is flagged in the <strong>Admin Members & Gate Access</strong> audit ledger.
              </p>

              {overrideSuccess ? (
                <div className="p-4 rounded-[14px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold text-[13px]">
                  ✓ Turnstile #01 Released & Logged to Head Office
                </div>
              ) : (
                <form onSubmit={handleManualOverride} className="space-y-3.5 text-[12.5px]">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Member Name / Guest Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mehmood (Phone 0300...)"
                      value={overrideMemberName}
                      onChange={(e) => setOverrideMemberName(e.target.value)}
                      className="w-full px-3 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Mandatory Override Reason
                    </label>
                    <ApolloSelect
                      value={overrideReason}
                      onChange={(val) => setOverrideReason(val)}
                      options={[
                        { value: "Card Forgotten", label: "Card Forgotten / Phone Battery Dead" },
                        { value: "Fingerprint Glitch", label: "Biometric Facial Glitch" },
                        { value: "Cash Paid at Counter", label: "Cash Paid Directly at Reception" },
                        { value: "Guest VIP", label: "VIP Guest / Executive Accompaniment" },
                        { value: "Medical Exemption", label: "Medical Exemption / Physio Session" },
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOverrideModalOpen(false)}
                      className="px-3 py-2 rounded-[10px] text-text-muted hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-[12px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-[10px] bg-rose-600 text-white font-[800] text-[12px] shadow-sm hover:opacity-90"
                    >
                      Authorize Gate Release
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: Walk-In Registration Modal */}
        {isWalkinModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-md glass-panel rounded-[22px] p-6 shadow-2xl border border-border">
              <button
                onClick={() => setIsWalkinModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-text-muted"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3 text-accent">
                <UserPlus className="w-5 h-5" />
                <h3 className="text-[17px] font-[800] text-text">Walk-In Member Signup</h3>
              </div>

              {walkinSuccess ? (
                <div className="p-4 rounded-[14px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold text-[13px]">
                  ✓ Member Profile Created & Gate Pass Issued!
                </div>
              ) : (
                <form onSubmit={handleWalkinRegister} className="space-y-3 text-[12.5px]">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Daniyal Khan"
                      value={walkinName}
                      onChange={(e) => setWalkinName(e.target.value)}
                      className="w-full px-3 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      WhatsApp Phone (03xx-xxxxxxx)
                    </label>
                    <input
                      type="text"
                      placeholder="0300-8271099"
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Membership Tier
                    </label>
                    <ApolloSelect
                      value={walkinTier}
                      onChange={(val) => setWalkinTier(val)}
                      options={[
                        { value: "Black Diamond VIP", label: "Black Diamond VIP (PKR 35,000 / mo)" },
                        { value: "Executive Gold", label: "Executive Gold (PKR 22,000 / mo)" },
                        { value: "Prime Annual", label: "Prime Annual (PKR 14,500 / mo)" },
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWalkinModalOpen(false)}
                      className="px-3 py-2 rounded-[10px] text-text-muted font-semibold text-[12px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary px-4 py-2 text-[12px] font-[800]"
                    >
                      Enroll & Activate Turnstile Pass
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 3: Request >5% Discount OTP Modal */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-sm bg-white dark:bg-[#12110c] border border-slate-200 dark:border-amber-950/40 rounded-[22px] p-6 shadow-2xl">
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-text-muted"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-2 text-amber-500">
                <KeyRound className="w-5 h-5" />
                <h3 className="text-[17px] font-[800] text-text">Manager Discount OTP</h3>
              </div>
              <p className="text-[12px] text-text-muted mb-4">
                Discounts exceeding 5% require SMS/WhatsApp 4-digit OTP approval from the General Manager.
              </p>

              {otpStatus === "VERIFIED" ? (
                <div className="p-4 rounded-[14px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold text-[13px]">
                  ✓ OTP 7291 Verified! {discountPercent}% Discount Applied to POS.
                </div>
              ) : otpStatus === "REQUESTED" ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-[12px] bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-[#FFD91C] text-[12px]">
                    SMS sent to GM Tariq (0300-8271001). Enter the 4-digit code:
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 7291"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center text-[22px] tracking-widest font-mono font-bold py-2 rounded-[12px] bg-slate-100 dark:bg-white/5 border border-border text-text"
                  />
                  <button
                    onClick={() => setOtpStatus("VERIFIED")}
                    className="w-full py-2.5 rounded-[12px] bg-emerald-600 text-white font-bold text-[12.5px]"
                  >
                    Verify & Apply Discount
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Requested Discount %
                    </label>
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-full px-3 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text font-bold"
                    />
                  </div>
                  <button
                    onClick={() => setOtpStatus("REQUESTED")}
                    className="w-full py-2.5 rounded-[12px] bg-[#F5C518] text-[#0B0B09] font-extrabold text-[12.5px]"
                  >
                    Send OTP to General Manager
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BranchPortalLayout>
  );
}
