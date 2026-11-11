"use client";

import React, { useEffect, useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  Wrench,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Coins,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Search,
  Filter,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { BarGold } from "@/components/charts";
import { BarGoldPoint } from "@/lib/data";

interface AdminEquipmentItem {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  branchId: string;
  branchName: string;
  branchCity: string;
  status: "OPERATIONAL" | "ATTENTION" | "MAINTENANCE";
  repairCostPKR: number;
  warrantyEnd: string;
  daysUntilWarrantyEnd: number;
  isWarrantyActive: boolean;
  replacementYear: number;
  replacementCostPKR: number;
  lastInspected: string;
}

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<AdminEquipmentItem[]>([]);
  const [summary, setSummary] = useState({
    totalAssets: 18,
    operationalCount: 17,
    attentionCount: 1,
    maintenanceCount: 0,
    totalRepairCostPKR: 126500,
    activeWarrantyCount: 16,
    uptimePct: 94,
  });
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEquipment() {
      setIsLoading(true);
      try {
        const queryParam = selectedBranch !== "ALL" ? `?branchId=${selectedBranch}` : "";
        const res = await fetch(`/api/admin/equipment${queryParam}`);
        if (res.ok) {
          const data = await res.json();
          setEquipment(data.equipment || []);
          if (data.summary) setSummary(data.summary);
        }
      } catch (err) {
        console.error("Failed to load admin equipment:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEquipment();
  }, [selectedBranch]);

  // Filter equipment based on category and search query
  const filteredEquipment = equipment.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Repair Costs by Branch Bar Data
  const repairCostsByBranchBars: BarGoldPoint[] = [
    {
      label: "Seaview (KHI)",
      value: 62500,
      formattedValue: "PKR 62.5k",
      sublabel: "8 Machines",
      isPeak: true,
    },
    {
      label: "AJ Tower (ISB)",
      value: 38000,
      formattedValue: "PKR 38k",
      sublabel: "6 Machines",
    },
    {
      label: "Soha Mall (ISB)",
      value: 26000,
      formattedValue: "PKR 26k",
      sublabel: "4 Machines",
    },
  ];

  // 5-Year Replacement Plans / CapEx Data
  const replacementPlans = [
    {
      year: "2027",
      title: "Cardio Fleet Cycle Refresh",
      machinesCount: 6,
      category: "CARDIO",
      projectedCostPKR: 4200000,
      priority: "SCHEDULED",
      notes: "Treadmills & Arc Trainers reaching 10,000 operating hours",
    },
    {
      year: "2028",
      title: "Pin-Select Cable Bay Expansion",
      machinesCount: 7,
      category: "CABLE",
      projectedCostPKR: 3850000,
      priority: "PLANNED",
      notes: "Multi-jungles and pulley stations lifecycle turnover",
    },
    {
      year: "2029",
      title: "Olympic Free Weights & Platforms",
      machinesCount: 5,
      category: "STRENGTH",
      projectedCostPKR: 3100000,
      priority: "ESTIMATED",
      notes: "Heavy barbell bays, bumper plates & calibrated lifting racks",
    },
  ];

  return (
    <AdminPortalLayout activeItem="equipment">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Equipment Asset Register & Capital Plans</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                {summary.operationalCount}/{summary.totalAssets} Operational
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Centralized asset telemetry across Karachi & Islamabad clubs with active warranties & 5-year replacement cycles
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/branch/equipment"
              className="btn !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Branch Equipment Bay</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />
            </Link>
          </div>
        </div>

        {/* 1. 4 Primary Compact KPI Cards — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Total Network Assets"
            numericValue={summary.totalAssets}
            variant="warning"
            icon={Wrench}
            sparklineData={[16, 17, 17, 18, 18, summary.totalAssets]}
            sparklineColor="#FFD91C"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                {summary.operationalCount} 100% Up
              </span>
            }
            footerRight="All 4 Clubs"
          />

          <StatCard
            title="Network Machine Uptime"
            value={`${summary.uptimePct}%`}
            variant="warning"
            icon={CheckCircle2}
            trend={{
              value: "Zero faults",
              isPositive: true,
            }}
            sparklineData={[98.5, 98.9, 99.2, 99.4]}
            sparklineColor="#F59E0B"
            footerRight="Tier 1 Standard"
          />

          <StatCard
            title="Total Repair Spend (PKR)"
            value={`PKR ${(summary.totalRepairCostPKR / 1000).toFixed(0)}k`}
            variant="warning"
            icon={Coins}
            trend={{
              value: "-24%",
              isPositive: true,
              label: "under cap",
            }}
            sparklineData={[68, 62, 58, 54, summary.totalRepairCostPKR / 1000]}
            sparklineColor="#FBBF24"
            footerRight="Under budget"
          />

          <StatCard
            title="Warranty Protected Units"
            value={`${summary.activeWarrantyCount}/${summary.totalAssets}`}
            variant="warning"
            icon={ShieldCheck}
            sparklineData={[12, 14, 15, 16, summary.activeWarrantyCount]}
            sparklineColor="#EAB308"
            footerLeft={
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                88.9%
              </span>
            }
            footerRight="Manufacturer Care"
          />
        </div>

        {/* 2. Visual Analytics Section: Repair Costs by Branch & Replacement Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Repair Costs by Branch Bars */}
          <div className="lg:col-span-5">
            <BarGold
              title="Cumulative Repair Spend by Branch"
              units="PKR"
              subtitle="Historical maintenance and servicing expenditure across clubs"
              data={repairCostsByBranchBars}
              isSample={true}
            />
          </div>

          {/* Replacement Plans & 5-Year CapEx Forecast */}
          <div className="lg:col-span-7 glass-panel p-5 border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-[700] text-text flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    Capital Replacement Expenditure Plan (CapEx)
                  </h3>
    
                </div>
                <span className="text-[11.5px] font-[600] text-positive">Lifecycle Model</span>
              </div>
              <p className="text-[12.5px] text-text-muted mb-3">
                Forward-looking fleet turnover timeline to ensure zero unbudgeted machinery obsolescence.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {replacementPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[14px] bg-glass border border-border hover:border-accent/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-[800] px-2 py-0.5 rounded bg-accent text-on-accent">
                        FY{plan.year}
                      </span>
                      <strong className="text-[13.5px] font-[700] text-text">{plan.title}</strong>
                    </div>
                    <p className="text-[11.5px] text-text-muted">{plan.notes}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 text-right">
                    <div>
                      <span className="text-[14px] font-[900] text-accent block">
                        PKR {(plan.projectedCostPKR / 1000000).toFixed(2)}M
                      </span>
                      <span className="text-[10.5px] text-text-muted">
                        {plan.machinesCount} Machines
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-positive/10 text-positive border border-positive/30">
                      {plan.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11.5px] text-text-muted">
              <span>Total 3-Year CapEx Commitment: PKR 11.15M</span>
              <span className="text-accent font-semibold">Reserve Funded</span>
            </div>
          </div>
        </div>

        {/* 3. Asset Register & Maintenance Matrix Table */}
        <div className="glass-panel p-5 border border-border space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-[800] text-text flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent" />
                  Network Equipment Register ({filteredEquipment.length} Machines)
                </h2>
  
              </div>
              <p className="text-[12.5px] text-text-muted mt-0.5">
                Serial tags, club bays, operational health, manufacturer warranty countdown, and replacement year.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-glass border border-border rounded-[11px] px-3 py-1.5 text-[12px] font-[600] text-text focus:outline-none focus:border-accent"
              >
                <option value="ALL">All Branches (Network)</option>
                <option value="branch-seaview">Karachi — Seaview</option>
                <option value="branch-ajtower">Islamabad — AJ Tower</option>
                <option value="branch-sohamall">Islamabad — Soha Mall</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-glass border border-border rounded-[11px] px-3 py-1.5 text-[12px] font-[600] text-text focus:outline-none focus:border-accent"
              >
                <option value="ALL">All Categories</option>
                <option value="STRENGTH">Strength Bays</option>
                <option value="CARDIO">Cardio Fleet</option>
                <option value="CABLE">Cable Systems</option>
                <option value="RECOVERY">Recovery & Cryo</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[12px] font-[600] text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-3">Machine & Serial</th>
                  <th className="py-3 px-3">Branch Location</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Warranty Expiration</th>
                  <th className="py-3 px-3 text-right">Repair Cost</th>
                  <th className="py-3 px-3 text-right">Replacement Year</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-[13.5px]">
                {filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-glass/80 transition-colors">
                    {/* Machine Name */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-[700] text-text block">{item.name}</span>
                        <span className="text-[11px] text-text-muted font-mono">{item.serialNumber}</span>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-[600] text-text">{item.branchName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent border border-accent/30">
                          {item.branchCity}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-[600] px-2 py-0.5 rounded bg-glass border border-border text-text">
                        {item.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center">
                      {item.status === "OPERATIONAL" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[9px] text-[11px] font-[700] bg-positive/10 text-positive border border-positive/30">
                          <CheckCircle2 className="w-3 h-3" />
                          OPERATIONAL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[9px] text-[11px] font-[700] bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          ATTENTION
                        </span>
                      )}
                    </td>

                    {/* Warranty */}
                    <td className="py-3.5 px-3 text-right">
                      {item.isWarrantyActive ? (
                        <div>
                          <span className="text-[11.5px] font-[600] text-positive">
                            Valid ({item.daysUntilWarrantyEnd}d)
                          </span>
                          <span className="block text-[10.5px] text-text-muted">
                            Exp: {new Date(item.warrantyEnd).toLocaleDateString("en-PK")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-[700] text-text-muted">
                          Expired
                        </span>
                      )}
                    </td>

                    {/* Repair Cost */}
                    <td className="py-3.5 px-3 text-right font-[700] text-text">
                      {item.repairCostPKR > 0 ? (
                        <span className="text-amber-400">PKR {item.repairCostPKR.toLocaleString()}</span>
                      ) : (
                        <span className="text-text-muted font-normal">PKR 0</span>
                      )}
                    </td>

                    {/* Replacement Year */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-[700] text-accent block">
                        FY{item.replacementYear}
                      </span>
                      <span className="text-[10.5px] text-text-muted">
                        ~PKR {(item.replacementCostPKR / 1000).toFixed(0)}k
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href="/branch/equipment"
                        className="btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                      >
                        <span>Bay Log</span>
                        <ArrowRight className="w-3 h-3 text-accent" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Equipment Reliability & Maintenance Protocol Notice */}
        <div className="glass-panel p-4 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-[700] text-text">
                Preventative Maintenance & Zero Machine Downtime Protocol Active
              </h4>
              <p className="text-[12px] text-text-muted mt-0.5">
                Every equipment asset undergoes scheduled bi-weekly torque and cable tension calibration. Service tickets requiring parts replacement auto-verify manufacturer warranty eligibility prior to technician dispatch.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-[700] px-2.5 py-1 rounded bg-accent/15 text-accent border border-accent/30 shrink-0">
            Warranty Verified
          </span>
        </div>
      </div>
    </AdminPortalLayout>
  );
}