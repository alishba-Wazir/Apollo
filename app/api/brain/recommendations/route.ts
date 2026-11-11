import { NextResponse } from "next/server";
import { ApolloBrainService } from "@/lib/brain-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const list = await ApolloBrainService.listRecommendations(status);
  return NextResponse.json({
    success: true,
    count: list.length,
    data: list,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, reviewerName, reason, requestData } = body;

    if (action === "APPROVE") {
      if (!id) return NextResponse.json({ success: false, error: "Missing recommendation ID" }, { status: 400 });
      const res = await ApolloBrainService.approveRecommendation(id, reviewerName || "Gym Operations Director");
      return NextResponse.json({ success: true, data: res });
    }

    if (action === "REJECT") {
      if (!id) return NextResponse.json({ success: false, error: "Missing recommendation ID" }, { status: 400 });
      const res = await ApolloBrainService.rejectRecommendation(id, reviewerName || "Gym Operations Director", reason);
      return NextResponse.json({ success: true, data: res });
    }

    if (action === "GENERATE") {
      if (!requestData) {
        return NextResponse.json({ success: false, error: "Missing requestData payload" }, { status: 400 });
      }
      const rec = await ApolloBrainService.generateRecommendation(requestData);
      return NextResponse.json({ success: true, data: rec });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
