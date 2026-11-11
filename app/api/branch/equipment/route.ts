import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope, logAuditEvent, BranchAccessError } from "@/lib/server/branch-guard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const targetBranchId = req.nextUrl.searchParams.get("branchId") || session.branchId || "branch-seaview";

    // Enforce branch scope on server
    const { effectiveBranchId } = enforceBranchScope(session, targetBranchId);

    if (!effectiveBranchId) {
      return NextResponse.json({ error: "A valid branchId is required" }, { status: 400 });
    }

    const branch = await prisma.branch.findUnique({
      where: { id: effectiveBranchId },
      select: { id: true, name: true, city: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const equipment = await prisma.equipment.findMany({
      where: { branchId: effectiveBranchId },
      orderBy: { name: "asc" },
    });

    const totalCount = equipment.length;
    const operationalCount = equipment.filter((e) => e.status === "OPERATIONAL").length;
    const attentionCount = equipment.filter((e) => e.status === "ATTENTION").length;
    const maintenanceCount = equipment.filter((e) => e.status === "MAINTENANCE").length;
    const totalRepairCostPKR = equipment.reduce((sum, e) => sum + (e.repairCost || 0), 0);

    return NextResponse.json({
      branch,
      equipment,
      summary: {
        totalCount,
        operationalCount,
        attentionCount,
        maintenanceCount,
        totalRepairCostPKR,
        operationalRate: totalCount > 0 ? Math.round((operationalCount / totalCount) * 100) : 100,
      },
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error loading branch equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const body = await req.json();
    const { equipmentId, newStatus, additionalRepairCostPKR, note } = body;

    if (!equipmentId || !newStatus) {
      return NextResponse.json({ error: "equipmentId and newStatus are required" }, { status: 400 });
    }

    const item = await prisma.equipment.findUnique({
      where: { id: equipmentId },
    });

    if (!item) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    // Enforce branch scope
    enforceBranchScope(session, item.branchId);

    const updatedCost = (item.repairCost || 0) + (additionalRepairCostPKR ? Number(additionalRepairCostPKR) : 0);

    const updatedItem = await prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        status: newStatus,
        repairCost: updatedCost,
      },
    });

    await logAuditEvent({
      userId: session.id,
      role: session.role,
      action: "EQUIPMENT_STATUS_UPDATE",
      target: `equipment:${equipmentId}`,
      details: `Updated status of ${item.name} from ${item.status} to ${newStatus}.${note ? ` Note: "${note}".` : ""} Added cost: PKR ${additionalRepairCostPKR || 0}.`,
    });

    return NextResponse.json({
      success: true,
      equipment: updatedItem,
      message: `Equipment status updated to ${newStatus}. Audit log entry recorded.`,
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error updating equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
