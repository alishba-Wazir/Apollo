import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceBranchScope, logAuditEvent, BranchAccessError } from "@/lib/server/branch-guard";
import { checkQuietHours, checkPrayerTime } from "@/lib/winback/guardrails";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const targetBranchId = req.nextUrl.searchParams.get("branchId") || session.branchId || "branch-seaview";

    // Enforce branch scope on server
    const { effectiveBranchId } = enforceBranchScope(session, targetBranchId);

    if (!effectiveBranchId) {
      return NextResponse.json({ error: "A valid branchId is required" }, { status: 400 });
    }

    const branch = await prisma.branch.findUnique({
      where: { id: effectiveBranchId },
      include: { settings: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Default prayer schedule by city
    const isIslamabad = branch.city.toLowerCase().includes("islamabad");
    const defaultTimetable = isIslamabad
      ? { fajr: "05:15", dhuhr: "12:10", asr: "15:20", maghrib: "17:35", isha: "19:00" }
      : { fajr: "05:30", dhuhr: "12:30", asr: "15:45", maghrib: "17:45", isha: "19:15" };

    let parsedSettings = {
      ...defaultTimetable,
      ramadanMode: false,
      ramadanHours: "21:00 - 04:00 (Night & Sehri Access)",
      iftar: isIslamabad ? "17:35" : "17:45",
      sehri: isIslamabad ? "04:45" : "05:00",
      audioMuted: true,
      taraweehClassesShifted: true,
    };

    if (branch.settings?.prayerTimes) {
      try {
        const stored = JSON.parse(branch.settings.prayerTimes);
        parsedSettings = { ...parsedSettings, ...stored };
      } catch (e) {
        // use fallback
      }
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const isPrayerBufferActive = !checkPrayerTime(timeStr, {
      fajr: parsedSettings.fajr,
      dhuhr: parsedSettings.dhuhr,
      asr: parsedSettings.asr,
      maghrib: parsedSettings.maghrib,
      isha: parsedSettings.isha,
    }, 20);

    const isQuietHoursActive = !checkQuietHours(
      timeStr,
      branch.settings?.quietHoursStart || "22:00",
      branch.settings?.quietHoursEnd || "07:00"
    );

    return NextResponse.json({
      branch: {
        id: branch.id,
        name: branch.name,
        city: branch.city,
        hours: parsedSettings.ramadanMode ? parsedSettings.ramadanHours : branch.hours,
      },
      settings: {
        quietHoursStart: branch.settings?.quietHoursStart || "22:00",
        quietHoursEnd: branch.settings?.quietHoursEnd || "07:00",
        ...parsedSettings,
      },
      status: {
        currentTimePKT: timeStr,
        isPrayerBufferActive,
        isQuietHoursActive,
        outreachBlocked: isPrayerBufferActive || isQuietHoursActive || parsedSettings.ramadanMode,
        outreachBlockReason: isPrayerBufferActive
          ? "Prayer congregation active (20-min window)"
          : isQuietHoursActive
          ? "Quiet hours active (22:00 - 07:00 PKT)"
          : parsedSettings.ramadanMode
          ? "Ramadan fasting hours active (Outreach muted until Iftar)"
          : null,
      },
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error loading prayer settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const body = await req.json();
    const { action, ramadanMode, audioMuted, prayerTimes, ramadanHours } = body;

    const targetBranchId = session.branchId || "branch-seaview";

    const branch = await prisma.branch.findUnique({
      where: { id: targetBranchId },
      include: { settings: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    let currentStored: any = {};
    if (branch.settings?.prayerTimes) {
      try {
        currentStored = JSON.parse(branch.settings.prayerTimes);
      } catch (e) {}
    }

    if (ramadanMode !== undefined) {
      currentStored.ramadanMode = Boolean(ramadanMode);
    }
    if (audioMuted !== undefined) {
      currentStored.audioMuted = Boolean(audioMuted);
    }
    if (ramadanHours) {
      currentStored.ramadanHours = ramadanHours;
    }
    if (prayerTimes) {
      currentStored = { ...currentStored, ...prayerTimes };
    }

    const updatedJson = JSON.stringify(currentStored);

    if (branch.settings) {
      await prisma.branchSettings.update({
        where: { branchId: targetBranchId },
        data: { prayerTimes: updatedJson },
      });
    } else {
      await prisma.branchSettings.create({
        data: {
          branchId: targetBranchId,
          prayerTimes: updatedJson,
        },
      });
    }

    await logAuditEvent({
      userId: session.id,
      role: session.role,
      action: "UPDATE_SETTINGS",
      target: `branch:${targetBranchId}:prayer_ramadan`,
      details: `Updated Prayer & Ramadan settings for ${branch.name}. Ramadan Mode: ${currentStored.ramadanMode ? "ON" : "OFF"}. Audio Mute: ${currentStored.audioMuted ? "ON" : "OFF"}.`,
    });

    return NextResponse.json({
      success: true,
      message: `Settings updated successfully. Ramadan Mode: ${currentStored.ramadanMode ? "ACTIVE" : "STANDBY"}.`,
      settings: currentStored,
    });
  } catch (error: any) {
    if (error instanceof BranchAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Error saving prayer settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
