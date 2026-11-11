import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope, enforceMemberScope } from "@/lib/server/branch-guard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    let session = { role: "ADMIN", branchId: null, memberId: null, trainerId: null };
    if (sessionCookie) {
      try {
        session = JSON.parse(sessionCookie);
      } catch (e) {}
    }

    const requestedBranchId = req.nextUrl.searchParams.get("branchId") || null;
    const requestedMemberId = req.nextUrl.searchParams.get("memberId") || null;

    // If specific member requested, enforce member scope
    if (requestedMemberId) {
      enforceMemberScope(session as any, requestedMemberId);
      const member = await prisma.member.findUnique({
        where: { id: requestedMemberId },
        include: {
          branch: true,
          trainer: true,
          visits: { orderBy: { checkedInAt: "desc" } },
          payments: { orderBy: { createdAt: "desc" } },
          bookings: { orderBy: { startsAt: "desc" } },
        },
      });

      if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }

      return NextResponse.json({ member });
    }

    // Role-based directory list
    if (session.role === "MEMBER") {
      // Member can only load their own record
      const memberId = session.memberId || (session as any).id;
      const member = await prisma.member.findUnique({
        where: { id: memberId },
        include: {
          branch: true,
          trainer: true,
          visits: { orderBy: { checkedInAt: "desc" } },
          payments: { orderBy: { createdAt: "desc" } },
          bookings: { orderBy: { startsAt: "desc" } },
        },
      });
      return NextResponse.json({ members: member ? [member] : [] });
    }

    if (session.role === "TRAINER") {
      // Trainer can only load their assigned clients
      const trainerId = session.trainerId || (session as any).id;
      const clients = await prisma.member.findMany({
        where: { trainerId },
        include: {
          branch: true,
          trainer: true,
          visits: { orderBy: { checkedInAt: "desc" }, take: 5 },
          bookings: { where: { trainerId }, orderBy: { startsAt: "desc" } },
        },
      });
      return NextResponse.json({ members: clients });
    }

    // Admin & Branch Manager
    const { effectiveBranchId } = enforceBranchScope(session as any, requestedBranchId);

    const members = await prisma.member.findMany({
      where: effectiveBranchId ? { branchId: effectiveBranchId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        branch: { select: { id: true, name: true, city: true, area: true } },
        trainer: { select: { id: true, name: true } },
        visits: { orderBy: { checkedInAt: "desc" }, take: 1 },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    const formatted = members.map((m) => {
      const lastVisit = m.visits[0];
      const lastPayment = m.payments[0];
      const now = new Date();
      const daysAway = lastVisit
        ? Math.floor((now.getTime() - new Date(lastVisit.checkedInAt).getTime()) / 86400000)
        : 30;

      return {
        id: m.id,
        name: m.name,
        phone: m.phone,
        cnic: m.cnic || "42101-0000000-0",
        branchId: m.branchId,
        branch: m.branch.name,
        branchCity: m.branch.city,
        tier: m.planId === "ELITE" ? "Black Diamond VIP" : m.planId === "PRO" ? "Executive Gold" : "Prime Standard",
        status: m.status,
        planId: m.planId,
        goal: m.goal,
        studio: m.studio,
        trainerName: m.trainer?.name || "Unassigned",
        trainerId: m.trainerId,
        daysAway,
        expirationDate: m.expirationDate,
        whatsappOptIn: m.whatsappOptIn,
        biometricConsent: m.biometricConsent,
        lastCheckin: lastVisit ? new Date(lastVisit.checkedInAt).toLocaleDateString("en-PK") : "Never",
        lastPaymentAmountPKR: lastPayment?.amountPKR || 0,
        locker: `L-${m.id.substring(m.id.length - 3)}`,
        techGisScans: (parseInt(m.id.substring(m.id.length - 2), 10) % 7) + 1,
        avatarSeed: m.name.split(" ").map((n) => n[0]).join(""),
      };
    });

    return NextResponse.json({ members: formatted, total: formatted.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch members" }, { status: error.statusCode || 500 });
  }
}
