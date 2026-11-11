import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  enforceBranchScope,
  enforceMemberScope,
  enforceTrainerScope,
  BranchAccessError,
  AuthenticatedUserSession,
} from "@/lib/server/branch-guard";

describe("PART 1: One Shared Database & Access Rules", () => {
  // Test (a): Branch totals add up to the network totals
  it("(a) branch totals add up to the network totals (members, revenue, trainers)", async () => {
    // 1. Fetch all branches with counts
    const branches = await prisma.branch.findMany({
      where: { status: "ACTIVE" },
      include: {
        _count: {
          select: { members: true, trainers: true },
        },
        payments: true,
      },
    });

    expect(branches.length).toBeGreaterThan(0);

    // Sum from branches
    const sumMembersFromBranches = branches.reduce((acc, b) => acc + b._count.members, 0);
    const sumTrainersFromBranches = branches.reduce((acc, b) => acc + b._count.trainers, 0);
    const sumRevenueFromBranches = branches.reduce(
      (acc, b) => acc + b.payments.reduce((pAcc, p) => pAcc + p.amountPKR, 0),
      0
    );

    // Network-level counts for active branches
    const networkTotalMembers = await prisma.member.count({
      where: { branch: { status: "ACTIVE" } },
    });
    const networkTotalTrainers = await prisma.trainer.count({
      where: { branch: { status: "ACTIVE" } },
    });
    const networkPayments = await prisma.payment.findMany({
      where: { branch: { status: "ACTIVE" } },
    });
    const networkTotalRevenue = networkPayments.reduce((acc, p) => acc + p.amountPKR, 0);

    // Assert exact equality
    expect(sumMembersFromBranches).toBe(networkTotalMembers);
    expect(sumTrainersFromBranches).toBe(networkTotalTrainers);
    expect(sumRevenueFromBranches).toBe(networkTotalRevenue);
  });

  // Test (b): A member's visits and dues are identical in every portal
  it("(b) a member's visits and dues are identical in every portal", async () => {
    // Pick a test member
    const member = await prisma.member.findFirst({
      include: {
        visits: true,
        payments: true,
        branch: true,
      },
    });

    expect(member).toBeDefined();
    if (!member) return;

    // Direct database counts
    const expectedVisitCount = member.visits.length;
    const expectedDuesTotal = member.payments.reduce((acc, p) => acc + p.amountPKR, 0);

    // 1. Member portal view (simulating member me query)
    const memberPortalView = await prisma.member.findUnique({
      where: { id: member.id },
      include: { visits: true, payments: true },
    });
    const memberPortalVisits = memberPortalView?.visits.length || 0;
    const memberPortalDues = memberPortalView?.payments.reduce((acc, p) => acc + p.amountPKR, 0) || 0;

    // 2. Admin portal view (simulating directory query)
    const adminDirectoryView = await prisma.member.findUnique({
      where: { id: member.id },
      include: { visits: true, payments: true },
    });
    const adminVisits = adminDirectoryView?.visits.length || 0;
    const adminDues = adminDirectoryView?.payments.reduce((acc, p) => acc + p.amountPKR, 0) || 0;

    // 3. Branch manager view (filtered by branch)
    const branchManagerView = await prisma.member.findFirst({
      where: { id: member.id, branchId: member.branchId },
      include: { visits: true, payments: true },
    });
    const branchVisits = branchManagerView?.visits.length || 0;
    const branchDues = branchManagerView?.payments.reduce((acc, p) => acc + p.amountPKR, 0) || 0;

    // All views must yield the exact same visits and dues
    expect(memberPortalVisits).toBe(expectedVisitCount);
    expect(adminVisits).toBe(expectedVisitCount);
    expect(branchVisits).toBe(expectedVisitCount);

    expect(memberPortalDues).toBe(expectedDuesTotal);
    expect(adminDues).toBe(expectedDuesTotal);
    expect(branchDues).toBe(expectedDuesTotal);
  });

  // Test (c): A Branch Manager cannot load another branch
  it("(c) a Branch Manager cannot load another branch (403 forbidden)", () => {
    const seaviewManager: AuthenticatedUserSession = {
      id: "usr-mgr-sea",
      name: "Tariq Manager",
      email: "tariq.seaview@trifit.com.pk",
      role: "BRANCH_MANAGER",
      branchId: "branch-seaview",
    };

    // Attempting to access Clifton or AJ Tower
    expect(() => {
      enforceBranchScope(seaviewManager, "branch-clifton");
    }).toThrowError(BranchAccessError);

    try {
      enforceBranchScope(seaviewManager, "branch-ajtower");
    } catch (err: any) {
      expect(err.statusCode).toBe(403);
      expect(err.message).toContain("Forbidden");
      expect(err.message).toContain("Scope restricted to branch-seaview");
    }

    // Accessing own branch is permitted
    const ownAccess = enforceBranchScope(seaviewManager, "branch-seaview");
    expect(ownAccess.allowed).toBe(true);
    expect(ownAccess.effectiveBranchId).toBe("branch-seaview");
  });

  // Test (d): A Member cannot load another member
  it("(d) a Member cannot load another member (403 forbidden)", () => {
    const memberAlice: AuthenticatedUserSession = {
      id: "usr-mem-001",
      name: "Alice Member",
      email: "alice@example.com",
      role: "MEMBER",
      branchId: "branch-seaview",
      memberId: "mem-seaview-001",
    };

    // Member Alice trying to load Member Bob's profile
    expect(() => {
      enforceMemberScope(memberAlice, "mem-clifton-002");
    }).toThrowError(BranchAccessError);

    try {
      enforceMemberScope(memberAlice, "mem-clifton-002");
    } catch (err: any) {
      expect(err.statusCode).toBe(403);
      expect(err.message).toContain("Forbidden");
      expect(err.message).toContain("Members cannot view or modify other members' private records");
    }

    // Accessing own record is permitted
    const ownAccess = enforceMemberScope(memberAlice, "mem-seaview-001");
    expect(ownAccess.allowed).toBe(true);
    expect(ownAccess.effectiveMemberId).toBe("mem-seaview-001");

    // Admin has global access to any member
    const adminUser: AuthenticatedUserSession = {
      id: "usr-admin",
      name: "Super Admin",
      email: "admin@trifit.com.pk",
      role: "ADMIN",
      branchId: null,
    };
    const adminAccess = enforceMemberScope(adminUser, "mem-clifton-002");
    expect(adminAccess.allowed).toBe(true);
    expect(adminAccess.effectiveMemberId).toBe("mem-clifton-002");
  });

  // Additional rule: Trainer cannot access other trainers' clients
  it("(e) a Trainer cannot load a client assigned to another trainer", () => {
    const trainerHamza: AuthenticatedUserSession = {
      id: "usr-trn-01",
      name: "Coach Hamza",
      email: "hamza@trifit.com.pk",
      role: "TRAINER",
      branchId: "branch-seaview",
      trainerId: "trn-sea-01",
    };

    // Client assigned to Coach Bilal (trn-sea-02)
    expect(() => {
      enforceTrainerScope(trainerHamza, "trn-sea-02");
    }).toThrowError(BranchAccessError);

    try {
      enforceTrainerScope(trainerHamza, "trn-sea-02");
    } catch (err: any) {
      expect(err.statusCode).toBe(403);
      expect(err.message).toContain("Trainers cannot access another coach's earnings or clients");
    }

    // Accessing own client is permitted
    const ownClientAccess = enforceTrainerScope(trainerHamza, "trn-sea-01");
    expect(ownClientAccess.allowed).toBe(true);
  });
});
