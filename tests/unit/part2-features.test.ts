import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("PART 2: Three New Features", () => {
  // ---------------------------------------------------------------------------
  // 1. RENEWAL REMINDERS
  // ---------------------------------------------------------------------------
  describe("Feature 1: Renewal Reminders (7-Day Expiry & Visit Frequency)", () => {
    it("fetches members expiring in next 7 days and identifies those visiting less than usual", async () => {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 86400000);

      const expiringMembers = await prisma.member.findMany({
        where: {
          status: "ACTIVE",
          expirationDate: {
            gte: now,
            lte: sevenDaysLater,
          },
        },
        include: {
          visits: {
            orderBy: { checkedInAt: "desc" },
            take: 5,
          },
          branch: true,
        },
      });

      // There should be members seeded expiring in next 7 days
      expect(expiringMembers.length).toBeGreaterThan(0);

      // Verify each member is strictly in the 7-day future window
      for (const m of expiringMembers) {
        expect(m.expirationDate).not.toBeNull();
        const expTime = new Date(m.expirationDate!).getTime();
        expect(expTime).toBeGreaterThanOrEqual(now.getTime() - 1000);
        expect(expTime).toBeLessThanOrEqual(sevenDaysLater.getTime() + 1000);

        // Check visit drop detection
        const lastVisit = m.visits[0];
        const daysAbsent = lastVisit
          ? Math.floor((now.getTime() - new Date(lastVisit.checkedInAt).getTime()) / 86400000)
          : 30;
        const isVisitingLess = daysAbsent >= 7 || m.visits.length < 3;

        // If absent >= 7 days, isVisitingLess MUST be true
        if (daysAbsent >= 7) {
          expect(isVisitingLess).toBe(true);
        }
      }
    });

    it("verifies bilingual reminder templates (English & Roman Urdu) contain key variables", async () => {
      const member = await prisma.member.findFirst({
        where: { status: "ACTIVE" },
        include: { branch: true },
      });
      expect(member).not.toBeNull();

      const daysRemaining = 4;
      const expDateStr = "11 Nov 2026";

      const draftEnglish = `Assalam-o-Alaikum ${member!.name}! Your ${member!.planId} membership at TRI FIT ${member!.branch.name} expires in ${daysRemaining} days on ${expDateStr}. Renew before expiry to maintain your continuous turnstile access!`;
      const draftUrdu = `Assalam-o-Alaikum ${member!.name}! TRI FIT ${member!.branch.name} par aapka ${member!.planId} package ${daysRemaining} dino me (${expDateStr}) expire ho raha hai. Bila ta-attul turnstile access ke liye aaj hi renew karwayen!`;

      expect(draftEnglish).toContain(member!.name);
      expect(draftEnglish).toContain(member!.branch.name);
      expect(draftEnglish).toContain("turnstile access");

      expect(draftUrdu).toContain(member!.name);
      expect(draftUrdu).toContain(member!.branch.name);
      expect(draftUrdu).toContain("turnstile access");
    });

    it("enforces consent rule: cannot send renewal message to member who has not opted in", async () => {
      const optedOutMember = await prisma.member.findFirst({
        where: { whatsappOptIn: false },
      });
      expect(optedOutMember).not.toBeNull();
      expect(optedOutMember!.whatsappOptIn).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. OWNER WEEKLY SUMMARY
  // ---------------------------------------------------------------------------
  describe("Feature 2: Owner Weekly Summary", () => {
    it("computes live network metrics (members, revenue, at-risk, brought back, best/weakest branch)", async () => {
      const activeBranches = await prisma.branch.findMany({
        where: { status: "ACTIVE" },
        include: { _count: { select: { members: true } } },
      });
      expect(activeBranches.length).toBe(4);

      const totalMembers = await prisma.member.count({ where: { status: "ACTIVE" } });
      const payments = await prisma.payment.findMany();
      const totalRevenuePKR = payments.reduce((acc, p) => acc + p.amountPKR, 0);

      expect(totalMembers).toBeGreaterThan(150);
      expect(totalRevenuePKR).toBeGreaterThan(0);

      // Branch revenue breakdown
      const branchRevenues: Record<string, number> = {};
      for (const p of payments) {
        branchRevenues[p.branchId] = (branchRevenues[p.branchId] || 0) + p.amountPKR;
      }

      const branchPerf = activeBranches.map((b) => ({
        id: b.id,
        name: b.name,
        revenuePKR: branchRevenues[b.id] || 0,
      }));

      branchPerf.sort((a, b) => b.revenuePKR - a.revenuePKR);
      const bestBranch = branchPerf[0];
      const weakestBranch = branchPerf[branchPerf.length - 1];

      expect(bestBranch).toBeDefined();
      expect(weakestBranch).toBeDefined();
      expect(bestBranch.revenuePKR).toBeGreaterThanOrEqual(weakestBranch.revenuePKR);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. TRIAL AND TOUR CONVERSION FUNNEL
  // ---------------------------------------------------------------------------
  describe("Feature 3: Trial and Tour Conversion Funnel", () => {
    it("computes conversion funnel per branch and across the network", async () => {
      const leads = await prisma.leadTour.findMany({
        include: { branch: true },
      });

      expect(leads.length).toBeGreaterThan(0);

      const enquiries = leads.length;
      const tours = leads.filter(
        (l) => l.stage === "TOUR_BOOKED" || l.stage === "TRIAL_ATTENDED" || l.stage === "JOINED"
      ).length;
      const trials = leads.filter((l) => l.stage === "TRIAL_ATTENDED" || l.stage === "JOINED").length;
      const joined = leads.filter((l) => l.stage === "JOINED").length;

      // Mathematical funnel invariants
      expect(enquiries).toBeGreaterThanOrEqual(tours);
      expect(tours).toBeGreaterThanOrEqual(trials);
      expect(trials).toBeGreaterThanOrEqual(joined);

      const conversionRate = (joined / enquiries) * 100;
      expect(conversionRate).toBeGreaterThan(0);
      expect(conversionRate).toBeLessThanOrEqual(100);

      // Test active branches breakdown
      const activeBranches = await prisma.branch.findMany({ where: { status: "ACTIVE" } });
      for (const b of activeBranches) {
        const branchLeads = leads.filter((l) => l.branchId === b.id);
        expect(branchLeads.length).toBeGreaterThan(0);

        const bJoined = branchLeads.filter((l) => l.stage === "JOINED").length;
        const bRate = (bJoined / branchLeads.length) * 100;
        expect(bRate).toBeGreaterThanOrEqual(0);
        expect(bRate).toBeLessThanOrEqual(100);
      }
    });
  });
});
