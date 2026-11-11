"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Sparkles,
  Dumbbell,
  CalendarCheck,
  Wrench,
  Moon,
  ScanLine,
  Coins,
  Building2,
  Users,
  UserCog,
  QrCode,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Sun,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useApolloStore } from "@/lib/apollo-demo-store";
import { PageTransition } from "@/components/ui/Motion";
import { FloatingCommandBar } from "@/components/layout/FloatingCommandBar";

interface BranchPortalLayoutProps {
  children: React.ReactNode;
  activeItem?: string;
}

export interface BranchNavGroup {
  label: string;
  items: Array<{
    id: string;
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }>;
}

export const BRANCH_NAV_GROUPS: BranchNavGroup[] = [
  {
    label: "Club Operations",
    items: [
      { id: "today", label: "Overview", href: "/branch/today", icon: CalendarDays },
      { id: "desk", label: "Check-in Desk & POS", href: "/branch/desk", icon: ScanLine, badge: "Live Gate" },
      { id: "attendance", label: "Attendance Logs", href: "/branch/attendance", icon: QrCode },
    ],
  },
  {
    label: "People & Staff",
    items: [
      { id: "members", label: "Branch Members", href: "/branch/members", icon: Users },
      { id: "trainers", label: "Trainer Roster", href: "/branch/trainers", icon: Dumbbell },
      { id: "staff", label: "Branch Staff", href: "/branch/staff", icon: UserCog },
    ],
  },
  {
    label: "Facilities & Assets",
    items: [
      { id: "equipment", label: "Equipment Status", href: "/branch/equipment", icon: Wrench },
      { id: "classes", label: "Class Schedules", href: "/branch/classes", icon: CalendarCheck },
      { id: "locker", label: "Lockers & Saunas", href: "/branch/locker", icon: Building2 },
    ],
  },
  {
    label: "Revenue & Growth",
    items: [
      { id: "cash", label: "Daily Cash Drawer", href: "/branch/cash", icon: Coins },
      { id: "winback", label: "Winback Retention", href: "/branch/winback", icon: Sparkles, badge: "AI Core" },
      { id: "announcements", label: "Announcements", href: "/branch/announcements", icon: Megaphone },
    ],
  },
];

export const BranchPortalLayout: React.FC<BranchPortalLayoutProps> = ({ children, activeItem }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { branches, currentBranchId } = useApolloStore();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [theme, setTheme] = useState<"theme-dark" | "theme-light">("theme-dark");

  const selectedBranch = branches.find((b) => b.id === currentBranchId) || branches[0];

  useEffect(() => {
    const saved = localStorage.getItem("apollo_admin_theme") ||
      (localStorage.getItem("apollo-theme") === "light" ? "theme-light" : "theme-dark");
    if (saved === "theme-light" || saved === "theme-dark") {
      setTheme(saved as any);
    }
    const savedExpanded = localStorage.getItem("apollo_sidebar_expanded");
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

  const toggleTheme = () => {
    const nextTheme = theme === "theme-dark" ? "theme-light" : "theme-dark";
    setTheme(nextTheme);
    localStorage.setItem("apollo_admin_theme", nextTheme);
    localStorage.setItem("apollo-theme", nextTheme === "theme-dark" ? "dark" : "light");
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("theme-dark", "theme-light");
      document.documentElement.classList.add(nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "theme-dark");
      document.documentElement.setAttribute("data-theme", nextTheme === "theme-dark" ? "dark" : "light");
    }
    window.dispatchEvent(
      new CustomEvent("apollo-theme-change", { detail: { theme: nextTheme === "theme-dark" ? "dark" : "light" } })
    );
  };

  const toggleExpanded = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    localStorage.setItem("apollo_sidebar_expanded", String(next));
  };

  const getActiveId = (): string => {
    if (activeItem) return activeItem;
    if (pathname === "/branch/today") return "today";
    if (pathname.startsWith("/branch/desk")) return "desk";
    if (pathname.startsWith("/branch/attendance")) return "attendance";
    if (pathname.startsWith("/branch/members")) return "members";
    if (pathname.startsWith("/branch/trainers")) return "trainers";
    if (pathname.startsWith("/branch/staff")) return "staff";
    if (pathname.startsWith("/branch/equipment")) return "equipment";
    if (pathname.startsWith("/branch/classes")) return "classes";
    if (pathname.startsWith("/branch/locker")) return "locker";
    if (pathname.startsWith("/branch/cash")) return "cash";
    if (pathname.startsWith("/branch/winback")) return "winback";
    if (pathname.startsWith("/branch/announcements")) return "announcements";
    return "today";
  };

  const resolvedActiveId = getActiveId();
  const activeBranchName = selectedBranch?.name || user?.branchName || "TriFit Seaview DHA — Karachi";
  const allNavItems = BRANCH_NAV_GROUPS.flatMap((g) => g.items);
  const currentActiveItem = allNavItems.find((i) => i.id === resolvedActiveId) || allNavItems[0];

  const filteredGroups = BRANCH_NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) =>
      item.label.toLowerCase().includes(navSearch.toLowerCase())
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div
      className={`admin-glass-root ${theme} min-h-screen w-full relative flex flex-col md:flex-row gap-5 p-3.5 sm:px-6 sm:py-3.5 overflow-x-hidden`}
    >
      {/* Ambient background orbs */}
      <div
        className="orb pointer-events-none"
        style={{ width: 520, height: 520, top: -120, right: "8%" }}
        aria-hidden="true"
      />
      <div
        className="orb pointer-events-none"
        style={{ width: 440, height: 440, bottom: 40, left: 140 }}
        aria-hidden="true"
      />
      <div
        className="orb pointer-events-none"
        style={{ width: 320, height: 320, top: "42%", right: "24%" }}
        aria-hidden="true"
      />

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-3 rounded-2xl glass mb-2 z-40 relative">
        <div className="flex items-center gap-2.5">
          <Link
            href="/branch/today"
            className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shadow-sm shrink-0"
            style={{ background: "var(--accent)" }}
          >
            <img src="/tri_fit_badge.png" alt="TriFit" className="w-full h-full object-cover rounded-lg" />
          </Link>
          <div>
            <div className="font-display font-bold text-sm tracking-tight text-[var(--text)]">
              TRIFIT BRANCH
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

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] glass p-4 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shadow-sm shrink-0"
                  style={{ background: "var(--accent)" }}
                >
                  <img src="/tri_fit_badge.png" alt="TriFit" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-[var(--text)]">TRIFIT BRANCH</div>
                  <div className="text-[11px] text-[var(--muted)] truncate max-w-[170px]">{activeBranchName}</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto apollo-scrollbar py-3 space-y-4 pr-1">
              {BRANCH_NAV_GROUPS.map((group) => (
                <div key={group.label} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
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
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${
                          isActive
                            ? "bg-[var(--accent)] text-[var(--on-accent)] font-bold shadow-sm"
                            : "text-[var(--text)] hover:bg-[var(--chip)] font-medium"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
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

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 fixed top-3.5 left-4 sm:left-6 z-40">
        {!isExpanded ? (
          <div className="glass rail h-[calc(100vh-28px)] justify-between select-none">
            {/* Top Logo Badge + Expand Chevron */}
            <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
              <Link
                href="/branch/today"
                className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center p-0.5 shadow-sm hover:scale-105 transition-transform"
                style={{ background: "var(--accent)" }}
                title="TriFit Branch Portal"
                aria-label="TriFit Branch"
              >
                <img
                  src="/tri_fit_badge.png"
                  alt="TriFit"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </Link>

              <button
                type="button"
                onClick={toggleExpanded}
                className="w-7 h-7 flex items-center justify-center rounded-xl text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-all cursor-pointer"
                title="Expand Navigation Panel"
                aria-label="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-8 h-[1px] my-0.5 opacity-70 shrink-0" style={{ background: "var(--line)" }} />

            {/* Nav Group 1: Operations */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <Link
                href="/branch/today"
                className={`nav ${resolvedActiveId === "today" ? "on" : ""}`}
                title="Daily Overview"
                aria-label="Overview"
              >
                <CalendarDays size={22} strokeWidth={1.75} />
              </Link>
              <Link
                href="/branch/desk"
                className={`nav ${resolvedActiveId === "desk" ? "on" : ""}`}
                title="Check-in Desk & Live Gate"
                aria-label="Desk"
              >
                <ScanLine size={22} strokeWidth={1.75} />
              </Link>
              <Link
                href="/branch/attendance"
                className={`nav ${resolvedActiveId === "attendance" ? "on" : ""}`}
                title="Attendance Logs"
                aria-label="Attendance"
              >
                <QrCode size={22} strokeWidth={1.75} />
              </Link>
            </div>

            {/* Divider */}
            <div className="w-6 h-[1px] my-0.5 opacity-70 shrink-0" style={{ background: "var(--line)" }} />

            {/* Nav Group 2: People */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <Link
                href="/branch/members"
                className={`nav ${resolvedActiveId === "members" ? "on" : ""}`}
                title="Branch Members"
                aria-label="Members"
              >
                <Users size={22} strokeWidth={1.75} />
              </Link>
              <Link
                href="/branch/trainers"
                className={`nav ${resolvedActiveId === "trainers" ? "on" : ""}`}
                title="Trainer Roster"
                aria-label="Trainers"
              >
                <Dumbbell size={22} strokeWidth={1.75} />
              </Link>
              <Link
                href="/branch/staff"
                className={`nav ${resolvedActiveId === "staff" ? "on" : ""}`}
                title="Branch Staff"
                aria-label="Staff"
              >
                <UserCog size={22} strokeWidth={1.75} />
              </Link>
            </div>

            {/* Divider */}
            <div className="w-6 h-[1px] my-0.5 opacity-70 shrink-0" style={{ background: "var(--line)" }} />

            {/* Nav Group 3: Facilities */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <Link
                href="/branch/equipment"
                className={`nav ${resolvedActiveId === "equipment" ? "on" : ""}`}
                title="Equipment Status"
                aria-label="Equipment"
              >
                <Wrench size={22} strokeWidth={1.75} />
              </Link>
              <Link
                href="/branch/classes"
                className={`nav ${resolvedActiveId === "classes" ? "on" : ""}`}
                title="Class Schedules"
                aria-label="Classes"
              >
                <CalendarCheck size={22} strokeWidth={1.75} />
              </Link>
              <Link
                href="/branch/cash"
                className={`nav ${resolvedActiveId === "cash" ? "on" : ""}`}
                title="Daily Cash Drawer"
                aria-label="Cash"
              >
                <Coins size={22} strokeWidth={1.75} />
              </Link>
            </div>

            {/* Flex Spacer */}
            <div className="flex-1 min-h-[8px]" />

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="nav shrink-0"
              title={theme === "theme-dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle Theme"
            >
              {theme === "theme-dark" ? (
                <Sun size={20} strokeWidth={1.75} className="text-amber-300" />
              ) : (
                <Moon size={20} strokeWidth={1.75} className="text-slate-800" />
              )}
            </button>
          </div>
        ) : (
          /* Expanded Panel */
          <div className="glass expanded-panel h-[calc(100vh-28px)] flex flex-col justify-between overflow-hidden w-[264px]">
            {/* Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Link
                  href="/branch/today"
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
                  <div className="font-display font-bold text-sm tracking-tight text-[var(--text)] leading-tight truncate">
                    TRIFIT BRANCH
                  </div>
                  <div className="text-[10.5px] text-[var(--muted)] font-mono leading-none truncate mt-0.5">
                    {activeBranchName.replace("TriFit ", "")}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleExpanded}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-colors shrink-0 cursor-pointer"
                title="Collapse Sidebar"
                aria-label="Collapse Navigation Panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="pt-2.5 pb-1 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search branch views..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[var(--btn-bg)] border border-[var(--line)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            {/* Categorized Nav List */}
            <div className="flex-1 overflow-y-auto apollo-scrollbar py-2 space-y-3 pr-1">
              {filteredGroups.map((group) => (
                <div key={group.label} className="space-y-0.5">
                  <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] opacity-80">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = resolvedActiveId === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`nav-expanded ${isActive ? "on" : ""}`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                              isActive
                                ? "bg-black/20 text-black border border-black/30"
                                : "chip"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Bottom Controls */}
            <div className="pt-2 border-t border-[var(--line)] space-y-1.5 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full nav-expanded justify-between text-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {theme === "theme-dark" ? (
                    <Sun className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-800" />
                  )}
                  <span>{theme === "theme-dark" ? "Dark Theme" : "Light Theme"}</span>
                </div>
                <span className="text-[10px] chip py-0.5 px-2">Toggle</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 min-w-0 flex flex-col gap-5 z-10 relative pb-12 transition-all duration-300 ease-in-out ${
          isExpanded ? "md:ml-[284px]" : "md:ml-[96px]"
        }`}
      >
        <FloatingCommandBar onOpenMobileMenu={() => setIsMobileDrawerOpen(true)} />
        <PageTransition key={pathname}>{children}</PageTransition>
      </main>
    </div>
  );
};