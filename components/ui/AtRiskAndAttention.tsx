"use client";

import React from "react";
import { AlertCircle, Clock, Wrench } from "lucide-react";

export interface AtRiskBranchItem {
  branchName: string;
  count: number;
  maxCount?: number;
}

interface AtRiskAndAttentionProps {
  items?: AtRiskBranchItem[];
  className?: string;
  onSelectBranch?: (name: string) => void;
}

const DEFAULT_AT_RISK: AtRiskBranchItem[] = [
  { branchName: "Seaview DHA", count: 98, maxCount: 110 },
  { branchName: "LuckyOne Mall", count: 71, maxCount: 110 },
  { branchName: "Clifton", count: 64, maxCount: 110 },
  { branchName: "AJ Tower", count: 61, maxCount: 110 },
];

export const AtRiskAndAttention: React.FC<AtRiskAndAttentionProps> = ({
  items = DEFAULT_AT_RISK,
  className = "",
  onSelectBranch,
}) => {
  return (
    <div className={`w-full flex flex-col justify-between gap-5 select-none ${className}`}>
      {/* 1. At-risk members by branch */}
      <div>
        <div className="mb-3">
          <h3 className="text-[15px] font-[800] text-slate-900 dark:text-white">At-risk members by branch</h3>
          <p className="text-[12px] text-slate-500 dark:text-neutral-400 mt-0.5">
            Where Win-back AI has the most work.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const max = item.maxCount || 100;
            const widthPct = Math.min((item.count / max) * 100, 100);

            return (
              <div
                key={idx}
                onClick={() => onSelectBranch && onSelectBranch(item.branchName)}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11.5px] mb-1">
                  <span className="font-[600] text-slate-700 dark:text-neutral-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                    {item.branchName}
                  </span>
                  <span className="font-[800] text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#FFD91C] transition-colors">
                    {item.count}
                  </span>
                </div>
                {/* Yellow Bar matching screenshot */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFD91C] rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Needs attention */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/10">
        <h4 className="text-[13.5px] font-[800] text-slate-900 dark:text-white mb-2.5">
          Needs attention
        </h4>

        <div className="space-y-2">
          {/* Attention Card 1 */}
          <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-white/10 hover:border-amber-500 dark:hover:border-[#FFD91C]/40 transition-colors">
            <p className="text-[11.5px] text-slate-700 dark:text-neutral-300 leading-snug">
              <strong className="text-slate-900 dark:text-white font-bold">Coach Sara</strong> is 28 minutes late at Seaview DHA. A message is drafted for the manager to approve.
            </p>
          </div>

          {/* Attention Card 2 */}
          <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-white/10 hover:border-amber-500 dark:hover:border-[#FFD91C]/40 transition-colors">
            <p className="text-[11.5px] text-slate-700 dark:text-neutral-300 leading-snug">
              Treadmill repair ticket is open at <strong className="text-slate-900 dark:text-white font-bold">LuckyOne Mall</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
