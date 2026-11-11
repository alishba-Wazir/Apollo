"use client";

import React, { useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { TrendingDown } from "lucide-react";
import { ChartTooltip } from "./ChartTooltip";

interface MemberHabitDropChartProps {
  memberName: string;
  normalVisits: number;
  daysAway: number;
}

export const MemberHabitDropChart: React.FC<MemberHabitDropChartProps> = ({
  memberName,
  normalVisits = 3.5,
  daysAway = 14,
}) => {
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    hasAnimatedRef.current = true;
  }, []);

  const data = [
    { week: "W-7", visits: normalVisits, benchmark: normalVisits },
    { week: "W-6", visits: normalVisits, benchmark: normalVisits },
    { week: "W-5", visits: Math.round(normalVisits), benchmark: normalVisits },
    { week: "W-4", visits: Math.max(1, Math.round(normalVisits - 1)), benchmark: normalVisits },
    { week: "W-3", visits: Math.max(1, Math.round(normalVisits - 1.5)), benchmark: normalVisits },
    { week: "W-2", visits: 1, benchmark: normalVisits },
    { week: "W-1", visits: 0, benchmark: normalVisits },
    { week: "Current", visits: 0, benchmark: normalVisits },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <ChartTooltip
          active={active}
          customLabel={`${label} • ${memberName}`}
          customValue={`${point.visits} visits`}
          unit="Visits"
          secondaryLabel="Baseline Habit"
          secondaryValue={`${point.benchmark}x/wk`}
          isSample={true}
        />
      );
    }
    return null;
  };

  return (
    <div
      className="p-4 rounded-[16px] space-y-3 transition-colors"
      style={{
        background: "var(--glass)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-[800]" style={{ color: "var(--text)" }}>
          <TrendingDown className="w-4 h-4" style={{ color: "var(--negative)" }} />
          <span>Behavioral Habit Trajectory</span>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            color: "var(--negative)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          {daysAway} Days Absent
        </span>
      </div>

      <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Tracking <strong style={{ color: "var(--text)" }}>{memberName}&apos;s</strong> weekly frequency drop against historical baseline of <strong style={{ color: "var(--text)" }}>{normalVisits}x/wk</strong>.
      </p>

      <div className="h-44 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />

            <XAxis
              dataKey="week"
              stroke="var(--text-muted)"
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              stroke="var(--text-muted)"
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace" }}
              domain={[0, Math.ceil(normalVisits + 1)]}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={normalVisits}
              stroke="var(--text-muted)"
              strokeDasharray="3 3"
              label={{
                value: `Baseline ${normalVisits}x`,
                position: "insideTopRight",
                fill: "var(--text-muted)",
                fontSize: 9.5,
              }}
            />

            <Line
              type="monotone"
              dataKey="visits"
              stroke="var(--negative)"
              strokeWidth={2.5}
              isAnimationActive={!hasAnimatedRef.current}
              animationDuration={850}
              dot={{ r: 3.5, stroke: "var(--negative)", strokeWidth: 2, fill: "var(--bg)" }}
              activeDot={{ r: 5.5, stroke: "var(--bg)", strokeWidth: 2, fill: "var(--negative)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[10.5px] pt-1 border-t border-[var(--border)]" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--negative)" }} />
          <span>Actual visits</span>
        </span>
        <span className="flex items-center gap-1.5 font-mono">
          <span className="w-3 h-0.5" style={{ background: "var(--text-muted)" }} />
          <span>Normal: {normalVisits}x/wk</span>
        </span>
      </div>
    </div>
  );
};
