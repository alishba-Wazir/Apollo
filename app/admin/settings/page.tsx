"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  Settings,
  Moon,
  ShieldCheck,
  Cpu,
  Receipt,
  Users2,
  UploadCloud,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Lock,
  Unlock,
  Key,
  RefreshCw,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Download,
  Activity,
  HardDrive,
  Camera,
  Scale,
  Sparkle,
  Sliders,
  DollarSign,
  Check,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "hardware" | "tax" | "rbac" | "sync"
  >("hardware");

  useEffect(() => {
    if (initialTab === "hardware") setActiveTab("hardware");
    else if (initialTab === "tax") setActiveTab("tax");
    else if (initialTab === "rbac") setActiveTab("rbac");
    else if (initialTab === "sync") setActiveTab("sync");
  }, [initialTab]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Hardware Mint Dispenser Stock State
  const [kiosks, setKiosks] = useState([
    {
      branch: "TRI FIT Seaview Flagship (Karachi)",
      ip: "192.168.10.21",
      latency: "4ms",
      topCamera: "4K Depth Sensor (120 FPS Calibrated)",
      middleScreen: "1080x1920 Touch (60 FPS)",
      baseScale: "Zeroed (±0.05 kg accuracy)",
      mintCapacityPct: 82,
      mintsRemaining: 410,
      status: "OPTIMAL",
    },
    {
      branch: "TRI FIT LuckyOne Mall (Karachi)",
      ip: "192.168.20.15",
      latency: "6ms",
      topCamera: "4K Depth Sensor (120 FPS Calibrated)",
      middleScreen: "1080x1920 Touch (60 FPS)",
      baseScale: "Zeroed (±0.05 kg accuracy)",
      mintCapacityPct: 18,
      mintsRemaining: 90,
      status: "REFILL_WARNING",
    },
    {
      branch: "TRI FIT Clifton (Karachi)",
      ip: "192.168.30.12",
      latency: "5ms",
      topCamera: "4K Depth Sensor (120 FPS Calibrated)",
      middleScreen: "1080x1920 Touch (60 FPS)",
      baseScale: "Zeroed (±0.05 kg accuracy)",
      mintCapacityPct: 91,
      mintsRemaining: 455,
      status: "OPTIMAL",
    },
    {
      branch: "TRI FIT AJ Tower (Islamabad)",
      ip: "192.168.40.18",
      latency: "8ms",
      topCamera: "4K Depth Sensor (120 FPS Calibrated)",
      middleScreen: "1080x1920 Touch (60 FPS)",
      baseScale: "Zeroed (±0.05 kg accuracy)",
      mintCapacityPct: 64,
      mintsRemaining: 320,
      status: "OPTIMAL",
    },
  ]);

  // 3. Tax Tokens State
  const [fbrToken, setFbrToken] = useState("FBR-ISB-POS-99812-LIVE-KEY");
  const [srbToken, setSrbToken] = useState("SRB-KHI-POS-44819-LIVE-KEY");
  const [managerDiscountLimit, setManagerDiscountLimit] = useState(10);
  const [directorDiscountLimit, setDirectorDiscountLimit] = useState(20);

  // 4. RBAC Matrix State
  const [rbacPermissions, setRbacPermissions] = useState({
    manualGateOverride: { superAdmin: true, branchManager: true, receptionist: false },
    ibftOcrApproval: { superAdmin: true, branchManager: true, receptionist: false },
    blacklistModify: { superAdmin: true, branchManager: false, receptionist: false },
    pettyCashSignoff: { superAdmin: true, branchManager: true, receptionist: false },
    winbackAutoDispatch: { superAdmin: false, branchManager: false, receptionist: false }, // Permanently OFF
  });

  // 5. CSV Sync State
  const [csvContent, setCsvContent] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefillMints = (branchName: string) => {
    setKiosks((prev) =>
      prev.map((k) =>
        k.branch.includes(branchName)
          ? { ...k, mintCapacityPct: 100, mintsRemaining: 500, status: "OPTIMAL" }
          : k
      )
    );
    showNotification(`Mint dispenser refilled for ${branchName}. Sensor reset to 100%.`);
  };

  return (
    <AdminPortalLayout activeItem="settings">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Settings & System Governance</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Production Live
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              3D kiosk sensors, FBR/SRB POS tax endpoints, security encryption, and RBAC governance
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[var(--muted)] bg-[var(--card)] border border-[var(--line)] px-3 py-1 rounded-xl shadow-sm">
              Env: <strong className="text-emerald-500">Production</strong>
            </span>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[var(--chip)] border border-[var(--accent)]/40 text-[var(--text)] text-[13px] font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 4-Tab Horizontal Sub-Navigation */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("hardware")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "hardware"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>1. Smart Hardware & Kiosks</span>
          </button>

          <button
            onClick={() => setActiveTab("tax")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "tax"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>2. Tax & Billing Rules</span>
          </button>

          <button
            onClick={() => setActiveTab("rbac")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "rbac"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Roles & Anti-Theft RBAC</span>
          </button>

          <button
            onClick={() => setActiveTab("sync")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "sync"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>4. Data Sync (CSV & Webhooks)</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: SMART HARDWARE & KIOSKS (TECHGIS 3D TELEMETRY)
           ========================================================================= */}
        {activeTab === "hardware" && (
          <div className="space-y-6">
            <div className="glass p-5 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[var(--accent)]" />
                  <span>TechGIS F-Shaped 3D Kiosk & ZKTeco Turnstile Network</span>
                </h3>
                <p className="body-label text-xs text-[var(--muted)] mt-1">
                  Hardware telemetry across all 4 operational clubs in Karachi and Islamabad.
                </p>
              </div>

              <div className="text-xs text-[var(--muted)] font-mono">
                Hardware Protocol: TCP/IP & MQTT WebSocket
              </div>
            </div>

            {/* Kiosks Roster */}
            <div className="space-y-4">
              {kiosks.map((kiosk, idx) => (
                <div
                  key={idx}
                  className="glass p-5 rounded-2xl space-y-4 shadow-lg hover:border-[var(--accent)]/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
                    <div>
                      <h4 className="font-bold text-[var(--text)] text-sm">{kiosk.branch}</h4>
                      <div className="text-xs font-mono text-[var(--muted)] mt-0.5">
                        Static Controller IP: <strong className="text-[var(--accent)]">{kiosk.ip}</strong> · Latency: {kiosk.latency}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {kiosk.status === "OPTIMAL" ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                          ● Online & Calibrated
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold animate-pulse">
                          ⚠️ Mint Dispenser Refill Alert
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4 Sensor Telemetry Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Sensor 1: Top Camera */}
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[var(--text)]">
                        <Camera className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Top Camera Sensor</span>
                      </div>
                      <div className="text-xs text-[var(--muted)]">{kiosk.topCamera}</div>
                      <div className="text-[10px] text-emerald-400 font-bold">Focal Plane: 1.8m OK</div>
                    </div>

                    {/* Sensor 2: Middle Screen */}
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[var(--text)]">
                        <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Middle Touch Screen</span>
                      </div>
                      <div className="text-xs text-[var(--muted)]">{kiosk.middleScreen}</div>
                      <div className="text-[10px] text-emerald-400 font-bold">Response: 12ms OK</div>
                    </div>

                    {/* Sensor 3: Base Weight Scale */}
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[var(--text)]">
                        <Scale className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Base Scale Sensor</span>
                      </div>
                      <div className="text-xs text-[var(--muted)]">{kiosk.baseScale}</div>
                      <div className="text-[10px] text-emerald-400 font-bold">Auto-Tare Active</div>
                    </div>

                    {/* Sensor 4: Bottom Mint Dispenser */}
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-1">
                      <div className="flex items-center justify-between font-bold text-[var(--text)]">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span>Mint Dispenser</span>
                        </div>
                        <span className={`text-xs ${kiosk.mintCapacityPct < 30 ? "text-red-400 font-bold" : "text-[var(--accent)]"}`}>
                          {kiosk.mintCapacityPct}%
                        </span>
                      </div>
                      <div className="text-xs text-[var(--muted)]">
                        {kiosk.mintsRemaining} / 500 Mints Remaining
                      </div>
                      {kiosk.mintCapacityPct < 30 && (
                        <button
                          onClick={() => handleRefillMints(kiosk.branch.split(" ")[2])}
                          className="mt-1 text-[11px] font-bold text-[var(--accent)] hover:underline block cursor-pointer"
                        >
                          Confirm Restock Refill
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: TAX & BILLING RULES (FBR ISLAMABAD & SRB KARACHI)
           ========================================================================= */}
        {activeTab === "tax" && (
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl space-y-5 shadow-xl">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[var(--accent)]" />
                  <span>Pakistani Government Tax Authority API Endpoints</span>
                </h3>
                <p className="body-label text-xs text-[var(--muted)] mt-1">
                  Real-time invoice transmission to Sindh Revenue Board (SRB) and Federal Board of Revenue (FBR).
                </p>
              </div>

              {/* Authority 1: FBR Islamabad */}
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--text)] text-sm">
                      Federal Board of Revenue (FBR) — Islamabad POS
                    </h4>
                    <span className="text-xs text-[var(--muted)]">
                      Governs: TRI FIT AJ Tower (Gulberg Greens, Islamabad)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    Connected & Transmitting
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-[var(--muted)] font-bold uppercase mb-1">
                      FBR Digital POS Integration Token
                    </label>
                    <input
                      type="password"
                      value={fbrToken}
                      onChange={(e) => setFbrToken(e.target.value)}
                      className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--text)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--muted)] font-bold uppercase mb-1">
                      ICT Sales Tax on Gym Services
                    </label>
                    <input
                      type="text"
                      disabled
                      value="15.0% (Islamabad Capital Territory)"
                      className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--muted)] font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Authority 2: SRB Karachi */}
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--text)] text-sm">
                      Sindh Revenue Board (SRB) — Karachi POS
                    </h4>
                    <span className="text-xs text-[var(--muted)]">
                      Governs: Seaview Flagship, LuckyOne Mall, and Clifton Clubs
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    Connected & Transmitting
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-[var(--muted)] font-bold uppercase mb-1">
                      SRB Digital POS Integration Token
                    </label>
                    <input
                      type="password"
                      value={srbToken}
                      onChange={(e) => setSrbToken(e.target.value)}
                      className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--text)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--muted)] font-bold uppercase mb-1">
                      Sindh Sales Tax (SST) on Gym & Club Services
                    </label>
                    <input
                      type="text"
                      disabled
                      value="13.0% (Sindh Sales Tax)"
                      className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--muted)] font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Limits Governance */}
              <div className="pt-2 border-t border-[var(--line)] space-y-3">
                <h4 className="font-bold text-[var(--text)] text-sm">
                  Discount OTP Approval Limits & Staff Safeguards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                    <span className="text-[var(--muted)] block font-semibold">Front-Desk Receptionist</span>
                    <strong className="text-[var(--text)] block text-base mt-1">0% (Locked)</strong>
                    <span className="text-[10.5px] text-[var(--muted)]">No discount authorization</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                    <span className="text-[var(--muted)] block font-semibold">Branch Manager</span>
                    <strong className="text-[var(--accent)] block text-base mt-1">Up to 10%</strong>
                    <span className="text-[10.5px] text-[var(--muted)]">Requires Member OTP SMS confirmation</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                    <span className="text-[var(--muted)] block font-semibold">Regional Area Director</span>
                    <strong className="text-emerald-400 block text-base mt-1">Up to 20%</strong>
                    <span className="text-[10.5px] text-[var(--muted)]">Requires Executive Dual-Auth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ROLES & ANTI-THEFT RBAC
           ========================================================================= */}
        {activeTab === "rbac" && (
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                  <span>Anti-Theft Role-Based Access Control (RBAC) Matrix</span>
                </h3>
                <p className="body-label text-xs text-[var(--muted)] mt-1">
                  Strict segregation of duties to prevent cash misappropriation, illicit gate bypasses, and unauthorized discounting.
                </p>
              </div>

              <div className="rounded-xl border border-[var(--line)] overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--card)] text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                      <th className="py-3 px-4">Permission Scope</th>
                      <th className="py-3 px-4 text-center">Super Admin</th>
                      <th className="py-3 px-4 text-center">Branch Manager</th>
                      <th className="py-3 px-4 text-center">Receptionist Desk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    <tr className="hover:bg-[var(--card)] transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-[var(--text)] block font-bold">Manual Turnstile Gate Override</strong>
                        <span className="text-[10.5px] text-[var(--muted)]">Emergency front-desk gate release bypass</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">Full Access</td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--accent)]">Audit Logged</td>
                      <td className="py-3 px-4 text-center font-bold text-red-400">Locked ✕</td>
                    </tr>

                    <tr className="hover:bg-[var(--card)] transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-[var(--text)] block font-bold">IBFT OCR Approval Sign-Off</strong>
                        <span className="text-[10.5px] text-[var(--muted)]">Credit member account upon bank receipt verification</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">Full Access</td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--accent)]">Up to PKR 50k</td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--muted)]">Read-Only</td>
                    </tr>

                    <tr className="hover:bg-[var(--card)] transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-[var(--text)] block font-bold">CNIC Blacklist Addition & Revocation</strong>
                        <span className="text-[10.5px] text-[var(--muted)]">Hard-block individual at all 8 ZKTeco controllers</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">Full Access</td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--muted)]">Request Only</td>
                      <td className="py-3 px-4 text-center font-bold text-red-400">No Access</td>
                    </tr>

                    <tr className="hover:bg-[var(--card)] transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-[var(--text)] block font-bold">Petty Cash / Kiryana Slip Sign-Off</strong>
                        <span className="text-[10.5px] text-[var(--muted)]">Authorize branch cash expenditure reimbursement</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">Unlimited</td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--accent)]">Up to PKR 25k</td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--muted)]">Submit Only</td>
                    </tr>

                    <tr className="hover:bg-[var(--card)] transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-[var(--text)] block font-bold">Win-Back AI Auto-Dispatch Authorization</strong>
                        <span className="text-[10.5px] text-[var(--muted)]">Autonomous WhatsApp dispatch without human review</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--muted)]">Disabled (Safety Rule)</td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--muted)]">Disabled</td>
                      <td className="py-3 px-4 text-center font-bold text-[var(--muted)]">Disabled</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: DATA SYNC (CSV & MOBILE APP WEBHOOKS)
           ========================================================================= */}
        {activeTab === "sync" && (
          <div className="space-y-6">
            {/* Webhook Status Card */}
            <div className="glass p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[var(--text)] text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>TriFit Mobile App Real-Time Webhook Engine</span>
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Bidirectional sync between Flutter Mobile App and Apollo Enterprise Cloud.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  🟢 200 OK (142ms)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                  <span className="text-[var(--muted)] block font-semibold">Webhook Destination</span>
                  <span className="font-mono text-[var(--text)] text-xs truncate block mt-0.5">
                    https://api.trifit.com.pk/v1/webhooks/mobile-sync
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                  <span className="text-[var(--muted)] block font-semibold">Sync Cadence</span>
                  <span className="font-mono text-[var(--accent)] text-xs block mt-0.5">
                    Every 5 minutes + Real-time Push
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                  <span className="text-[var(--muted)] block font-semibold">Last Completed Sync</span>
                  <span className="font-mono text-emerald-400 text-xs block mt-0.5">
                    2 minutes ago (0 Queued Events)
                  </span>
                </div>
              </div>
            </div>

            {/* CSV Import / Export Console */}
            <div className="glass p-5 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[var(--text)] text-sm flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-[var(--accent)]" />
                    <span>Bulk CSV Data Synchronizer</span>
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Import or export bulk data schemas for Members, Visits, Trainers, and Class Bookings.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  rows={5}
                  placeholder={`Paste CSV content here...\nname,phone,goal,studio,plan,language,status\nBilal Qureshi,0300-1122334,Strength,Strength Forge,PRO,en,ACTIVE`}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl p-3 text-[var(--text)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
                />

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCsvContent(
                          `name,phone,goal,studio,plan,language,status\nBilal Qureshi,0300-1122334,Strength,Strength Forge,PRO,en,ACTIVE\nZainab Farooq,0300-2233445,Fat Loss,Cardio Loft,ELITE,ur,ACTIVE\nHaris Mehmood,0300-3344556,Hypertrophy,Studio Alpha,STANDARD,en,ACTIVE`
                        )
                      }
                      className="btn !py-1.5 !px-3 text-xs text-[var(--text)] border border-[var(--line)] hover:bg-[var(--card)] cursor-pointer"
                    >
                      Load Template CSV
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (!csvContent) {
                        showNotification("Please paste or load CSV content first.");
                        return;
                      }
                      setIsSyncing(true);
                      setTimeout(() => {
                        setIsSyncing(false);
                        showNotification("Successfully processed and synced 3 records to database.");
                        setCsvContent("");
                      }, 1000);
                    }}
                    disabled={isSyncing}
                    className="btn primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isSyncing ? "Validating & Syncing..." : "Process Bulk CSV Sync"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400">Loading settings...</div>}>
      <AdminSettingsContent />
    </Suspense>
  );
}
