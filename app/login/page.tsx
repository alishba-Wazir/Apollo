"use client";

import React, { useState } from "react";
import { useAuth, UserRole } from "@/lib/auth-context";
import { TriFitLogo } from "@/components/brand/TriFitLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  LayoutGrid,
  Building2,
  Users,
  Dumbbell,
  Share2,
  Smartphone,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

interface PortalDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  role: UserRole;
  email: string;
  scopeBadge: string;
  icon: React.ElementType;
  highlights: string[];
}

const APOLLO_PORTALS: PortalDefinition[] = [
  {
    id: "admin",
    title: "Admin Portal",
    subtitle: "Executive Command Center",
    description: "Consolidated multi-branch financial telemetry, AI win-back engine, member lifecycle, and system governance.",
    route: "/admin",
    role: "ADMIN",
    email: "admin@trifit.com",
    scopeBadge: "Head Office Scope",
    icon: LayoutGrid,
    highlights: ["Consolidated Telemetry", "AI Win-Back Engine", "Network Financials"],
  },
  {
    id: "branch",
    title: "Branch Manager",
    subtitle: "Club Desk & Operations",
    description: "Live front desk operations, biometric turnstile gates, staff shifts, walk-in POS, and end-of-day register closing.",
    route: "/branch/desk",
    role: "BRANCH_MANAGER",
    email: "manager.seaview@trifit.com",
    scopeBadge: "Seaview Flagship",
    icon: Building2,
    highlights: ["Turnstile Gate Control", "Front Desk POS", "Shift & Shift Closing"],
  },
  {
    id: "member",
    title: "Member Portal",
    subtitle: "Member Pass & Studio App",
    description: "Digital turnstile QR pass, interactive class timetable booking, workout telemetry, dues payment, and coach chat.",
    route: "/member/visits",
    role: "MEMBER",
    email: "zaid.khan@trifit.com",
    scopeBadge: "VIP Member",
    icon: Smartphone,
    highlights: ["Biometric QR Gate Pass", "Class Reservations", "Dues Ledger & Billing"],
  },
  {
    id: "trainer",
    title: "Trainer Portal",
    subtitle: "Coaching & Client Roster",
    description: "Personal training clients, AI-assisted workout routine designer, 3D body composition tracking, and session verification.",
    route: "/trainer/clients",
    role: "TRAINER",
    email: "trainer.tariq@trifit.com",
    scopeBadge: "Coach Portal",
    icon: Dumbbell,
    highlights: ["Client PT Roster", "AI Workout Generator", "3D Scans & Progress"],
  },
  {
    id: "social",
    title: "Social Media Hub",
    subtitle: "Omni-Channel Content Studio",
    description: "Multi-platform publishing for Instagram, TikTok & YouTube, campaign scheduling, brand approvals, and social analytics.",
    route: "/social",
    role: "ADMIN",
    email: "admin@trifit.com",
    scopeBadge: "Marketing Studio",
    icon: Share2,
    highlights: ["Instagram & TikTok Studio", "Scheduled Campaigns", "Growth & Engagement"],
  },
];

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [activePortalLoading, setActivePortalLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("admin@trifit.com");
  const [password, setPassword] = useState("Password123!");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);

  // 1-Click Direct Portal Access
  const handleEnterPortal = async (portal: PortalDefinition) => {
    setActivePortalLoading(portal.id);
    setErrorMessage(null);
    setEmail(portal.email);
    setPassword("Password123!");

    const result = await login(portal.email, "Password123!", portal.route);
    if (!result.success) {
      setErrorMessage(result.error || `Failed to enter ${portal.title}`);
      setActivePortalLoading(null);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = await login(email, password);
    if (!result.success) {
      setErrorMessage(result.error || "Authentication failed. Please verify credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 relative bg-bg text-text select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-accent/[0.07] via-accent/[0.02] to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-3 z-10 border-b border-border/40 pb-4">
        <TriFitLogo size={42} showWordmark={true} />
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-[800] tracking-wider uppercase border border-[#FFD91C]/40 bg-[#FFD91C]/10 text-[#050505] dark:text-[#FFD91C]">
            ENTERPRISE PLATFORM
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto py-8 sm:py-12 z-10 space-y-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 text-[12px] font-[800] text-accent shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>APOLLO • Five Unified Enterprise Portals</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[900] tracking-[-0.03em] text-text leading-tight">
            Select Your Portal Gateway
          </h1>

          <p className="text-[14px] sm:text-[15px] text-text-muted leading-relaxed max-w-2xl mx-auto">
            Select an operational portal to enter your dedicated management suite, or authenticate using custom organization credentials.
          </p>
        </div>

        {errorMessage && (
          <div className="max-w-2xl mx-auto p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-500 font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 5 Portals Grid: 5 columns on 2xl, 3 on lg, 2 on sm, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {APOLLO_PORTALS.map((portal) => {
            const Icon = portal.icon;
            const isSelectedLoading = activePortalLoading === portal.id;

            // Per-portal visual identity
            const portalTheme: Record<string, { iconBg: string; iconColor: string; borderHover: string; shadowHover: string; badge: string }> = {
              admin:   { iconBg: "bg-amber-400/15",   iconColor: "text-amber-500 dark:text-[#FFD91C]", borderHover: "hover:border-amber-400/60",  shadowHover: "hover:shadow-[0_16px_40px_rgba(255,217,28,0.18)]",  badge: "bg-amber-400/10 border-amber-400/30 text-amber-700 dark:text-amber-400" },
              branch:  { iconBg: "bg-blue-500/15",    iconColor: "text-blue-500",                      borderHover: "hover:border-blue-400/60",   shadowHover: "hover:shadow-[0_16px_40px_rgba(59,130,246,0.15)]",   badge: "bg-blue-500/10 border-blue-400/30 text-blue-700 dark:text-blue-400" },
              member:  { iconBg: "bg-emerald-500/15", iconColor: "text-emerald-500",                   borderHover: "hover:border-emerald-400/60",shadowHover: "hover:shadow-[0_16px_40px_rgba(16,185,129,0.15)]",  badge: "bg-emerald-500/10 border-emerald-400/30 text-emerald-700 dark:text-emerald-400" },
              trainer: { iconBg: "bg-rose-500/15",    iconColor: "text-rose-500",                      borderHover: "hover:border-rose-400/60",   shadowHover: "hover:shadow-[0_16px_40px_rgba(239,68,68,0.15)]",   badge: "bg-rose-500/10 border-rose-400/30 text-rose-700 dark:text-rose-400" },
              social:  { iconBg: "bg-purple-500/15",  iconColor: "text-purple-500",                    borderHover: "hover:border-purple-400/60", shadowHover: "hover:shadow-[0_16px_40px_rgba(168,85,247,0.15)]",  badge: "bg-purple-500/10 border-purple-400/30 text-purple-700 dark:text-purple-400" },
            };
            const theme = portalTheme[portal.id] || portalTheme.admin;

            return (
              <div
                key={portal.id}
                className={`glass-card group p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden border border-border/70 ${theme.borderHover} ${theme.shadowHover} hover:scale-[1.015] cursor-default`}
              >
                {/* Specular top-line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Top card metadata */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl ${theme.iconBg} border border-current/20 flex items-center justify-center ${theme.iconColor} group-hover:scale-110 transition-transform shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${theme.badge} transition-colors`}>
                      {portal.scopeBadge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-[17px] font-[800] text-text tracking-tight">
                      {portal.title}
                    </h2>
                    <span className={`text-[11.5px] font-bold block mt-0.5 ${theme.iconColor}`}>
                      {portal.subtitle}
                    </span>
                    <p className="text-[12px] text-text-muted mt-2 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="pt-2 border-t border-border/40 space-y-1.5">
                    {portal.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <CheckCircle2 className={`w-3 h-3 shrink-0 ${theme.iconColor}`} />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct 1-Click Launch Button */}
                <div className="pt-4 mt-4 border-t border-border/50">
                  <button
                    type="button"
                    disabled={isLoading || activePortalLoading !== null}
                    onClick={() => handleEnterPortal(portal)}
                    className="w-full btn-primary py-2.5 px-3 rounded-xl text-[12.5px] font-extrabold flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSelectedLoading ? "Entering Portal…" : `Enter ${portal.title}`}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                  <span className="text-[10px] text-text-muted font-mono block text-center mt-1.5 truncate">
                    {portal.email}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Credentials Sign-In Collapsible */}
        <div className="max-w-xl mx-auto pt-4">
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-border/80 shadow-lg">
            <button
              type="button"
              onClick={() => setShowCredentialsForm(!showCredentialsForm)}
              className="w-full flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-center text-text-muted">
                  <Lock className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-[14px] font-[800] text-text">
                    Sign In with Custom Credentials
                  </h3>
                  <span className="text-[11.5px] text-text-muted">
                    Manual authentication for custom email & password
                  </span>
                </div>
              </div>
              <div className="p-1 rounded-lg text-text-muted hover:text-text">
                {showCredentialsForm ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {showCredentialsForm && (
              <form onSubmit={handleCredentialsSubmit} className="mt-5 pt-4 border-t border-border/60 space-y-3.5 animate-in fade-in">
                <div>
                  <label className="block text-[11.5px] font-[700] text-text-muted mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. admin@trifit.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-glass border border-border text-text text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-[700] text-text-muted mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter password"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-glass border border-border text-text text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-2.5 rounded-xl text-[13px] font-extrabold flex items-center justify-center gap-2 mt-2"
                >
                  <span>{isLoading ? "Authenticating..." : "Sign In with Credentials"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

      </main>

      {/* Footer Notice */}
      <footer className="w-full max-w-7xl mx-auto py-4 text-center text-[12px] text-text-muted z-10 border-t border-border/40">
        <span>APOLLO Enterprise AI Fitness for TRI FIT • All 5 Portals Managed & Protected</span>
      </footer>
    </div>
  );
}
