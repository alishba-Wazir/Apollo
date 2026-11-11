"use client";

import React, { useState } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import {
  Coins,
  Banknote,
  Receipt,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  FileCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface KiryanaSlip {
  id: string;
  vendor: string;
  category: "Cleaning & Chemicals" | "Fresh Mint & Lemons" | "Staff Iftar Refreshments" | "Towel Laundry";
  amountPKR: number;
  ocrConfidence: number;
  extractedDate: string;
  status: "AUDITED" | "PENDING_ADMIN";
}

const INITIAL_KIRYANA_SLIPS: KiryanaSlip[] = [
  {
    id: "ks-01",
    vendor: "Al-Madina Kiryana Store (Urdu)",
    category: "Fresh Mint & Lemons",
    amountPKR: 1450,
    ocrConfidence: 98.4,
    extractedDate: "Today, 11:20 PKT",
    status: "AUDITED",
  },
  {
    id: "ks-02",
    vendor: "Metro Cash & Carry",
    category: "Cleaning & Chemicals",
    amountPKR: 8200,
    ocrConfidence: 99.1,
    extractedDate: "Today, 14:05 PKT",
    status: "AUDITED",
  },
  {
    id: "ks-03",
    vendor: "Karachi D-Ground Dry Cleaners",
    category: "Towel Laundry",
    amountPKR: 3500,
    ocrConfidence: 96.7,
    extractedDate: "Today, 16:30 PKT",
    status: "PENDING_ADMIN",
  },
];

export default function BranchClosingPage() {
  const { user } = useAuth();

  // Drawer Reconciliation State
  const [systemPosCash] = useState(68500); // Expected from POS
  const [walkinCash] = useState(25000);   // Expected from Walkins
  const expectedTotal = systemPosCash + walkinCash;

  const [physicalCashInput, setPhysicalCashInput] = useState("93500");
  const physicalAmount = Number(physicalCashInput) || 0;
  const variance = physicalAmount - expectedTotal;

  // Deposit slip upload
  const [depositSlipAttached, setDepositSlipAttached] = useState(false);
  const [reconciliationSaved, setReconciliationSaved] = useState(false);

  // Kiryana OCR State
  const [slips, setSlips] = useState<KiryanaSlip[]>(INITIAL_KIRYANA_SLIPS);
  const [isScanningSlip, setIsScanningSlip] = useState(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string | null>(null);

  const handleReconcileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReconciliationSaved(true);
    setTimeout(() => setReconciliationSaved(false), 4000);
  };

  const handleSimulateOcrUpload = () => {
    setIsScanningSlip(true);
    setTimeout(() => {
      const newSlip: KiryanaSlip = {
        id: `ks-${Date.now()}`,
        vendor: "Bismillah General Store (Rawalpindi)",
        category: "Staff Iftar Refreshments",
        amountPKR: 2150,
        ocrConfidence: 97.8,
        extractedDate: "Just now",
        status: "PENDING_ADMIN",
      };
      setSlips([newSlip, ...slips]);
      setIsScanningSlip(false);
      setOcrSuccessMsg("Urdu/English receipt scanned: Extracted PKR 2,150 (Confidence: 97.8%). Pushed to Admin Finance.");
      setTimeout(() => setOcrSuccessMsg(null), 5000);
    }, 1500);
  };

  return (
    <BranchPortalLayout activeItem="closing">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Shift Cash Closing & Petty Cash OCR</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Shift #02 • {user?.branchName || "TRI FIT Seaview Flagship"}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Reconcile physical cash drawer with POS telemetry and upload bilingual Kiryana receipts
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Expected Cash</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                PKR {expectedTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Drawer Closing on Left | Kiryana Slip OCR on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Cash Drawer Reconciliation (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-5 rounded-[18px] border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-[800] text-text flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-accent" />
                  <span>Cash Drawer Reconciliation</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  SHUTDOWN READY
                </span>
              </div>

              {reconciliationSaved && (
                <div className="p-3 rounded-[12px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12.5px] font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Closing report signed and submitted to Head Office Finance ledger!</span>
                </div>
              )}

              {/* Breakdown Cards */}
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                  <span className="text-text-muted text-[11px] block">POS Member Cash</span>
                  <span className="text-[16px] font-[800] text-text font-mono mt-0.5 block">
                    PKR {systemPosCash.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                  <span className="text-text-muted text-[11px] block">Walk-In & Shake Bar Cash</span>
                  <span className="text-[16px] font-[800] text-text font-mono mt-0.5 block">
                    PKR {walkinCash.toLocaleString()}
                  </span>
                </div>
              </div>

              <form onSubmit={handleReconcileSubmit} className="space-y-4 text-[12.5px]">
                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Counted Physical Cash in Drawer (PKR)
                  </label>
                  <input
                    type="number"
                    value={physicalCashInput}
                    onChange={(e) => setPhysicalCashInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-[11px] bg-slate-100 dark:bg-white/5 border border-border text-text font-bold text-[16px] focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                {/* Variance Indicator */}
                <div className={`p-3 rounded-[12px] border flex items-center justify-between ${
                  variance === 0
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : variance > 0
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                }`}>
                  <div className="flex items-center gap-2">
                    {variance === 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span className="font-bold">
                      {variance === 0 ? "Drawer Perfectly Balanced" : variance > 0 ? "Cash Surplus Detected" : "Cash Deficit Alert"}
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-[14px]">
                    {variance > 0 ? `+PKR ${variance.toLocaleString()}` : variance < 0 ? `-PKR ${Math.abs(variance).toLocaleString()}` : "PKR 0 Variance"}
                  </span>
                </div>

                {/* Deposit Slip Upload */}
                <div className="p-3.5 rounded-[14px] border border-dashed border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/[0.02] text-center">
                  <input
                    type="file"
                    id="deposit-slip"
                    className="hidden"
                    onChange={() => setDepositSlipAttached(true)}
                  />
                  <label htmlFor="deposit-slip" className="cursor-pointer block">
                    <UploadCloud className="w-6 h-6 text-accent mx-auto mb-1.5" />
                    <span className="text-[12px] font-bold text-text block">
                      {depositSlipAttached ? "✓ Meezan Bank Deposit Slip Attached" : "Upload Bank Deposit Cash Slip"}
                    </span>
                    <span className="text-[10.5px] text-text-muted">
                      Attach stamped counter slip before locking shift
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-[12px] bg-[#F5C518] text-[#0B0B09] font-[800] text-[13px] shadow-[0_2px_12px_rgba(245,197,24,0.3)] hover:opacity-95"
                >
                  Finalize & Sign Shift Cash Closing
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Kiryana / Petty Cash OCR (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-5 rounded-[18px] border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-[800] text-text flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-accent" />
                    <span>Petty Cash / Kiryana OCR Ledger</span>
                  </h3>
                  <p className="text-[11.5px] text-text-muted mt-0.5">
                    Bilingual Urdu & English receipt parser auto-feeding into /admin/finance.
                  </p>
                </div>

                <button
                  onClick={handleSimulateOcrUpload}
                  disabled={isScanningSlip}
                  className="px-3 py-1.5 rounded-[10px] bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                >
                  {isScanningSlip ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning Slip...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>+ Scan New Receipt</span>
                    </>
                  )}
                </button>
              </div>

              {ocrSuccessMsg && (
                <div className="p-2.5 rounded-[12px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{ocrSuccessMsg}</span>
                </div>
              )}

              {/* Scanned Slips Feed */}
              <div className="space-y-2.5">
                {slips.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-[14px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-[13px] text-text">{s.vendor}</div>
                      <div className="text-[11px] text-text-muted flex items-center gap-2 mt-0.5">
                        <span className="text-accent font-semibold">{s.category}</span>
                        <span>•</span>
                        <span>{s.extractedDate}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-extrabold text-[14px] text-text">
                        PKR {s.amountPKR.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] justify-end mt-0.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {s.ocrConfidence}% OCR
                        </span>
                        <span>•</span>
                        <span
                          className={`font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            s.status === "AUDITED"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/15 text-amber-600 dark:text-[#FFD91C]"
                          }`}
                        >
                          {s.status === "AUDITED" ? "Audited" : "Pending Head Office"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BranchPortalLayout>
  );
}
