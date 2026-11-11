"use client";

import React, { useState } from "react";
import { MemberPortalLayout } from "@/components/layout/MemberPortalLayout";
import { ApolloSelect } from "@/components/ui/ApolloSelect";
import { StatCard } from "@/components/ui/StatCard";
import {
  CreditCard,
  UploadCloud,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  PauseCircle,
  Building2,
  Copy,
  Sparkles,
  X,
  Clock,
  ShieldCheck,
  ChevronRight,
  Wallet,
  Coffee,
} from "lucide-react";

interface PaymentHistoryItem {
  id: string;
  month: string;
  date: string;
  amount: string;
  method: string;
  bank: string;
  tid: string;
  status: "VERIFIED" | "PENDING_OCR" | "FAILED";
  invoiceNum: string;
  taxAuth: "SRB" | "FBR";
}

const PAST_INVOICES: PaymentHistoryItem[] = [
  {
    id: "PAY-101",
    month: "October 2026",
    date: "Oct 24, 2026",
    amount: "PKR 36,200",
    method: "IBFT Online",
    bank: "Meezan Bank",
    tid: "MEZ-99401928",
    status: "VERIFIED",
    invoiceNum: "TF-INV-2026-1049",
    taxAuth: "SRB",
  },
  {
    id: "PAY-102",
    month: "September 2026",
    date: "Sep 25, 2026",
    amount: "PKR 35,000",
    method: "Raast P2M",
    bank: "HBL Raast",
    tid: "RST-88192044",
    status: "VERIFIED",
    invoiceNum: "TF-INV-2026-0922",
    taxAuth: "SRB",
  },
  {
    id: "PAY-103",
    month: "August 2026",
    date: "Aug 23, 2026",
    amount: "PKR 35,000",
    method: "IBFT Online",
    bank: "Bank Alfalah",
    tid: "ALF-77182903",
    status: "VERIFIED",
    invoiceNum: "TF-INV-2026-0814",
    taxAuth: "SRB",
  },
];

export default function MemberDuesPage() {
  const [history, setHistory] = useState<PaymentHistoryItem[]>(PAST_INVOICES);
  const [memberData, setMemberData] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState("Meezan Bank");
  const [tidInput, setTidInput] = useState("");
  const [fileAttached, setFileAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  React.useEffect(() => {
    async function loadMemberDues() {
      try {
        const res = await fetch("/api/member/me");
        if (res.ok) {
          const data = await res.json();
          if (data.member) {
            setMemberData(data.member);
            if (data.member.payments && data.member.payments.length > 0) {
              const mapped = data.member.payments.map((p: any, idx: number) => ({
                id: `PAY-${p.id.substring(0, 6)}`,
                month: new Date(p.createdAt).toLocaleDateString("en-PK", { month: "long", year: "numeric" }),
                date: new Date(p.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" }),
                amount: `PKR ${p.amountPKR.toLocaleString()}`,
                method: p.method,
                bank: p.bankName || "Meezan Bank",
                tid: p.tid || `TID-${idx + 1000}`,
                status: p.status === "APPROVED" ? "VERIFIED" : "PENDING_OCR",
                invoiceNum: `TF-INV-${p.id.substring(0, 8).toUpperCase()}`,
                taxAuth: "SRB",
              }));
              setHistory(mapped);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load member dues:", e);
      }
    }
    loadMemberDues();
  }, []);

  // Freeze Modal State
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [freezeDuration, setFreezeDuration] = useState("30");
  const [freezeReason, setFreezeReason] = useState("Travel / Umrah");
  const [freezeSubmitted, setFreezeSubmitted] = useState(false);

  const handleCopyIban = () => {
    navigator.clipboard?.writeText("PK64MEZN00010009848101");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleIbftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tidInput && !fileAttached) return;

    setIsSubmitting(true);
    const generatedTid = tidInput.trim() || `TID-${Math.floor(10000000 + Math.random() * 90000000)}`;

    try {
      await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: memberData?.id,
          branchId: memberData?.branchId,
          bankName: selectedBank,
          tid: generatedTid,
          amountPKR: 36850,
          description: "Monthly Membership Dues & Shake Bar",
        }),
      });
    } catch (err) {
      console.error("Failed to post payment to finance API:", err);
    }

    const now = new Date();
    const formattedDate = `Today, ${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    const formattedMonth = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const newPayment: PaymentHistoryItem = {
      id: `PAY-${Date.now()}`,
      month: formattedMonth,
      date: formattedDate,
      amount: "PKR 36,850",
      method: "IBFT OCR Queue",
      bank: selectedBank,
      tid: generatedTid,
      status: "PENDING_OCR",
      invoiceNum: `TF-INV-${now.getFullYear()}-${Math.floor(1100 + Math.random() * 800)}`,
      taxAuth: "SRB",
    };

    setHistory([newPayment, ...history]);
    setIsSubmitting(false);
    setUploadSuccess(true);
    setTidInput("");
    setFileAttached(false);
  };

  const handleFreezeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFreezeSubmitted(true);
    setTimeout(() => {
      setShowFreezeModal(false);
      setFreezeSubmitted(false);
    }, 2000);
  };

  return (
    <MemberPortalLayout activeItem="dues">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              My Dues & IBFT Payment
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
              Review monthly membership tier, shake bar ledger & submit IBFT/Raast payment slips
            </p>
          </div>

          <button
            onClick={() => setShowFreezeModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-border text-xs font-bold text-text hover:border-accent shadow-sm transition-all self-start sm:self-auto"
          >
            <PauseCircle className="w-4 h-4 text-amber-500" />
            Freeze Membership
          </button>
        </div>

        {/* Compact 4-Card Billing & Membership Strip — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Membership Tier"
            value="Black Diamond"
            icon={ShieldCheck}
            variant="warning"
            sparklineData={[1, 1, 1, 1, 1]}
            sparklineColor="#FFD91C"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                VIP Tier 1
              </span>
            }
            footerRight="Reciprocal 4 Clubs"
          />

          <StatCard
            title="Monthly Membership Dues"
            value="PKR 35,000"
            icon={Wallet}
            variant="warning"
            sparklineData={[35000, 35000, 35000, 35000]}
            sparklineColor="#F59E0B"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                Due Today (Nov 9)
              </span>
            }
            footerRight="FBR/SRB Invoiced"
          />

          <StatCard
            title="Unbilled Shake Bar"
            value="PKR 1,850"
            icon={Coffee}
            variant="warning"
            sparklineData={[600, 950, 1400, 1850]}
            sparklineColor="#FBBF24"
            footerLeft={
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                4 Protein Shakes
              </span>
            }
            footerRight="Juice Bar POS"
          />

          <StatCard
            title="Total Outstanding"
            value="PKR 36,850"
            icon={CreditCard}
            variant="warning"
            sparklineData={[30000, 32000, 35000, 36850]}
            sparklineColor="#EAB308"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                Pending IBFT
              </span>
            }
            footerRight="Raast / 1LINK"
          />
        </div>

        {/* Payable Breakdown & Bank Account Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Outstanding Balance Breakdown */}
          <div className="lg:col-span-5 glass-panel p-5 rounded-[22px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-[#F5C518]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Current Payable Balance
                    </h3>
                    <p className="text-[10.5px] text-slate-400">November 2026 Statement</p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#F5C518] border border-amber-500/30">
                  UNPAID
                </span>
              </div>

              <div className="py-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-neutral-300">
                  <span>Black Diamond Monthly Dues</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    PKR 35,000
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-neutral-300">
                  <span>Juice Bar Tab (Whey Protein Scoops)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    PKR 1,850
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>SRB Sindh Sales Tax (Included)</span>
                  <span className="font-mono">13% SRB POS</span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between items-baseline">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    Total Amount Due
                  </span>
                  <span className="text-xl font-black text-amber-600 dark:text-[#FFD91C] font-mono">
                    PKR 36,850
                  </span>
                </div>
              </div>
            </div>

            {/* Official Bank Account for Transfer */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-neutral-200">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  Meezan Bank - TriFit Fitness Pvt Ltd
                </div>
                <button
                  onClick={handleCopyIban}
                  className="text-[10px] font-bold text-amber-600 dark:text-[#F5C518] flex items-center gap-1 hover:underline"
                >
                  <Copy className="w-3 h-3" />
                  {copiedBank ? "Copied!" : "Copy IBAN"}
                </button>
              </div>

              <div className="font-mono text-[11px] text-slate-600 dark:text-neutral-300">
                IBAN: <strong>PK64MEZN00010009848101</strong>
                <br />
                Raast ID: <strong>trifit@raast</strong>
              </div>
            </div>
          </div>

          {/* 1-Click IBFT Upload Form */}
          <div className="lg:col-span-7 glass-panel p-5 rounded-[22px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Upload IBFT / Raast Transfer Receipt
                    </h3>
                    <p className="text-[10.5px] text-slate-400">
                      Automatic OCR verification pushed to Admin Finance queue
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI OCR Ready
                </span>
              </div>

              {uploadSuccess ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Transfer Receipt Queued for Approval
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
                    Your payment receipt was transmitted to <strong>/admin/finance</strong>. Once verified by the finance desk, your receipt and gate pass will automatically reflect verified status.
                  </p>
                  <button
                    onClick={() => setUploadSuccess(false)}
                    className="mt-2 text-xs font-bold text-amber-600 dark:text-[#F5C518] hover:underline"
                  >
                    Submit another receipt
                  </button>
                </div>
              ) : (
                <form onSubmit={handleIbftSubmit} className="space-y-3.5 mt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                        Originating Bank
                      </label>
                      <ApolloSelect
                        value={selectedBank}
                        onChange={(val) => setSelectedBank(val)}
                        options={[
                          { value: "Meezan Bank", label: "Meezan Bank" },
                          { value: "Habib Bank Ltd (HBL)", label: "Habib Bank Ltd (HBL)" },
                          { value: "Bank Alfalah", label: "Bank Alfalah" },
                          { value: "Standard Chartered", label: "Standard Chartered" },
                          { value: "Raast P2M", label: "Raast Instant Payment" },
                          { value: "JazzCash / Nayapay", label: "JazzCash / Nayapay" },
                        ]}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                        Bank Transaction ID (TID)
                      </label>
                      <input
                        type="text"
                        value={tidInput}
                        onChange={(e) => setTidInput(e.target.value)}
                        placeholder="e.g. MEZ-99401928 (or let OCR detect)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Dropzone Simulation */}
                  <div
                    onClick={() => setFileAttached(!fileAttached)}
                    className={`p-4 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all ${
                      fileAttached
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                        : "border-slate-300 dark:border-white/10 hover:border-amber-500/50 bg-slate-50/50 dark:bg-black/20"
                    }`}
                  >
                    <UploadCloud className="w-6 h-6 mx-auto mb-1 text-amber-500" />
                    <p className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                      {fileAttached
                        ? "✓ ibft_screenshot_meezan_nov.png attached (Ready for OCR)"
                        : "Drag & drop your IBFT transfer screenshot here"}
                    </p>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">
                      Supports JPG, PNG or PDF payment receipt
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Auto-matches with Meezan Statement
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting || (!tidInput && !fileAttached)}
                      className="px-5 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#eab308] text-[#0B0B09] font-black text-xs shadow-md transition-all disabled:opacity-40"
                    >
                      {isSubmitting ? "Running OCR..." : "Submit Receipt for OCR"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Invoice History & Tax Receipts */}
        <div className="glass-panel p-5 rounded-[22px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/5">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Payment History & FBR / SRB Invoices
              </h3>
              <p className="text-xs text-slate-400">
                Official fiscalized receipts and verified bank transaction logs
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 text-[10.5px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Billing Cycle</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Bank & TID</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Tax Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {history.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                      {inv.month}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-neutral-300">
                      {inv.date}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.amount}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 dark:text-neutral-200 block">
                        {inv.bank}
                      </span>
                      <span className="font-mono text-[10.5px] text-slate-400">
                        {inv.tid}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {inv.status === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#F5C518] border border-amber-500/30">
                          <Clock className="w-3 h-3" /> OCR QUEUE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert(`Downloading FBR/SRB tax invoice ${inv.invoiceNum}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-[#F5C518] hover:text-[#0B0B09] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        {inv.taxAuth} PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Freeze Membership */}
        {showFreezeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md glass-panel rounded-[22px] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <PauseCircle className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Request Membership Freeze
                    </h3>
                    <p className="text-xs text-slate-400">Pause billing and gate access</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFreezeModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {freezeSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Freeze Request Submitted
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Your Black Diamond membership will pause for {freezeDuration} days starting next billing cycle.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFreezeSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                      Freeze Duration
                    </label>
                    <ApolloSelect
                      value={freezeDuration}
                      onChange={(val) => setFreezeDuration(val)}
                      options={[
                        { value: "15", label: "15 Days (Complimentary)" },
                        { value: "30", label: "30 Days (Complimentary VIP Freeze)" },
                        { value: "45", label: "45 Days (Extended)" },
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                      Reason for Pause
                    </label>
                    <ApolloSelect
                      value={freezeReason}
                      onChange={(val) => setFreezeReason(val)}
                      options={[
                        { value: "Travel / Umrah", label: "Travel / Umrah Pilgrimage" },
                        { value: "Medical / Injury", label: "Medical / Injury Recovery" },
                        { value: "Work Assignment", label: "Official Work Assignment Outside City" },
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-[#FFD91C]">
                    Black Diamond VIP members receive 30 days complimentary freeze per calendar year without maintenance charges.
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowFreezeModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#F5C518] hover:bg-[#eab308] text-[#0B0B09] font-black text-xs shadow-md"
                    >
                      Confirm Freeze
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
}
