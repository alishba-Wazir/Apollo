"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Activity } from "lucide-react";

const DATA_WEEKLY = [
  { label: "W1", seaview: 420, ajTower: 310, sohaMall: 220, total: 950 },
  { label: "W2", seaview: 460, ajTower: 335, sohaMall: 245, total: 1040 },
  { label: "W3", seaview: 490, ajTower: 360, sohaMall: 260, total: 1110 },
  { label: "W4", seaview: 475, ajTower: 350, sohaMall: 250, total: 1075 },
  { label: "W5", seaview: 530, ajTower: 390, sohaMall: 290, total: 1210 },
  { label: "W6", seaview: 560, ajTower: 415, sohaMall: 310, total: 1285 },
  { label: "W7", seaview: 595, ajTower: 440, sohaMall: 325, total: 1360 },
  { label: "W8", seaview: 640, ajTower: 470, sohaMall: 345, total: 1455 },
];

const DATA_DAILY = [
  { label: "Mon", seaview: 92, ajTower: 68, sohaMall: 51, total: 211 },
  { label: "Tue", seaview: 98, ajTower: 72, sohaMall: 54, total: 224 },
  { label: "Wed", seaview: 105, ajTower: 79, sohaMall: 58, total: 242 },
  { label: "Thu", seaview: 94, ajTower: 71, sohaMall: 50, total: 215 },
  { label: "Fri", seaview: 78, ajTower: 60, sohaMall: 42, total: 180 }, // Friday prayer lull
  { label: "Sat", seaview: 112, ajTower: 85, sohaMall: 63, total: 260 },
  { label: "Sun", seaview: 86, ajTower: 65, sohaMall: 47, total: 198 },
];

export const NetworkAttendanceChart: React.FC<{ selectedBranchId?: string | null }> = ({
  selectedBranchId,
}) => {
  const [timeframe, setTimeframe] = useState<"weekly" | "daily">("weekly");
  const data = timeframe === "weekly" ? DATA_WEEKLY : DATA_DAILY;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 border border-border shadow-2xl rounded-[12px] text-[12px] min-w-[190px]">
          <div className="font-[800] text-text mb-2 pb-1 border-b border-border/60 flex items-center justify-between">
            <span>{timeframe === "weekly" ? `Week ${label}` : label}</span>
            <span className="text-[10px] text-accent font-mono font-bold">
              {payload.reduce((acc: number, p: any) => acc + (p.value || 0), 0)} visits
            </span>
          </div>
          <div className="space-y-1.5 font-mono">
            {payload.map((entry: any) => (
              <div key={entry.name} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-text-muted text-[11px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}
                </span>
                <span className="font-bold text-text">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-5 border border-border space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-yellow text-[10px] font-bold">LIVE TELEMETRY</span>
            <span className="text-[12px] text-text-muted">Multi-Branch Attendance Velocity</span>
          </div>
          <h3 className="text-[18px] font-[800] text-text tracking-tight flex items-center gap-2 mt-0.5">
            <TrendingUp className="w-5 h-5 text-accent" />
            Network Attendance & Member Visits Trend
          </h3>
        </div>

        {/* Timeframe Toggle with animated slide */}
        <div className="flex items-center gap-1 bg-glass p-1 rounded-[12px] border border-border self-start sm:self-auto">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-3 py-1 rounded-[9px] text-[11.5px] font-[700] transition-all ${
              timeframe === "weekly"
                ? "bg-accent text-on-accent shadow-[0_2px_8px_rgba(255,217,28,0.3)]"
                : "text-text-muted hover:text-text"
            }`}
          >
            Last 8 Weeks
          </button>
          <button
            onClick={() => setTimeframe("daily")}
            className={`px-3 py-1 rounded-[9px] text-[11.5px] font-[700] transition-all ${
              timeframe === "daily"
                ? "bg-accent text-on-accent shadow-[0_2px_8px_rgba(255,217,28,0.3)]"
                : "text-text-muted hover:text-text"
            }`}
          >
            Current Week (Day by Day)
          </button>
        </div>
      </div>

      {/* SVG Animated Chart */}
      <motion.div
        key={timeframe}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="h-72 w-full pt-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSeaview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD91C" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#FFD91C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorAjTower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorSohaMall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />

            <XAxis
              dataKey="label"
              stroke="currentColor"
              className="text-[11px] opacity-60 font-mono"
              tickLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-[11px] opacity-60 font-mono"
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Seaview Flagship Area & Line */}
            {(!selectedBranchId || selectedBranchId === "branch-seaview") && (
              <Area
                type="monotone"
                dataKey="seaview"
                name="Seaview Flagship (Karachi)"
                stroke="#FFD91C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSeaview)"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-in-out"
                activeDot={{ r: 6, stroke: "var(--bg)", strokeWidth: 2, fill: "#FFD91C" }}
              />
            )}

            {/* AJ Tower Area & Line */}
            {(!selectedBranchId || selectedBranchId === "branch-ajtower") && (
              <Area
                type="monotone"
                dataKey="ajTower"
                name="AJ Tower (Islamabad)"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorAjTower)"
                isAnimationActive={true}
                animationDuration={1400}
                animationEasing="ease-in-out"
                activeDot={{ r: 5, stroke: "#F59E0B", strokeWidth: 2, fill: "#000" }}
              />
            )}

            {/* Soha Mall Area & Line */}
            {(!selectedBranchId || selectedBranchId === "branch-sohamall") && (
              <Area
                type="monotone"
                dataKey="sohaMall"
                name="Soha Mall (Islamabad Ladies)"
                stroke="#FBBF24"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSohaMall)"
                isAnimationActive={true}
                animationDuration={1600}
                animationEasing="ease-in-out"
                activeDot={{ r: 5, stroke: "#FBBF24", strokeWidth: 2, fill: "#000" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend & Stats Banner (Strict Amber / Gold Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60">
        <div className="flex items-center gap-2 p-2 rounded-[10px] bg-glass">
          <span className="w-3 h-3 rounded-full bg-[#FFD91C] shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-[800] text-text block truncate">
              Seaview Flagship
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              640 visits/wk • +12% MoM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-[10px] bg-glass">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B] shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-[800] text-text block truncate">
              AJ Tower
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              470 visits/wk • +9% MoM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-[10px] bg-glass">
          <span className="w-3 h-3 rounded-full bg-[#FBBF24] shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-[800] text-text block truncate">
              Soha Mall (Ladies)
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              345 visits/wk • +15% MoM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
