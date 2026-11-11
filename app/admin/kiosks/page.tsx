"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  ScanLine,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Building2,
  Maximize2,
  ArrowRight,
  TrendingDown,
  Gauge,
  Camera,
  Cpu,
  Monitor,
  Flame,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";

type KioskStep = 1 | 2 | 3 | 4 | 5;

interface KioskDevice {
  id: string;
  name: string;
  branch: string;
  status: "ONLINE" | "CALIBRATING" | "OFFLINE";
  firmware: string;
  scansToday: number;
  scaleTare: "CALIBRATED" | "NEEDS_ZERO";
  sensorStatus: "OPTIMAL" | "ALIGNING";
  screenUptime: string;
}

const KIOSK_FLEET: KioskDevice[] = [
  {
    id: "forma-seaview-01",
    name: "Forma 3D Kiosk Alpha #01",
    branch: "TriFit Seaview DHA (Karachi)",
    status: "ONLINE",
    firmware: "v4.8.2-FormaAI",
    scansToday: 48,
    scaleTare: "CALIBRATED",
    sensorStatus: "OPTIMAL",
    screenUptime: "99.98%",
  },
  {
    id: "forma-clifton-02",
    name: "Forma 3D Kiosk Beta #02",
    branch: "TriFit Clifton Flagship (Karachi)",
    status: "ONLINE",
    firmware: "v4.8.2-FormaAI",
    scansToday: 42,
    scaleTare: "CALIBRATED",
    sensorStatus: "OPTIMAL",
    screenUptime: "99.95%",
  },
  {
    id: "forma-luckyone-03",
    name: "Forma 3D Kiosk Gamma #03",
    branch: "TriFit LuckyOne Mall (Karachi)",
    status: "ONLINE",
    firmware: "v4.8.1-FormaAI",
    scansToday: 36,
    scaleTare: "CALIBRATED",
    sensorStatus: "OPTIMAL",
    screenUptime: "99.91%",
  },
  {
    id: "forma-ajtower-04",
    name: "Forma 3D Kiosk Delta #04",
    branch: "TriFit AJ Tower (Islamabad)",
    status: "ONLINE",
    firmware: "v4.8.2-FormaAI",
    scansToday: 29,
    scaleTare: "CALIBRATED",
    sensorStatus: "OPTIMAL",
    screenUptime: "99.99%",
  },
];

export default function AdminKiosksPage() {
  const [activeStep, setActiveStep] = useState<KioskStep>(1);
  const [selectedKiosk, setSelectedKiosk] = useState<string>("forma-seaview-01");
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [digitalTwinAngle, setDigitalTwinAngle] = useState<"FRONT" | "SIDE" | "BACK">("FRONT");

  const currentDevice = KIOSK_FLEET.find((k) => k.id === selectedKiosk) || KIOSK_FLEET[0];

  const handleTareZero = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      alert("Base Weight Scale recalibrated: 0.00 kg zero tare confirmed.");
    }, 1200);
  };

  return (
    <AdminPortalLayout activeItem="kiosks">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[var(--accent)] text-[var(--on-accent)]">
                <ScanLine className="w-5 h-5" />
              </span>
              <h1 className="admin-page-title text-2xl font-bold tracking-tight text-[var(--text)]">
                Forma 3D AI Body Scanner Telemetry
              </h1>
            </div>
            <p className="body-label text-xs sm:text-sm mt-1 text-[var(--muted)]">
              Multi-branch F-shaped hardware inspection: Base electrode scale, overhead 3D sensor, and holographic digital twin telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="admin-chip text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              4 Kiosks Online Across Pakistan
            </span>
          </div>
        </div>

        {/* Step-by-Step Toggle Cards (Requested by User) */}
        <div className="glass p-3 rounded-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
            {[
              { step: 1, label: "1. Weight Machine Scale", icon: Gauge, detail: "Base Electrode Pads" },
              { step: 2, label: "2. Overhead 3D Sensor", icon: Cpu, detail: "Top 4K Depth Bar" },
              { step: 3, label: "3. Interactive Touchscreen", icon: Monitor, detail: "Forma Vertical UI" },
              { step: 4, label: "4. Uploaded Camera Snapshot", icon: Camera, detail: "Real Gym Kiosk" },
              { step: 5, label: "5. Realistic 3D Digital Twin", icon: Sparkles, detail: "Photorealistic Body %" },
            ].map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.step;

              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(s.step as KioskStep)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isActive
                      ? "bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)] shadow-md scale-102"
                      : "bg-[var(--card)] border-[var(--line)] text-[var(--text)] hover:border-[var(--card-border)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4" />
                    <span className="font-mono text-[10px] opacity-80">0{s.step}</span>
                  </div>
                  <div>
                    <div className="font-bold text-xs truncate">{s.label}</div>
                    <div className="text-[10px] opacity-75 truncate">{s.detail}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Hardware Interactive Visualizer Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Kiosk Chassis & Overlay (7 cols) */}
          <div className="lg:col-span-7 glass p-6 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-[var(--text)] flex items-center gap-2">
                  <span className="text-[var(--accent)] font-mono font-bold">STAGE 0{activeStep}:</span>
                  <span>
                    {activeStep === 1 && "Base Weight Machine & Electrode Telemetry"}
                    {activeStep === 2 && "Overhead 3D Laser Depth Sensor Bar"}
                    {activeStep === 3 && "Vertical Touchscreen Forma Interface"}
                    {activeStep === 4 && "Physical Forma Kiosk Uploaded Photo"}
                    {activeStep === 5 && "Photorealistic 3D Digital Twin & Body Fat %"}
                  </span>
                </h3>
                <p className="body-label text-xs mt-1 text-[var(--muted)]">
                  {currentDevice.branch} • Unit ID: {currentDevice.id}
                </p>
              </div>

              {/* Prev / Next Step Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev > 1 ? ((prev - 1) as KioskStep) : 5))}
                  className="btn !p-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev < 5 ? ((prev + 1) as KioskStep) : 1))}
                  className="btn !p-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Visual Stage */}
            <div className="relative min-h-[440px] w-full rounded-2xl bg-gradient-to-b from-[#0a0f1d] via-[#050608] to-[#040507] border border-cyan-500/30 flex items-center justify-center p-4 overflow-hidden shadow-2xl">
              {/* Radial ambient lighting */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(6,182,212,0.15)_0%,_transparent_75%)] pointer-events-none" />

              {/* ==============================================================
                  STEP 1: BASE WEIGHT SCALE HIGHLIGHT
                 ============================================================== */}
              {activeStep === 1 && (
                <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in duration-300 w-full max-w-md">
                  {/* Visual 1 on Weight Machine Scale */}
                  <div className="relative p-6 rounded-3xl glass border-2 border-[var(--accent)] shadow-2xl w-full">
                    {/* Badge 1 */}
                    <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                      <span>PINPOINT 1: WEIGHT MACHINE BASE</span>
                    </div>

                    {/* Scale Platform Visual with 4 Electrode Pads */}
                    <div className="relative h-44 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between">
                      {/* Top 2 Electrodes */}
                      <div className="flex justify-between items-center px-4">
                        <div className="w-12 h-12 rounded-full border-2 border-[var(--accent)] bg-[var(--chip)] flex items-center justify-center text-[10px] font-mono text-[var(--accent)] font-bold shadow-sm">
                          PAD #1
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-[var(--accent)] bg-[var(--chip)] flex items-center justify-center text-[10px] font-mono text-[var(--accent)] font-bold shadow-sm">
                          PAD #2
                        </div>
                      </div>

                      {/* Central Digital Readout */}
                      <div className="text-center my-1">
                        <div className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest">Load Cell Active</div>
                        <div className="text-3xl font-bold font-mono text-[var(--text)] tracking-tight">62.80 kg</div>
                        <div className="text-[10px] text-emerald-500 font-mono font-semibold">BIA Dual-Frequency (50kHz / 250kHz)</div>
                      </div>

                      {/* Bottom 2 Electrodes */}
                      <div className="flex justify-between items-center px-4">
                        <div className="w-12 h-12 rounded-full border-2 border-[var(--accent)] bg-[var(--chip)] flex items-center justify-center text-[10px] font-mono text-[var(--accent)] font-bold shadow-sm">
                          PAD #3
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-[var(--accent)] bg-[var(--chip)] flex items-center justify-center text-[10px] font-mono text-[var(--accent)] font-bold shadow-sm">
                          PAD #4
                        </div>
                      </div>
                    </div>

                    {/* Scale Calibration Controls */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--line)] text-xs">
                      <span className="text-[var(--muted)]">Tare Status: <strong className="text-[var(--text)]">Zero Calibrated (±0.02kg)</strong></span>
                      <button
                        type="button"
                        onClick={handleTareZero}
                        disabled={isCalibrating}
                        className="btn primary !py-1 !px-3 text-xs flex items-center gap-1.5"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isCalibrating ? "animate-spin" : ""}`} />
                        <span>{isCalibrating ? "Zeroing..." : "Zero Tare Now"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  STEP 2: OVERHEAD 3D DEPTH SENSOR BAR (TOP)
                 ============================================================== */}
              {activeStep === 2 && (
                <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in duration-300 w-full max-w-md">
                  <div className="relative p-6 rounded-3xl glass border-2 border-[var(--accent)] shadow-2xl w-full">
                    {/* Badge 2 */}
                    <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                      <span>PINPOINT 2: OVERHEAD SENSOR ON TOP</span>
                    </div>

                    {/* 3D Depth Sensor Bar Visual */}
                    <div className="relative p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] space-y-4">
                      {/* Sensor Bar Horizontal Enclosure */}
                      <div className="h-16 rounded-xl bg-black/40 border border-[var(--line)] flex items-center justify-around px-4 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent animate-pulse" />
                        {/* Left IR Emitter */}
                        <div className="w-6 h-6 rounded-full bg-red-950 border border-red-500/80 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        </div>
                        {/* Center 4K RGB Optical Lens */}
                        <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-[var(--accent)] flex items-center justify-center shadow-md">
                          <div className="w-4 h-4 rounded-full bg-[var(--accent)]" />
                        </div>
                        {/* Right LiDAR Depth Projector */}
                        <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-500/80 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                        </div>
                      </div>

                      {/* Telemetry Output */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-left">
                        <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--line)]">
                          <div className="text-[10px] text-[var(--muted)]">Field of View</div>
                          <div className="font-mono font-bold text-[var(--text)] mt-0.5">120° Wide Optical</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--line)]">
                          <div className="text-[10px] text-[var(--muted)]">Depth Accuracy</div>
                          <div className="font-mono font-bold text-[var(--accent)] mt-0.5">±0.5mm LiDAR</div>
                        </div>
                      </div>

                      <p className="text-[11px] text-[var(--muted)]">
                        Mounted on the top cantilever arm. Scans 2 million point clouds per revolution for millimeter posture & circumference accuracy.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--line)] text-xs flex justify-between items-center text-[var(--muted)]">
                      <span>Laser Beam Safety: <strong className="text-[var(--text)]">Class 1 Eye-Safe</strong></span>
                      <span className="text-emerald-500 font-mono font-semibold">Active Ready</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  STEP 3: FORMA TOUCHSCREEN INTERFACE
                 ============================================================== */}
              {activeStep === 3 && (
                <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in duration-300 w-full max-w-sm">
                  <div className="relative p-4 rounded-3xl glass border-2 border-[var(--accent)] shadow-2xl w-full">
                    {/* Badge 3 */}
                    <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                      <span>PINPOINT 3: VERTICAL TOUCHSCREEN</span>
                    </div>

                    {/* Screen Frame Mockup (Exact Match to Uploaded Photo) */}
                    <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 text-left flex flex-col justify-between min-h-[380px] shadow-2xl relative overflow-hidden">
                      {/* Top Bar of Screen */}
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                        <div className="flex items-center gap-1.5 font-bold font-mono text-[var(--accent)] text-sm">
                          <span className="w-3.5 h-3.5 rounded bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center text-[9px] font-black">F</span>
                          <span>Forma</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--muted)] text-[11px]">
                          <span>WiFi Connected</span>
                          <span>•</span>
                          <span className="w-4 h-4 rounded-full bg-[var(--chip)] text-[var(--text)] flex items-center justify-center text-[9px]">S</span>
                        </div>
                      </div>

                      {/* Header Greeting */}
                      <div className="my-2">
                        <div className="text-[var(--text)] text-base font-bold">Hello, Sarah</div>
                        <div className="text-[var(--muted)] text-xs">Let&apos;s analyze your body</div>
                      </div>

                      {/* Central Avatar Wireframe & Telemetry Cards */}
                      <div className="grid grid-cols-2 gap-2 items-center my-auto">
                        {/* Blue Holographic Figure */}
                        <div className="flex justify-center">
                          <svg className="w-24 h-44 text-[var(--accent)] drop-shadow-[0_0_12px_rgba(255,214,10,0.6)]" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="50" cy="24" r="14" fill="rgba(255,214,10,0.15)" stroke="currentColor" />
                            <path d="M26 48 L74 48 L68 112 L32 112 Z" fill="rgba(255,214,10,0.12)" stroke="currentColor" />
                            <line x1="26" y1="48" x2="16" y2="108" stroke="currentColor" />
                            <line x1="74" y1="48" x2="84" y2="108" stroke="currentColor" />
                            <path d="M38 112 L34 185 M62 112 L66 185" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>

                        {/* Telemetry Chips from Image */}
                        <div className="space-y-2">
                          <div className="p-2 rounded-xl glass bg-[var(--chip)] border border-[var(--line)]">
                            <div className="text-[10px] text-[var(--muted)] uppercase font-mono">Body Fat</div>
                            <div className="text-xl font-bold font-mono text-[var(--text)]">21.1%</div>
                          </div>

                          <div className="p-2 rounded-xl glass bg-[var(--chip)] border border-[var(--line)]">
                            <div className="text-[10px] text-[var(--muted)] uppercase font-mono">Weight</div>
                            <div className="text-xl font-bold font-mono text-[var(--text)]">62.8 kg</div>
                          </div>

                          <div className="p-2 rounded-xl glass bg-[var(--chip)] border border-[var(--line)]">
                            <div className="text-[10px] text-[var(--muted)] uppercase font-mono">BMI</div>
                            <div className="text-xl font-bold font-mono text-[var(--text)]">20.83</div>
                          </div>
                        </div>
                      </div>

                      {/* Pill Button from Image: View Details -> */}
                      <button
                        type="button"
                        onClick={() => setActiveStep(5)}
                        className="btn primary w-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-md mt-2"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  STEP 4: UPLOADED REAL GYM KIOSK PHOTOGRAPH
                 ============================================================== */}
              {activeStep === 4 && (
                <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in duration-300 w-full max-w-lg">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--card-border)] shadow-2xl w-full">
                    {/* Badge 4 */}
                    <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-xs border border-[var(--line)] flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Forma Physical Chassis (Floor Snapshot)</span>
                    </div>

                    {/* Real Image Rendering */}
                    <div className="relative aspect-[16/10] w-full bg-black">
                      <Image
                        src="/media_1794386702106_6a2669a9.jpg"
                        alt="Forma 3D AI Body Scanner Kiosk"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted)]">
                    Original reference photo of the Forma ultra-slim F-shaped cantilever kiosk installed on TriFit gym floor with base scale and 3D depth sensor.
                  </p>
                </div>
              )}

              {/* ==============================================================
                  STEP 5: REALISTIC 3D DIGITAL TWIN & REAL BODY FAT %
                 ============================================================== */}
              {activeStep === 5 && (
                <div className="flex flex-col items-center w-full max-w-lg space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-4 h-4" />
                      <span>Photorealistic Digital Twin (Sarah Ahmed Khan)</span>
                    </span>

                    {/* 3D Angle Selector */}
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--card)] border border-[var(--line)] text-xs">
                      {(["FRONT", "SIDE", "BACK"] as const).map((angle) => (
                        <button
                          key={angle}
                          type="button"
                          onClick={() => setDigitalTwinAngle(angle)}
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                            digitalTwinAngle === angle
                              ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                              : "text-[var(--muted)] hover:text-[var(--text)]"
                          }`}
                        >
                          {angle}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Realistic Render Frame */}
                  <div className="relative h-[360px] w-full rounded-2xl bg-gradient-to-b from-black/40 via-black/20 to-transparent border border-[var(--line)] p-4 flex items-center justify-center overflow-hidden">
                    {/* Realistic Anatomic Hologram SVG with Shading */}
                    <svg className="w-48 h-80 drop-shadow-[0_0_20px_rgba(255,214,10,0.4)]" viewBox="0 0 100 200">
                      <defs>
                        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
                          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>

                      {/* Head & Neck */}
                      <circle cx="50" cy="22" r="14" fill="url(#bodyGrad)" stroke="var(--accent)" strokeWidth="1" />
                      <rect x="46" y="36" width="8" height="8" rx="2" fill="url(#bodyGrad)" />

                      {/* Shoulders & Chest (Muscular Contour) */}
                      <path
                        d="M22 46 Q50 40 78 46 L72 108 Q50 114 28 108 Z"
                        fill="url(#bodyGrad)"
                        stroke="var(--accent)"
                        strokeWidth="1.2"
                      />

                      {/* Abdominal Muscle Contours */}
                      <path d="M38 72 Q50 78 62 72" stroke="var(--card-border)" strokeWidth="1" fill="none" opacity="0.8" />
                      <path d="M40 86 Q50 92 60 86" stroke="var(--card-border)" strokeWidth="1" fill="none" opacity="0.8" />
                      <line x1="50" y1="52" x2="50" y2="105" stroke="var(--card-border)" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

                      {/* Arms & Forearms */}
                      <path d="M22 46 L12 106 L16 112 L26 56 Z" fill="url(#bodyGrad)" />
                      <path d="M78 46 L88 106 L84 112 L74 56 Z" fill="url(#bodyGrad)" />

                      {/* Pelvis & Hip */}
                      <path d="M28 108 Q50 114 72 108 L66 128 L34 128 Z" fill="url(#bodyGrad)" />

                      {/* Thighs & Quads */}
                      <path d="M34 128 L28 184 L36 186 L46 128 Z" fill="url(#bodyGrad)" />
                      <path d="M66 128 L72 184 L64 186 L54 128 Z" fill="url(#bodyGrad)" />
                    </svg>

                    {/* Floating Telemetry Callouts */}
                    <div className="absolute top-8 left-4 p-2 rounded-xl glass bg-[var(--card)] border border-[var(--card-border)] text-xs">
                      <div className="text-[10px] text-[var(--muted)]">Segmental Fat (Arms)</div>
                      <div className="font-mono font-bold text-[var(--accent)]">12.1% Fat</div>
                    </div>

                    <div className="absolute top-24 right-4 p-2 rounded-xl glass bg-[var(--card)] border border-[var(--card-border)] text-xs">
                      <div className="text-[10px] text-[var(--muted)]">Core / Trunk Fat</div>
                      <div className="font-mono font-bold text-[var(--accent)]">19.8% Fat</div>
                    </div>

                    <div className="absolute bottom-10 left-4 p-2 rounded-xl glass bg-[var(--card)] border border-[var(--card-border)] text-xs">
                      <div className="text-[10px] text-[var(--muted)]">Skeletal Muscle</div>
                      <div className="font-mono font-bold text-emerald-500">28.4 kg Mass</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Stepper Progress Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-xs text-[var(--muted)]">
              <span>Forma AI Hardware Telemetry • Step {activeStep} of 5</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <span
                    key={step}
                    className={`w-6 h-1.5 rounded-full transition-all ${
                      activeStep === step ? "bg-[var(--accent)] shadow-sm" : "bg-[var(--line)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Branch Kiosk Fleet Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Fleet Status Box */}
            <div className="glass p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[var(--accent)]" />
                  <span>TriFit Pakistan Kiosk Fleet</span>
                </h4>
                <span className="admin-chip text-emerald-500">All 4 Online</span>
              </div>

              <div className="space-y-2.5">
                {KIOSK_FLEET.map((kiosk) => {
                  const isSelected = selectedKiosk === kiosk.id;

                  return (
                    <button
                      key={kiosk.id}
                      type="button"
                      onClick={() => setSelectedKiosk(kiosk.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[var(--accent)]/15 border-[var(--accent)] shadow-md"
                          : "bg-[var(--card)] border border-[var(--line)] hover:border-[var(--card-border)]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--text)]">{kiosk.name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-500">
                          {kiosk.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--muted)] mt-1">{kiosk.branch}</div>
                      <div className="flex items-center justify-between text-[10.5px] font-mono mt-2 pt-2 border-t border-[var(--line)] text-[var(--muted)]">
                        <span>{kiosk.scansToday} Scans Completed Today</span>
                        <span className="text-[var(--accent)]">Tare: {kiosk.scaleTare}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hardware Diagnostics Card */}
            <div className="glass p-5 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Unit Diagnostics: {currentDevice.name}</span>
              </h4>

              <div className="space-y-2 font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--card)] border border-[var(--line)]">
                  <span className="text-[var(--muted)] font-sans">Base Scale Zero Calibration:</span>
                  <span className="text-emerald-500 font-bold">{currentDevice.scaleTare}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--card)] border border-[var(--line)]">
                  <span className="text-[var(--muted)] font-sans">Top 3D Depth LiDAR:</span>
                  <span className="text-[var(--accent)] font-bold">{currentDevice.sensorStatus}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--card)] border border-[var(--line)]">
                  <span className="text-[var(--muted)] font-sans">Screen Display Uptime:</span>
                  <span className="text-[var(--text)] font-bold">{currentDevice.screenUptime}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--card)] border border-[var(--line)]">
                  <span className="text-[var(--muted)] font-sans">Firmware Release:</span>
                  <span className="text-[var(--accent)] font-bold">{currentDevice.firmware}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTareZero}
                  disabled={isCalibrating}
                  className="w-full btn !py-2 text-xs flex items-center justify-center gap-2"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isCalibrating ? "animate-spin" : ""}`} />
                  <span>Trigger Unit Self-Test & Zero Calibration</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
