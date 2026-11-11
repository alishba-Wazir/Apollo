"use client";

import React, { useState, useEffect } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  Layers,
  ArrowRight,
  Dumbbell,
  Activity,
  Calendar,
  Check,
  Banknote,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StatCard } from "@/components/ui/StatCard";

interface EquipmentItem {
  id: string;
  name: string;
  category: "STRENGTH" | "CARDIO" | "CABLE" | "RECOVERY";
  status: "OPERATIONAL" | "ATTENTION" | "MAINTENANCE";
  repairCost: number;
  warrantyEnd: string;
}

interface EquipmentSummary {
  totalCount: number;
  operationalCount: number;
  attentionCount: number;
  maintenanceCount: number;
  totalRepairCostPKR: number;
  operationalRate: number;
}

export default function BranchEquipmentPage() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [summary, setSummary] = useState<EquipmentSummary | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // TechGIS F-Shaped 3D Kiosk State
  const [mintStock, setMintStock] = useState(78);
  const [isDispensing, setIsDispensing] = useState(false);
  const [kioskMessage, setKioskMessage] = useState<string | null>(null);

  const handleTestDispense = () => {
    setIsDispensing(true);
    setTimeout(() => {
      setMintStock((prev) => Math.max(0, prev - 1));
      setIsDispensing(false);
      setKioskMessage("Test dispense signal sent: 1 Sugar-Free TriFit Mint unit dispensed via lower solenoid.");
      setTimeout(() => setKioskMessage(null), 4000);
    }, 800);
  };
  const [serviceNote, setServiceNote] = useState("");
  const [additionalCostInput, setAdditionalCostInput] = useState("");

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/branch/equipment");
      if (res.ok) {
        const json = await res.json();
        setEquipment(json.equipment || []);
        setSummary(json.summary || null);
        if (json.equipment && json.equipment.length > 0 && !selectedItemId) {
          setSelectedItemId(json.equipment[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load equipment", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const selectedItem = equipment.find((e) => e.id === selectedItemId) || equipment[0];

  // Handle Quick Status Update & Service Logging
  const handleUpdateStatus = async (newStatus: "OPERATIONAL" | "ATTENTION" | "MAINTENANCE") => {
    if (!selectedItem) return;
    setIsUpdating(true);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/branch/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: selectedItem.id,
          newStatus,
          additionalRepairCostPKR: additionalCostInput ? Number(additionalCostInput) : 0,
          note: serviceNote.trim() || undefined,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setActionSuccess(`Asset updated to ${newStatus}.${additionalCostInput ? ` Logged PKR ${Number(additionalCostInput).toLocaleString()} expense.` : ""}`);
        setServiceNote("");
        setAdditionalCostInput("");
        await fetchEquipment();
      } else {
        alert(result.error || "Update failed");
      }
    } catch (e: any) {
      alert(e.message || "Network error");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredEquipment = equipment.filter((e) => {
    if (categoryFilter === "ALL") return true;
    return e.category === categoryFilter;
  });

  return (
    <BranchPortalLayout activeItem="equipment">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Equipment & Maintenance Bay</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {user?.branchName || "Current Branch"}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Floor machinery status, warranty compliance, and service invoices tracked in PKR
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchEquipment}
              disabled={isLoading}
              className="h-9 px-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
              <span>Refresh Inventory</span>
            </button>
          </div>
        </div>

        {/* Action Alert */}
        {actionSuccess && (
          <div className="p-3.5 rounded-[12px] bg-positive/10 border border-positive/30 text-positive text-[13px] font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Compact KPI Snapshot Cards — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Tracked Assets"
            numericValue={summary?.totalCount ?? equipment.length}
            variant="warning"
            icon={Layers}
            sparklineData={[4, 5, 5, 6, 6, summary?.totalCount ?? equipment.length]}
            sparklineColor="#FFD91C"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                Strength & Cardio
              </span>
            }
            footerRight="Floor Bay"
          />

          <StatCard
            title="Operational Health"
            value={`${summary?.operationalRate ?? 100}%`}
            variant="warning"
            icon={CheckCircle2}
            trend={{
              value: "Ready",
              isPositive: true,
            }}
            sparklineData={[94, 96, 98, 100]}
            sparklineColor="#F59E0B"
            footerRight={`${summary?.operationalCount ?? equipment.length} Available`}
          />

          <StatCard
            title="Attention & Service"
            numericValue={(summary?.attentionCount ?? 0) + (summary?.maintenanceCount ?? 0)}
            variant="warning"
            icon={AlertTriangle}
            sparklineData={[1, 2, 1, 0, (summary?.attentionCount ?? 0) + (summary?.maintenanceCount ?? 0)]}
            sparklineColor="#FBBF24"
            footerLeft={
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {summary?.maintenanceCount ? `${summary.maintenanceCount} in repair` : "All operational"}
              </span>
            }
            footerRight="Floor Tech"
          />

          <StatCard
            title="Maintenance Spent (PKR)"
            value={`PKR ${((summary?.totalRepairCostPKR ?? 51000) / 1000).toFixed(0)}k`}
            variant="warning"
            icon={Banknote}
            sparklineData={[35, 42, 48, (summary?.totalRepairCostPKR ?? 51000) / 1000]}
            sparklineColor="#EAB308"
            footerRight="Parts & service"
          />
        </div>

        {/* TechGIS F-Shaped 3D Body Kiosk Telemetry Card */}
        <div className="glass-panel p-6 rounded-[22px] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border dark:border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-extrabold uppercase bg-accent text-on-accent shadow-[0_0_10px_rgba(255,217,28,0.35)]">
                  TechGIS Proprietary Hardware
                </span>
                <span className="text-[12px] text-text-muted">Serial: TG-F3D-7710-ISB</span>
              </div>
              <h3 className="text-[18px] font-[900] text-text flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span>TechGIS F-Shaped 3D Body Kiosk Telemetry</span>
              </h3>
              <p className="text-[12.5px] text-text-muted mt-0.5">
                Front-line body composition scanner: 3-point sensor sync, low-profile scale tare calibration, and mint dispensary.
              </p>
            </div>

            <button
              onClick={handleTestDispense}
              disabled={isDispensing}
              className="btn-primary px-3.5 py-2 text-[12px] font-[800] self-start sm:self-auto flex items-center gap-2"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDispensing ? "animate-spin" : ""}`} />
              <span>{isDispensing ? "Dispensing..." : "Trigger Mint Test Dispense"}</span>
            </button>
          </div>

          {kioskMessage && (
            <div className="p-3 rounded-[12px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{kioskMessage}</span>
            </div>
          )}

          {/* 4 Kiosk Modules Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-[12px]">
            {/* Sensor 1: Top 3D Camera Sensor */}
            <div className="p-3.5 rounded-[16px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Top 3D Camera</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[16px] font-[800] text-emerald-600 dark:text-emerald-400">
                Online (60 FPS)
              </div>
              <span className="text-[10.5px] text-text-muted mt-1 block">
                Dual 1080p Depth Sensor Stream Active
              </span>
            </div>

            {/* Sensor 2: Middle Touchscreen */}
            <div className="p-3.5 rounded-[16px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Middle Screen</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[16px] font-[800] text-text">
                Active & Calibrated
              </div>
              <span className="text-[10.5px] text-text-muted mt-1 block">
                21.5" Capacitive Touch Display (4K)
              </span>
            </div>

            {/* Sensor 3: Low-Profile Base Scale */}
            <div className="p-3.5 rounded-[16px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Base Weight Scale</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[16px] font-[800] text-text font-mono">
                Calibrated (±0.05kg)
              </div>
              <span className="text-[10.5px] text-text-muted mt-1 block">
                Zero Tare Balanced (Load Cell OK)
              </span>
            </div>

            {/* Sensor 4: Bottom Mint Dispenser Stock */}
            <div className="p-3.5 rounded-[16px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Mint Dispenser</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                  mintStock < 20
                    ? "bg-rose-500/15 text-rose-600 border border-rose-500/30"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                }`}>
                  {mintStock < 20 ? "REFILL ALERT" : "STOCKED"}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[18px] font-[900] text-accent font-mono">
                  {mintStock}% Stock
                </span>
                <span className="text-[11px] text-text-muted font-bold">~156 Mints</span>
              </div>
              {/* Progress meter */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${mintStock}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Split: Equipment Directory & Selected Asset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Equipment Inventory List (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-4 border border-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-[13px] font-[900] text-text">Inventory Roster</span>
              <span className="text-[11px] text-text-muted">{filteredEquipment.length} machines</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-[10px] bg-glass border border-border text-[11px]">
              {["ALL", "STRENGTH", "CARDIO", "CABLE"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex-1 py-1 rounded-[8px] font-bold transition-all ${
                    categoryFilter === cat
                      ? "bg-accent text-on-accent shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {cat === "ALL" ? "All" : cat}
                </button>
              ))}
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-12 text-center text-text-muted text-[13px]">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
                  Loading inventory...
                </div>
              ) : (
                filteredEquipment.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const isOperational = item.status === "OPERATIONAL";
                  const isAttention = item.status === "ATTENTION";

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setActionSuccess(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-[14px] border transition-all ${
                        isSelected
                          ? "bg-accent/15 border-accent shadow-md ring-1 ring-accent/40"
                          : "bg-glass border-border hover:border-accent/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[13.5px] font-[900] text-text block leading-snug">
                            {item.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider mt-0.5 inline-block">
                            {item.category}
                          </span>
                        </div>

                        <span
                          className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                            isOperational
                              ? "bg-positive/15 text-positive border border-positive/30"
                              : isAttention
                              ? "bg-accent/20 text-accent border border-accent/30"
                              : "bg-negative/15 text-negative border border-negative/30"
                          }`}
                        >
                          {isOperational ? "Operational" : isAttention ? "Attention" : "Maintenance"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/40 text-[11px] text-text-muted">
                        <span>Warranty: <strong>{new Date(item.warrantyEnd).toLocaleDateString("en-PK")}</strong></span>
                        <span className="font-mono text-accent font-bold">
                          PKR {item.repairCost.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Machine Deep Dive & Maintenance Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {selectedItem ? (
              <>
                {/* Machine Overview Card */}
                <div className="glass-panel p-5 border border-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-border gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-[20px] font-[900] text-text">{selectedItem.name}</h2>
                        <span className="badge-yellow text-[10px] font-bold">
                          {selectedItem.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-text-muted mt-1.5">
                        <span>Warranty End: <strong className="text-text">{new Date(selectedItem.warrantyEnd).toLocaleDateString("en-PK")}</strong></span>
                        <span>•</span>
                        <span>Cumulative Cost: <strong className="text-accent font-mono">PKR {selectedItem.repairCost.toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] px-3 py-1 rounded-[10px] font-bold uppercase self-start sm:self-center ${
                        selectedItem.status === "OPERATIONAL"
                          ? "bg-positive/15 text-positive border border-positive/30"
                          : selectedItem.status === "ATTENTION"
                          ? "bg-accent/20 text-accent border border-accent/40"
                          : "bg-negative/15 text-negative border border-negative/30"
                      }`}
                    >
                      STATUS: {selectedItem.status}
                    </span>
                  </div>

                  {/* Quick Status Control Buttons */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      Change Operational Status:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleUpdateStatus("OPERATIONAL")}
                        disabled={isUpdating || selectedItem.status === "OPERATIONAL"}
                        className={`p-2.5 rounded-[10px] border text-[11.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                          selectedItem.status === "OPERATIONAL"
                            ? "bg-positive/20 border-positive text-positive"
                            : "bg-glass border-border text-text-muted hover:text-text hover:border-positive/50"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Operational</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus("ATTENTION")}
                        disabled={isUpdating || selectedItem.status === "ATTENTION"}
                        className={`p-2.5 rounded-[10px] border text-[11.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                          selectedItem.status === "ATTENTION"
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-glass border-border text-text-muted hover:text-text hover:border-accent/50"
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Needs Attention</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus("MAINTENANCE")}
                        disabled={isUpdating || selectedItem.status === "MAINTENANCE"}
                        className={`p-2.5 rounded-[10px] border text-[11.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                          selectedItem.status === "MAINTENANCE"
                            ? "bg-negative/20 border-negative text-negative"
                            : "bg-glass border-border text-text-muted hover:text-text hover:border-negative/50"
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Maintenance</span>
                      </button>
                    </div>
                  </div>

                  {/* Log Service Invoice in PKR */}
                  <div className="pt-3 border-t border-border space-y-3">
                    <span className="text-[11.5px] font-bold text-text uppercase tracking-wider block flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-accent" />
                      Log Service & Maintenance Expense (PKR)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-bold text-text-muted block mb-1">
                          Additional Cost (PKR):
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-accent">
                            PKR
                          </span>
                          <input
                            type="number"
                            value={additionalCostInput}
                            onChange={(e) => setAdditionalCostInput(e.target.value)}
                            placeholder="e.g. 15000"
                            className="w-full pl-12 pr-3 py-2 rounded-[8px] bg-background border border-border text-[12.5px] text-text font-mono placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-text-muted block mb-1">
                          Service Work Details:
                        </label>
                        <input
                          type="text"
                          value={serviceNote}
                          onChange={(e) => setServiceNote(e.target.value)}
                          placeholder="e.g. Lubricated bearings, tightened cables"
                          className="w-full px-3 py-2 rounded-[8px] bg-background border border-border text-[12.5px] text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpdateStatus(selectedItem.status)}
                      disabled={isUpdating || (!additionalCostInput && !serviceNote.trim())}
                      className="btn-primary text-[12px] py-2 px-4 flex items-center gap-2 self-start"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isUpdating ? "Logging..." : "Log Expense & Audit Entry"}</span>
                    </button>
                  </div>

                  {/* Safety & Compliance Checklist */}
                  <div className="pt-3 border-t border-border/60">
                    <span className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider block mb-2">
                      Asset Compliance Verification
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>Warranty: Active (2028)</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>Currency: PKR (No $)</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-[8px] bg-positive/10 border border-positive/20 text-positive">
                        <Check className="w-3.5 h-3.5" />
                        <span>No Card Data Stored</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-panel p-12 text-center text-text-muted">
                Select an equipment asset from the directory to inspect details.
              </div>
            )}
          </div>
        </div>
      </div>
    </BranchPortalLayout>
  );
}
