import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const session = JSON.parse(sessionCookie);
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { branch: true },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        branchId: user.branchId,
        branchName: user.branch?.name || null,
        branchCity: user.branch?.city || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
