import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface NetworkClassSummary {
  id: string;
  title: string;
  category: "HIIT" | "STRENGTH" | "PILATES" | "CYCLE" | "YOGA";
  studio: string;
  branchId: string;
  branchName: string;
  branchCity: string;
  trainerName: string;
  timeSlot: string; // e.g., "07:00", "17:15", "18:30", "19:45"
  capacity: number;
  bookedCount: number;
  waitlistCount: number;
  fillRatePct: number;
  prayerBufferStatus: "SAFE" | "OVERRIDDEN" | "BUFFER_APPLIED";
  demandStatus: "SURGE" | "OPTIMAL" | "ROOM_AVAILABLE";
}

const NETWORK_CLASSES: NetworkClassSummary[] = [
  // Karachi Seaview Flagship
  {
    id: "cls-khi-01",
    title: "Sunrise Burn HIIT",
    category: "HIIT",
    studio: "Studio Alpha",
    branchId: "branch-seaview",
    branchName: "Seaview Flagship",
    branchCity: "Karachi",
    trainerName: "Coach Marcus Chen",
    timeSlot: "07:00",
    capacity: 25,
    bookedCount: 25,
    waitlistCount: 6,
    fillRatePct: 100,
    prayerBufferStatus: "SAFE",
    demandStatus: "SURGE",
  },
  {
    id: "cls-khi-02",
    title: "Olympic Barbell Technique",
    category: "STRENGTH",
    studio: "Strength Forge",
    branchId: "branch-seaview",
    branchName: "Seaview Flagship",
    branchCity: "Karachi",
    trainerName: "Coach Hamza Ali",
    timeSlot: "17:15",
    capacity: 20,
    bookedCount: 19,
    waitlistCount: 4,
    fillRatePct: 95,
    prayerBufferStatus: "OVERRIDDEN",
    demandStatus: "SURGE",
  },
  {
    id: "cls-khi-03",
    title: "Reformer Flow & Alignment",
    category: "PILATES",
    studio: "Mind & Body Loft",
    branchId: "branch-seaview",
    branchName: "Seaview Flagship",
    branchCity: "Karachi",
    trainerName: "Coach Sarah Jenkins",
    timeSlot: "18:30",
    capacity: 15,
    bookedCount: 15,
    waitlistCount: 8,
    fillRatePct: 100,
    prayerBufferStatus: "SAFE",
    demandStatus: "SURGE",
  },
  {
    id: "cls-khi-04",
    title: "Power Cadence Spin",
    category: "CYCLE",
    studio: "Cycle Loft",
    branchId: "branch-seaview",
    branchName: "Seaview Flagship",
    branchCity: "Karachi",
    trainerName: "Coach Bilal Tariq",
    timeSlot: "19:45",
    capacity: 24,
    bookedCount: 21,
    waitlistCount: 2,
    fillRatePct: 87.5,
    prayerBufferStatus: "SAFE",
    demandStatus: "OPTIMAL",
  },

  // Islamabad AJ Tower
  {
    id: "cls-isb-aj-01",
    title: "Metabolic Conditioning Pro",
    category: "HIIT",
    studio: "Apex Studio",
    branchId: "branch-ajtower",
    branchName: "AJ Tower",
    branchCity: "Islamabad",
    trainerName: "Coach Tariq Jamil",
    timeSlot: "07:30",
    capacity: 22,
    bookedCount: 20,
    waitlistCount: 3,
    fillRatePct: 90.9,
    prayerBufferStatus: "SAFE",
    demandStatus: "OPTIMAL",
  },
  {
    id: "cls-isb-aj-02",
    title: "Hypertrophy Power Hour",
    category: "STRENGTH",
    studio: "Iron Arena",
    branchId: "branch-ajtower",
    branchName: "AJ Tower",
    branchCity: "Islamabad",
    trainerName: "Coach Zeeshan Abbasi",
    timeSlot: "17:30",
    capacity: 20,
    bookedCount: 19,
    waitlistCount: 5,
    fillRatePct: 95,
    prayerBufferStatus: "BUFFER_APPLIED",
    demandStatus: "SURGE",
  },
  {
    id: "cls-isb-aj-03",
    title: "Dynamic Vinyasa Flow",
    category: "YOGA",
    studio: "Zenith Studio",
    branchId: "branch-ajtower",
    branchName: "AJ Tower",
    branchCity: "Islamabad",
    trainerName: "Coach Ayesha Khan",
    timeSlot: "19:00",
    capacity: 18,
    bookedCount: 16,
    waitlistCount: 1,
    fillRatePct: 88.9,
    prayerBufferStatus: "SAFE",
    demandStatus: "OPTIMAL",
  },

  // Islamabad Soha Mall
  {
    id: "cls-isb-sh-01",
    title: "Express Core & HIIT",
    category: "HIIT",
    studio: "Boutique Studio 1",
    branchId: "branch-sohamall",
    branchName: "Soha Mall",
    branchCity: "Islamabad",
    trainerName: "Coach Daniyal Mir",
    timeSlot: "08:00",
    capacity: 16,
    bookedCount: 15,
    waitlistCount: 2,
    fillRatePct: 93.8,
    prayerBufferStatus: "SAFE",
    demandStatus: "OPTIMAL",
  },
  {
    id: "cls-isb-sh-02",
    title: "Pilates Sculpt & Core",
    category: "PILATES",
    studio: "Boutique Studio 2",
    branchId: "branch-sohamall",
    branchName: "Soha Mall",
    branchCity: "Islamabad",
    trainerName: "Coach Mehak Noor",
    timeSlot: "18:00",
    capacity: 14,
    bookedCount: 14,
    waitlistCount: 7,
    fillRatePct: 100,
    prayerBufferStatus: "BUFFER_APPLIED",
    demandStatus: "SURGE",
  },
];

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

    const branchFilter = req.nextUrl.searchParams.get("branchId");
    let classes = NETWORK_CLASSES;

    if (branchFilter && branchFilter !== "ALL") {
      classes = classes.filter((c) => c.branchId === branchFilter);
    }

    const totalClasses = classes.length;
    const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
    const totalBooked = classes.reduce((sum, c) => sum + c.bookedCount, 0);
    const totalWaitlist = classes.reduce((sum, c) => sum + c.waitlistCount, 0);
    const overallFillRate = Math.round((totalBooked / totalCapacity) * 100);

    return NextResponse.json({
      classes,
      summary: {
        totalClasses,
        totalCapacity,
        totalBooked,
        totalWaitlist,
        overallFillRate,
      },
    });
  } catch (err: any) {
    console.error("Error fetching admin classes:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}