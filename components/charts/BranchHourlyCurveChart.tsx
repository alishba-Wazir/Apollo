"use client";

import React, { useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Clock, Users, Sparkles, Moon } from "lucide-react";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";

interface HourlyPoint {
  hour: string;
  visits: number;
  capacityRate: number;
}

const DEFAULT_HOURLY: HourlyPoint[] = [
  { hour: "06:00", visits: 8, capacityRate: 8 },
  { hour: "07:00", visits: 24, capacityRate: 24 },
  { hour: "08:00", visits: 38, capacityRate: 38 },
  { hour: "09:00", visits: 31, capacityRate: 31 },
  { hour: "10:00", visits: 19, capacityRate: 19 },
  { hour: "11:00", visits: 14, capacityRate: 14 },
  { hour: "12:00", visits: 12, capacityRate: 12 },
  { hour: "13:00", visits: 16, capacityRate: 16 },
  { hour: "14:00", visits: 18, capacityRate: 18 },
  { hour: "15:00", visits: 15, capacityRate: 15 },
  { hour: "16:00", visits: 26, capacityRate: 26 },
  { hour: "17:00", visits: 39, capacityRate: 39 },
  { hour: "18:00", visits: 52, capacityRate: 52 },
  { hour: "19:00", visits: 64, capacityRate: 64 },
  { hour: "20:00", visits: 58, capacityRate: 58 },
  { hour: "21:00", visits: 41, capacityRate: 41 },
  { hour: "22:00", visits: 22, capacityRate: 22 },
  { hour: "23:00", visits: 6, capacityRate: 6 },
];

export const BranchHourlyCurveChart: React.FC<{
  branchName?: string;
  currentHour?: string;
}> = ({ branchName = "TRI FIT Seaview Flagship", currentHour = "17:00" }) => {
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    hasAnimatedRef.current = true;
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <ChartTooltip
          active={active}
          customLabel={`${label} • ${branchName}`}
          customValue={`${data.visits} in club`}
          unit="Visits"
          secondaryLabel="Floor Load"
          secondaryValue={`${data.capacityRate}%`}
          isSample={true}
        />
      );
    }
    return null;
  };

  return (
    <ChartCard
      title="Live Hourly Attendance Velocity"
      units="Members"
      subtitle={`${branchName} • Live turnstile check-in stream & peak hours`}
      badge={
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
          style={{
            background: "rgba(255, 217, 28, 0.15)",
            color: "var(--accent)",
            border: "1px solid rgba(255, 217, 28, 0.3)",
          }}
        >
          Peak: 19:00 (64 Members)
        </span>
      }
      isSample={true}
    >
      <div className="w-full space-y-4 pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DEFAULT_HOURLY} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="branchHourlyGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-line)" stopOpacity={0.4} />
                  <stop offset="60%" stopColor="var(--chart-line)" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="var(--chart-line)" stopOpacity={0.0} />
                </linearGradient>
                <filter id="branchGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--chart-glow)" />
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />

              <XAxis
                dataKey="hour"
                stroke="var(--text-muted)"
                tick={{ fill: "var(--text-muted)", fontSize: 10.5 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                stroke="var(--text-muted)"
                tick={{ fill: "var(--text-muted)", fontSize: 10.5 }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine
                x={currentHour}
                stroke="var(--accent)"
                strokeDasharray="4 4"
                label={{
                  value: "NOW",
                  position: "insideTopLeft",
                  fill: "var(--accent)",
                  fontSize: 10,
                  fontWeight: 900,
                }}
              />

              <Area
                type="monotone"
                dataKey="visits"
                stroke="var(--chart-line)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#branchHourlyGlow)"
                filter="url(#branchGlow)"
                isAnimationActive={!hasAnimatedRef.current}
                animationDuration={900}
                activeDot={{
                  r: 6,
                  stroke: "var(--bg)",
                  strokeWidth: 2.5,
                  fill: "var(--accent)",
                  filter: "drop-shadow(0 0 6px var(--accent))",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[var(--border)] text-[11px]">
          <div className="p-2 rounded-[8px]" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
            <span style={{ color: "var(--text-muted)" }} className="block">Morning Peak</span>
            <strong className="font-mono text-[12px]" style={{ color: "var(--text)" }}>08:00 (38 visits)</strong>
          </div>
          <div className="p-2 rounded-[8px]" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
            <span style={{ color: "var(--text-muted)" }} className="block">Afternoon Flow</span>
            <strong className="font-mono text-[12px]" style={{ color: "var(--text)" }}>14:00 (18 visits)</strong>
          </div>
          <div className="p-2 rounded-[8px]" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
            <span style={{ color: "var(--text-muted)" }} className="block">Evening Peak</span>
            <strong className="font-mono text-[12px]" style={{ color: "var(--accent)" }}>19:00 (64 visits)</strong>
          </div>
          <div className="p-2 rounded-[8px]" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
            <span style={{ color: "var(--text-muted)" }} className="block">Late Night Shift</span>
            <strong className="font-mono text-[12px]" style={{ color: "var(--text)" }}>21:30 - 23:00 Active</strong>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};
