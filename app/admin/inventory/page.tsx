"use client";

import React, { useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  CupSoda,
  AlertTriangle,
  CheckCircle2,
  Package,
  TrendingUp,
  Building2,
  RefreshCw,
  Send,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  category: "PROTEIN_TUBS" | "BEVERAGES_CUPS" | "RETAIL_GEAR" | "SUPPLEMENTS";
  currentStock: number;
  maxStock: number;
  unit: string;
  costPKR: number;
  retailPKR: number;
  status: "HEALTHY" | "LOW_STOCK" | "CRITICAL";
  branch: string;
}

const STOCK_INVENTORY: StockItem[] = [
  { id: "stk-1", name: "Optimum Nutrition Gold Standard Whey (5lb Chocolate)", category: "PROTEIN_TUBS", currentStock: 48, maxStock: 60, unit: "Tubs", costPKR: 19500, retailPKR: 28500, status: "HEALTHY", branch: "All Flagships" },
  { id: "stk-2", name: "Dymatize ISO-100 Hydrolyzed Whey (5lb Vanilla)", category: "PROTEIN_TUBS", currentStock: 12, maxStock: 50, unit: "Tubs", costPKR: 24000, retailPKR: 34000, status: "LOW_STOCK", branch: "Seaview DHA" },
  { id: "stk-3", name: "Cellucor C4 Extreme Pre-Workout (Fruit Punch 60 Servings)", category: "SUPPLEMENTS", currentStock: 8, maxStock: 40, unit: "Tubs", costPKR: 8500, retailPKR: 13500, status: "CRITICAL", branch: "Clifton Flagship" },
  { id: "stk-4", name: "TriFit 16oz Biodegradable Fuel Bar Cups & Lids", category: "BEVERAGES_CUPS", currentStock: 1200, maxStock: 5000, unit: "Units", costPKR: 35, retailPKR: 0, status: "LOW_STOCK", branch: "LuckyOne Mall" },
  { id: "stk-5", name: "TriFit Matte Obsidian 750ml Shaker Bottles", category: "RETAIL_GEAR", currentStock: 142, maxStock: 150, unit: "Bottles", costPKR: 1200, retailPKR: 2800, status: "HEALTHY", branch: "All Flagships" },
  { id: "stk-6", name: "TriFit Quick-Dry Microfiber Gym Towels", category: "RETAIL_GEAR", currentStock: 94, maxStock: 100, unit: "Towels", costPKR: 900, retailPKR: 2200, status: "HEALTHY", branch: "AJ Tower Islamabad" },
];

export default function AdminInventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");

  const filteredItems = STOCK_INVENTORY.filter((item) => {
    const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesBranch = selectedBranch === "ALL" || item.branch === "All Flagships" || item.branch.includes(selectedBranch);
    return matchesCat && matchesBranch;
  });

  return (
    <AdminPortalLayout activeItem="inventory">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[var(--accent)] text-[var(--on-accent)]">
                <CupSoda className="w-5 h-5" />
              </span>
              <h1 className="admin-page-title text-2xl font-bold tracking-tight text-[var(--text)]">
                Fuel Bar & Retail Inventory Telemetry
              </h1>
            </div>
            <p className="body-label text-xs sm:text-sm mt-1 text-[var(--muted)]">
              Multi-club stock levels, protein tub depletion gauges, and supplier reorder automation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="admin-chip text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              2 Items Pending Reorder
            </span>
          </div>
        </div>

        {/* Top 4 Inventory KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Total Stock Valuation</div>
            <div className="text-2xl font-bold font-mono text-[var(--text)] mt-1">PKR 8.42M</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5">At landed wholesale cost</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Low-Stock Alerts</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">2 Items</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Below 25% safety ceiling</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Fuel Bar Gross Margin</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">64.2%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+2.4% vs wholesale target</div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="text-[11px] text-[var(--muted)] uppercase font-semibold">Monthly Stock Turns</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">4.8x</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5">Rapid replenishment cadence</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {[
              { id: "ALL", label: "All Stock" },
              { id: "PROTEIN_TUBS", label: "Protein Tubs" },
              { id: "SUPPLEMENTS", label: "Pre-Workouts" },
              { id: "BEVERAGES_CUPS", label: "Fuel Bar Consumables" },
              { id: "RETAIL_GEAR", label: "Merchandise & Shakers" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                    : "bg-white/5 text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--muted)]">Scope:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] outline-none"
            >
              <option value="ALL">All Clubs</option>
              <option value="Seaview">Seaview DHA</option>
              <option value="Clifton">Clifton Flagship</option>
              <option value="LuckyOne">LuckyOne Mall</option>
              <option value="AJ Tower">AJ Tower Islamabad</option>
            </select>
          </div>
        </div>

        {/* Horizontal Stock Gauge Bars List */}
        <div className="glass p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="card-title text-[var(--text)]">Stock Depletion Gauge Bars</h3>
            <span className="text-xs text-[var(--muted)] font-mono">Automated WhatsApp PO Trigger Active</span>
          </div>

          <div className="space-y-4">
            {filteredItems.map((item) => {
              const percentage = Math.round((item.currentStock / item.maxStock) * 100);
              const barColor =
                item.status === "CRITICAL"
                  ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  : item.status === "LOW_STOCK"
                  ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  : "bg-emerald-500";

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--accent)]/40 transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div>
                      <span className="font-bold text-sm text-[var(--text)]">{item.name}</span>
                      <div className="text-[11px] text-[var(--muted)] flex items-center gap-2 mt-0.5">
                        <span>{item.branch}</span>
                        <span>•</span>
                        <span>Cost: PKR {item.costPKR.toLocaleString()}</span>
                        {item.retailPKR > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              Retail: PKR {item.retailPKR.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <span className="font-bold text-[var(--text)]">
                          {item.currentStock.toLocaleString()} / {item.maxStock.toLocaleString()} {item.unit}
                        </span>
                        <div className="text-[10px] text-[var(--muted)]">{percentage}% Capacity</div>
                      </div>

                      {item.status !== "HEALTHY" && (
                        <button
                          type="button"
                          onClick={() => {
                            const msg = encodeURIComponent(
                              `TriFit Reorder PO: Requesting urgent shipment of ${item.maxStock - item.currentStock} units of ${item.name} for ${item.branch}.`
                            );
                            window.open(`https://wa.me/923001234567?text=${msg}`, "_blank");
                          }}
                          className="btn primary !py-1 !px-2.5 text-[11px] flex items-center gap-1 font-bold"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reorder PO</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Bar Gauge */}
                  <div className="w-full bg-[var(--track)] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
