"use client";

import React, { useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  AreaTrend,
  BarGold,
  DonutTotal,
  RadarRisk,
  FunnelSteps,
  Heatmap,
  Sparkline,
  Dial,
  ChartCard,
} from "@/components/charts";
import { Sparkles, Activity, Layers, Sun, Moon, Flame } from "lucide-react";

export default function ChartsPreviewPage() {
  const [isSimulatingError, setIsSimulatingError] = useState(false);
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);

  return (
    <AdminPortalLayout activeItem="dashboard">
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Step 1 Review Header */}
        <div className="p-6 rounded-[22px] glass-panel border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[var(--accent)] text-[var(--on-accent)] tracking-wider">
                STEP 1 REVIEW READY
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: "var(--text)" }}>
                APOLLO Unified Chart Kit Showcase
              </h1>
            </div>
            <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Shared, theme-adaptive charts powered by CSS variables (<code className="text-xs font-mono">--chart-line</code>, <code className="text-xs font-mono">--chart-fill</code>, <code className="text-xs font-mono">--bar-gradient</code>, <code className="text-xs font-mono">--accent</code>)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsSimulatingLoading(!isSimulatingLoading)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
              style={{
                borderColor: "var(--border)",
                background: isSimulatingLoading ? "var(--accent)" : "var(--glass)",
                color: isSimulatingLoading ? "var(--on-accent)" : "var(--text)",
              }}
            >
              Toggle Loading State
            </button>
            <button
              onClick={() => setIsSimulatingError(!isSimulatingError)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
              style={{
                borderColor: "var(--border)",
                background: isSimulatingError ? "var(--negative)" : "var(--glass)",
                color: isSimulatingError ? "#ffffff" : "var(--text)",
              }}
            >
              Toggle Error State
            </button>
          </div>
        </div>

        {/* Row 1: KPI Cards with Sparklines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-[20px] glass-panel border border-[var(--border)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Monthly Revenue
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono" style={{ color: "var(--text)" }}>
                  PKR 23.95M
                </span>
                <span className="text-xs font-bold text-emerald-500 font-mono">+4.1%</span>
              </div>
              <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
                Across 4 active clubs
              </span>
            </div>
            <div className="w-24 h-10">
              <Sparkline data={[19.1, 20.3, 21.4, 22.2, 23.0, 23.95]} />
            </div>
          </div>

          <div className="p-4 rounded-[20px] glass-panel border border-[var(--border)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Total Active Members
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono" style={{ color: "var(--text)" }}>
                  4,940
                </span>
                <span className="text-xs font-bold text-emerald-500 font-mono">+16.2%</span>
              </div>
              <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
                Capacity index: 78%
              </span>
            </div>
            <div className="w-24 h-10">
              <Sparkline data={[4100, 4320, 4450, 4600, 4780, 4940]} />
            </div>
          </div>

          <div className="p-4 rounded-[20px] glass-panel border border-[var(--border)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Win-back Recovery
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono" style={{ color: "var(--accent)" }}>
                  74.1%
                </span>
                <span className="text-xs font-bold text-emerald-500 font-mono">218 rescued</span>
              </div>
              <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
                WhatsApp AI outreach
              </span>
            </div>
            <div className="w-24 h-10">
              <Sparkline data={[55, 60, 64, 69, 71, 74.1]} />
            </div>
          </div>
        </div>

        {/* Row 2: AreaTrend + DonutTotal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <AreaTrend
              dataKey="revenue_overview"
              subtitle="Monthly recurring revenue with 0-baseline and glow line"
              loading={isSimulatingLoading}
              error={isSimulatingError ? "Simulated network stream timeout" : null}
            />
          </div>

          <div className="lg:col-span-5">
            <DonutTotal
              dataKey="revenue_by_branch"
              subtitle="Club share with centered total and rounded segments"
              loading={isSimulatingLoading}
              error={isSimulatingError ? "Simulated database connection failure" : null}
            />
          </div>
        </div>

        {/* Row 3: BarGold + Dial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <BarGold
              dataKey="hourly_checkins"
              subtitle="Staggered gold gradient bars with highlighted 6:00 PM peak"
              loading={isSimulatingLoading}
              error={isSimulatingError ? "Simulated turnstile feed disconnect" : null}
            />
          </div>

          <div className="lg:col-span-4">
            <Dial
              dataKey="capacity_dial"
              subtitle="SVG circular gauge with animated fill-in and target marker"
              loading={isSimulatingLoading}
              error={isSimulatingError ? "Simulated sensor failure" : null}
            />
          </div>
        </div>

        {/* Row 4: RadarRisk + FunnelSteps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6">
            <RadarRisk
              dataKey="churn_risk_radar"
              subtitle="Multivariate churn risk factor profile vs benchmark"
              loading={isSimulatingLoading}
              error={isSimulatingError ? "Simulated prediction engine error" : null}
            />
          </div>

          <div className="lg:col-span-6">
            <FunnelSteps
              dataKey="winback_funnel"
              subtitle="WhatsApp automated messaging conversion funnel"
              loading={isSimulatingLoading}
              error={isSimulatingError ? "Simulated campaign sync error" : null}
            />
          </div>
        </div>

        {/* Row 5: Heatmap */}
        <div>
          <Heatmap
            dataKey="attendance_heatmap"
            subtitle="Weekday x hour check-in intensity matrix (Built with CSS grid and hover inspection)"
            loading={isSimulatingLoading}
            error={isSimulatingError ? "Simulated telemetry aggregator error" : null}
          />
        </div>

        {/* Row 6: ChartCard States Demo (Loading, Empty, Error) */}
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            ChartCard Standard States (Loading, Empty & Error Handlers)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ChartCard
              title="Telemetry State: Loading"
              units="Hz"
              loading={true}
              isSample={true}
            >
              <div />
            </ChartCard>

            <ChartCard
              title="Telemetry State: Empty"
              units="Events"
              empty={true}
              isSample={true}
            >
              <div />
            </ChartCard>

            <ChartCard
              title="Telemetry State: Error"
              units="Errors"
              error={new Error("ZKTeco Turnstile WebSocket disconnected (code: 1006)")}
              onRetry={() => alert("Retrying telemetry connection...")}
              isSample={true}
            >
              <div />
            </ChartCard>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
