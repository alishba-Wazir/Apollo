"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";

interface FunnelStep {
  label: string;
  count: number;
  sublabel: string;
  color: string;
  percentage: number;
}

const FUNNEL_STEPS: FunnelStep[] = [
  {
    label: "Flagged Absent",
    count: 32,
    sublabel: "Members away >2x baseline interval",
    color: "rgba(245, 197, 24, 0.4)",
    percentage: 100,
  },
  {
    label: "AI Drafts Prepared",
    count: 32,
    sublabel: "Personalized in English & Urdu",
    color: "rgba(245, 197, 24, 0.7)",
    percentage: 100,
  },
  {
    label: "Manager Approved",
    count: 24,
    sublabel: "Human approved & dispatched (Auto-send OFF)",
    color: "var(--bar-gradient-from)",
    percentage: 75,
  },
  {
    label: "Re-engaged / Returned",
    count: 19,
    sublabel: "Checked in within 7 days of outreach",
    color: "var(--accent)",
    percentage: 59,
  },
];

export const RetentionFunnelChart: React.FC = () => {
  return (
    <div className="glass-panel p-5 border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="badge-yellow text-[10px] font-bold">RECOVERY FUNNEL</span>
            <span className="text-[11.5px] text-text-muted">Win-back AI Pipeline</span>
          </div>
          <h3 className="text-[17px] font-[800] text-text tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Member Win-Back Conversion
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-text-muted uppercase font-bold block">
            Retained PKR Impact
          </span>
          <span className="text-[15px] font-[900] text-positive font-mono">
            +PKR 342,000 / mo
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {FUNNEL_STEPS.map((step, idx) => (
          <div key={step.label} className="space-y-1">
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-glass border border-border flex items-center justify-center text-[10px] font-bold text-text-muted font-mono">
                  {idx + 1}
                </span>
                <span className="font-[800] text-text">{step.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[11px] text-text-muted">({step.percentage}%)</span>
                <strong className="text-text font-[800] text-[13px]">{step.count} members</strong>
              </div>
            </div>

            {/* Animated Progress Line */}
            <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${step.percentage}%` }}
                transition={{ duration: 1.2, delay: idx * 0.15, ease: "easeOut" }}
                className="h-full rounded-full relative"
                style={{ backgroundColor: step.color }}
              >
                {/* Glowing edge on bar */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                  style={{ backgroundColor: step.color }}
                />
              </motion.div>
            </div>
            <span className="text-[10.5px] text-text-muted block pl-7">{step.sublabel}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-text-muted">
        <span className="flex items-center gap-1.5 text-positive font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          59.4% Win-back Conversion Rate
        </span>
        <span>Auto-send is locked OFF</span>
      </div>
    </div>
  );
};
