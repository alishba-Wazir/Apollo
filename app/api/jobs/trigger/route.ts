import { NextResponse } from "next/server";
import { ApolloBackgroundJobs } from "@/lib/background-jobs";

export async function GET() {
  const history = ApolloBackgroundJobs.getHistory();
  return NextResponse.json({
    success: true,
    totalRuns: history.length,
    history,
  });
}

export async function POST(request: Request) {
  try {
    const { jobName } = await request.json();

    let result;
    switch (jobName) {
      case "waitlist-vacancy-expiry":
        result = await ApolloBackgroundJobs.runWaitlistExpiryScanner();
        break;
      case "membership-renewal-reminders":
        result = await ApolloBackgroundJobs.runRenewalReminders();
        break;
      case "equipment-telemetry-scanner":
        result = await ApolloBackgroundJobs.runPredictiveMaintenanceScanner();
        break;
      case "all":
        const r1 = await ApolloBackgroundJobs.runWaitlistExpiryScanner();
        const r2 = await ApolloBackgroundJobs.runRenewalReminders();
        const r3 = await ApolloBackgroundJobs.runPredictiveMaintenanceScanner();
        result = { jobs: [r1, r2, r3] };
        break;
      default:
        return NextResponse.json({ error: "Invalid jobName" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
