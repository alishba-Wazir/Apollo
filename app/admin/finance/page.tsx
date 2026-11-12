"use client";

import React, { useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  Wallet,
  Building2,
  TrendingUp,
  Receipt,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  QrCode,
  Eye,
  Check,
  Flag,
  Sparkles,
  ShoppingBag,
  Plus,
  X,
  Search,
  Filter,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatCard } from "@/components/ui/StatCard";

interface IbftItem {
  id: string;
  memberName: string;
  phone: string;
  branch: string;
  bank: "Meezan Bank" | "HBL" | "Bank Alfalah" | "Raast / EasyPaisa";
  tid: string;
  amountPKR: number;
  ocrConfidence: number;
  uploadedAt: string;
  status: "PENDING" | "APPROVED" | "FLAGGED";
  receiptImgPreviewText: string;
  paymentId?: string;
}

interface KiryanaItem {
  id: string;
  branch: string;
  date: string;
  vendor: string;
  items: string;
  amountPKR: number;
  ocrConfidence: number;
  status: "APPROVED" | "PENDING_AUDIT";
}

export default function AdminFinancePage() {
  const [activeFinanceTab, setActiveFinanceTab] = useState<"kpis" | "ibft" | "kiryana">("ibft");
  const [selectedReceipt, setSelectedReceipt] = useState<IbftItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterBank, setFilterBank] = useState("ALL");

  // Kiryana modal
  const [isKiryanaModalOpen, setIsKiryanaModalOpen] = useState(false);
  const [newKiryanaBranch, setNewKiryanaBranch] = useState("Seaview Flagship");
  const [newKiryanaVendor, setNewKiryanaVendor] = useState("");
  const [newKiryanaItems, setNewKiryanaItems] = useState("");
  const [newKiryanaAmount, setNewKiryanaAmount] = useState("");

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [ibftQueue, setIbftQueue] = useState<IbftItem[]>([
    {
      id: "IBFT-4091",
      memberName: "Hamza Tariq",
      phone: "0300-8271001",
      branch: "Seaview Flagship (DHA)",
      bank: "Meezan Bank",
      tid: "MEZN-9982410982",
      amountPKR: 45000,
      ocrConfidence: 99.2,
      uploadedAt: "18:42 PKT",
      status: "PENDING",
      receiptImgPreviewText: "Meezan Bank Raast Interbank Transfer. Beneficiary: TRI FIT FITNESS (PVT) LTD. A/C: 01020109982. Amount: PKR 45,000.00. Ref: MEZN-9982410982. Date: 06-NOV-2026 18:41 PKT.",
    },
    {
      id: "IBFT-4090",
      memberName: "Ayesha Siddiqui",
      phone: "0321-4455667",
      branch: "LuckyOne Mall",
      bank: "HBL",
      tid: "HBL-PK-88192301",
      amountPKR: 25000,
      ocrConfidence: 96.5,
      uploadedAt: "18:25 PKT",
      status: "PENDING",
      receiptImgPreviewText: "Habib Bank Ltd Digital Slip. To: TRI FIT CLUB REVENUE. Amount: PKR 25,000. Status: SUCCESS. Transaction ID: HBL-PK-88192301. Date: 06-11-2026.",
    },
    {
      id: "IBFT-4089",
      memberName: "Daniyal Khan",
      phone: "0333-5129033",
      branch: "AJ Tower (Islamabad)",
      bank: "Bank Alfalah",
      tid: "ALF-55829104",
      amountPKR: 120000,
      ocrConfidence: 91.0,
      uploadedAt: "17:50 PKT",
      status: "PENDING",
      receiptImgPreviewText: "Bank Alfalah Alfa Transfer. Transaction Ref: ALF-55829104. Paid To: TRI FIT ISLAMABAD BRANCH. Total: PKR 120,000.00. Channel: 1LINK Raast.",
    },
    {
      id: "IBFT-4088",
      memberName: "Zainab Malik",
      phone: "0312-3344556",
      branch: "Clifton",
      bank: "Raast / EasyPaisa",
      tid: "RST-33819022",
      amountPKR: 35000,
      ocrConfidence: 74.1,
      uploadedAt: "17:15 PKT",
      status: "PENDING",
      receiptImgPreviewText: "Raast Instant Payment. Trx ID: RST-33819022. Sender: 03123344556. Receiver: TRI FIT CLIFTON. Amount: PKR 35,000. Date: 06 Nov 2026 17:14.",
    },
    {
      id: "IBFT-4087",
      memberName: "Mustafa Qureshi",
      phone: "0345-9988112",
      branch: "Seaview Flagship (DHA)",
      bank: "Meezan Bank",
      tid: "MEZN-11928471",
      amountPKR: 65000,
      ocrConfidence: 99.8,
      uploadedAt: "16:30 PKT",
      status: "APPROVED",
      receiptImgPreviewText: "Meezan Bank Slip verified automatically via open banking API.",
    },
  ]);

  const [financeData, setFinanceData] = useState<any>(null);

  React.useEffect(() => {
    async function loadFinance() {
      try {
        const res = await fetch("/api/finance");
        if (res.ok) {
          const data = await res.json();
          setFinanceData(data);
          if (data.ibftQueue && data.ibftQueue.length > 0) {
            setIbftQueue(data.ibftQueue);
          }
        }
      } catch (e) {
        console.error("Failed to fetch finance data:", e);
      }
    }
    loadFinance();
  }, []);

  const totalRevPKR = financeData?.totalRevenuePKR ?? 4756850;
  const totalRevDisplay = `PKR ${(totalRevPKR / 1000000).toFixed(2)}M`;
  const ibftTotalPKR = ibftQueue.reduce((acc, i) => acc + i.amountPKR, 0);
  const ibftDisplay = `PKR ${(ibftTotalPKR / 1000000).toFixed(2)}M`;
  const posTotalPKR = Math.max(0, totalRevPKR - ibftTotalPKR);
  const posDisplay = `PKR ${(posTotalPKR / 1000000).toFixed(2)}M`;

  // 2. Kiryana / Petty Cash Ledger
  const [kiryanaLedger, setKiryanaLedger] = useState<KiryanaItem[]>([
    {
      id: "KIR-801",
      branch: "Seaview Flagship",
      date: "Nov 06, 2026",
      vendor: "Al-Madina General Store & Kiryana (DHA)",
      items: "Nestlé Pure Life 19L Water Bulk (12 Gallons) + Fresh Mint & Lemons for Protein Bar",
      amountPKR: 8500,
      ocrConfidence: 98.4,
      status: "APPROVED",
    },
    {
      id: "KIR-802",
      branch: "LuckyOne Mall",
      date: "Nov 06, 2026",
      vendor: "Super Cleaners Laundry & Detergents",
      items: "Commercial Towel Laundry Wash & Bleach Sanitizer (Batch #44)",
      amountPKR: 14200,
      ocrConfidence: 95.1,
      status: "APPROVED",
    },
    {
      id: "KIR-803",
      branch: "AJ Tower (Islamabad)",
      date: "Nov 05, 2026",
      vendor: "Gulberg Greens Hardware & Tools",
      items: "M10 Machine Hex Screws & Silicone Lubricant for Cable Jungle Multi-Station",
      amountPKR: 3450,
      ocrConfidence: 92.0,
      status: "PENDING_AUDIT",
    },
    {
      id: "KIR-804",
      branch: "Clifton",
      date: "Nov 05, 2026",
      vendor: "Zamzama Dry Cleaners",
      items: "Studio Prayer Mats Steam Cleaning & Antiseptic Wash (18 Mats)",
      amountPKR: 6800,
      ocrConfidence: 97.2,
      status: "APPROVED",
    },
  ]);

  const handleApproveIbft = async (id: string, memberName: string, amount: number) => {
    setIbftQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item))
    );
    showNotification(`Approved PKR ${amount.toLocaleString()} for ${memberName}. Subscription extended automatically.`);

    const found = ibftQueue.find((item) => item.id === id);
    if (found?.paymentId) {
      try {
        await fetch("/api/finance", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: found.paymentId, status: "APPROVED" }),
        });
      } catch (e) {
        console.error("Failed to update payment status via API:", e);
      }
    }
  };

  const handleFlagIbft = (id: string, tid: string) => {
    setIbftQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "FLAGGED" } : item))
    );
    showNotification(`Flagged transaction ${tid} for duplicate TID audit.`);
  };

  const handleAddKiryanaSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKiryanaVendor || !newKiryanaAmount) return;

    const newSlip: KiryanaItem = {
      id: `KIR-80${kiryanaLedger.length + 1}`,
      branch: newKiryanaBranch,
      date: "Today, Nov 06",
      vendor: newKiryanaVendor,
      items: newKiryanaItems || "Gym operational supplies",
      amountPKR: Number(newKiryanaAmount),
      ocrConfidence: 96.0,
      status: "PENDING_AUDIT",
    };

    setKiryanaLedger([newSlip, ...kiryanaLedger]);
    setIsKiryanaModalOpen(false);
    setNewKiryanaVendor("");
    setNewKiryanaItems("");
    setNewKiryanaAmount("");
    showNotification(`Kiryana slip for PKR ${newSlip.amountPKR.toLocaleString()} logged and scanned via OCR.`);
  };

  const pendingIbftCount = ibftQueue.filter((i) => i.status === "PENDING").length;

  const filteredIbft = ibftQueue.filter((item) => {
    if (filterBank === "ALL") return true;
    return item.bank === filterBank;
  });

  return (
    <AdminPortalLayout activeItem="finance">
      <div className="space-y-5">
        {/* Unboxed Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Finance, Ledger & OCR Verification</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--text)] border border-[var(--accent)]/30 font-mono">
                All 4 Flagship Clubs
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              PKR 82.4M consolidated network collections, AI bank slip OCR validation, and Club OpEx & Vendor Invoice OCR
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsKiryanaModalOpen(true)}
              className="btn primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Club OpEx & Vendor Invoice OCR</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[var(--chip)] border border-[var(--accent)]/40 text-[var(--text)] text-[13px] font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top KPI Cards: Standardized Compact Revenue Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Consolidated Monthly Revenue"
            value="PKR 82.4M"
            icon={Wallet}
            variant="warning"
            trend={{
              value: "+14.2%",
              isPositive: true,
              label: "vs last month",
            }}
            sparklineData={[68.5, 72.8, 76.2, 79.5, 82.4]}
            sparklineColor="var(--accent)"
            footerRight="All 4 Flagship Clubs"
          />

          <StatCard
            title="IBFT & Raast OCR Collections"
            value="PKR 18.2M"
            icon={Receipt}
            variant="warning"
            sparklineData={[14.5, 15.2, 16.5, 17.8, 18.2]}
            sparklineColor="var(--accent)"
            footerLeft={
              <span className="font-semibold text-[var(--accent)]">
                22.1% of network
              </span>
            }
            footerRight="Raast / 1LINK OCR"
          />

          <StatCard
            title="Front-Desk POS Cards"
            value="PKR 64.2M"
            icon={CreditCard}
            variant="warning"
            sparklineData={[52.2, 55.8, 58.5, 61.1, 64.2]}
            sparklineColor="var(--accent)"
            footerLeft={
              <span className="font-semibold text-[var(--accent)]">
                77.9% of network
              </span>
            }
            footerRight="Visa / Mastercard"
          />

          <StatCard
            title="Fuel Bar & PT Margins"
            value="PKR 15.80M"
            icon={ShoppingBag}
            variant="warning"
            sparklineData={[12.0, 13.5, 14.2, 14.8, 15.8]}
            sparklineColor="var(--accent)"
            footerLeft={
              <span className="font-semibold text-emerald-400">
                68% Gross Margin
              </span>
            }
            footerRight="PKR 11.4M PT + 4.4M Fuel"
          />
        </div>

        {/* 4 Horizontal Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveFinanceTab("ibft")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeFinanceTab === "ibft"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>AI IBFT & Receipt OCR Queue</span>
            {pendingIbftCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--on-accent)] text-[var(--accent)] font-extrabold">
                {pendingIbftCount} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFinanceTab("kiryana")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeFinanceTab === "kiryana"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Club OpEx & Vendor Invoice OCR</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--card)] text-[var(--muted)] font-mono">
              {kiryanaLedger.length} Records
            </span>
          </button>

          <button
            onClick={() => setActiveFinanceTab("margins" as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              (activeFinanceTab as string) === "margins"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Fuel Bar & PT Margin Analytics</span>
          </button>

          <button
            onClick={() => setActiveFinanceTab("kpis")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeFinanceTab === "kpis"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Club-by-Club Target Roster</span>
          </button>
        </div>

        {/* =========================================================================
            SUB-TAB 1: AI IBFT & RECEIPT OCR QUEUE
           ========================================================================= */}
        {activeFinanceTab === "ibft" && (
          <div className="space-y-4">
            <div className="glass p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[var(--muted)]">Filter by Bank:</span>
                {["ALL", "Meezan Bank", "HBL", "Bank Alfalah", "Raast / EasyPaisa"].map((b) => (
                  <button
                    key={b}
                    onClick={() => setFilterBank(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filterBank === b
                        ? "bg-[var(--accent)] text-[var(--on-accent)] font-bold shadow-sm"
                        : "bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[var(--muted)] font-mono">
                AI Pipeline: Gemini Vision Flash OCR (Latency: 280ms)
              </div>
            </div>

            {/* IBFT Verification Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--card)] text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                      <th className="py-3 px-4">Member Name & Branch</th>
                      <th className="py-3 px-4">Bank Provider</th>
                      <th className="py-3 px-4 font-mono">Extracted TID</th>
                      <th className="py-3 px-4 text-right">Extracted Amount</th>
                      <th className="py-3 px-4 text-center">OCR Confidence</th>
                      <th className="py-3 px-4 text-center">Slip Preview</th>
                      <th className="py-3 px-4 text-right">Human Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)] text-xs">
                    {filteredIbft.map((item) => (
                      <tr key={item.id} className="hover:bg-[var(--card)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--text)]">{item.memberName}</div>
                          <div className="text-[11px] text-[var(--accent)] font-semibold">{item.branch}</div>
                          <div className="text-[10px] text-[var(--muted)] font-mono">{item.phone} · {item.uploadedAt}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-[var(--text)]">{item.bank}</span>
                        </td>

                        <td className="py-3 px-4 font-mono text-xs text-[var(--accent)] font-bold">
                          {item.tid}
                        </td>

                        <td className="py-3 px-4 text-right font-extrabold text-[var(--text)]">
                          PKR {item.amountPKR.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-center font-mono">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              item.ocrConfidence > 95
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : item.ocrConfidence > 85
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {item.ocrConfidence.toFixed(1)}%
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedReceipt(item)}
                            className="btn !py-1 !px-2.5 text-xs text-[var(--text)] border border-[var(--line)] hover:bg-[var(--card)] inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-[var(--accent)]" />
                            <span>Inspect Slip</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          {item.status === "APPROVED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified & Auto-Extended Membership</span>
                            </span>
                          )}
                          {item.status === "FLAGGED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-bold">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Flagged</span>
                            </span>
                          )}
                          {item.status === "PENDING" && (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleApproveIbft(item.id, item.memberName, item.amountPKR)}
                                className="btn primary !py-1 !px-3 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleFlagIbft(item.id, item.tid)}
                                className="btn !py-1 !px-2.5 text-xs text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                                title="Flag Mismatched TID"
                              >
                                <Flag className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 2: BRANCH PETTY CASH / KIRYANA LEDGER
           ========================================================================= */}
        {activeFinanceTab === "kiryana" && (
          <div className="space-y-4">
            <div className="glass p-5 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[var(--accent)]" />
                  <span>Branch Petty Cash / Kiryana OCR Ledger</span>
                </h3>
                <p className="body-label text-xs text-[var(--muted)] mt-1">
                  Daily branch micro-procurement: drinking water bulk refills, juice bar citrus/mint, cleaning supplies, and repair items.
                </p>
              </div>

              <button
                onClick={() => setIsKiryanaModalOpen(true)}
                className="btn primary !py-2 !px-3.5 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Kiryana Receipt</span>
              </button>
            </div>

            {/* Kiryana Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--card)] text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                      <th className="py-3 px-4">Club & Date</th>
                      <th className="py-3 px-4">Vendor / Kiryana Store</th>
                      <th className="py-3 px-4">Itemized Supplies</th>
                      <th className="py-3 px-4 text-right">Receipt Amount</th>
                      <th className="py-3 px-4 text-center">OCR Confidence</th>
                      <th className="py-3 px-4 text-right">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)] text-xs">
                    {kiryanaLedger.map((item) => (
                      <tr key={item.id} className="hover:bg-[var(--card)] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--text)]">{item.branch}</div>
                          <div className="text-[10px] text-[var(--muted)] font-mono">{item.date}</div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-[var(--text)]">
                          {item.vendor}
                        </td>

                        <td className="py-3 px-4 text-[var(--muted)] max-w-sm">
                          <p className="text-xs line-clamp-2">{item.items}</p>
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-[var(--accent)] font-mono">
                          PKR {item.amountPKR.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-center font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                            {item.ocrConfidence.toFixed(1)}%
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          {item.status === "APPROVED" ? (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                              Manager Approved
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                              Pending Area Director
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB: FUEL BAR & PT MARGIN ANALYTICS
           ========================================================================= */}
        {(activeFinanceTab as string) === "margins" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="glass p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                  <span>Fuel Bar & Personal Training Profitability Telemetry</span>
                </h3>
                <p className="body-label text-xs text-[var(--muted)] mt-1">
                  High-margin secondary revenue streams: Attach rates per member check-in & gross margin by club
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="admin-chip text-emerald-400 border-emerald-500/30 text-xs font-mono font-bold">
                  Consolidated: PKR 15.80M (68% Margin)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Seaview DHA (Karachi)", ptRev: "PKR 4.80M", fuelRev: "PKR 1.62M", total: "PKR 6.42M", attach: "PKR 380", margin: "71%", cogs: "PKR 1.86M", badge: "Flagship Leader" },
                { name: "Clifton Flagship (Karachi)", ptRev: "PKR 3.40M", fuelRev: "PKR 1.25M", total: "PKR 4.65M", attach: "PKR 340", margin: "68%", cogs: "PKR 1.48M", badge: "High Yield" },
                { name: "AJ Tower (Islamabad)", ptRev: "PKR 1.90M", fuelRev: "PKR 0.81M", total: "PKR 2.71M", attach: "PKR 310", margin: "65%", cogs: "PKR 0.95M", badge: "Expanding" },
                { name: "LuckyOne Mall (Karachi)", ptRev: "PKR 1.34M", fuelRev: "PKR 0.68M", total: "PKR 2.02M", attach: "PKR 290", margin: "64%", cogs: "PKR 0.73M", badge: "Growth Target" },
              ].map((club, idx) => (
                <div key={idx} className="glass p-5 rounded-2xl space-y-3.5 border border-[var(--card-border)] hover:border-[var(--accent)]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--text)]">{club.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--chip)] text-emerald-400 border border-emerald-500/30">
                      {club.badge}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">PT Coaching Revenue:</span>
                      <span className="text-[var(--text)] font-bold">{club.ptRev}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Fuel Bar Retail:</span>
                      <span className="text-[var(--accent)] font-bold">{club.fuelRev}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[var(--line)]">
                      <span className="text-[var(--muted)]">Total High-Margin Rev:</span>
                      <span className="text-emerald-400 font-bold">{club.total}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Attach Rate / Check-In:</span>
                      <span className="text-[var(--text)] font-bold">{club.attach} / visit</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Blended Gross Margin:</span>
                      <span className="text-emerald-400 font-bold">{club.margin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">COGS & Ingredients:</span>
                      <span className="text-[var(--muted)]">{club.cogs}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 3: CLUB BY CLUB FINANCIAL TARGET ROSTER
           ========================================================================= */}
        {activeFinanceTab === "kpis" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "TRI FIT Seaview Flagship", city: "Karachi", revenue: "PKR 8.40M", target: "PKR 8.20M", share: "35.1%", status: "Exceeded Target (+2.4%)" },
              { name: "TRI FIT LuckyOne Mall", city: "Karachi", revenue: "PKR 5.56M", target: "PKR 5.40M", share: "23.2%", status: "On Track (+3.0%)" },
              { name: "TRI FIT Clifton", city: "Karachi", revenue: "PKR 5.10M", target: "PKR 5.00M", share: "21.3%", status: "On Track (+2.0%)" },
              { name: "TRI FIT AJ Tower", city: "Islamabad", revenue: "PKR 4.89M", target: "PKR 4.70M", share: "20.5%", status: "Exceeded Target (+4.0%)" },
            ].map((club, idx) => (
              <div key={idx} className="glass p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text)] text-sm">{club.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                    {club.city}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[var(--accent)]">{club.revenue}</div>
                <div className="text-xs text-[var(--muted)]">Target: {club.target} ({club.share} share)</div>
                <div className="pt-2 border-t border-[var(--line)] text-xs font-bold text-emerald-400">
                  {club.status}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Receipt Preview */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass bg-[var(--bg)] border border-[var(--card-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div>
                  <h3 className="card-title text-[var(--text)]">
                    Bank Transfer Slip OCR Inspection
                  </h3>
                  <p className="text-xs text-[var(--muted)] font-mono mt-0.5">
                    TID: {selectedReceipt.tid} · {selectedReceipt.bank}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="btn !py-1 !px-2.5 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              {/* Simulated Slip Preview with Bounding Boxes */}
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)] font-mono text-xs space-y-2 relative">
                <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider pb-2 border-b border-[var(--line)] flex items-center justify-between">
                  <span>Verified Bounding Box Telemetry</span>
                  <span className="text-emerald-400 font-bold">{selectedReceipt.ocrConfidence}% Confidence</span>
                </div>
                <p className="text-[var(--text)] leading-relaxed">
                  {selectedReceipt.receiptImgPreviewText}
                </p>

                <div className="pt-3 flex items-center justify-between text-xs border-t border-[var(--line)]">
                  <span className="text-[var(--muted)]">Member: {selectedReceipt.memberName}</span>
                  <span className="font-bold text-[var(--accent)]">PKR {selectedReceipt.amountPKR.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="btn !py-2 !px-3.5 text-xs"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleApproveIbft(selectedReceipt.id, selectedReceipt.memberName, selectedReceipt.amountPKR);
                    setSelectedReceipt(null);
                  }}
                  className="btn primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify & Credit Member</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Kiryana Slip */}
        {isKiryanaModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass bg-[var(--bg)] border border-[var(--card-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[var(--accent)]" />
                  <span>Scan & Log Kiryana Receipt</span>
                </h3>
                <button
                  onClick={() => setIsKiryanaModalOpen(false)}
                  className="btn !py-1 !px-2.5 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddKiryanaSlip} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
                    Operating Branch
                  </label>
                  <select
                    value={newKiryanaBranch}
                    onChange={(e) => setNewKiryanaBranch(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="Seaview Flagship">TRI FIT Seaview Flagship</option>
                    <option value="LuckyOne Mall">TRI FIT LuckyOne Mall</option>
                    <option value="Clifton">TRI FIT Clifton</option>
                    <option value="AJ Tower">TRI FIT AJ Tower (Islamabad)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
                    Vendor / Kiryana Store Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Madina Kiryana Store"
                    value={newKiryanaVendor}
                    onChange={(e) => setNewKiryanaVendor(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
                    Itemized Supplies Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10x 19L Drinking water bottles, fresh mint for juice bar"
                    value={newKiryanaItems}
                    onChange={(e) => setNewKiryanaItems(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
                    Total Amount in PKR
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 6500"
                    value={newKiryanaAmount}
                    onChange={(e) => setNewKiryanaAmount(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsKiryanaModalOpen(false)}
                    className="btn !py-2 !px-3.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn primary !py-2 !px-4 text-xs font-bold"
                  >
                    Save & OCR Verify
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}
