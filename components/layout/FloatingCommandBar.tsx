"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TriFitLogo } from "@/components/brand/TriFitLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GlobalSearchModal } from "@/components/ui/GlobalSearchModal";
import { NotificationsDropdown } from "@/components/ui/NotificationsDropdown";
import { ResetDemoDataDialog } from "@/components/ui/ResetDemoDataDialog";
import { useAuth } from "@/lib/auth-context";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  Building2,
  ChevronDown,
  LogOut,
  Check,
  Search,
  RefreshCw,
  LayoutGrid,
  Menu,
} from "lucide-react";

interface FloatingCommandBarProps {
  onOpenMobileMenu?: () => void;
  portalTitle?: string;
  portalSubtitle?: string;
}

export const FloatingCommandBar: React.FC<FloatingCommandBarProps> = ({
  onOpenMobileMenu,
  portalTitle,
  portalSubtitle,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { branches, currentBranchId, setCurrentBranchId } = useApolloStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // If on login or landing, do not show
  if (pathname === "/login" || pathname === "/") {
    return null;
  }

  const isClubScopedPortal =
    pathname.startsWith("/admin") || pathname.startsWith("/branch");

  const currentBranch = branches.find((b) => b.id === currentBranchId) || {
    id: null,
    name: "All Branches (Consolidated)",
    area: "Enterprise Network",
    city: "Pakistan",
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full backdrop-blur-2xl glass border-b border-[var(--card-border)] px-3 sm:px-6 py-2.5 select-none transition-all duration-200">
        <div className="w-full flex items-center justify-between gap-3">
          
          {/* Left: Mobile menu toggle + Brand or Context */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="lg:hidden p-1.5 rounded-xl glass text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] transition-colors focus:outline-none"
                title="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            <div className="lg:hidden flex items-center gap-2">
              <Link
                href="/admin"
                className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shadow-sm shrink-0"
                style={{ background: "var(--accent)" }}
                title="APOLLO Enterprise"
              >
                <img src="/tri_fit_badge.png" alt="TriFit" className="w-full h-full object-cover rounded-lg" />
              </Link>
            </div>

            {(portalTitle || portalSubtitle) && (
              <div className="hidden sm:flex flex-col">
                {portalTitle && (
                  <span className="text-xs font-bold font-display text-[var(--text)] tracking-tight leading-tight">
                    {portalTitle}
                  </span>
                )}
                {portalSubtitle && (
                  <span className="text-[10px] text-[var(--muted)] leading-tight font-body">
                    {portalSubtitle}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Global Command Controls (Search ⌘K + Branch Selector + Notifications + Theme Toggle + User Menu) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Global Search Bar with Inset Icon, Focus Ring & ⌘K badge */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass border border-[var(--card-border)] hover:border-[var(--accent)] text-xs text-[var(--muted)] hover:text-[var(--text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              title="Search APOLLO (Ctrl+K or ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
              <span className="hidden md:inline font-normal">Search anything...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium glass text-[var(--muted)] rounded border border-[var(--card-border)]">
                ⌘K
              </kbd>
            </button>

            {/* Standardized Consolidated Branch Scope Switcher Dropdown */}
            {isClubScopedPortal && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl glass border border-[var(--card-border)] hover:border-[var(--accent)] text-xs font-semibold text-[var(--text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <Building2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <div className="flex flex-col text-left max-w-[120px] sm:max-w-[170px] truncate">
                    <span className="leading-tight truncate text-[11px] font-semibold">{currentBranch.name}</span>
                    <span className="text-[9px] text-[var(--accent)] font-medium leading-none truncate hidden sm:inline">
                      {currentBranch.area}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[998]" onClick={() => setIsDropdownOpen(false)} />
                    <div className="menu absolute right-0 mt-2 w-80 p-2 z-[999] animate-in fade-in zoom-in-95">
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider px-2 py-1 block">
                        Select Branch Scope:
                      </span>
                      
                      {/* All Branches Consolidated option */}
                      <button
                        onClick={() => {
                          setCurrentBranchId(null);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          currentBranchId === null
                            ? "bg-[var(--accent)] text-[var(--on-accent)] font-bold shadow-xs"
                            : "text-[var(--text)] hover:bg-[var(--chip)]"
                        }`}
                      >
                        <div>
                          <div className="font-bold">All Branches (Consolidated)</div>
                          <div className="text-[10px] opacity-80">Enterprise multi-branch analytics</div>
                        </div>
                        {currentBranchId === null && <Check className="w-4 h-4 shrink-0 text-[var(--on-accent)]" />}
                      </button>

                      {/* Specific Branches */}
                      {branches.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setCurrentBranchId(b.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between gap-2 mt-1 cursor-pointer ${
                            currentBranchId === b.id
                              ? "bg-[var(--accent)] text-[var(--on-accent)] font-bold shadow-xs"
                              : "text-[var(--text)] hover:bg-[var(--chip)]"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold truncate">{b.name}</div>
                            <div className="text-[10px] opacity-80 flex items-center gap-1.5">
                              <span className="font-medium">{b.area}</span>
                              <span>•</span>
                              <span>{b.city}</span>
                            </div>
                          </div>
                          {currentBranchId === b.id && <Check className="w-4 h-4 shrink-0 text-[var(--on-accent)]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Notifications Dropdown (with dynamic count badge) */}
            <NotificationsDropdown />

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* User Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 focus:outline-none"
                title="Account Settings"
              >
                <div className="w-8 h-8 rounded-full bg-[#FFD91C] text-black font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 transition-transform">
                  {user?.name ? user.name.charAt(0) : "A"}
                </div>
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[998]" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="menu absolute right-0 mt-2 w-64 p-2 z-[999] animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-[var(--line)]">
                      <div className="text-xs font-bold text-[var(--text)] truncate">
                        {user?.name || "Lead Administrator"}
                      </div>
                      <div className="text-[10.5px] text-[var(--accent)] font-medium">
                        {user?.email || "admin@trifit.com"}
                      </div>
                      <div className="text-[9.5px] text-[var(--muted)] mt-0.5">
                        {user?.badge || "Enterprise Administrator"}
                      </div>
                    </div>

                    <div className="p-1 space-y-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          router.push("/login");
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs font-medium text-[var(--text)] hover:bg-[var(--chip)] flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <LayoutGrid className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Switch Portal</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsResetDialogOpen(true);
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs font-medium text-[var(--accent)] hover:bg-[var(--chip)] flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Workspace Cache</span>
                      </button>

                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                          router.push("/login");
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ResetDemoDataDialog isOpen={isResetDialogOpen} onClose={() => setIsResetDialogOpen(false)} />
    </>
  );
};
