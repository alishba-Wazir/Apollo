export interface AreaTrendPoint {
  label: string;
  value: number;
  formattedValue?: string;
  secondaryValue?: number;
}

export interface BarGoldPoint {
  label: string;
  value: number;
  formattedValue?: string;
  isPeak?: boolean;
  sublabel?: string;
}

export interface DonutSegment {
  name: string;
  value: number;
  formattedValue: string;
  percentage: number;
  colorVar?: string;
}

export interface RadarRiskPoint {
  metric: string;
  score: number; // 0-100
  benchmark?: number;
}

export interface FunnelStepItem {
  step: string;
  count: number;
  rate: number; // %
  dropOff?: number; // %
}

export interface HeatmapCell {
  day: string; // "Mon", "Tue", ...
  hour: string; // "06:00", ...
  hourNum: number;
  value: number; // 0-100 density
  rawCheckins?: number;
}

export interface SparklinePoint {
  value: number;
}

export interface DialData {
  value: number;
  min: number;
  max: number;
  target?: number;
  units: string;
  statusLabel?: string;
}

export interface ChartDataset<T = any> {
  key: string;
  title: string;
  units: string;
  isSample: boolean;
  summary: string;
  data: T;
}

export const SAMPLE_CHART_REGISTRY: Record<string, ChartDataset> = {
  revenue_overview: {
    key: "revenue_overview",
    title: "Revenue Overview",
    units: "PKR Millions",
    isSample: true,
    summary: "Monthly recurring gym revenue in PKR millions across all 4 operational clubs, demonstrating steady expansion from 19.10M in June to 23.95M in November.",
    data: [
      { label: "Jun", value: 19.1, formattedValue: "PKR 19.10M" },
      { label: "Jul", value: 20.3, formattedValue: "PKR 20.30M" },
      { label: "Aug", value: 21.4, formattedValue: "PKR 21.40M" },
      { label: "Sep", value: 22.2, formattedValue: "PKR 22.20M" },
      { label: "Oct", value: 23.0, formattedValue: "PKR 23.00M" },
      { label: "Nov", value: 23.95, formattedValue: "PKR 23.95M" },
    ] as AreaTrendPoint[],
  },

  hourly_checkins: {
    key: "hourly_checkins",
    title: "Check-ins by Time of Day",
    units: "Check-ins",
    isSample: true,
    summary: "Today's check-in volume across clubs, peaking at 6:00 PM with 250 check-ins.",
    data: [
      { label: "6 am", value: 70, formattedValue: "70 check-ins", isPeak: false },
      { label: "8 am", value: 140, formattedValue: "140 check-ins", isPeak: false },
      { label: "10 am", value: 110, formattedValue: "110 check-ins", isPeak: false },
      { label: "12 pm", value: 120, formattedValue: "120 check-ins", isPeak: false },
      { label: "2 pm", value: 100, formattedValue: "100 check-ins", isPeak: false },
      { label: "4 pm", value: 180, formattedValue: "180 check-ins", isPeak: false },
      { label: "6 pm", value: 250, formattedValue: "250 check-ins", isPeak: true },
      { label: "8 pm", value: 190, formattedValue: "190 check-ins", isPeak: false },
      { label: "10 pm", value: 88, formattedValue: "88 check-ins", isPeak: false },
    ] as BarGoldPoint[],
  },

  revenue_by_branch: {
    key: "revenue_by_branch",
    title: "Revenue by Branch",
    units: "PKR Millions",
    isSample: true,
    summary: "Share of this month's PKR 23.95M total revenue by active club.",
    data: [
      { name: "Seaview DHA", value: 8.41, formattedValue: "PKR 8.41M", percentage: 35.1 },
      { name: "LuckyOne Mall", value: 5.56, formattedValue: "PKR 5.56M", percentage: 23.2 },
      { name: "Clifton", value: 5.10, formattedValue: "PKR 5.10M", percentage: 21.3 },
      { name: "AJ Tower", value: 4.91, formattedValue: "PKR 4.91M", percentage: 20.5 },
    ] as DonutSegment[],
  },

  churn_risk_radar: {
    key: "churn_risk_radar",
    title: "Member Churn Risk Indicators",
    units: "Risk Severity Index (0-100)",
    isSample: true,
    summary: "Multivariate radar of drop-off indicators among 294 at-risk members, highlighting app inactivity and attendance gap as leading precursors.",
    data: [
      { metric: "Visit Gap (>14d)", score: 92, benchmark: 40 },
      { metric: "App Inactivity", score: 86, benchmark: 35 },
      { metric: "Coach Disconnect", score: 78, benchmark: 30 },
      { metric: "Declined Booking", score: 65, benchmark: 25 },
      { metric: "Off-Peak Drop", score: 58, benchmark: 20 },
      { metric: "Dues Pending", score: 48, benchmark: 15 },
    ] as RadarRiskPoint[],
  },

  winback_funnel: {
    key: "winback_funnel",
    title: "Win-back Campaign Conversion Funnel",
    units: "Members",
    isSample: true,
    summary: "Conversion stages of the automated Apollo AI Win-Back campaign achieving a 74.1% recovery rate.",
    data: [
      { step: "At-Risk Identified", count: 294, rate: 100, dropOff: 0 },
      { step: "WhatsApp Sent", count: 266, rate: 90.5, dropOff: 9.5 },
      { step: "Delivered & Read", count: 248, rate: 84.4, dropOff: 6.1 },
      { step: "Replied / Engaged", count: 232, rate: 78.9, dropOff: 5.5 },
      { step: "Brought Back", count: 218, rate: 74.1, dropOff: 4.8 },
    ] as FunnelStepItem[],
  },

  attendance_heatmap: {
    key: "attendance_heatmap",
    title: "Weekly Floor Density Heatmap",
    units: "Check-in Intensity (%)",
    isSample: true,
    summary: "Weekly hour-by-hour floor density across all 4 clubs, revealing evening peaks and post-Taraweeh night shifts.",
    data: generateSampleHeatmap(),
  },

  sparkline_revenue: {
    key: "sparkline_revenue",
    title: "Revenue Velocity",
    units: "PKR Millions",
    isSample: true,
    summary: "7-day rolling revenue trend",
    data: [
      { value: 19.1 },
      { value: 19.8 },
      { value: 20.3 },
      { value: 21.0 },
      { value: 21.4 },
      { value: 22.2 },
      { value: 23.0 },
      { value: 23.95 },
    ] as SparklinePoint[],
  },

  capacity_dial: {
    key: "capacity_dial",
    title: "Club Floor Capacity",
    units: "% Occupancy",
    isSample: true,
    summary: "Current live floor load at Seaview DHA Flagship (136/200 active members).",
    data: {
      value: 68,
      min: 0,
      max: 100,
      target: 85,
      units: "% Floor Capacity",
      statusLabel: "Moderate Rush",
    } as DialData,
  },
};

function generateSampleHeatmap(): HeatmapCell[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [
    { label: "6 AM", num: 6 },
    { label: "8 AM", num: 8 },
    { label: "10 AM", num: 10 },
    { label: "12 PM", num: 12 },
    { label: "2 PM", num: 14 },
    { label: "4 PM", num: 16 },
    { label: "6 PM", num: 18 },
    { label: "8 PM", num: 20 },
    { label: "10 PM", num: 22 },
  ];

  const cells: HeatmapCell[] = [];

  days.forEach((day) => {
    hours.forEach(({ label, num }) => {
      let density = 20;

      // Peak hour boosts
      if (num === 18) density = day === "Fri" ? 75 : 95; // 6pm peak
      else if (num === 20) density = 82; // 8pm rush
      else if (num === 8) density = 60; // 8am morning rush
      else if (num === 16) density = 70; // 4pm pre-evening
      else if (num === 14 && day === "Fri") density = 10; // Jummah pause
      else if (num === 22) density = 65; // Ramadan night shift

      cells.push({
        day,
        hour: label,
        hourNum: num,
        value: density,
        rawCheckins: Math.round(density * 2.5),
      });
    });
  });

  return cells;
}
