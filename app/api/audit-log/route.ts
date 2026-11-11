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
      const logs = await prisma.auditLog.findMany({
        take: 100,
        orderBy: { at: "desc" },
        include: {
          user: {
            select: { name: true, email: true, role: true, branchId: true },
          },
        },
      });
      return NextResponse.json({ logs });
    }

    if (session.role === "BRANCH_MANAGER") {
      // Scoped to manager's branch
      const logs = await prisma.auditLog.findMany({
        where: {
          OR: [
            { target: { contains: session.branchId } },
            { user: { branchId: session.branchId } },
          ],
        },
        take: 100,
        orderBy: { at: "desc" },
        include: {
          user: {
            select: { name: true, email: true, role: true, branchId: true },
          },
        },
      });
      return NextResponse.json({ logs });
    }

    return NextResponse.json({ error: "Forbidden role" }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch audit log" }, { status: 500 });
  }
}
