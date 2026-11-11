import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      branchCount,
      userCount,
      memberCount,
      trainerCount,
      equipmentCount,
      visitCount,
      auditLogCount,
      branches,
    ] = await Promise.all([
      prisma.branch.count(),
      prisma.user.count(),
      prisma.member.count(),
      prisma.trainer.count(),
      prisma.equipment.count(),
      prisma.visit.count(),
      prisma.auditLog.count(),
      prisma.branch.findMany({
        select: {
          id: true,
          name: true,
          city: true,
          type: true,
          capacity: true,
          hours: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      system: "APOLLO for TRI FIT",
      phase: "Phase 1: Foundation",
      database: "SQLite via Prisma ORM",
      counts: {
        branches: branchCount,
        users: userCount,
        members: memberCount,
        trainers: trainerCount,
        equipment: equipmentCount,
        visits: visitCount,
        auditLogs: auditLogCount,
      },
      branches,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Foundation status API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to query database status" },
      { status: 500 }
    );
  }
}
