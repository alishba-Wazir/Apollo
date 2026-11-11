import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { parseCSV, DataSyncService } from "@/lib/sync/data-sync";
import { BranchAccessError, AuthenticatedUserSession } from "@/lib/server/branch-guard";
import { prisma } from "@/lib/prisma";

describe("Phase 2: Data Sync (CSV Ingestion & Validation Engine)", () => {
  afterAll(async () => {
    await prisma.member.deleteMany({
      where: {
        phone: { in: ["0300-9999999", "0300-7777777", "0300-2222222", "0300-8888888"] },
      },
    });
  });
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

  describe("1. CSV Parser (parseCSV)", () => {
    it("should parse standard comma-delimited CSV text with headers", () => {
      const csv = `name,phone,goal,studio,plan
Bilal Qureshi,0300-1122334,Strength,Strength Forge,PRO
Zainab Farooq,0300-2233445,Fat Loss,Cardio Loft,ELITE`;

      const parsed = parseCSV(csv);
      expect(parsed.headers).toEqual(["name", "phone", "goal", "studio", "plan"]);
      expect(parsed.rows.length).toBe(2);
      expect(parsed.rows[0].name).toBe("Bilal Qureshi");
      expect(parsed.rows[0].phone).toBe("0300-1122334");
      expect(parsed.rows[1].name).toBe("Zainab Farooq");
    });

    it("should handle quoted fields containing commas", () => {
      const csv = `name,notes
"Farhan, Senior Trainer",Certified in TRX and Olympic Lifting`;

      const parsed = parseCSV(csv);
      expect(parsed.rows.length).toBe(1);
      expect(parsed.rows[0].name).toBe("Farhan, Senior Trainer");
      expect(parsed.rows[0].notes).toBe("Certified in TRX and Olympic Lifting");
    });

    it("should gracefully handle empty lines and whitespace", () => {
      const csv = `
name,phone

Tariq Aziz,0300-9988776

      `;
      const parsed = parseCSV(csv);
      expect(parsed.rows.length).toBe(1);
      expect(parsed.rows[0].name).toBe("Tariq Aziz");
    });
  });

  describe("2. Server-Enforced Branch Permissions During Import (Section 1 & 7)", () => {
    it("should allow Branch Manager to import data into their OWN branch", async () => {
      const csv = `name,phone
Test Member,0300-9999999`;

      // Should not throw BranchAccessError
      const result = await DataSyncService.importMembers(csv, "branch-seaview", seaviewManager);
      expect(result.imported).toBeGreaterThanOrEqual(1);
      expect(result.branchId).toBe("branch-seaview");
    });

    it("should STRICTLY REJECT Branch Manager from importing data into another branch (403)", async () => {
      const csv = `name,phone
Unauthorized Cross-Branch,0300-8888888`;

      // Seaview manager trying to import into AJ Tower
      await expect(
        DataSyncService.importMembers(csv, "branch-ajtower", seaviewManager)
      ).rejects.toThrowError(BranchAccessError);

      try {
        await DataSyncService.importMembers(csv, "branch-ajtower", seaviewManager);
      } catch (err: any) {
        expect(err.statusCode).toBe(403);
        expect(err.message).toContain("Forbidden");
      }
    });

    it("should allow ADMIN to import data into any branch in the network", async () => {
      const csv = `name,phone
Admin Ingested,0300-7777777`;

      const result = await DataSyncService.importMembers(csv, "branch-ajtower", adminUser);
      expect(result.imported).toBeGreaterThanOrEqual(1);
      expect(result.branchId).toBe("branch-ajtower");
    });
  });

  describe("3. Data Validation and Row Skipping", () => {
    it("should skip rows missing required fields and log row errors", async () => {
      const malformedCSV = `name,phone
,0300-1111111
Valid Name,
Another Valid,0300-2222222`;

      const result = await DataSyncService.importMembers(malformedCSV, "branch-seaview", adminUser);
      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(2);
      expect(result.errors.length).toBe(2);
      expect(result.errors[0]).toContain("Missing required name or phone");
    });
  });
});
