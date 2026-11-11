import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope, logAuditEvent, BranchAccessError } from "@/lib/server/branch-guard";
import { GeminiWinbackMock } from "@/lib/winback/gemini-mock";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const body = await req.json();
    const { action, caseId, language, editedText, replyReason } = body;

    if (!caseId) {
      return NextResponse.json({ error: "caseId is required" }, { status: 400 });
    }

    const winbackCase = await prisma.winbackCase.findUnique({
      where: { id: caseId },
      include: {
        member: {
          include: {
            branch: true,
            trainer: true,
          },
        },
        messages: {
          include: {
            replyTags: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!winbackCase) {
      return NextResponse.json({ error: "Winback case not found" }, { status: 404 });
    }

    // Enforce branch scope
    enforceBranchScope(session, winbackCase.member.branchId);

    // 1. GENERATE_DRAFT (or switch language)
    if (action === "GENERATE_DRAFT") {
      const lang = (language === "ur" ? "ur" : "en") as "en" | "ur";
      const newDraftBody = GeminiWinbackMock.draftMessage({
        memberName: winbackCase.member.name,
        daysAway: winbackCase.daysAway,
        normalVisits: Math.round(winbackCase.normalVisitsPerWeek),
        goal: winbackCase.member.goal,
        studio: winbackCase.member.studio,
        coachName: winbackCase.member.trainer?.name,
        branchName: winbackCase.member.branch.name,
        language: lang,
      });

      // Update or create draft message
      let draftMessage = winbackCase.messages.find((m) => m.direction === "OUTBOUND" && m.status === "draft");

      if (draftMessage) {
        draftMessage = await prisma.message.update({
          where: { id: draftMessage.id },
          data: {
            body: newDraftBody,
            language: lang,
          },
          include: { replyTags: true },
        });
      } else {
        draftMessage = await prisma.message.create({
          data: {
            caseId: winbackCase.id,
            direction: "OUTBOUND",
            body: newDraftBody,
            language: lang,
            status: "draft",
          },
          include: { replyTags: true },
        });
      }

      return NextResponse.json({ success: true, message: draftMessage });
    }

    // 2. UPDATE_DRAFT (manager manually edited text)
    if (action === "UPDATE_DRAFT") {
      if (!editedText) {
        return NextResponse.json({ error: "editedText is required" }, { status: 400 });
      }

      const draftMessage = winbackCase.messages.find((m) => m.direction === "OUTBOUND" && m.status === "draft");
      if (!draftMessage) {
        return NextResponse.json({ error: "No draft message found to edit" }, { status: 404 });
      }

      const updated = await prisma.message.update({
        where: { id: draftMessage.id },
        data: { body: editedText },
        include: { replyTags: true },
      });

      return NextResponse.json({ success: true, message: updated });
    }

    // 3. SIMULATE_REPLY (member replies via WhatsApp simulation)
    if (action === "SIMULATE_REPLY") {
      const replies = GeminiWinbackMock.getSimulatedReplies(winbackCase.member.name);
      const chosenText = replies[replyReason || "work"] || replies.work;

      const tagged = GeminiWinbackMock.tagReply(chosenText);

      // Create INBOUND message
      const inboundMessage = await prisma.message.create({
        data: {
          caseId: winbackCase.id,
          direction: "INBOUND",
          body: chosenText,
          language: winbackCase.member.language || "en",
          status: "delivered",
          sentAt: new Date(),
          replyTags: {
            create: {
              reason: tagged.reasonTag,
              handedToHuman: tagged.handedToHuman,
            },
          },
        },
        include: { replyTags: true },
      });

      await logAuditEvent({
        userId: session.id,
        role: session.role,
        action: "SIMULATE_REPLY",
        target: `winback_case:${winbackCase.id}`,
        details: `Simulated member reply: "${chosenText.substring(0, 45)}...". Tagged: ${tagged.reasonTag}. Handover: ${tagged.handedToHuman ? "YES" : "NO"}.`,
      });

      return NextResponse.json({
        success: true,
        message: inboundMessage,
        tagged,
      });
    }

    // 4. SIMULATE_CHECKIN (member returns to gym!)
    if (action === "SIMULATE_CHECKIN") {
      // Record visit
      await prisma.visit.create({
        data: {
          memberId: winbackCase.member.id,
          branchId: winbackCase.member.branchId,
          checkedInAt: new Date(),
        },
      });

      // Update case to BROUGHT_BACK
      const updatedCase = await prisma.winbackCase.update({
        where: { id: winbackCase.id },
        data: {
          status: "BROUGHT_BACK",
          resolvedAt: new Date(),
        },
      });

      await logAuditEvent({
        userId: session.id,
        role: session.role,
        action: "MEMBER_CHECKIN",
        target: `member:${winbackCase.member.id}`,
        details: `Member ${winbackCase.member.name} returned and checked in at ${winbackCase.member.branch.name}. Win-back case marked BROUGHT_BACK.`,
      });

      return NextResponse.json({
        success: true,
        case: updatedCase,
        note: `Member ${winbackCase.member.name} successfully checked in. Win-back case closed.`,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error in winback action route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
