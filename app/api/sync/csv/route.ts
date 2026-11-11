import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope, BranchAccessError } from "@/lib/server/branch-guard";
import { DataSyncService, SyncEntityType } from "@/lib/sync/data-sync";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const body = await req.json();
    const { entityType, csvData, targetBranchId } = body;

    if (!entityType || !csvData) {
      return NextResponse.json(
        { error: "Both entityType and csvData are required." },
        { status: 400 }
      );
    }

    // Determine target branch
    const effectiveBranchId = targetBranchId || session.branchId || "branch-seaview";

    // Enforce branch scope on server
    enforceBranchScope(session, effectiveBranchId);

    let result;
    switch (entityType as SyncEntityType) {
      case "members":
        result = await DataSyncService.importMembers(csvData, effectiveBranchId, session);
        break;
      case "visits":
        result = await DataSyncService.importVisits(csvData, effectiveBranchId, session);
        break;
      case "trainers":
        result = await DataSyncService.importTrainers(csvData, effectiveBranchId, session);
        break;
      case "shifts":
        result = await DataSyncService.importShifts(csvData, effectiveBranchId, session);
        break;
      case "bookings":
        result = await DataSyncService.importBookings(csvData, effectiveBranchId, session);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown entityType '${entityType}'. Valid: members, visits, trainers, shifts, bookings.` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("CSV sync error:", error);
    return NextResponse.json({ error: error.message || "CSV sync failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);

    // Fetch recent sync audit logs
    const syncLogs = await prisma.auditLog.findMany({
      where: {
        action: "DATA_SYNC_IMPORT",
        ...(session.role === "BRANCH_MANAGER"
          ? { target: { contains: session.branchId } }
          : {}),
      },
      take: 20,
      orderBy: { at: "desc" },
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
    });

    // Counts by branch
    const branches = await prisma.branch.findMany({
      include: {
        _count: {
          select: { members: true, visits: true, trainers: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      syncLogs,
      branches,
      lastSyncTimestamp: syncLogs[0]?.at || null,
      syncEngine: "TRI FIT CSV Sync Engine (Phase 2)",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch sync status" }, { status: 500 });
  }
}
