import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/server/branch-guard";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie);
      await logAuditEvent({
        userId: session.id,
        role: session.role,
        action: "LOGOUT",
        target: session.role === "ADMIN" ? "portal:admin" : `portal:branch:${session.branchId}`,
        details: `User ${session.email} logged out.`,
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("apollo_session");
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("apollo_session");
    return response;
  }
}
