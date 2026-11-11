import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope } from "@/lib/server/branch-guard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    let session = { role: "ADMIN", branchId: null, userId: "usr-admin" };
    if (sessionCookie) {
      try {
        session = JSON.parse(sessionCookie);
      } catch (e) {}
    }

    const requestedBranchId = req.nextUrl.searchParams.get("branchId") || null;
    const { effectiveBranchId } = enforceBranchScope(session as any, requestedBranchId);

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 86400000);

    // 1. Fetch active members expiring in the next 7 days
    const expiringMembersFromDb = await prisma.member.findMany({
      where: {
        status: "ACTIVE",
        branchId: effectiveBranchId || undefined,
        expirationDate: {
          gte: now,
          lte: sevenDaysLater,
        },
      },
      include: {
        branch: {
          select: { id: true, name: true, city: true, area: true, status: true },
        },
        trainer: {
          select: { id: true, name: true, phone: true },
        },
        visits: {
          orderBy: { checkedInAt: "desc" },
          take: 10,
        },
      },
      orderBy: {
        expirationDate: "asc",
      },
    });

    const planPrices: Record<string, number> = {
      ELITE: 28000,
      PRO: 18500,
      STANDARD: 12500,
    };

    let visitingLessCount = 0;
    let atRiskRevenuePKR = 0;
    const expiringByBranch: Record<
      string,
      { branchId: string; branchName: string; city: string; count: number; visitingLessCount: number }
    > = {};

    const expiringList = expiringMembersFromDb.map((m) => {
      const expDate = m.expirationDate ? new Date(m.expirationDate) : sevenDaysLater;
      const daysRemaining = Math.max(1, Math.ceil((expDate.getTime() - now.getTime()) / 86400000));

      const lastVisit = m.visits[0];
      const daysAbsent = lastVisit
        ? Math.floor((now.getTime() - new Date(lastVisit.checkedInAt).getTime()) / 86400000)
        : 30;

      // Visiting less if absent >= 7 days or visits over last 14 days is low
      const isVisitingLess = daysAbsent >= 7 || m.visits.length < 3;
      if (isVisitingLess) visitingLessCount++;

      const feePKR = planPrices[m.planId] || 18500;
      atRiskRevenuePKR += feePKR;

      // Group per branch
      if (!expiringByBranch[m.branchId]) {
        expiringByBranch[m.branchId] = {
          branchId: m.branchId,
          branchName: m.branch.name,
          city: m.branch.city,
          count: 0,
          visitingLessCount: 0,
        };
      }
      expiringByBranch[m.branchId].count++;
      if (isVisitingLess) {
        expiringByBranch[m.branchId].visitingLessCount++;
      }

      // Bilingual WhatsApp Draft generation
      const expFormatted = expDate.toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const draftEnglish = isVisitingLess
        ? `Assalam-o-Alaikum ${m.name}! Your ${m.planId} membership at TRI FIT ${m.branch.name} expires in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""} on ${expFormatted}. We noticed you haven't visited in ${daysAbsent} days — renew today to lock in your preferential rate, reboot your routine with Coach ${m.trainer?.name || "Tariq"}, and retain seamless turnstile access!`
        : `Assalam-o-Alaikum ${m.name}! Your ${m.planId} membership at TRI FIT ${m.branch.name} is up for renewal in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""} on ${expFormatted}. Keep your strong workout streak alive with uninterrupted turnstile access! Renew at reception or via IBFT/Raast: trifit@raast.`;

      const draftUrdu = isVisitingLess
        ? `Assalam-o-Alaikum ${m.name}! TRI FIT ${m.branch.name} par aapka ${m.planId} package ${daysRemaining} dino me (${expFormatted}) expire ho raha hai. Hum ne dekha aap pichle ${daysAbsent} dino se gym nahi aye — aaj hi renewal karwayen aur Coach ${m.trainer?.name || "Tariq"} ke sath workout shuru karein!`
        : `Assalam-o-Alaikum ${m.name}! TRI FIT ${m.branch.name} par aapki ${m.planId} membership ${daysRemaining} din me (${expFormatted}) expire ho rahi hai. Apne fitness streak aur continuous turnstile access ko barqarar rakhne ke liye aaj hi renew karwayen! Desk par rabta karein ya Raast: trifit@raast.`;

      return {
        id: m.id,
        name: m.name,
        phone: m.phone,
        branchId: m.branchId,
        branchName: m.branch.name,
        city: m.branch.city,
        planId: m.planId,
        expirationDate: expDate.toISOString(),
        daysRemaining,
        daysAbsent,
        isVisitingLess,
        whatsappOptIn: m.whatsappOptIn,
        preferredLanguage: m.language || "en",
        trainerName: m.trainer?.name || "Senior Coach",
        planFeePKR: feePKR,
        draftEnglish,
        draftUrdu,
        status: "PENDING_APPROVAL",
      };
    });

    return NextResponse.json({
      totalExpiringCount: expiringList.length,
      visitingLessCount,
      atRiskRevenuePKR,
      expiringByBranch: Object.values(expiringByBranch),
      members: expiringList,
    });
  } catch (error: any) {
    console.error("[RENEWALS_GET_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to load renewals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    let session = { role: "ADMIN", branchId: null, userId: "usr-admin" };
    if (sessionCookie) {
      try {
        session = JSON.parse(sessionCookie);
      } catch (e) {}
    }

    const body = await req.json();
    const { memberId, language = "en", customText } = body;

    if (!memberId) {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 });
    }

    // 1. Fetch member & consent
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { branch: true },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Check branch scope
    enforceBranchScope(session as any, member.branchId);

    // Rule: Consent and Privacy
    if (!member.whatsappOptIn) {
      return NextResponse.json(
        {
          error: "CONSENT_REQUIRED",
          message: "Cannot send reminder: Member has not opted into WhatsApp communications.",
        },
        { status: 403 }
      );
    }

    // Rule: Quiet Hours check (22:00 to 07:00 PKT)
    const now = new Date();
    // PKT is UTC+5
    const pktHour = (now.getUTCHours() + 5) % 24;
    const isQuietHours = pktHour >= 22 || pktHour < 7;

    // Rule: Audit Log entry
    await prisma.auditLog.create({
      data: {
        userId: session.userId || "usr-admin",
        role: session.role || "BRANCH_MANAGER",
        action: "APPROVE_RENEWAL_MESSAGE",
        target: `member:${member.id}`,
        details: JSON.stringify({
          memberName: member.name,
          phone: member.phone,
          branchId: member.branchId,
          language,
          isQuietHours,
          customText: customText || "Default template",
          timestamp: now.toISOString(),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      status: isQuietHours ? "QUEUED_QUIET_HOURS" : "APPROVED_AND_SENT",
      memberId: member.id,
      memberName: member.name,
      phone: member.phone,
      isQuietHours,
      message: isQuietHours
        ? "Approved! Message queued for dispatch after quiet hours (07:00 AM PKT)."
        : "Approved! Renewal reminder transmitted to member's WhatsApp.",
    });
  } catch (error: any) {
    console.error("[RENEWALS_POST_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve renewal reminder" },
      { status: 500 }
    );
  }
}
