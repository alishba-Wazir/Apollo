"use client";

import React, { useState, useEffect } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import { StatCard } from "@/components/ui/StatCard";
import {
  Wallet,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Banknote,
  DollarSign,
  ArrowUpRight,
  Download,
} from "lucide-react";

interface PayoutTransaction {
  id: string;
  date: string;
  clientName: string;
  type: "PT Session (1 Hour)" | "Monthly PT Renewal Bonus" | "Base Salary Staging";
  amountPKR: number;
  status: "VERIFIED" | "PROCESSING";
}

const TRANSACTIONS: PayoutTransaction[] = [
  { id: "tx-01", date: "Today, 11:30 AM", clientName: "Hamza Rauf", type: "PT Session (1 Hour)", amountPKR: 1500, status: "VERIFIED" },
  { id: "tx-02", date: "Today, 01:15 PM", clientName: "Daniyal Khan", type: "PT Session (1 Hour)", amountPKR: 1500, status: "VERIFIED" },
  { id: "tx-03", date: "Yesterday, 06:00 PM", clientName: "Zaid Khan", type: "PT Session (1 Hour)", amountPKR: 1500, status: "VERIFIED" },
  { id: "tx-04", date: "Nov 5, 2026", clientName: "Alishba Khan", type: "Monthly PT Renewal Bonus", amountPKR: 8000, status: "VERIFIED" },
  { id: "tx-05", date: "Nov 4, 2026", clientName: "Zaid Khan", type: "Monthly PT Renewal Bonus", amountPKR: 8000, status: "VERIFIED" },
  { id: "tx-06", date: "Nov 1, 2026", clientName: "Head Office Base Staging", type: "Base Salary Staging", amountPKR: 75000, status: "VERIFIED" },
];

export default function TrainerEarningsPage() {
  const [earningsData, setEarningsData] = useState<any>(null);

  useEffect(() => {
    async function loadEarnings() {
      try {
        const res = await fetch("/api/trainer/me");
        if (res.ok) {
          const data = await res.json();
          if (data.trainer) {
            setEarningsData(data.trainer);
          }
        }
      } catch (e) {
        console.error("Failed to load earnings:", e);
      }
    }
    loadEarnings();
  }, []);

  const baseSalaryPKR = earningsData?.baseSalaryPKR ?? 75000;
  const ptCommissionsPKR = earningsData?.commissionTotalPKR ?? 42000;
  const renewalBonusesPKR = 24000;
  const totalEarningsPKR = earningsData?.totalEarningsPKR ?? (baseSalaryPKR + ptCommissionsPKR + renewalBonusesPKR);

  return (
    <TrainerPortalLayout activeItem="earnings">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>My Commissions & Payouts (PKR)</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Cycle: November 2026
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Verified 1-on-1 personal training hours, renewal bonus multipliers, and base contract compensation
            </span>
          </div>

          <div className="text-right px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm shrink-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Projected Payout</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              PKR {totalEarningsPKR.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4 Compact KPI Cards — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Base Monthly Salary"
            value={`PKR ${baseSalaryPKR.toLocaleString()}`}
            icon={Banknote}
            variant="warning"
            sparklineData={[75000, 75000, 75000, 75000, 75000, 75000]}
            sparklineColor="#FFD91C"
            footerRight="Tier 3 Senior PT Contract"
          />

          <StatCard
            title="Verified PT Sessions"
            value={`PKR ${ptCommissionsPKR.toLocaleString()}`}
            icon={TrendingUp}
            variant="warning"
            trend={{
              value: "+14.2%",
              isPositive: true,
            }}
            sparklineData={[28000, 32000, 36000, 39000, 42000]}
            sparklineColor="#F59E0B"
            footerRight="28 Sessions × PKR 1,500"
          />

          <StatCard
            title="Renewal Bonuses"
            value={`PKR ${renewalBonusesPKR.toLocaleString()}`}
            icon={Sparkles}
            variant="warning"
            trend={{
              value: "+8,000",
              isPositive: true,
              label: "new",
            }}
            sparklineData={[8000, 16000, 16000, 24000]}
            sparklineColor="#FBBF24"
            footerRight="3 Client Retentions"
          />

          <StatCard
            title="Tax Deduction (FBR)"
            value="-PKR 6,800"
            icon={CheckCircle2}
            variant="warning"
            sparklineData={[6800, 6800, 6800, 6800]}
            sparklineColor="#EAB308"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                Active Filer
              </span>
            }
            footerRight="Standard WHT Rate"
          />
        </div>

        {/* Verified Payout Statement Table */}
        <div className="glass-panel p-5 rounded-[18px] border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-[800] text-text">Live Commission Audit Statement</h3>
              <p className="text-[11.5px] text-text-muted mt-0.5">
                Each completed PT session is verified via 4-digit client OTP and stamped immediately.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-[10px] bg-slate-100 dark:bg-white/5 border border-border text-text font-semibold text-[11px] flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-white/10">
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Payslip</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Client / Reference</th>
                  <th className="py-2.5 px-3">Earning Category</th>
                  <th className="py-2.5 px-3 text-right">Commission Amount</th>
                  <th className="py-2.5 px-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono text-[11.5px] text-text-muted">
                      {tx.date}
                    </td>
                    <td className="py-3 px-3 font-bold text-text">
                      {tx.clientName}
                    </td>
                    <td className="py-3 px-3 text-text-muted font-medium">
                      {tx.type}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-accent">
                      PKR {tx.amountPKR.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TrainerPortalLayout>
  );
}
