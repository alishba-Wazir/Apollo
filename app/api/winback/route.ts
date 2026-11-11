import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope, BranchAccessError } from "@/lib/server/branch-guard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const targetBranchId = req.nextUrl.searchParams.get("branchId") || session.branchId;

    // Enforce branch scope on server
    const { effectiveBranchId } = enforceBranchScope(session, targetBranchId);

    // If Admin requests without branch filter, effectiveBranchId is null (all branches)
    const whereClause: any = {};
    if (effectiveBranchId) {
      whereClause.member = { branchId: effectiveBranchId };
    }

    const cases = await prisma.winbackCase.findMany({
      where: whereClause,
      orderBy: { flaggedAt: "desc" },
      include: {
        member: {
          include: {
            branch: {
              select: { id: true, name: true, city: true },
            },
            trainer: {
              select: { id: true, name: true, phone: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            replyTags: true,
          },
        },
      },
    });

    return NextResponse.json({
      cases,
      branchScope: effectiveBranchId || "ALL_BRANCHES",
      totalCount: cases.length,
      openCount: cases.filter((c) => c.status === "OPEN").length,
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error loading winback cases:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
