"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Info, ExternalLink } from "lucide-react";

interface SchematicBranchMapProps {
  selectedBranchId: string | null;
  onSelectBranch: (id: string | null) => void;
  className?: string;
}

export const SchematicBranchMap: React.FC<SchematicBranchMapProps> = ({
  selectedBranchId,
  onSelectBranch,
  className = "",
}) => {
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  return (
    <div className={`w-full flex flex-col gap-3 select-none ${className}`}>
      {/* Dual City Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Panel 1: Karachi Cluster */}
        <div className="relative rounded-[16px] bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 p-4 overflow-hidden min-h-[260px] flex flex-col justify-between group">
          {/* Panel Header */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[12px] font-[700] text-slate-800 dark:text-gray-200">
              Karachi · 3 clubs · 3,900 members
            </span>
            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-mono">SINDH</span>
          </div>

          {/* SVG Map Canvas: Karachi */}
          <div className="relative w-full h-[180px] my-auto">
            <svg
              viewBox="0 0 320 180"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Subtle Road / Grid Lines */}
              <g stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="1" fill="none">
                <path d="M 30 20 L 180 80 L 290 50" />
                <path d="M 120 10 L 140 120 L 220 150" />
                <path d="M 50 100 L 280 110" />
                <path d="M 80 50 L 190 140" />
                <path d="M 160 30 L 260 160" />
                <path d="M 220 20 L 240 170" strokeDasharray="3 3" />
                <path d="M 20 140 Q 140 125 300 135" stroke="rgba(255,217,28,0.25)" strokeWidth="1.5" />
              </g>

              {/* Arabian Sea Coastline & Label */}
              <path
                d="M 10 160 Q 90 145 180 155 T 310 148 L 310 180 L 10 180 Z"
                fill="currentColor"
                stroke="currentColor"
                className="text-slate-200/60 dark:text-white/[0.04]"
                strokeWidth="1"
              />
              <text
                x="160"
                y="172"
                textAnchor="middle"
                className="fill-slate-400 dark:fill-[#4b5563]"
                fontSize="8.5"
                fontWeight="700"
                letterSpacing="0.2em"
                fontFamily="sans-serif"
              >
                ARABIAN SEA
              </text>

              {/* Pin 1: LuckyOne Mall (Karachi North / Federal B Area) */}
              <g
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectBranch("branch-luckyone")}
                onMouseEnter={() => setHoveredBranch("branch-luckyone")}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                <circle
                  cx="210"
                  cy="45"
                  r={selectedBranchId === "branch-luckyone" ? "22" : "18"}
                  fill="rgba(255, 217, 28, 0.2)"
                  stroke="#FFD91C"
                  strokeWidth="1.5"
                  className={selectedBranchId === "branch-luckyone" ? "animate-pulse" : ""}
                />
                <circle cx="210" cy="45" r="7" fill="#FFD91C" />
                <text
                  x="210"
                  y="28"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-900 dark:text-white"
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  LuckyOne Mall
                </text>
                <text
                  x="210"
                  y="62"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-500 dark:text-[#9ca3af]"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  1,180
                </text>
              </g>

              {/* Pin 2: Clifton (Karachi West / Coastal) */}
              <g
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectBranch("branch-clifton")}
                onMouseEnter={() => setHoveredBranch("branch-clifton")}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                <circle
                  cx="95"
                  cy="115"
                  r={selectedBranchId === "branch-clifton" ? "20" : "16"}
                  fill="rgba(255, 217, 28, 0.2)"
                  stroke="#FFD91C"
                  strokeWidth="1.5"
                  className={selectedBranchId === "branch-clifton" ? "animate-pulse" : ""}
                />
                <circle cx="95" cy="115" r="6" fill="#FFD91C" />
                <text
                  x="95"
                  y="98"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-900 dark:text-white"
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  Clifton
                </text>
                <text
                  x="95"
                  y="131"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-500 dark:text-[#9ca3af]"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  1,100
                </text>
              </g>

              {/* Pin 3: Seaview DHA (Flagship - Largest Pin) */}
              <g
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectBranch("branch-seaview")}
                onMouseEnter={() => setHoveredBranch("branch-seaview")}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                <circle
                  cx="165"
                  cy="125"
                  r={selectedBranchId === "branch-seaview" ? "26" : "22"}
                  fill="rgba(255, 217, 28, 0.25)"
                  stroke="#FFD91C"
                  strokeWidth="2"
                  className={selectedBranchId === "branch-seaview" ? "animate-pulse" : ""}
                />
                <circle cx="165" cy="125" r="9" fill="#FFD91C" />
                <text
                  x="165"
                  y="106"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-900 dark:text-white"
                  fontSize="10"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  Seaview DHA
                </text>
                <text
                  x="165"
                  y="144"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-500 dark:text-[#9ca3af]"
                  fontSize="8.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  1,620
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Panel 2: Islamabad Cluster */}
        <div className="relative rounded-[16px] bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 p-4 overflow-hidden min-h-[260px] flex flex-col justify-between group">
          {/* Panel Header */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[12px] font-[700] text-slate-800 dark:text-gray-200">
              Islamabad · 1 club · 1,040 members
            </span>
            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-mono">FEDERAL</span>
          </div>

          {/* SVG Map Canvas: Islamabad */}
          <div className="relative w-full h-[180px] my-auto">
            <svg
              viewBox="0 0 320 180"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Margalla Hills Ridge Lines & Label */}
              <g stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="1" fill="none">
                <path d="M 20 25 Q 70 15 120 28 T 220 18 T 300 25" />
                <path d="M 40 38 Q 90 28 140 40 T 240 30 T 290 38" />
                <path d="M 10 50 Q 80 42 160 52 T 310 48" stroke="rgba(255,217,28,0.25)" />
              </g>
              <text
                x="160"
                y="20"
                textAnchor="middle"
                className="fill-slate-400 dark:fill-[#4b5563]"
                fontSize="8.5"
                fontWeight="700"
                letterSpacing="0.2em"
                fontFamily="sans-serif"
              >
                MARGALLA HILLS
              </text>

              {/* Road / Sector Grid Lines */}
              <g stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="1" fill="none">
                <path d="M 50 70 L 270 70" />
                <path d="M 70 100 L 250 100" />
                <path d="M 90 130 L 230 130" />
                <path d="M 100 50 L 80 160" />
                <path d="M 160 45 L 160 170" stroke="rgba(255,217,28,0.25)" strokeWidth="1.5" />
                <path d="M 220 50 L 240 160" />
                <path d="M 60 150 L 260 60" strokeDasharray="3 3" />
              </g>

              {/* Pin: AJ Tower (Gulberg Greens, Islamabad) */}
              <g
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectBranch("branch-ajtower")}
                onMouseEnter={() => setHoveredBranch("branch-ajtower")}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                <circle
                  cx="160"
                  cy="110"
                  r={selectedBranchId === "branch-ajtower" ? "24" : "20"}
                  fill="rgba(255, 217, 28, 0.22)"
                  stroke="#FFD91C"
                  strokeWidth="2"
                  className={selectedBranchId === "branch-ajtower" ? "animate-pulse" : ""}
                />
                <circle cx="160" cy="110" r="8" fill="#FFD91C" />
                <text
                  x="160"
                  y="92"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-900 dark:text-white"
                  fontSize="10"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  AJ Tower
                </text>
                <text
                  x="160"
                  y="128"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-500 dark:text-[#9ca3af]"
                  fontSize="8.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  1,040
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Footnote: Soha Mall Coming Soon (matching screenshot text) */}
      <div className="flex items-center gap-2 pt-1 text-[11.5px] text-slate-500 dark:text-gray-400">
        <span className="w-2.5 h-2.5 rounded-full border border-slate-400 dark:border-gray-500 inline-block shrink-0" />
        <span>
          Soha Mall is coming soon. Its city is still to be confirmed, so it has no pin yet.
        </span>
      </div>
    </div>
  );
};
