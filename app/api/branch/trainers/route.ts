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

    // Enforce server-side branch scope
    const { effectiveBranchId } = enforceBranchScope(session, targetBranchId);

    if (!effectiveBranchId) {
      return NextResponse.json(
        { error: "A valid branchId is required" },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.findUnique({
      where: { id: effectiveBranchId },
      select: { id: true, name: true, city: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const now = new Date();

    const trainers = await prisma.trainer.findMany({
      where: { branchId: effectiveBranchId },
      include: {
        shifts: {
          orderBy: { startsAt: "desc" },
          take: 3,
        },
        bookings: {
          include: {
            member: {
              select: { id: true, name: true, phone: true, goal: true, planId: true },
            },
          },
          orderBy: { startsAt: "asc" },
        },
        members: {
          select: { id: true, name: true, phone: true, goal: true, planId: true },
        },
      },
    });

    const enrichedTrainers = trainers.map((t) => {
      const expiryDate = new Date(t.certificateExpiry);
      const diffMs = expiryDate.getTime() - now.getTime();
      const daysUntilExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let certStatus: "VALID" | "EXPIRING_SOON" | "EXPIRED" = "VALID";
      if (daysUntilExpiry <= 0) certStatus = "EXPIRED";
      else if (daysUntilExpiry <= 30) certStatus = "EXPIRING_SOON";

      // Current shift or scheduled shift today
      const activeShift = t.shifts.find((s) => {
        const start = new Date(s.startsAt).getTime();
        const end = new Date(s.endsAt).getTime();
        return now.getTime() >= start && now.getTime() <= end;
      });

      const currentShift = activeShift || t.shifts[0];

      let shiftStatus: "ON_DUTY" | "PENDING_CHECKIN" | "OFF_DUTY" = "OFF_DUTY";
      if (activeShift) {
        shiftStatus = activeShift.checkedInAt ? "ON_DUTY" : "PENDING_CHECKIN";
      }

      // Utilization: total booked hours / 8-hour shift capacity
      const bookedCount = t.bookings.length;
      const utilizationRate = Math.min(100, Math.round((bookedCount / 6) * 100)); // 6 max slots per shift

      return {
        id: t.id,
        name: t.name,
        phone: t.phone,
        certificateExpiry: t.certificateExpiry,
        daysUntilExpiry,
        certStatus,
        shiftStatus,
        currentShift,
        shifts: t.shifts,
        bookings: t.bookings,
        assignedMembers: t.members,
        assignedMembersCount: t.members.length,
        utilizationRate,
      };
    });

    const totalTrainers = enrichedTrainers.length;
    const onDutyCount = enrichedTrainers.filter((t) => t.shiftStatus === "ON_DUTY").length;
    const certAlertsCount = enrichedTrainers.filter((t) => t.certStatus === "EXPIRING_SOON" || t.certStatus === "EXPIRED").length;
    const totalBookingsCount = enrichedTrainers.reduce((acc, t) => acc + t.bookings.length, 0);

    return NextResponse.json({
      branch,
      trainers: enrichedTrainers,
      summary: {
        totalTrainers,
        onDutyCount,
        certAlertsCount,
        totalBookingsCount,
      },
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error loading branch trainers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
