"use client";

import React, { useState } from "react";
import { MemberPortalLayout } from "@/components/layout/MemberPortalLayout";
import { AreaTrend } from "@/components/charts";
import {
  TrendingUp,
  Sparkles,
  QrCode,
  Award,
  Flame,
  Scale,
  Activity,
  CheckCircle2,
  ChevronRight,
  Info,
  Calendar,
  Utensils,
  Moon,
  Clock,
  Dumbbell,
} from "lucide-react";

export default function MemberProgressPage() {
  const [activeAngle, setActiveAngle] = useState<"FRONT" | "SIDE" | "BACK">("FRONT");
  const [nutritionMode, setNutritionMode] = useState<"RAMADAN" | "STANDARD">("RAMADAN");
  const [mintRedeemed, setMintRedeemed] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const handleRedeemMint = () => {
    setMintRedeemed(true);
    setTimeout(() => {
      setShowVoucherModal(false);
    }, 1800);
  };

  return (
    <MemberPortalLayout activeItem="progress">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              3D Body Progress, Rewards & Diet
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
              TechGIS F-Shaped volumetric scans, base scale telemetry, mint reward voucher & localized nutrition
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-[#F5C518] border border-amber-500/20 font-bold">
              Scan #04 • Nov 9, 2026
            </span>
          </div>
        </div>

        {/* Unlocked Kiosk Mint Dispenser Reward Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-2 border-amber-500/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5C518] text-[#0B0B09] flex items-center justify-center font-black shadow-md shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  🎉 Unlocked: TechGIS Kiosk Mint Dispenser Reward
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  READY TO CLAIM
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-neutral-300 mt-0.5">
                Milestone reached: 8 visits this month! Scan your voucher under the kiosk to dispense your TriFit Eucalyptus Mint.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowVoucherModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#eab308] text-[#0B0B09] font-black text-xs shadow-md flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <QrCode className="w-4 h-4" />
            {mintRedeemed ? "Mint Voucher Claimed ✓" : "View Voucher Barcode"}
          </button>
        </div>

        {/* 3D Body Mesh Reconstruction & Metric Deltas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 3D Mesh Viewer Card */}
          <div className="lg:col-span-7 glass-panel p-5 rounded-[22px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-[#F5C518]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      TriFit 3D Volumetric Mesh Viewer
                    </h3>
                    <p className="text-[10.5px] text-slate-400">
                      Top 3D Sensor Camera + Multi-angle Recomposition
                    </p>
                  </div>
                </div>

                {/* View Angle Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                  {(["FRONT", "SIDE", "BACK"] as const).map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setActiveAngle(angle)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                        activeAngle === angle
                          ? "bg-[#F5C518] text-[#0B0B09] shadow-sm font-black"
                          : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {angle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wireframe Silhouette Visualizer */}
              <div className="py-6 flex flex-col items-center justify-center relative min-h-[260px] bg-slate-50 dark:bg-black/30 rounded-2xl my-3 border border-slate-200/60 dark:border-white/5">
                {/* SVG Silhouette Simulation */}
                <div className="relative w-48 h-56 flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 130"
                    className="w-full h-full stroke-[#F5C518] fill-amber-500/10 drop-shadow-[0_0_15px_rgba(245,197,24,0.3)] transition-all duration-300"
                    strokeWidth="1.5"
                  >
                    {/* Head */}
                    <circle cx="50" cy="16" r="9" />
                    {/* Torso & Shoulders depending on angle */}
                    {activeAngle === "FRONT" && (
                      <>
                        <path d="M 32 30 Q 50 26 68 30 L 65 65 Q 50 68 35 65 Z" />
                        <line x1="50" y1="30" x2="50" y2="66" strokeDasharray="2,2" />
                        <path d="M 32 30 L 22 55 L 20 75" />
                        <path d="M 68 30 L 78 55 L 80 75" />
                        {/* Legs */}
                        <path d="M 38 65 L 36 100 L 34 125" />
                        <path d="M 62 65 L 64 100 L 66 125" />
                      </>
                    )}
                    {activeAngle === "SIDE" && (
                      <>
                        <path d="M 44 29 Q 58 35 52 65 Q 46 68 44 65 Z" />
                        <path d="M 50 30 L 52 58 L 51 76" />
                        {/* Legs Side */}
                        <path d="M 47 65 L 49 98 L 47 125" />
                      </>
                    )}
                    {activeAngle === "BACK" && (
                      <>
                        <path d="M 32 30 Q 50 26 68 30 L 65 65 Q 50 68 35 65 Z" />
                        <path d="M 42 38 Q 50 42 58 38" />
                        <path d="M 44 48 Q 50 52 56 48" />
                        <path d="M 32 30 L 22 55 L 20 75" />
                        <path d="M 68 30 L 78 55 L 80 75" />
                        <path d="M 38 65 L 36 100 L 34 125" />
                        <path d="M 62 65 L 64 100 L 66 125" />
                      </>
                    )}
                  </svg>

                  {/* Muscle Heatmap Callouts */}
                  <span className="absolute top-8 right-2 text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    +1.8kg Muscle
                  </span>
                  <span className="absolute bottom-16 left-2 text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    -3.2% Fat Loss
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-neutral-300">
                    Viewing {activeAngle.toLowerCase()} volumetric reconstruction
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Scanned at TechGIS F-Shaped Telemetry Kiosk
                  </p>
                </div>
              </div>
            </div>

            {/* Metric Comparison Strips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/30">
                <span className="text-[10px] text-slate-400 block">Body Fat</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">15.2%</span>
                <span className="text-[10px] font-extrabold text-blue-500 block">-3.2%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/30">
                <span className="text-[10px] text-slate-400 block">Skeletal Muscle</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">36.0 kg</span>
                <span className="text-[10px] font-extrabold text-emerald-500 block">+1.8 kg</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/30">
                <span className="text-[10px] text-slate-400 block">Waist Size</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">32.1 in</span>
                <span className="text-[10px] font-extrabold text-emerald-500 block">-2.4 in</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/30">
                <span className="text-[10px] text-slate-400 block">Posture Symmetry</span>
                <span className="text-sm font-black text-amber-600 dark:text-[#FFD91C]">94/100</span>
                <span className="text-[10px] font-extrabold text-emerald-500 block">Optimal</span>
              </div>
            </div>
          </div>

          {/* Base Weight Scale Telemetry & Trend */}
          <div className="lg:col-span-5">
            <AreaTrend
              title="Base Scale Weight Progression"
              units="kg"
              subtitle="Calibrated Kiosk Base Sensor (±0.05kg) • -3.9kg lean recomposition"
              data={[
                { label: "Oct 01", value: 84.5, formattedValue: "84.5 kg" },
                { label: "Oct 15", value: 83.2, formattedValue: "83.2 kg" },
                { label: "Nov 01", value: 81.8, formattedValue: "81.8 kg" },
                { label: "Nov 05", value: 81.1, formattedValue: "81.1 kg" },
                { label: "Nov 09", value: 80.6, formattedValue: "80.6 kg" },
              ]}
              yAxisFromZero={false}
              isSample={true}
            />
          </div>
        </div>

        {/* Localized Pakistani Nutrition & Diet Plan */}
        <div className="glass-panel p-5 rounded-[22px] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-[#F5C518] flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Coach Tariq’s Localized Macro & Diet Plan
                </h3>
                <p className="text-xs text-slate-400">
                  Customized for Pakistani staple foods (Roti, Daal Chawal, Chicken Karahi, Sattu)
                </p>
              </div>
            </div>

            {/* Split Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/5 self-start sm:self-auto">
              <button
                onClick={() => setNutritionMode("RAMADAN")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  nutritionMode === "RAMADAN"
                    ? "bg-[#F5C518] text-[#0B0B09] shadow-sm font-black"
                    : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                🌙 Ramadan Suhoor & Iftar Split
              </button>
              <button
                onClick={() => setNutritionMode("STANDARD")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  nutritionMode === "STANDARD"
                    ? "bg-[#F5C518] text-[#0B0B09] shadow-sm font-black"
                    : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Standard 4-Meal Split
              </button>
            </div>
          </div>

          {/* Nutrition Cards */}
          {nutritionMode === "RAMADAN" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Suhoor */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-black/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 dark:text-[#FFD91C] uppercase tracking-wider">
                    Suhoor (04:15 AM)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">650 kcal</span>
                </div>
                <ul className="text-xs space-y-1.5 text-slate-700 dark:text-neutral-300">
                  <li>• 4 Egg Whites + 1 Whole Egg Omelette</li>
                  <li>• 1 Small Whole-Wheat Roti (30g carbs)</li>
                  <li>• 50g Rolled Oats with 1 Scoop Whey</li>
                  <li>• 1 Glass Mint Sattu / Skim Lassi (Hydration)</li>
                </ul>
                <div className="text-[10.5px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-white/5">
                  Macros: 48g Protein • 62g Carbs • 14g Fat
                </div>
              </div>

              {/* Iftar */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-black/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 dark:text-[#FFD91C] uppercase tracking-wider">
                    Iftar & Opening (06:05 PM)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">720 kcal</span>
                </div>
                <ul className="text-xs space-y-1.5 text-slate-700 dark:text-neutral-300">
                  <li>• 2 Iranian Medjool Dates + 500ml Water</li>
                  <li>• 1 Scoop Whey Protein Isolate (Juice Bar)</li>
                  <li>• 200g Grilled Chicken Breast or Karahi (Low Oil)</li>
                  <li>• 1 Cup Boiled Daal Chawal or 1 Roti</li>
                </ul>
                <div className="text-[10.5px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-white/5">
                  Macros: 65g Protein • 75g Carbs • 12g Fat
                </div>
              </div>

              {/* Post-Workout Late Night */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-black/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 dark:text-[#FFD91C] uppercase tracking-wider">
                    Post-Workout Night (11:30 PM)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">580 kcal</span>
                </div>
                <ul className="text-xs space-y-1.5 text-slate-700 dark:text-neutral-300">
                  <li>• 180g Grilled Fish (Surmai / Red Snapper)</li>
                  <li>• 1 Bowl Steamed Basmati Rice</li>
                  <li>• Cucumber, Tomato & Mint Raita (Skim Dahi)</li>
                  <li>• 5 Almonds + 2 Walnuts</li>
                </ul>
                <div className="text-[10.5px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-white/5">
                  Macros: 52g Protein • 55g Carbs • 15g Fat
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {["Breakfast (08:00 AM)", "Lunch (01:30 PM)", "Pre-Workout (05:30 PM)", "Dinner (09:00 PM)"].map((meal, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-black/30 space-y-1.5 text-xs">
                  <span className="font-black text-amber-600 dark:text-[#FFD91C] block">{meal}</span>
                  <p className="text-slate-600 dark:text-neutral-300">
                    High protein lean split with whole grains, desi daal and whey isolate.
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1 font-mono">Target: 45g Protein</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Redeem Mint Voucher */}
        {showVoucherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm glass-panel rounded-[22px] p-6 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-[#F5C518] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Kiosk Mint Dispenser Voucher
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scan barcode under the TechGIS F-Shaped Kiosk bottom scanner
                </p>
              </div>

              {/* Barcode Mock */}
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-900/10 dark:border-amber-500/30">
                <div className="flex items-center justify-center gap-1 h-16">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full bg-slate-950 ${
                        i % 3 === 0 ? "w-1" : i % 2 === 0 ? "w-0.5" : "w-1.5"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono font-black text-slate-900 tracking-widest mt-2 block">
                  TF-MINT-88392-PK
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleRedeemMint}
                  disabled={mintRedeemed}
                  className="w-full py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#eab308] text-[#0B0B09] font-black text-xs shadow-md transition-all"
                >
                  {mintRedeemed ? "Dispensed Successfully! 🍬" : "Simulate Kiosk Scan & Dispense"}
                </button>
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
}
