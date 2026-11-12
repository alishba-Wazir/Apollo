"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  Users,
  Dumbbell,
  UserCog,
  CreditCard,
  WalletCards,
  QrCode,
  CalendarDays,
  Wrench,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Search,
  BrainCircuit,
  FileBarChart2,
  Sun,
  Moon,
  Share2,
  Bell,
  Menu,
  X,
  Sparkles,
  LogOut,
  Flame,
  TrendingUp,
  ScanLine,
  CupSoda,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useApolloStore } from "@/lib/apollo-demo-store";
import { PageTransition } from "@/components/ui/Motion";

interface AdminPortalLayoutProps {
  children: React.ReactNode;
  activeItem?: string;
}

export interface NavGroup {
  label: string;
  items: Array<{
    id: string;
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }>;
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    label: "Executive Intelligence (8 Core Modules)",
    items: [
      { id: "overview", label: "Executive Cockpit", href: "/admin", icon: LayoutDashboard },
      { id: "brain", label: "AI Retention & Upsell Brain", href: "/admin/brain", icon: BrainCircuit, badge: "21.0x ROI" },
      { id: "growth", label: "Growth & Leakage", href: "/admin/growth", icon: TrendingUp, badge: "108% Pace" },
      { id: "sales", label: "Sales & Pipeline", href: "/admin/sales", icon: Users, badge: "Kanban" },
      { id: "members", label: "Members CRM", href: "/admin/members", icon: Users },
      { id: "staff", label: "Staff & Master Coaches", href: "/admin/staff", icon: Dumbbell, badge: "REPs L3" },
      { id: "finance", label: "Finance & Ledger", href: "/admin/finance", icon: CreditCard, badge: "PKR 82.4M" },
      { id: "network", label: "Flagship Network", href: "/admin/network", icon: ReceiptText, badge: "4 Clubs" },
    ],
  },
  {
    label: "Yield & Platform Operations",
    items: [
      { id: "studios", label: "Studio Yield & Waitlists", href: "/admin/studios", icon: Flame, badge: "Pilates 100%" },
      { id: "settings", label: "Plans, Kiosks & System", href: "/admin/settings", icon: SlidersHorizontal },
    ],
  },
];

export const AdminPortalLayout: React.FC<AdminPortalLayoutProps> = ({ children, activeItem }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { stats, branches, currentBranchId, setCurrentBranchId } = useApolloStore();

  // Glass Dashboard Theme state (Dark default, persists in localStorage per Spec #7)
  const [theme, setTheme] = useState<"theme-dark" | "theme-light">("theme-dark");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("apollo_admin_theme") || localStorage.getItem("apollo-theme")) as string | null;
    let initialTheme: "theme-dark" | "theme-light" = "theme-dark";
    if (saved === "theme-light" || saved === "light") {
      initialTheme = "theme-light";
    } else if (saved === "theme-dark" || saved === "dark") {
      initialTheme = "theme-dark";
    }
    setTheme(initialTheme);
    const isDark = initialTheme === "theme-dark";
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("theme-dark", "theme-light");
      document.documentElement.classList.add(initialTheme);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }

    const savedExpanded = localStorage.getItem("apollo_admin_sidebar_expanded");
    if (savedExpanded === "true") {
      setIsExpanded(true);
    }

    const handleThemeChange = (e: any) => {
      const val = e.detail?.theme;
      if (val === "light" || val === "theme-light") {
        setTheme("theme-light");
      } else if (val === "dark" || val === "theme-dark") {
        setTheme("theme-dark");
      }
    };
    window.addEventListener("apollo-theme-change" as any, handleThemeChange);
    return () => {
      window.removeEventListener("apollo-theme-change" as any, handleThemeChange);
    };
  }, []);

  const toggleExpanded = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      localStorage.setItem("apollo_admin_sidebar_expanded", String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    const nextTheme = theme === "theme-dark" ? "theme-light" : "theme-dark";
    setTheme(nextTheme);
    localStorage.setItem("apollo_admin_theme", nextTheme);
    localStorage.setItem("apollo-theme", nextTheme === "theme-dark" ? "dark" : "light");
    const isDark = nextTheme === "theme-dark";
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("theme-dark", "theme-light");
      document.documentElement.classList.add(nextTheme);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }
    window.dispatchEvent(
      new CustomEvent("apollo-theme-change", { detail: { theme: isDark ? "dark" : "light" } })
    );
  };

  const getActiveId = (): string => {
    if (activeItem) return activeItem;
    if (pathname === "/admin") return "overview";
    if (pathname.startsWith("/admin/network")) return "network";
    if (pathname.startsWith("/admin/members")) return "members";
    if (pathname.startsWith("/admin/trainers")) return "trainers";
    if (pathname.startsWith("/admin/staff")) return "staff";
    if (pathname.startsWith("/admin/plans")) return "plans";
    if (pathname.startsWith("/admin/finance") || pathname.startsWith("/admin/revenue")) return "finance";
    if (pathname.startsWith("/admin/attendance")) return "attendance";
    if (pathname.startsWith("/admin/classes")) return "classes";
    if (pathname.startsWith("/admin/equipment")) return "equipment";
    if (pathname.startsWith("/admin/brain")) return "brain";
    if (pathname.startsWith("/admin/reports")) return "reports";
    if (pathname.startsWith("/social")) return "social";
    if (pathname.startsWith("/admin/notifications")) return "notifications";
    if (
      pathname.startsWith("/admin/settings") ||
      pathname.startsWith("/admin/sync") ||
      pathname.startsWith("/admin/audit")
    )
      return "settings";
    return "overview";
  };

  const resolvedActiveId = getActiveId();
  const allNavItems = ADMIN_NAV_GROUPS.flatMap((g) => g.items);
  const currentActiveItem = allNavItems.find((i) => i.id === resolvedActiveId) || allNavItems[0];

  return (
    <div
      className={`admin-glass-root ${theme} min-h-screen w-full relative flex flex-col md:flex-row gap-5 p-3.5 sm:px-6 sm:py-3.5 overflow-x-hidden`}
    >
      {/* =========================================================================
          SECTION 3: AMBIENT BLURRED YELLOW CIRCLES BEHIND GLASS
         ========================================================================= */}
      {/* Frosted ambient backlight directly behind the left sidebar panel */}
      <div
        className="orb pointer-events-none"
        style={{
          width: 320,
          height: 780,
          top: -20,
          left: -60,
          background: "var(--orb)",
          filter: "blur(90px)",
          opacity: 0.88,
        }}
        aria-hidden="true"
      />
      <div
        className="orb pointer-events-none"
        style={{
          width: 520,
          height: 520,
          top: -120,
          right: "8%",
        }}
        aria-hidden="true"
      />
      <div
        className="orb pointer-events-none"
        style={{
          width: 440,
          height: 440,
          bottom: 40,
          left: 140,
        }}
        aria-hidden="true"
      />
      <div
        className="orb pointer-events-none"
        style={{
          width: 320,
          height: 320,
          top: "42%",
          right: "24%",
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          MOBILE TOP BAR (Visible < 720px)
         ========================================================================= */}
      <div className="md:hidden flex items-center justify-between p-3 rounded-2xl glass mb-2 z-40 relative">
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin"
            className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shadow-sm shrink-0"
            style={{ background: "var(--accent)" }}
          >
            <img src="/tri_fit_badge.png" alt="TriFit" className="w-full h-full object-cover rounded-lg" />
          </Link>
          <div>
            <div className="font-display font-bold text-sm tracking-tight text-[var(--text)]">
              TRIFIT APOLLO
            </div>
            <div className="text-[10px] text-[var(--muted)] font-mono">
              {currentActiveItem.label}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text)] cursor-pointer"
            title="Toggle Light / Dark Theme"
          >
            {theme === "theme-dark" ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-800" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text)] cursor-pointer"
            aria-label="Open Navigation Panel"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MOBILE SLIDE-OVER DRAWER (Only on screens < 720px)
         ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] glass p-5 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: "var(--accent)" }}
                >
                  <img src="/tri_fit_badge.png" alt="TriFit" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-[var(--text)]">TRIFIT APOLLO</span>
                  <span className="text-[10px] text-[var(--muted)] font-mono block">Enterprise Operations</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-4">
              {ADMIN_NAV_GROUPS.map((group) => (
                <div key={group.label} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] font-mono">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === resolvedActiveId;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "nav on font-black"
                            : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)]"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-[9.5px] font-bold px-1.5 py-0.2 rounded-full border border-current">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* =========================================================================
          LEFT SIDEBAR: FIXED IN-PLACE EXPANDABLE PANEL (Stays fixed while dashboard scrolls)
         ========================================================================= */}
      <aside
        className={`hidden md:flex shrink-0 z-40 fixed top-3.5 left-4 sm:left-6 transition-all duration-300 ease-in-out h-[calc(100vh-28px)] max-h-[820px] select-none ${
          isExpanded ? "w-[264px]" : "w-[76px]"
        }`}
      >
        {/* Frosted aura backplate directly contouring the sidebar panel */}
        <div
          className={`absolute -inset-1.5 pointer-events-none transition-all duration-300 -z-10 ${
            isExpanded ? "rounded-[34px]" : "rounded-[44px]"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at 50% 15%, var(--orb), transparent 75%), radial-gradient(ellipse at 50% 85%, rgba(255, 214, 10, 0.2), transparent 70%)",
            filter: "blur(18px)",
            opacity: 0.85,
          }}
          aria-hidden="true"
        />

        {!isExpanded ? (
          /* =====================================================================
             1. COLLAPSED RAIL (76px Pill - Fits all screens, no scrollbars, rock-solid fixed)
             ===================================================================== */
          <div className="glass rail w-[76px] h-full flex flex-col justify-between py-2.5 px-0 select-none overflow-y-auto no-scrollbar">
            {/* Top: 40px logo tile with official TriFit logo */}
            <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
              <Link
                href="/admin"
                className="w-10 h-10 rounded-[13px] flex items-center justify-center p-0.5 shadow-sm transition-transform hover:scale-105 shrink-0 overflow-hidden"
                style={{ background: "var(--accent)" }}
                title="TriFit Enterprise"
              >
                <img
                  src="/tri_fit_badge.png"
                  alt="TriFit Logo"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </Link>

              {/* Chevron button: Expands sidebar in place */}
              <button
                type="button"
                onClick={toggleExpanded}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-all cursor-pointer shrink-0 mt-0.5"
                title="Expand Sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight size={16} strokeWidth={2.2} />
              </button>

              {/* Divider line */}
              <div className="w-7 h-[1px] my-0.5 shrink-0" style={{ background: "var(--line)" }} />
            </div>

            {/* Navigation Groups - Centered, Compact, Never Overflowing */}
            <div className="flex flex-col items-center gap-1 shrink-0 my-auto">
              {/* Group 1: Dashboard, Invoices */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Link
                  href="/admin"
                  className={`nav ${resolvedActiveId === "overview" || resolvedActiveId === "dashboard" ? "on" : ""}`}
                  title="Dashboard Overview"
                  aria-label="Dashboard"
                >
                  <LayoutDashboard size={20} strokeWidth={1.8} />
                </Link>
                <Link
                  href="/admin/network"
                  className={`nav ${resolvedActiveId === "network" ? "on" : ""}`}
                  title="Invoices & Branch Network"
                  aria-label="Invoices"
                >
                  <ReceiptText size={20} strokeWidth={1.8} />
                </Link>
              </div>

              {/* Divider */}
              <div className="w-6 h-[1px] my-0.5 opacity-60 shrink-0" style={{ background: "var(--line)" }} />

              {/* Group 2: Members, Workouts, Staff */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Link
                  href="/admin/members"
                  className={`nav ${resolvedActiveId === "members" ? "on" : ""}`}
                  title="Members Directory"
                  aria-label="Members"
                >
                  <Users size={20} strokeWidth={1.8} />
                </Link>
                <Link
                  href="/admin/trainers"
                  className={`nav ${resolvedActiveId === "trainers" ? "on" : ""}`}
                  title="Workouts & Trainer Roster"
                  aria-label="Workouts"
                >
                  <Dumbbell size={20} strokeWidth={1.8} />
                </Link>
                <Link
                  href="/admin/staff"
                  className={`nav ${resolvedActiveId === "staff" ? "on" : ""}`}
                  title="Staff Management"
                  aria-label="Staff"
                >
                  <UserCog size={20} strokeWidth={1.8} />
                </Link>
              </div>

              {/* Divider */}
              <div className="w-6 h-[1px] my-0.5 opacity-60 shrink-0" style={{ background: "var(--line)" }} />

              {/* Group 3: Payments, Plans, QR Check-in */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Link
                  href="/admin/finance"
                  className={`nav ${resolvedActiveId === "finance" ? "on" : ""}`}
                  title="Payments & Revenue"
                  aria-label="Payments"
                >
                  <CreditCard size={20} strokeWidth={1.8} />
                </Link>
                <Link
                  href="/admin/plans"
                  className={`nav ${resolvedActiveId === "plans" ? "on" : ""}`}
                  title="Membership Plans"
                  aria-label="Plans"
                >
                  <WalletCards size={20} strokeWidth={1.8} />
                </Link>
                <Link
                  href="/admin/studios"
                  className={`nav ${resolvedActiveId === "studios" ? "on" : ""}`}
                  title="Signature Studios (HIIT, Cycling, Yoga, Pilates, Functional)"
                  aria-label="Studios"
                >
                  <Flame size={20} strokeWidth={1.8} />
                </Link>
              </div>

              {/* Divider */}
              <div className="w-6 h-[1px] my-0.5 opacity-60 shrink-0" style={{ background: "var(--line)" }} />

              {/* Group 4: Schedule, Equipment */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Link
                  href="/admin/classes"
                  className={`nav ${resolvedActiveId === "classes" ? "on" : ""}`}
                  title="Schedule & Studio Classes"
                  aria-label="Schedule"
                >
                  <CalendarDays size={20} strokeWidth={1.8} />
                </Link>
                <Link
                  href="/admin/equipment"
                  className={`nav ${resolvedActiveId === "equipment" ? "on" : ""}`}
                  title="Equipment & Kiosks"
                  aria-label="Equipment"
                >
                  <Wrench size={20} strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            {/* Bottom Actions: Theme Switcher & Settings */}
            <div className="flex flex-col items-center gap-1 shrink-0 pb-1">
              <div className="w-7 h-[1px] my-0.5 shrink-0" style={{ background: "var(--line)" }} />
              {/* Theme Switcher Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="nav shrink-0"
                title={theme === "theme-dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
                aria-label="Toggle Theme"
              >
                {theme === "theme-dark" ? (
                  <Sun size={19} strokeWidth={1.8} className="text-amber-300" />
                ) : (
                  <Moon size={19} strokeWidth={1.8} className="text-slate-800" />
                )}
              </button>

              {/* Settings pinned to bottom */}
              <Link
                href="/admin/settings"
                className={`nav shrink-0 ${resolvedActiveId === "settings" ? "on" : ""}`}
                title="Settings & System"
                aria-label="Settings"
              >
                <SlidersHorizontal size={20} strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        ) : (
          /* =====================================================================
             2. EXPANDED SIDEBAR PANEL (264px In-Place, matching user reference)
             ===================================================================== */
          <div className="glass expanded-panel h-[calc(100vh-28px)] flex flex-col justify-between overflow-hidden w-[264px]">
            {/* Top Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Link
                  href="/admin"
                  className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shadow-sm shrink-0"
                  style={{ background: "var(--accent)" }}
                  title="TriFit Enterprise"
                >
                  <img
                    src="/tri_fit_badge.png"
                    alt="TriFit"
                    className="w-full h-full object-cover rounded-[9px]"
                  />
                </Link>
                <div className="min-w-0 truncate">
                  <div className="font-display font-bold text-sm tracking-tight text-[var(--text)] truncate">
                    TriFit Apollo
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono truncate">
                    Enterprise Operations
                  </div>
                </div>
              </div>

              {/* Collapse Chevron Button (<) */}
              <button
                type="button"
                onClick={toggleExpanded}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-all cursor-pointer shrink-0 ml-1"
                title="Collapse Sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
              </button>
            </div>

            {/* Search Input Box */}
            <div className="py-2 shrink-0">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-[var(--muted)] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search portal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--btn-bg)] border border-[var(--btn-border)] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium"
                />
              </div>
            </div>

            {/* Scrollable Navigation Groups */}
            <nav className="flex-1 overflow-y-auto apollo-scrollbar space-y-3 pr-1 py-1">
              {ADMIN_NAV_GROUPS.map((group) => {
                const filteredItems = searchQuery
                  ? group.items.filter((item) =>
                      item.label.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  : group.items;

                if (filteredItems.length === 0) return null;

                return (
                  <div key={group.label} className="space-y-1">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] font-mono">
                      {group.label}
                    </div>
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.id === resolvedActiveId;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`nav-expanded ${isActive ? "on" : ""}`}
                          title={item.label}
                        >
                          <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border border-current font-mono">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </nav>

            {/* Bottom Section: Profile, Theme, Settings */}
            <div className="pt-2.5 border-t border-[var(--line)] shrink-0 flex flex-col gap-1.5">
              {/* Profile Card */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-display"
                    style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                  >
                    SR
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="text-xs font-bold text-[var(--text)] truncate leading-tight">
                      Syed Rizwan
                    </div>
                    <div className="text-[10px] text-[var(--muted)] truncate leading-tight font-mono">
                      Executive Admin
                    </div>
                  </div>
                </div>
                <Link
                  href="/admin/notifications"
                  className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text)] hover:bg-[var(--chip)] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {theme === "theme-dark" ? (
                    <Moon className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <span>{theme === "theme-dark" ? "Dark Theme" : "Light Theme"}</span>
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              </button>

              {/* Footer Actions: Settings & Logout (Matching Spec & Image 3) */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <Link
                  href="/admin/settings"
                  className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    resolvedActiveId === "settings"
                      ? "bg-[var(--accent)] text-[var(--on-accent)] font-bold"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)]"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Sign out of Apollo"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* =========================================================================
          SECTION 6: MAIN COLUMN (smoothly offset from fixed left sidebar)
         ========================================================================= */}
      <main
        className={`flex-1 min-w-0 flex flex-col gap-5 z-10 relative pb-12 transition-all duration-300 ease-in-out ${
          isExpanded ? "md:ml-[284px]" : "md:ml-[96px]"
        }`}
      >
        <PageTransition key={pathname}>{children}</PageTransition>
      </main>
    </div>
  );
};
