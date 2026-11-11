"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Building2, PieChart } from "lucide-react";

interface BranchCapacityItem {
  name: string;
  shortName: string;
  city: string;
  capacity: number;
  occupancy: number;
  rate: number;
}

const BRANCH_CAPACITIES: BranchCapacityItem[] = [
  {
    name: "TRI FIT Seaview Flagship",
    shortName: "Seaview",
    city: "Karachi",
    capacity: 300,
    occupancy: 84,
    rate: 28,
  },
  {
    name: "TRI FIT AJ Tower",
    shortName: "AJ Tower",
    city: "Islamabad",
    capacity: 250,
    occupancy: 65,
    rate: 26,
  },
  {
    name: "TRI FIT Soha Mall",
    shortName: "Soha Mall",
    city: "Islamabad",
    capacity: 180,
    occupancy: 48,
    rate: 27,
  },
];

export const CapacityUtilizationChart: React.FC = () => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as BranchCapacityItem;
      return (
        <div className="glass-panel p-3 border border-border shadow-xl rounded-[12px] text-[12px] min-w-[180px]">
          <strong className="block text-text font-[800] mb-1">{data.name}</strong>
          <div className="text-[11px] text-text-muted mb-1.5">{data.city}</div>
          <div className="space-y-1 font-mono text-[11.5px]">
            <div className="flex justify-between">
              <span className="text-text-muted">Live Occupancy:</span>
              <strong className="text-accent">{data.occupancy} members</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Max Capacity:</span>
              <span className="text-text">{data.capacity}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border/60">
              <span className="text-text-muted">Utilization:</span>
              <strong className="text-text">{data.rate}%</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-5 border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="badge-yellow text-[10px] font-bold">CAPACITY GAUGES</span>
            <span className="text-[11.5px] text-text-muted">Live Headcount vs Ceiling</span>
          </div>
          <h3 className="text-[17px] font-[800] text-text tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent" />
            Branch Utilization & Load Balance
          </h3>
        </div>
        <span className="text-[11px] font-mono text-text-muted bg-glass px-2.5 py-1 rounded-[10px] border border-border">
          Total Cap: 730
        </span>
      </div>

      <div className="h-60 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={BRANCH_CAPACITIES}
            margin={{ top: 15, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
            <XAxis
              dataKey="shortName"
              stroke="currentColor"
              className="text-[11px] opacity-75 font-semibold"
              tickLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-[10.5px] opacity-60 font-mono"
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="occupancy"
              name="Active Members in Club"
              fill="var(--accent)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={850}
            >
              {BRANCH_CAPACITIES.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? "var(--accent)"
                      : index === 1
                      ? "var(--bar-gradient-from)"
                      : "rgba(245, 197, 24, 0.5)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-[11px] font-mono">
        {BRANCH_CAPACITIES.map((b, i) => (
          <div key={b.name} className="p-2 rounded-[8px] bg-glass text-center">
            <span className="text-text-muted block text-[10px] uppercase font-bold truncate">
              {b.shortName}
            </span>
            <span className="text-text font-bold block mt-0.5">
              {b.occupancy} / {b.capacity}
            </span>
            <span className="text-accent text-[10px] font-semibold">{b.rate}% Load</span>
          </div>
        ))}
      </div>
    </div>
  );
};
