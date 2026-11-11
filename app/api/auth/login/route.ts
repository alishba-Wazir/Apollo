import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { logAuditEvent } from "@/lib/server/branch-guard";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { branch: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Record login in audit log
    await logAuditEvent({
      userId: user.id,
      role: user.role,
      action: "LOGIN",
      target: user.role === "ADMIN" ? "portal:admin" : `portal:branch:${user.branchId}`,
      details: `Successful login from ${user.email} (${user.role}).`,
    });

    const sessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      branchId: user.branchId,
      branchName: user.branch?.name || null,
      branchCity: user.branch?.city || null,
    };

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
    });

    // Set HTTP-only cookie
    response.cookies.set("apollo_session", JSON.stringify(sessionPayload), {
      httpOnly: false, // Accessible to client-side auth context in demo
      path: "/",
      maxAge: 86400 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error during login." },
      { status: 500 }
    );
  }
}
