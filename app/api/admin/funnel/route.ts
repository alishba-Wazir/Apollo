import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    let session = { role: "ADMIN", branchId: null, userId: "usr-admin" };
    if (sessionCookie) {
      try {
        session = JSON.parse(sessionCookie);
      } catch (e) {}
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin portal only." }, { status: 403 });
    }

    const branchFilter = req.nextUrl.searchParams.get("branchId") || null;

    // 1. Fetch active branches
    const activeBranches = await prisma.branch.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    });

    // 2. Fetch leads from LeadTour table
    const leads = await prisma.leadTour.findMany({
      where: branchFilter ? { branchId: branchFilter } : undefined,
      include: {
        branch: { select: { id: true, name: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Helper to calculate cumulative stages
    const calcFunnel = (branchLeads: typeof leads) => {
      const enquiriesCount = branchLeads.length;
      const toursCount = branchLeads.filter(
        (l) => l.stage === "TOUR_BOOKED" || l.stage === "TRIAL_ATTENDED" || l.stage === "JOINED"
      ).length;
      const trialsCount = branchLeads.filter(
        (l) => l.stage === "TRIAL_ATTENDED" || l.stage === "JOINED"
      ).length;
      const joinedCount = branchLeads.filter((l) => l.stage === "JOINED").length;

      const tourRate = enquiriesCount > 0 ? +((toursCount / enquiriesCount) * 100).toFixed(1) : 0;
      const trialRate = enquiriesCount > 0 ? +((trialsCount / enquiriesCount) * 100).toFixed(1) : 0;
      const overallConversionRate = enquiriesCount > 0 ? +((joinedCount / enquiriesCount) * 100).toFixed(1) : 0;

      const funnelSteps = [
        { step: "Initial Enquiries", count: enquiriesCount, rate: 100 },
        { step: "Club Tours Booked", count: toursCount, rate: tourRate },
        { step: "Free Trials Attended", count: trialsCount, rate: trialRate },
        { step: "Paid Members Joined", count: joinedCount, rate: overallConversionRate },
      ];

      return {
        enquiriesCount,
        toursCount,
        trialsCount,
        joinedCount,
        overallConversionRate,
        funnelSteps,
      };
    };

    // Overall Network Funnel
    const networkFunnel = calcFunnel(leads);

    // Branch Breakdown
    const branchBreakdown = activeBranches.map((b) => {
      const branchLeads = leads.filter((l) => l.branchId === b.id);
      const funnel = calcFunnel(branchLeads);
      return {
        branchId: b.id,
        branchName: b.name,
        city: b.city,
        ...funnel,
      };
    });

    // Sort by conversion rate to show top converter
    const topBranch = [...branchBreakdown].sort((a, b) => b.overallConversionRate - a.overallConversionRate)[0];

    return NextResponse.json({
      selectedBranchId: branchFilter,
      networkFunnel,
      branchBreakdown,
      topConvertingBranch: topBranch,
      recentLeads: leads.slice(0, 30).map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        stage: l.stage,
        branchId: l.branchId,
        branchName: l.branch.name,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("[FUNNEL_GET_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to load conversion funnel" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    let session = { role: "ADMIN", branchId: null, userId: "usr-admin" };
    if (sessionCookie) {
      try {
        session = JSON.parse(sessionCookie);
      } catch (e) {}
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin portal only." }, { status: 403 });
    }

    const body = await req.json();
    const { leadId, nextStage } = body;

    if (!leadId || !nextStage) {
      return NextResponse.json({ error: "leadId and nextStage are required" }, { status: 400 });
    }

    const updated = await prisma.leadTour.update({
      where: { id: leadId },
      data: { stage: nextStage },
      include: { branch: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId || "usr-admin",
        role: "ADMIN",
        action: "ADVANCE_LEAD_STAGE",
        target: `lead:${leadId}`,
        details: JSON.stringify({
          leadName: updated.name,
          nextStage,
          branchName: updated.branch.name,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      lead: updated,
    });
  } catch (error: any) {
    console.error("[FUNNEL_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to update lead stage" },
      { status: 500 }
    );
  }
}
