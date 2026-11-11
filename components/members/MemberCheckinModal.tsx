"use client";

import React, { useState } from "react";
import {
  X,
  QrCode,
  Search,
  CheckCircle2,
  ScanLine,
  ArrowRight,
  LogOut,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { useApolloStore } from "@/lib/apollo-demo-store";
import { ApolloSelect } from "@/components/ui/ApolloSelect";

interface MemberCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberCheckinModal: React.FC<MemberCheckinModalProps> = ({ isOpen, onClose }) => {
  const { members, branches, checkInMember, checkOutMember } = useApolloStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGate, setSelectedGate] = useState("Turnstile Gate Alpha");
  const [activeCheckinMode, setActiveCheckinMode] = useState<"MANUAL" | "QR_SIMULATION">("MANUAL");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredMembers = searchQuery.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.memberCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.phone.includes(searchQuery)
      )
    : members.slice(0, 6);

  const handleCheckIn = (memberId: string) => {
    const record = checkInMember(memberId, selectedGate, activeCheckinMode === "QR_SIMULATION" ? "QR_CODE" : "MANUAL_DESK");
    if (record) {
      setSuccessMsg(`Gate pass verified! ${record.memberName} checked in at ${record.gateName}.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleCheckOut = (memberId: string, name: string) => {
    checkOutMember(memberId);
    setSuccessMsg(`Checkout logged for ${name}.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0D0D0B] text-text border border-slate-200 dark:border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent text-on-accent font-bold">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-extrabold text-text">Member Turnstile Gate Pass</h3>
              <p className="text-[11.5px] text-text-muted">Biometric & QR Code Fast Check-in Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[12.5px] font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
            <button
              onClick={() => setActiveCheckinMode("MANUAL")}
              className={`py-2 rounded-lg text-[12px] font-bold transition-all ${
                activeCheckinMode === "MANUAL"
                  ? "bg-accent text-on-accent shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Manual Search Check-in
            </button>
            <button
              onClick={() => setActiveCheckinMode("QR_SIMULATION")}
              className={`py-2 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeCheckinMode === "QR_SIMULATION"
                  ? "bg-accent text-on-accent shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Scanner Simulation</span>
            </button>
          </div>

          {/* Gate Lane Picker */}
          <div>
            <label className="block text-[12px] font-bold text-text-muted mb-1">
              Active Turnstile Gate:
            </label>
            <ApolloSelect
              value={selectedGate}
              onChange={(val) => setSelectedGate(val)}
              options={[
                { value: "Turnstile Gate Alpha", label: "Turnstile Gate Alpha (Main Entry)" },
                { value: "Turnstile Gate Bravo", label: "Turnstile Gate Bravo (Cardio Loft)" },
                { value: "Ladies Studio Gate", label: "Ladies Studio Gate (Private)" },
                { value: "Executive Gate 01", label: "Executive Gate 01 (VIP Zone)" },
              ]}
              className="w-full"
            />
          </div>

          {/* QR Simulation Visualizer */}
          {activeCheckinMode === "QR_SIMULATION" && (
            <div className="p-5 rounded-2xl bg-black/40 border border-accent/40 text-center space-y-3">
              <div className="w-32 h-32 mx-auto rounded-2xl bg-white p-3 shadow-inner flex items-center justify-center border-2 border-accent relative overflow-hidden">
                <QrCode className="w-full h-full text-black" />
                <div className="absolute inset-x-0 h-1 bg-accent/80 animate-bounce shadow-md" />
              </div>
              <div>
                <span className="text-[12.5px] font-bold text-text block">Optical Scanner Armed</span>
                <span className="text-[11px] text-text-muted">Instant QR verification for turnstile gate pass</span>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => handleCheckIn(members[0]?.id || "mem-01")}
                  className="px-3 py-1.5 rounded-xl bg-accent text-on-accent text-[12px] font-bold hover:bg-accent/90"
                >
                  Scan Zaid Khan QR Pass
                </button>
                <button
                  onClick={() => handleCheckIn(members[1]?.id || "mem-02")}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-[12px] font-bold hover:bg-white/20"
                >
                  Scan Ayesha Malik QR
                </button>
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member by name, code (e.g. TF-10201), or phone..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-border text-[12.5px] text-text placeholder-text-muted"
            />
          </div>

          {/* Member List for Check-in / Check-out */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Eligible Members:
            </span>
            {filteredMembers.map((m) => {
              const isInClub = m.lastCheckin?.startsWith("Today") && !m.lastCheckedOut;
              const isExpired = m.status === "EXPIRED";

              return (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between gap-3 hover:border-accent/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-text">{m.name}</span>
                        <span className="text-[10px] font-mono px-1.5 rounded bg-white/10 text-accent font-bold">
                          {m.memberCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {m.status} • {m.fitnessGoal}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isInClub ? (
                      <button
                        onClick={() => handleCheckOut(m.id, m.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11.5px] font-bold hover:bg-rose-500/30 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Checkout</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(m.id)}
                        disabled={isExpired}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-bold transition-all ${
                          isExpired
                            ? "bg-neutral-500/20 text-neutral-400 cursor-not-allowed"
                            : "bg-accent text-on-accent shadow-sm hover:bg-accent/90"
                        }`}
                      >
                        <ScanLine className="w-3.5 h-3.5" />
                        <span>Check In Gate</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between text-[11.5px] text-text-muted">
          <span>TriFit Biometric Integration</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 text-text font-bold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
