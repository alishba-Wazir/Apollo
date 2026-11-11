import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope, logAuditEvent, BranchAccessError } from "@/lib/server/branch-guard";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const body = await req.json();
    const { caseId, messageId } = body;

    if (!caseId) {
      return NextResponse.json({ error: "caseId is required" }, { status: 400 });
    }

    // Load case and member to verify branch ownership
    const winbackCase = await prisma.winbackCase.findUnique({
      where: { id: caseId },
      include: {
        member: true,
        messages: true,
      },
    });

    if (!winbackCase) {
      return NextResponse.json({ error: "Winback case not found" }, { status: 404 });
    }

    // Verify branch scope on server
    enforceBranchScope(session, winbackCase.member.branchId);

    // Target the specific draft message or the latest message
    const targetMessage = messageId
      ? winbackCase.messages.find((m) => m.id === messageId)
      : winbackCase.messages[0];

    if (!targetMessage) {
      return NextResponse.json({ error: "No message found to approve" }, { status: 404 });
    }

    // Update message status to "approved" then "sent" (demo mock dispatch)
    const updatedMessage = await prisma.message.update({
      where: { id: targetMessage.id },
      data: {
        status: "sent",
        approvedBy: session.id,
        sentAt: new Date(),
      },
    });

    // Update case status
    await prisma.winbackCase.update({
      where: { id: caseId },
      data: {
        status: "CONTACTED",
      },
    });

    // Record audit event
    await logAuditEvent({
      userId: session.id,
      role: session.role,
      action: "APPROVE_SEND",
      target: `winback_case:${caseId}`,
      details: `Approved and dispatched simulated WhatsApp winback message to ${winbackCase.member.name} (${winbackCase.member.phone}).`,
    });

    return NextResponse.json({
      success: true,
      message: updatedMessage,
      note: "Simulated WhatsApp message approved and dispatched (Auto-send was OFF). Audit event logged.",
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error approving winback message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
