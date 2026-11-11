import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);

    if (session.role === "ADMIN") {
      // Admin gets all branches
      const branches = await prisma.branch.findMany({
        orderBy: { name: "asc" },
        include: {
          settings: true,
          _count: {
            select: { members: true, trainers: true, equipment: true },
          },
        },
      });
      return NextResponse.json({ branches });
    }

    if (session.role === "BRANCH_MANAGER") {
      // Manager gets ONLY their own branch
      const branch = await prisma.branch.findUnique({
        where: { id: session.branchId },
        include: {
          settings: true,
          _count: {
            select: { members: true, trainers: true, equipment: true },
          },
        },
      });
      return NextResponse.json({ branches: branch ? [branch] : [] });
    }

    return NextResponse.json({ error: "Forbidden role" }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
  }
}
