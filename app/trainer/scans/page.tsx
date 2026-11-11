"use client";

import React, { useState } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import { AreaTrend } from "@/components/charts";
import {
  Activity,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  RotateCw,
  Scale,
  Zap,
} from "lucide-react";

export default function TrainerScansPage() {
  const [selectedAngle, setSelectedAngle] = useState<"FRONT" | "SIDE" | "BACK">("FRONT");
  const [selectedClient, setSelectedClient] = useState("Zaid Khan");

  const weightHistory = [
    { date: "Oct 1", weight: 84.5 },
    { date: "Oct 10", weight: 83.8 },
    { date: "Oct 20", weight: 82.9 },
    { date: "Nov 1", weight: 81.4 },
    { date: "Nov 7 (Today)", weight: 80.6 },
  ];

  return (
    <TrainerPortalLayout activeItem="scans">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>3D Body Scan Analyzer</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Client: {selectedClient}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Volumetric mesh reconstruction, skeletal muscle mass heatmap, and TechGIS base scale weight progression
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {["Zaid Khan", "Alishba Khan", "Hamza Rauf"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClient(c)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedClient === c
                    ? "bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-bold shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200/80 dark:border-slate-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-[16px] border border-border flex items-center justify-between">
            <div>
              <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider block">
                Body Fat Percentage
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[26px] font-[900] text-text font-mono">14.8%</span>
                <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingDown className="w-3.5 h-3.5" /> -3.2%
                </span>
              </div>
              <span className="text-[10.5px] text-text-muted">Target: 12.0% Athletic Tier</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold">
              %
            </div>
          </div>

          <div className="glass-panel p-4 rounded-[16px] border border-border flex items-center justify-between">
            <div>
              <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider block">
                Skeletal Muscle Mass
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[26px] font-[900] text-text font-mono">42.4 kg</span>
                <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5" /> +1.8 kg
                </span>
              </div>
              <span className="text-[10.5px] text-text-muted">Hypertrophy Index: 88th Percentile</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold">
              kg
            </div>
          </div>

          <div className="glass-panel p-4 rounded-[16px] border border-border flex items-center justify-between">
            <div>
              <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider block">
                Visceral Fat Rating
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[26px] font-[900] text-text font-mono">Level 4</span>
                <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
                  Optimal Healthy Range
                </span>
              </div>
              <span className="text-[10.5px] text-text-muted">Kiosk Base Scale Tare Calibrated</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center font-bold">
              VF
            </div>
          </div>
        </div>

        {/* 2-Column Grid: 3D Body Mesh Viewer on Left (7 cols) | Weight Curve on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: 3D Body Mesh Viewer (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-5 rounded-[18px] border border-border flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-[800] text-text flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  <span>TriFit 3D Volumetric Mesh Viewer</span>
                </h3>
                <p className="text-[11.5px] text-text-muted mt-0.5">
                  Point-cloud reconstruction from TechGIS Top Camera 60 FPS infrared depth sensors.
                </p>
              </div>

              {/* View Angle Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-[10px] bg-slate-100 dark:bg-white/5 border border-border text-[11px]">
                {(["FRONT", "SIDE", "BACK"] as const).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setSelectedAngle(angle)}
                    className={`px-3 py-1 rounded-[8px] font-bold transition-all ${
                      selectedAngle === angle
                        ? "bg-accent text-on-accent shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    {angle}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated 3D Mesh Canvas */}
            <div className="relative w-full h-[360px] rounded-[14px] bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
              {/* Silhouette Graphics based on Angle */}
              <svg viewBox="0 0 200 320" className="h-full w-auto">
                <defs>
                  <linearGradient id="bodyHeatmap" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFD91C" stopOpacity="0.8" />
                    <stop offset="35%" stopColor="#EAB308" stopOpacity="0.9" />
                    <stop offset="65%" stopColor="#10B981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFD91C" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Head */}
                <circle cx="100" cy="35" r="20" fill="url(#bodyHeatmap)" stroke="#FFD91C" strokeWidth="1.5" />
                {/* Neck */}
                <rect x="94" y="55" width="12" height="15" fill="#FFD91C" opacity="0.6" />

                {selectedAngle === "FRONT" && (
                  <g stroke="#FFD91C" strokeWidth="1.5">
                    {/* Torso & Shoulders */}
                    <path
                      d="M 60 70 L 140 70 L 125 155 L 75 155 Z"
                      fill="url(#bodyHeatmap)"
                      opacity="0.85"
                    />
                    {/* Chest Pec Line */}
                    <line x1="75" y1="95" x2="125" y2="95" stroke="#050505" strokeWidth="1.5" opacity="0.5" />
                    <line x1="100" y1="85" x2="100" y2="140" stroke="#050505" strokeWidth="1.5" opacity="0.4" />
                    {/* Arms */}
                    <path d="M 58 72 L 40 145 L 48 150 L 64 85 Z" fill="url(#bodyHeatmap)" />
                    <path d="M 142 72 L 160 145 L 152 150 L 136 85 Z" fill="url(#bodyHeatmap)" />
                    {/* Legs */}
                    <path d="M 75 155 L 68 280 L 85 280 L 96 160 Z" fill="url(#bodyHeatmap)" />
                    <path d="M 125 155 L 132 280 L 115 280 L 104 160 Z" fill="url(#bodyHeatmap)" />
                  </g>
                )}

                {selectedAngle === "SIDE" && (
                  <g stroke="#FFD91C" strokeWidth="1.5">
                    {/* Side Profile */}
                    <path
                      d="M 85 70 Q 130 95 115 155 Q 85 160 85 70 Z"
                      fill="url(#bodyHeatmap)"
                      opacity="0.85"
                    />
                    {/* Side Arm */}
                    <path d="M 95 75 L 90 150 L 105 150 L 110 80 Z" fill="url(#bodyHeatmap)" />
                    {/* Side Leg */}
                    <path d="M 90 155 Q 120 200 95 280 L 80 280 Q 75 200 90 155 Z" fill="url(#bodyHeatmap)" />
                  </g>
                )}

                {selectedAngle === "BACK" && (
                  <g stroke="#FFD91C" strokeWidth="1.5">
                    {/* Back Lat Spread */}
                    <path
                      d="M 55 70 L 145 70 L 120 155 L 80 155 Z"
                      fill="url(#bodyHeatmap)"
                      opacity="0.85"
                    />
                    {/* Spine line */}
                    <line x1="100" y1="70" x2="100" y2="155" stroke="#050505" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
                    {/* Legs */}
                    <path d="M 80 155 L 72 280 L 88 280 L 98 160 Z" fill="url(#bodyHeatmap)" />
                    <path d="M 120 155 L 128 280 L 112 280 L 102 160 Z" fill="url(#bodyHeatmap)" />
                  </g>
                )}
              </svg>

              {/* Angle watermark */}
              <div className="absolute bottom-3 left-4 text-[11px] font-mono font-bold text-accent">
                VIEW: {selectedAngle} · 1080p DEPTH WIREFRAME
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Dense Muscle Tissue (+4% Hypertrophy)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD91C]" />
                Reduced Adipose Layer (-3.2% Fat)
              </span>
            </div>
          </div>

          {/* Right Column: Weight History Graph (5 Cols) */}
          <div className="lg:col-span-5">
            <AreaTrend
              title="Kiosk Base Scale Progression"
              units="kg"
              subtitle="Precision load-cell readings from TechGIS 3D Kiosk"
              data={weightHistory.map((w) => ({
                label: w.date.split(" ")[0],
                value: w.weight,
                formattedValue: `${w.weight} kg`,
              }))}
              yAxisFromZero={false}
              isSample={true}
            />
          </div>
        </div>
      </div>
    </TrainerPortalLayout>
  );
}
