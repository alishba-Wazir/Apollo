import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope } from "@/lib/server/branch-guard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    let session = { role: "ADMIN", branchId: null };
    if (sessionCookie) {
      try {
        session = JSON.parse(sessionCookie);
      } catch (e) {}
    }

    const requestedBranchId = req.nextUrl.searchParams.get("branchId") || null;
    const { effectiveBranchId } = enforceBranchScope(session as any, requestedBranchId);

    // Fetch payments
    const payments = await prisma.payment.findMany({
      where: effectiveBranchId ? { branchId: effectiveBranchId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        member: { select: { id: true, name: true, phone: true } },
        branch: { select: { id: true, name: true, city: true } },
      },
    });

    const totalRevenuePKR = payments.reduce((acc, p) => acc + p.amountPKR, 0);

    // Group revenue by branch
    const branchBreakdown: Record<string, { branchName: string; amountPKR: number; count: number }> = {};
    for (const p of payments) {
      if (!branchBreakdown[p.branchId]) {
        branchBreakdown[p.branchId] = {
          branchName: p.branch.name,
          amountPKR: 0,
          count: 0,
        };
      }
      branchBreakdown[p.branchId].amountPKR += p.amountPKR;
      branchBreakdown[p.branchId].count += 1;
    }

    // Format IBFT OCR verification queue
    const ibftQueue = payments.map((p, idx) => ({
      id: `IBFT-${p.id.substring(0, 6)}`,
      paymentId: p.id,
      memberName: p.member.name,
      phone: p.member.phone,
      branch: p.branch.name,
      bank: p.bankName || "Meezan Bank",
      tid: p.tid || `TID-${idx + 1000}`,
      amountPKR: p.amountPKR,
      ocrConfidence: +(96 + (idx % 4) * 0.9).toFixed(1),
      uploadedAt: new Date(p.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
      status: p.status,
      receiptImgPreviewText: `${p.bankName || "Bank"} Digital Transfer. To: TRI FIT CLUB REVENUE. Amount: PKR ${p.amountPKR.toLocaleString()}. TID: ${p.tid || `TID-${idx}`}. Status: SUCCESS.`,
    }));

    return NextResponse.json({
      totalRevenuePKR,
      paymentsCount: payments.length,
      branchBreakdown: Object.values(branchBreakdown),
      ibftQueue,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch finance data" }, { status: error.statusCode || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberId, branchId, amountPKR, bankName, tid, description } = body;

    let targetMemberId = memberId;
    let targetBranchId = branchId;

    if (!targetMemberId) {
      const firstMember = await prisma.member.findFirst();
      targetMemberId = firstMember?.id || "mem-seaview-001";
      targetBranchId = targetBranchId || firstMember?.branchId || "branch-seaview";
    }

    if (!targetBranchId) {
      const m = await prisma.member.findUnique({ where: { id: targetMemberId }, select: { branchId: true } });
      targetBranchId = m?.branchId || "branch-seaview";
    }

    const payment = await prisma.payment.create({
      data: {
        memberId: targetMemberId,
        branchId: targetBranchId,
        amountPKR: Number(amountPKR) || 36850,
        method: "IBFT",
        bankName: bankName || "Meezan Bank",
        tid: tid || `TID-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: "PENDING",
        description: description || "Monthly Membership Dues & Shake Bar",
      },
      include: {
        member: { select: { id: true, name: true, phone: true } },
        branch: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create payment" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentId, status } = body;

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: status || "APPROVED" },
    });

    return NextResponse.json({ success: true, payment: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update payment status" }, { status: 500 });
  }
}
