"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "ADMIN" | "BRANCH_MANAGER" | "TRAINER" | "MEMBER";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  branchId: string | null;
  branchName?: string | null;
  branchCity?: string | null;
  avatar?: string;
  badge?: string;
}

export interface DemoAccount {
  label: string;
  sublabel: string;
  email: string;
  role: UserRole;
  branchId: string | null;
  branchName: string;
  scopeBadge: string;
  targetRoute: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "👑 Admin (Head Office)",
    sublabel: "Full access to all 5 branches, finance & settings",
    email: "admin@trifit.com",
    role: "ADMIN",
    branchId: null,
    branchName: "All Branches (Network-Wide)",
    scopeBadge: "Global Access",
    targetRoute: "/admin",
  },
  {
    label: "🏢 Branch Manager (Seaview)",
    sublabel: "Front desk, turnstile gates, POS & closing",
    email: "manager.seaview@trifit.com",
    role: "BRANCH_MANAGER",
    branchId: "branch-seaview",
    branchName: "TRI FIT Seaview Flagship",
    scopeBadge: "Seaview Flagship",
    targetRoute: "/branch/desk",
  },
  {
    label: "🏋️‍♂️ Trainer (Coach Tariq)",
    sublabel: "PT clients, workout planner, 3D scans & chat",
    email: "trainer.tariq@trifit.com",
    role: "TRAINER",
    branchId: "branch-seaview",
    branchName: "TRI FIT Seaview Flagship",
    scopeBadge: "Coach Portal",
    targetRoute: "/trainer/clients",
  },
  {
    label: "📱 Member (Zaid Khan)",
    sublabel: "Gate pass, class bookings, trainer chat & dues",
    email: "zaid.khan@trifit.com",
    role: "MEMBER",
    branchId: "branch-seaview",
    branchName: "TRI FIT Seaview Flagship",
    scopeBadge: "VIP Member",
    targetRoute: "/member/visits",
  },
  {
    label: "📢 Social Hub (Marketing)",
    sublabel: "Multi-platform studio, scheduled campaigns & analytics",
    email: "admin@trifit.com",
    role: "ADMIN",
    branchId: null,
    branchName: "All Branches (Network-Wide)",
    scopeBadge: "Social Studio",
    targetRoute: "/social",
  },
];

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  branchId?: string | null;
  branchName?: string;
  badge?: string;
};

// 4 Interactive Personas for the Global Persona Switcher
export const DEMO_PERSONAS: DemoUser[] = [
  {
    id: "usr-admin-01",
    name: "TriFit Lead Admin",
    email: "admin@trifit.com",
    role: "ADMIN",
    branchId: null,
    branchName: "All Branches (Network-Wide)",
    badge: "Super Admin",
  },
  {
    id: "usr-mgr-seaview",
    name: "Seaview General Manager",
    email: "manager.seaview@trifit.com",
    role: "BRANCH_MANAGER",
    branchId: "branch-seaview",
    branchName: "TRI FIT Seaview Flagship",
    badge: "Branch GM",
  },
  {
    id: "usr-tr-tariq",
    name: "Coach Tariq Mahmood",
    email: "trainer.tariq@trifit.com",
    role: "TRAINER",
    branchId: "branch-seaview",
    branchName: "TRI FIT Seaview Flagship",
    badge: "Senior PT",
  },
  {
    id: "usr-mem-zaid",
    name: "Zaid Khan",
    email: "zaid.khan@trifit.com",
    role: "MEMBER",
    branchId: "branch-seaview",
    branchName: "TRI FIT Seaview Flagship",
    badge: "Black Diamond VIP",
  },
];

interface AuthContextType {
  user: UserSession | null;
  currentUser: DemoUser; // Legacy backward compat
  setCurrentUser: (u: DemoUser) => void; // Legacy backward compat
  isLoading: boolean;
  selectedBranchId: string | null; // For Admin branch switcher
  setSelectedBranchId: (id: string | null) => void;
  switchPersona: (role: UserRole, targetRoute?: string) => void;
  login: (email: string, password?: string, targetRoute?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasAccess: (targetPortal: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    // Default to admin session for smooth development
    return {
      id: "usr-admin-01",
      email: "admin@trifit.com",
      name: "TriFit Lead Admin",
      role: "ADMIN",
      branchId: null,
      branchName: "All Branches (Network-Wide)",
      branchCity: "Karachi & Islamabad",
      badge: "Super Admin",
    };
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const router = useRouter();

  // Load session from cookie / API or localStorage on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const savedPersona = localStorage.getItem("apollo-persona") as UserRole | null;
        if (savedPersona) {
          const match = DEMO_PERSONAS.find((p) => p.role === savedPersona);
          if (match) {
            setUser({
              id: match.id,
              email: match.email,
              name: match.name,
              role: match.role,
              branchId: match.branchId || null,
              branchName: match.branchName || null,
              badge: match.badge,
            });
            setSelectedBranchId(match.branchId || null);
            setIsLoading(false);
            return;
          }
        }

        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setSelectedBranchId(data.user.branchId || null);
          }
        }
      } catch (e) {
        console.error("Failed to load auth session", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const switchPersona = (targetRole: UserRole, targetRoute?: string) => {
    const persona = DEMO_PERSONAS.find((p) => p.role === targetRole) || DEMO_PERSONAS[0];
    const sessionUser: UserSession = {
      id: persona.id,
      email: persona.email,
      name: persona.name,
      role: persona.role,
      branchId: persona.branchId || null,
      branchName: persona.branchName || null,
      badge: persona.badge,
    };

    setUser(sessionUser);
    setSelectedBranchId(persona.branchId || null);
    localStorage.setItem("apollo-persona", persona.role);

    // Automatic route switching
    if (targetRoute) {
      router.push(targetRoute);
    } else if (persona.role === "ADMIN") {
      router.push("/admin");
    } else if (persona.role === "BRANCH_MANAGER") {
      router.push("/branch/desk");
    } else if (persona.role === "TRAINER") {
      router.push("/trainer/clients");
    } else if (persona.role === "MEMBER") {
      router.push("/member/visits");
    }
  };

  const login = async (email: string, password: string = "Password123!", targetRoute?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Fallback demo login if API endpoint mock is triggered
        const matchedDemo = DEMO_PERSONAS.find((d) => d.email === email);
        if (matchedDemo) {
          switchPersona(matchedDemo.role, targetRoute);
          return { success: true };
        }
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      setSelectedBranchId(data.user.branchId || null);
      localStorage.setItem("apollo-persona", data.user.role);

      if (targetRoute) {
        router.push(targetRoute);
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else if (data.user.role === "BRANCH_MANAGER") {
        router.push("/branch/desk");
      } else if (data.user.role === "TRAINER") {
        router.push("/trainer/clients");
      } else {
        router.push("/member/visits");
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setSelectedBranchId(null);
      localStorage.removeItem("apollo-persona");
      setIsLoading(false);
      router.push("/login");
    }
  };

  const hasAccess = (targetPortal: string): boolean => {
    if (!user) return false;
    if (targetPortal === "admin" || targetPortal === "command") return user.role === "ADMIN";
    if (targetPortal === "branch" || targetPortal === "pro") return user.role === "BRANCH_MANAGER" || user.role === "ADMIN";
    if (targetPortal === "trainer") return user.role === "TRAINER" || user.role === "ADMIN";
    if (targetPortal === "member") return user.role === "MEMBER" || user.role === "ADMIN";
    return true;
  };

  const currentUser: DemoUser = {
    id: user?.id || "usr-admin-01",
    name: user?.name || "TriFit Lead Admin",
    email: user?.email || "admin@trifit.com",
    role: user?.role || "ADMIN",
    branchId: user?.branchId || null,
    branchName: user?.branchName || "All Branches",
    badge: user?.badge || "Super Admin",
  };

  const setCurrentUser = (newUser: DemoUser) => {
    switchPersona(newUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser,
        setCurrentUser,
        isLoading,
        selectedBranchId,
        setSelectedBranchId,
        switchPersona,
        login,
        logout,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
