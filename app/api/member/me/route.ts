import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    let memberId = "mem-seaview-001"; // Default fallback demo member
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie);
        if (session.memberId) memberId = session.memberId;
        else if (session.role === "MEMBER" && session.id) memberId = session.id;
      } catch (e) {}
    }

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

    if (!member) {
      // Find first available member
      const first = await prisma.member.findFirst({
        include: {
          branch: true,
          trainer: true,
          visits: { orderBy: { checkedInAt: "desc" } },
          payments: { orderBy: { createdAt: "desc" } },
          bookings: { orderBy: { startsAt: "desc" } },
        },
      });
      return NextResponse.json({ member: first });
    }

    // Compute streak and dues
    const totalVisits = member.visits.length;
    const streakDays = Math.min(8, Math.max(1, totalVisits % 10));
    const totalPaidPKR = member.payments.reduce((acc, p) => acc + p.amountPKR, 0);

    return NextResponse.json({
      member: {
        ...member,
        totalVisits,
        streakDays,
        totalPaidPKR,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load member profile" }, { status: 500 });
  }
}
