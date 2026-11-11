import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope, logAuditEvent, BranchAccessError } from "@/lib/server/branch-guard";

export const dynamic = "force-dynamic";

export interface GroupClassItem {
  id: string;
  title: string;
  studio: string;
  trainerName: string;
  trainerPhone: string;
  startsAt: string; // "17:15"
  durationMinutes: number;
  capacity: number;
  bookedCount: number;
  waitlistCount: number;
  waitlist: Array<{
    id: string;
    memberName: string;
    phone: string;
    planId: string;
    joinedAt: string;
  }>;
  prayerConflict: {
    hasConflict: boolean;
    prayerName?: string;
    prayerTime?: string;
    bufferMinutes?: number;
    overridden: boolean;
    overrideReason?: string;
  };
}

// In-memory or dynamic store for interactive branch demo classes
let demoClasses: Record<string, GroupClassItem[]> = {
  "branch-seaview": [
    {
      id: "cls-sea-01",
      title: "Sunrise Burn HIIT",
      studio: "Studio Alpha",
      trainerName: "Coach Marcus Chen",
      trainerPhone: "0300-0000011",
      startsAt: "07:00",
      durationMinutes: 45,
      capacity: 25,
      bookedCount: 24,
      waitlistCount: 2,
      waitlist: [
        { id: "w-1", memberName: "Zubair Siddiqui", phone: "0300-0000004", planId: "ELITE", joinedAt: "06:15" },
        { id: "w-2", memberName: "Hamza Farooq", phone: "0300-0000005", planId: "PRO", joinedAt: "06:22" },
      ],
      prayerConflict: { hasConflict: false, overridden: false },
    },
    {
      id: "cls-sea-02",
      title: "Olympic Barbell Technique",
      studio: "Strength Forge",
      trainerName: "Coach Hamza Ali",
      trainerPhone: "0300-0000013",
      startsAt: "09:30",
      durationMinutes: 50,
      capacity: 20,
      bookedCount: 18,
      waitlistCount: 0,
      waitlist: [],
      prayerConflict: { hasConflict: false, overridden: false },
    },
    {
      id: "cls-sea-03",
      title: "Cardio Loft Cadence Sprint",
      studio: "Cardio Loft",
      trainerName: "Coach Sarah Jenkins",
      trainerPhone: "0300-0000012",
      startsAt: "11:30",
      durationMinutes: 45,
      capacity: 20,
      bookedCount: 20,
      waitlistCount: 3,
      waitlist: [
        { id: "w-3", memberName: "Usman Raza", phone: "0300-0000002", planId: "PRO", joinedAt: "10:10" },
        { id: "w-4", memberName: "Bilal Mirza", phone: "0300-0000003", planId: "STANDARD", joinedAt: "10:45" },
        { id: "w-5", memberName: "Farhan Mirza", phone: "0300-0000013", planId: "ELITE", joinedAt: "11:05" },
      ],
      prayerConflict: { hasConflict: false, overridden: false },
    },
    {
      id: "cls-sea-04",
      title: "Functional Core & Mobility",
      studio: "Olympic Arena",
      trainerName: "Coach Marcus Chen",
      trainerPhone: "0300-0000011",
      startsAt: "15:00",
      durationMinutes: 40,
      capacity: 15,
      bookedCount: 12,
      waitlistCount: 0,
      waitlist: [],
      prayerConflict: { hasConflict: false, overridden: false },
    },
    {
      id: "cls-sea-05",
      title: "Evening Surge MetCon",
      studio: "Studio Alpha",
      trainerName: "Coach Sarah Jenkins",
      trainerPhone: "0300-0000012",
      startsAt: "17:30",
      durationMinutes: 45,
      capacity: 25,
      bookedCount: 25,
      waitlistCount: 4,
      waitlist: [
        { id: "w-6", memberName: "Ali Malik", phone: "0300-0000001", planId: "ELITE", joinedAt: "16:00" },
        { id: "w-7", memberName: "Tariq Rehman", phone: "0300-0000006", planId: "STANDARD", joinedAt: "16:30" },
      ],
      prayerConflict: {
        hasConflict: true,
        prayerName: "Maghrib",
        prayerTime: "17:45",
        bufferMinutes: 15,
        overridden: false,
      },
    },
    {
      id: "cls-sea-06",
      title: "Post-Isha Powerlifting Blitz",
      studio: "Strength Forge",
      trainerName: "Coach Hamza Ali",
      trainerPhone: "0300-0000013",
      startsAt: "20:00",
      durationMinutes: 60,
      capacity: 30,
      bookedCount: 28,
      waitlistCount: 1,
      waitlist: [
        { id: "w-8", memberName: "Waqas Akram", phone: "0300-0000017", planId: "PRO", joinedAt: "18:40" },
      ],
      prayerConflict: { hasConflict: false, overridden: false },
    },
  ],
};

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const targetBranchId = req.nextUrl.searchParams.get("branchId") || session.branchId || "branch-seaview";

    enforceBranchScope(session, targetBranchId);

    const branch = await prisma.branch.findUnique({
      where: { id: targetBranchId },
      include: { settings: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const classes = demoClasses[targetBranchId] || demoClasses["branch-seaview"];

    const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
    const totalBooked = classes.reduce((sum, c) => sum + c.bookedCount, 0);
    const totalWaitlist = classes.reduce((sum, c) => sum + c.waitlistCount, 0);
    const conflictCount = classes.filter((c) => c.prayerConflict.hasConflict && !c.prayerConflict.overridden).length;

    return NextResponse.json({
      branch: { id: branch.id, name: branch.name, city: branch.city },
      classes,
      summary: {
        totalClasses: classes.length,
        totalCapacity,
        totalBooked,
        totalWaitlist,
        conflictCount,
        occupancyRate: Math.round((totalBooked / totalCapacity) * 100),
      },
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error loading classes:", error);
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
    const { action, classId, reason } = body;

    const branchId = session.branchId || "branch-seaview";
    const classes = demoClasses[branchId] || demoClasses["branch-seaview"];
    const targetClass = classes.find((c) => c.id === classId);

    if (!targetClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // 1. Action: PROMOTE_WAITLIST (simulate cancellation and FIFO promotion)
    if (action === "PROMOTE_WAITLIST") {
      if (targetClass.waitlist.length === 0) {
        return NextResponse.json({ error: "Waitlist is empty" }, { status: 400 });
      }

      const promotedMember = targetClass.waitlist.shift()!;
      targetClass.waitlistCount = targetClass.waitlist.length;

      await logAuditEvent({
        userId: session.id,
        role: session.role,
        action: "WAITLIST_PROMOTION",
        target: `class:${classId}`,
        details: `FIFO promoted ${promotedMember.memberName} (${promotedMember.planId}) into ${targetClass.title}.`,
      });

      return NextResponse.json({
        success: true,
        promotedMember,
        targetClass,
        message: `Member ${promotedMember.memberName} promoted into class via FIFO queue!`,
      });
    }

    // 2. Action: OVERRIDE_PRAYER (manager override with reason)
    if (action === "OVERRIDE_PRAYER") {
      if (!reason) {
        return NextResponse.json({ error: "Override reason required" }, { status: 400 });
      }

      targetClass.prayerConflict.overridden = true;
      targetClass.prayerConflict.overrideReason = reason;

      await logAuditEvent({
        userId: session.id,
        role: session.role,
        action: "PRAYER_OVERRIDE",
        target: `class:${classId}`,
        details: `Manager override for prayer conflict on ${targetClass.title} (${targetClass.startsAt}): "${reason}".`,
      });

      return NextResponse.json({
        success: true,
        targetClass,
        message: `Prayer buffer overridden with logged reason: "${reason}".`,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating class action:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
