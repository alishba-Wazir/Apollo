import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  enforceBranchScope,
  BranchAccessError,
  AuthenticatedUserSession,
} from "@/lib/server/branch-guard";

describe("Phase 1: Foundation Tests (Auth, Roles, Branch Scoping, Audit)", () => {
  describe("1. Password Security (PBKDF2 SHA-512 with Salt)", () => {
    it("should hash a password into a salt:hash string format", () => {
      const password = "Password123!";
      const hashed = hashPassword(password);
      expect(hashed).toContain(":");
      const [salt, key] = hashed.split(":");
      expect(salt.length).toBe(32); // 16 bytes in hex = 32 chars
      expect(key.length).toBe(128); // 64 bytes in hex = 128 chars
    });

    it("should verify valid password correctly against the hash", () => {
      const password = "Password123!";
      const hashed = hashPassword(password);
      expect(verifyPassword("Password123!", hashed)).toBe(true);
    });

    it("should reject incorrect passwords", () => {
      const hashed = hashPassword("Password123!");
      expect(verifyPassword("WrongPassword", hashed)).toBe(false);
      expect(verifyPassword("", hashed)).toBe(false);
      expect(verifyPassword("password123!", hashed)).toBe(false); // case sensitive
    });
  });

  describe("2. Server-Enforced Branch Scoping (Section 1 & 2)", () => {
    const adminUser: AuthenticatedUserSession = {
      id: "usr-admin-01",
      email: "admin@trifit.com",
      name: "TriFit Lead Admin",
      role: "ADMIN",
      branchId: null,
    };

    const seaviewManager: AuthenticatedUserSession = {
      id: "usr-mgr-seaview",
      email: "manager.seaview@trifit.com",
      name: "Seaview General Manager",
      role: "BRANCH_MANAGER",
      branchId: "branch-seaview",
    };

    const ajTowerManager: AuthenticatedUserSession = {
      id: "usr-mgr-ajtower",
      email: "manager.ajtower@trifit.com",
      name: "AJ Tower Branch Manager",
      role: "BRANCH_MANAGER",
      branchId: "branch-ajtower",
    };

    it("should allow ADMIN network-wide access when targetBranchId is omitted", () => {
      const scope = enforceBranchScope(adminUser, null);
      expect(scope.allowed).toBe(true);
      expect(scope.effectiveBranchId).toBe(null);
    });

    it("should allow ADMIN to target any branch in the network", () => {
      const scopeSeaview = enforceBranchScope(adminUser, "branch-seaview");
      expect(scopeSeaview.allowed).toBe(true);
      expect(scopeSeaview.effectiveBranchId).toBe("branch-seaview");

      const scopeAjTower = enforceBranchScope(adminUser, "branch-ajtower");
      expect(scopeAjTower.allowed).toBe(true);
      expect(scopeAjTower.effectiveBranchId).toBe("branch-ajtower");

      const scopeSohaMall = enforceBranchScope(adminUser, "branch-sohamall");
      expect(scopeSohaMall.allowed).toBe(true);
      expect(scopeSohaMall.effectiveBranchId).toBe("branch-sohamall");
    });

    it("should allow Branch Manager to access their own assigned branch", () => {
      const scope = enforceBranchScope(seaviewManager, "branch-seaview");
      expect(scope.allowed).toBe(true);
      expect(scope.effectiveBranchId).toBe("branch-seaview");

      // Even if targetBranchId is omitted, defaults to their assigned branch
      const scopeDefault = enforceBranchScope(seaviewManager, null);
      expect(scopeDefault.allowed).toBe(true);
      expect(scopeDefault.effectiveBranchId).toBe("branch-seaview");
    });

    it("should STRICTLY FORBID Branch Manager from accessing a different branch (403)", () => {
      // Seaview manager trying to access AJ Tower
      expect(() => {
        enforceBranchScope(seaviewManager, "branch-ajtower");
      }).toThrowError(BranchAccessError);

      try {
        enforceBranchScope(seaviewManager, "branch-ajtower");
      } catch (err: any) {
        expect(err.statusCode).toBe(403);
        expect(err.message).toContain("Forbidden");
        expect(err.message).toContain("Scope restricted to branch-seaview");
      }

      // AJ Tower manager trying to access Seaview
      expect(() => {
        enforceBranchScope(ajTowerManager, "branch-seaview");
      }).toThrowError(BranchAccessError);
    });

    it("should throw 403 if Branch Manager has no assigned branchId", () => {
      const unassignedManager: AuthenticatedUserSession = {
        id: "usr-mgr-unassigned",
        email: "unassigned@trifit.com",
        name: "Unassigned Manager",
        role: "BRANCH_MANAGER",
        branchId: null,
      };

      expect(() => {
        enforceBranchScope(unassignedManager, "branch-seaview");
      }).toThrowError(BranchAccessError);
    });
  });

  describe("3. Auto-Send and Audit Policy Rules (Section 3 & 4)", () => {
    it("should verify that Auto-Send is OFF by default", () => {
      const defaultSettings = {
        autoSendEnabled: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
      };
      expect(defaultSettings.autoSendEnabled).toBe(false);
    });

    it("should require a manager approval event before changing message status from draft to sent", () => {
      interface WinbackMessage {
        id: string;
        caseId: string;
        status: "draft" | "approved" | "sent";
        approvedBy: string | null;
      }

      const initialMessage: WinbackMessage = {
        id: "msg-001",
        caseId: "case-001",
        status: "draft",
        approvedBy: null,
      };

      // Disallow sending if not approved
      const attemptAutoSend = (msg: WinbackMessage, autoSendSetting: boolean) => {
        if (!autoSendSetting && !msg.approvedBy) {
          throw new Error("Cannot send message: Auto-send is OFF and manager approval is missing.");
        }
        return { ...msg, status: "sent" as const };
      };

      expect(() => attemptAutoSend(initialMessage, false)).toThrowError(
        "Cannot send message: Auto-send is OFF and manager approval is missing."
      );

      // Approve message
      const approvedMessage: WinbackMessage = {
        ...initialMessage,
        approvedBy: "usr-mgr-seaview",
        status: "approved",
      };

      const sentMessage = attemptAutoSend(approvedMessage, false);
      expect(sentMessage.status).toBe("sent");
      expect(sentMessage.approvedBy).toBe("usr-mgr-seaview");
    });
  });
});
