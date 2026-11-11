import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export interface BranchPrayerSchedule {
  branchId: string;
  branchName: string;
  branchCity: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  iftar: string;
  sehri: string;
  ramadanMode: boolean;
  audioDucking: boolean;
  taraweehShifted: boolean;
  quietHours: string;
  activePrayerBuffer: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("apollo_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin role required" }, { status: 403 });
    }

    const branches = await prisma.branch.findMany({
      include: { settings: true },
      orderBy: { name: "asc" },
    });

    const schedules: BranchPrayerSchedule[] = branches.map((b) => {
      const isIslamabad = b.city.toLowerCase().includes("islamabad");
      let storedSettings: any = {};
      if (b.settings?.prayerTimes) {
        try {
          storedSettings = JSON.parse(b.settings.prayerTimes);
        } catch (e) {}
      }

      const defaultFajr = isIslamabad ? "05:15" : "05:30";
      const defaultDhuhr = isIslamabad ? "12:10" : "12:30";
      const defaultAsr = isIslamabad ? "15:20" : "15:45";
      const defaultMaghrib = isIslamabad ? "17:35" : "17:45";
      const defaultIsha = isIslamabad ? "19:00" : "19:15";
      const defaultIftar = isIslamabad ? "17:35" : "17:45";
      const defaultSehri = isIslamabad ? "04:45" : "05:00";

      return {
        branchId: b.id,
        branchName: b.name,
        branchCity: b.city,
        fajr: storedSettings.fajr || defaultFajr,
        dhuhr: storedSettings.dhuhr || defaultDhuhr,
        asr: storedSettings.asr || defaultAsr,
        maghrib: storedSettings.maghrib || defaultMaghrib,
        isha: storedSettings.isha || defaultIsha,
        iftar: storedSettings.iftar || defaultIftar,
        sehri: storedSettings.sehri || defaultSehri,
        ramadanMode: typeof storedSettings.ramadanMode === "boolean" ? storedSettings.ramadanMode : false,
        audioDucking: typeof storedSettings.audioDucking === "boolean" ? storedSettings.audioDucking : true,
        taraweehShifted: typeof storedSettings.taraweehShifted === "boolean" ? storedSettings.taraweehShifted : true,
        quietHours: "22:00 - 07:00 PKT",
        activePrayerBuffer: false,
      };
    });

    return NextResponse.json({
      schedules,
      networkSummary: {
        totalBranches: schedules.length,
        ramadanModeActiveBranches: schedules.filter((s) => s.ramadanMode).length,
        audioDuckingEnabledCount: schedules.filter((s) => s.audioDucking).length,
        quietHoursWindow: "22:00 - 07:00 PKT (Network-wide)",
      },
    });
  } catch (err: any) {
    console.error("Error fetching admin prayer schedules:", err);
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
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin role required" }, { status: 403 });
    }

    const body = await req.json();
    const { branchId, settings, applyNetworkWide } = body;

    if (applyNetworkWide) {
      // Apply Ramadan Mode toggle network-wide
      const branches = await prisma.branch.findMany({ include: { settings: true } });
      for (const b of branches) {
        let existing: any = {};
        if (b.settings?.prayerTimes) {
          try { existing = JSON.parse(b.settings.prayerTimes); } catch (e) {}
        }
        const updated = JSON.stringify({ ...existing, ...settings });
        if (b.settings) {
          await prisma.branchSettings.update({
            where: { branchId: b.id },
            data: { prayerTimes: updated },
          });
        }
      }
      return NextResponse.json({ success: true, networkWide: true });
    }

    if (!branchId) {
      return NextResponse.json({ error: "branchId is required" }, { status: 400 });
    }

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { settings: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    let existingSettings: any = {};
    if (branch.settings?.prayerTimes) {
      try {
        existingSettings = JSON.parse(branch.settings.prayerTimes);
      } catch (e) {}
    }

    const updatedSettings = JSON.stringify({ ...existingSettings, ...settings });

    if (branch.settings) {
      await prisma.branchSettings.update({
        where: { branchId },
        data: { prayerTimes: updatedSettings },
      });
    } else {
      await prisma.branchSettings.create({
        data: {
          branchId,
          prayerTimes: updatedSettings,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error saving admin prayer settings:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}