"use client";

import React, { useState, useMemo } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, Member, GymClass } from "@/lib/apollo-demo-store";
import {
  Flame,
  Bike,
  Sparkles,
  Dumbbell,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  CalendarDays,
  Plus,
  Download,
  Phone,
  MessageCircle,
  ChevronDown,
  Building2,
  Check,
  X,
  AlertCircle,
  Crown,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

type StudioType = "ALL" | "HIIT" | "CYCLING" | "YOGA" | "PILATES" | "FUNCTIONAL";
type BookingStatus = "CHECKED_IN" | "RESERVED" | "WAITLIST";

interface StudioDefinition {
  id: StudioType;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  equipment: string;
  color: string;
  accentHex: string;
  totalCapacity: number;
}

const STUDIOS: StudioDefinition[] = [
  {
    id: "HIIT",
    name: "HIIT Studio",
    shortName: "HIIT",
    icon: "🔥",
    description: "High-intensity interval conditioning & heart-rate threshold training",
    equipment: "24 Woodway Curve Treadmills & MyZone HR Monitors",
    color: "from-amber-500/20 to-orange-500/10",
    accentHex: "#FF9F0A",
    totalCapacity: 24,
  },
  {
    id: "CYCLING",
    name: "Cycling Studio",
    shortName: "Cycling",
    icon: "🚴",
    description: "Immersive Stages Flight power RPM & rhythm studio rides",
    equipment: "28 Stages SC3 Smart Power Bikes with Flight Screen",
    color: "from-yellow-500/20 to-amber-500/10",
    accentHex: "#FFD60A",
    totalCapacity: 28,
  },
  {
    id: "YOGA",
    name: "Yoga Studio",
    shortName: "Yoga",
    icon: "🧘",
    description: "Infrared heated Vinyasa Flow, Hot Yoga, and Restorative Yin",
    equipment: "22 Manduka Pro Mats & Infrared Radiant Ceiling Panels",
    color: "from-emerald-500/20 to-teal-500/10",
    accentHex: "#30D158",
    totalCapacity: 22,
  },
  {
    id: "PILATES",
    name: "Pilates Studio",
    shortName: "Pilates",
    icon: "🤸",
    description: "Balanced Body Reformer beds, core stabilization & posture therapy",
    equipment: "14 Balanced Body Allegro 2 Reformer Beds & Tower Systems",
    color: "from-purple-500/20 to-pink-500/10",
    accentHex: "#BF5AF2",
    totalCapacity: 14,
  },
  {
    id: "FUNCTIONAL",
    name: "Functional Fitness Studio",
    shortName: "Functional",
    icon: "⚡",
    description: "Olympic sprint turf track, prowler sleds, kettlebells & HYROX prep",
    equipment: "30m Sprint Turf, 8 Rogue Rigs, Sleds & Concept2 Rowers",
    color: "from-blue-500/20 to-cyan-500/10",
    accentHex: "#64D2FF",
    totalCapacity: 30,
  },
];

interface StudioBooking {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  memberEmail: string;
  planName: string;
  isPlusTier: boolean;
  branchId: string;
  branchName: string;
  studioType: StudioType;
  className: string;
  coachName: string;
  timeSlot: string;
  stationNumber: string;
  status: BookingStatus;
  bookedAt: string;
}

export default function AdminStudiosPage() {
  const { members, branches, trainers, plans, currentBranchId, setCurrentBranchId } = useApolloStore();

  const [selectedStudio, setSelectedStudio] = useState<StudioType>("ALL");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [reassignModalBooking, setReassignModalBooking] = useState<StudioBooking | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate realistic studio bookings linked to real members & branches in the store
  const [bookings, setBookings] = useState<StudioBooking[]>(() => {
    const branchNamesMap: Record<string, string> = {
      "branch-seaview": "Seaview DHA (Flagship)",
      "branch-clifton": "Clifton Flagship",
      "branch-luckyone": "LuckyOne Mall",
      "branch-ajtower": "AJ Tower Islamabad",
    };

    const initialBookings: StudioBooking[] = [
      // Seaview DHA bookings
      {
        id: "sb-1",
        memberId: "mem-1",
        memberName: "Hamza Malik",
        memberPhone: "+92 300 8271001",
        memberEmail: "hamza.malik@apollo.pk",
        planName: "TriFit Plus (12M)",
        isPlusTier: true,
        branchId: "branch-seaview",
        branchName: "Seaview DHA (Flagship)",
        studioType: "HIIT",
        className: "Apex Heart Rate HIIT",
        coachName: "Tariq Mahmood",
        timeSlot: "07:00 - 07:45 PKT",
        stationNumber: "Woodway Curve #04",
        status: "CHECKED_IN",
        bookedAt: "Today, 06:40",
      },
      {
        id: "sb-2",
        memberId: "mem-5",
        memberName: "Bilal Tariq",
        memberPhone: "+92 321 7890123",
        memberEmail: "bilal.tariq@apollo.pk",
        planName: "TriFit Plus (6M)",
        isPlusTier: true,
        branchId: "branch-seaview",
        branchName: "Seaview DHA (Flagship)",
        studioType: "HIIT",
        className: "Apex Heart Rate HIIT",
        coachName: "Tariq Mahmood",
        timeSlot: "07:00 - 07:45 PKT",
        stationNumber: "Woodway Curve #08",
        status: "CHECKED_IN",
        bookedAt: "Today, 06:45",
      },
      {
        id: "sb-3",
        memberId: "mem-2",
        memberName: "Ayesha Khan",
        memberPhone: "+92 321 5554321",
        memberEmail: "ayesha.khan@apollo.pk",
        planName: "TriFit Regular (12M)",
        isPlusTier: false,
        branchId: "branch-seaview",
        branchName: "Seaview DHA (Flagship)",
        studioType: "PILATES",
        className: "Athletic Reformer Core L2",
        coachName: "Alishba Khan",
        timeSlot: "09:00 - 09:50 PKT",
        stationNumber: "Reformer Bed #03",
        status: "CHECKED_IN",
        bookedAt: "Today, 08:35",
      },
      {
        id: "sb-4",
        memberId: "mem-8",
        memberName: "Sana Mir",
        memberPhone: "+92 301 2345678",
        memberEmail: "sana.mir@apollo.pk",
        planName: "TriFit Plus (12M)",
        isPlusTier: true,
        branchId: "branch-seaview",
        branchName: "Seaview DHA (Flagship)",
        studioType: "PILATES",
        className: "Athletic Reformer Core L2",
        coachName: "Alishba Khan",
        timeSlot: "09:00 - 09:50 PKT",
        stationNumber: "Reformer Bed #07",
        status: "RESERVED",
        bookedAt: "Today, 07:15",
      },
      {
        id: "sb-5",
        memberId: "mem-3",
        memberName: "Zainab Raza",
        memberPhone: "+92 333 9988776",
        memberEmail: "zainab.raza@apollo.pk",
        planName: "TriFit Regular (6M)",
        isPlusTier: false,
        branchId: "branch-seaview",
        branchName: "Seaview DHA (Flagship)",
        studioType: "CYCLING",
        className: "Stages Flight RPM 60",
        coachName: "Tariq Mahmood",
        timeSlot: "18:00 - 18:50 PKT",
        stationNumber: "Stages SC3 Bike #12",
        status: "RESERVED",
        bookedAt: "Yesterday, 20:30",
      },
      {
        id: "sb-6",
        memberId: "mem-11",
        memberName: "Kashif Abbasi",
        memberPhone: "+92 300 4567890",
        memberEmail: "kashif.abbasi@apollo.pk",
        planName: "TriFit Regular (3M)",
        isPlusTier: false,
        branchId: "branch-seaview",
        branchName: "Seaview DHA (Flagship)",
        studioType: "FUNCTIONAL",
        className: "Sprint & Sled HYROX Prep",
        coachName: "Tariq Mahmood",
        timeSlot: "19:15 - 20:15 PKT",
        stationNumber: "Turf Sprint Lane #02",
        status: "WAITLIST",
        bookedAt: "Today, 10:20",
      },

      // Clifton Branch bookings
      {
        id: "sb-7",
        memberId: "mem-4",
        memberName: "Mustafa Qureshi",
        memberPhone: "+92 300 1122334",
        memberEmail: "mustafa.q@apollo.pk",
        planName: "TriFit Plus (12M)",
        isPlusTier: true,
        branchId: "branch-clifton",
        branchName: "Clifton Flagship",
        studioType: "FUNCTIONAL",
        className: "Sprint & Sled HYROX Prep",
        coachName: "Bilal Tariq",
        timeSlot: "08:00 - 09:00 PKT",
        stationNumber: "Turf Sprint Lane #01",
        status: "CHECKED_IN",
        bookedAt: "Today, 07:50",
      },
      {
        id: "sb-8",
        memberId: "mem-6",
        memberName: "Fatima Noor",
        memberPhone: "+92 345 6789012",
        memberEmail: "fatima.noor@apollo.pk",
        planName: "TriFit Plus (6M)",
        isPlusTier: true,
        branchId: "branch-clifton",
        branchName: "Clifton Flagship",
        studioType: "YOGA",
        className: "Infrared Vinyasa Flow",
        coachName: "Zeeshan Siddiqui",
        timeSlot: "10:00 - 11:00 PKT",
        stationNumber: "Manduka Mat #05",
        status: "CHECKED_IN",
        bookedAt: "Today, 09:40",
      },
      {
        id: "sb-9",
        memberId: "mem-9",
        memberName: "Omar Farooq",
        memberPhone: "+92 322 3456789",
        memberEmail: "omar.farooq@apollo.pk",
        planName: "TriFit Regular (12M)",
        isPlusTier: false,
        branchId: "branch-clifton",
        branchName: "Clifton Flagship",
        studioType: "CYCLING",
        className: "Stages Flight RPM 60",
        coachName: "Bilal Tariq",
        timeSlot: "18:30 - 19:20 PKT",
        stationNumber: "Stages SC3 Bike #04",
        status: "RESERVED",
        bookedAt: "Today, 11:00",
      },
      {
        id: "sb-10",
        memberId: "mem-13",
        memberName: "Nida Yasir",
        memberPhone: "+92 333 4567890",
        memberEmail: "nida.yasir@apollo.pk",
        planName: "TriFit Plus (3M)",
        isPlusTier: true,
        branchId: "branch-clifton",
        branchName: "Clifton Flagship",
        studioType: "PILATES",
        className: "Athletic Reformer Core L2",
        coachName: "Zeeshan Siddiqui",
        timeSlot: "17:00 - 17:50 PKT",
        stationNumber: "Reformer Bed #06",
        status: "RESERVED",
        bookedAt: "Yesterday, 19:10",
      },

      // LuckyOne Mall bookings
      {
        id: "sb-11",
        memberId: "mem-7",
        memberName: "Usman Ali",
        memberPhone: "+92 312 9012345",
        memberEmail: "usman.ali@apollo.pk",
        planName: "TriFit Regular (6M)",
        isPlusTier: false,
        branchId: "branch-luckyone",
        branchName: "LuckyOne Mall",
        studioType: "HIIT",
        className: "Apex Heart Rate HIIT",
        coachName: "Hamza Abbasi",
        timeSlot: "17:30 - 18:15 PKT",
        stationNumber: "Woodway Curve #11",
        status: "RESERVED",
        bookedAt: "Today, 12:15",
      },
      {
        id: "sb-12",
        memberId: "mem-10",
        memberName: "Mariam Baig",
        memberPhone: "+92 334 5678901",
        memberEmail: "mariam.baig@apollo.pk",
        planName: "TriFit Plus (12M)",
        isPlusTier: true,
        branchId: "branch-luckyone",
        branchName: "LuckyOne Mall",
        studioType: "YOGA",
        className: "Infrared Vinyasa Flow",
        coachName: "Sara Ahmed",
        timeSlot: "08:30 - 09:30 PKT",
        stationNumber: "Manduka Mat #08",
        status: "CHECKED_IN",
        bookedAt: "Today, 08:15",
      },
      {
        id: "sb-13",
        memberId: "mem-14",
        memberName: "Waqas Sheikh",
        memberPhone: "+92 300 9876543",
        memberEmail: "waqas.sheikh@apollo.pk",
        planName: "TriFit Regular (12M)",
        isPlusTier: false,
        branchId: "branch-luckyone",
        branchName: "LuckyOne Mall",
        studioType: "FUNCTIONAL",
        className: "Sprint & Sled HYROX Prep",
        coachName: "Hamza Abbasi",
        timeSlot: "19:00 - 20:00 PKT",
        stationNumber: "Turf Sprint Lane #03",
        status: "RESERVED",
        bookedAt: "Today, 13:40",
      },

      // AJ Tower Islamabad bookings
      {
        id: "sb-14",
        memberId: "mem-12",
        memberName: "Hina Rabbani",
        memberPhone: "+92 315 6789012",
        memberEmail: "hina.rabbani@apollo.pk",
        planName: "TriFit Plus (12M)",
        isPlusTier: true,
        branchId: "branch-ajtower",
        branchName: "AJ Tower Islamabad",
        studioType: "PILATES",
        className: "Athletic Reformer Core L2",
        coachName: "Maryam Nawaz",
        timeSlot: "11:00 - 11:50 PKT",
        stationNumber: "Reformer Bed #02",
        status: "CHECKED_IN",
        bookedAt: "Today, 10:45",
      },
      {
        id: "sb-15",
        memberId: "mem-15",
        memberName: "Fahad Mustafa",
        memberPhone: "+92 321 8765432",
        memberEmail: "fahad.mustafa@apollo.pk",
        planName: "TriFit Plus (6M)",
        isPlusTier: true,
        branchId: "branch-ajtower",
        branchName: "AJ Tower Islamabad",
        studioType: "CYCLING",
        className: "Stages Flight RPM 60",
        coachName: "Danial Khan",
        timeSlot: "18:00 - 18:50 PKT",
        stationNumber: "Stages SC3 Bike #09",
        status: "CHECKED_IN",
        bookedAt: "Today, 17:40",
      },
      {
        id: "sb-16",
        memberId: "mem-16",
        memberName: "Sadia Imam",
        memberPhone: "+92 333 1234567",
        memberEmail: "sadia.imam@apollo.pk",
        planName: "TriFit Regular (12M)",
        isPlusTier: false,
        branchId: "branch-ajtower",
        branchName: "AJ Tower Islamabad",
        studioType: "HIIT",
        className: "Apex Heart Rate HIIT",
        coachName: "Danial Khan",
        timeSlot: "19:30 - 20:15 PKT",
        stationNumber: "Woodway Curve #05",
        status: "RESERVED",
        bookedAt: "Today, 14:00",
      },
    ];

    return initialBookings;
  });

  // Effective branch filter takes into account current store selection or local filter
  const effectiveBranchId = currentBranchId || (selectedBranchFilter === "ALL" ? null : selectedBranchFilter);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Branch filter
      if (effectiveBranchId && b.branchId !== effectiveBranchId) return false;
      // Studio filter
      if (selectedStudio !== "ALL" && b.studioType !== selectedStudio) return false;
      // Status filter
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = b.memberName.toLowerCase().includes(q);
        const matchPhone = b.memberPhone.includes(q);
        const matchClass = b.className.toLowerCase().includes(q);
        const matchStation = b.stationNumber.toLowerCase().includes(q);
        const matchCoach = b.coachName.toLowerCase().includes(q);
        const matchPlan = b.planName.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchClass && !matchStation && !matchCoach && !matchPlan) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, effectiveBranchId, selectedStudio, statusFilter, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const scoped = effectiveBranchId ? bookings.filter((b) => b.branchId === effectiveBranchId) : bookings;
    const checkedInCount = scoped.filter((b) => b.status === "CHECKED_IN").length;
    const reservedCount = scoped.filter((b) => b.status === "RESERVED").length;
    const waitlistCount = scoped.filter((b) => b.status === "WAITLIST").length;
    const totalCapacity = effectiveBranchId ? 118 : 118 * 4; // 118 stations per flagship club
    const fillRate = ((scoped.length / 118) * 100).toFixed(1);

    return {
      totalBooked: scoped.length,
      checkedInCount,
      reservedCount,
      waitlistCount,
      fillRate,
      leadCoachesCount: 8,
    };
  }, [bookings, effectiveBranchId]);

  // Action: Toggle Member Attendance
  const handleToggleCheckin = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const nextStatus: BookingStatus = b.status === "CHECKED_IN" ? "RESERVED" : "CHECKED_IN";
          showToast(
            nextStatus === "CHECKED_IN"
              ? `Checked-in ${b.memberName} at ${b.stationNumber}`
              : `Reverted ${b.memberName} to Reserved`
          );
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  // Action: Cancel Booking & Release Spot
  const handleCancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;
    if (confirm(`Cancel studio reservation for ${target.memberName} (${target.stationNumber})?`)) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      showToast(`Released ${target.stationNumber} for ${target.className}`);
    }
  };

  // Action: Export Studio Roster as CSV
  const handleExportCSV = () => {
    const headers = [
      "Booking ID",
      "Member Name",
      "Phone",
      "Email",
      "Plan",
      "Branch",
      "Studio",
      "Class Name",
      "Coach",
      "Time Slot",
      "Station Spot",
      "Status",
      "Booked At",
    ];
    const rows = filteredBookings.map((b) => [
      b.id,
      b.memberName,
      b.memberPhone,
      b.memberEmail,
      b.planName,
      b.branchName,
      b.studioType,
      b.className,
      b.coachName,
      b.timeSlot,
      b.stationNumber,
      b.status,
      b.bookedAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TriFit_Studio_Roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded Studio Roster CSV sheet");
  };

  // Action: Direct WhatsApp message
  const handleSendWhatsApp = (b: StudioBooking) => {
    const text = encodeURIComponent(
      `Salaam ${b.memberName}! Your reservation at TriFit ${b.branchName} for ${b.className} (${b.studioType} Studio) is confirmed on ${b.stationNumber}. Class begins at ${b.timeSlot} with Coach ${b.coachName}. Please arrive 5 minutes early.`
    );
    window.open(`https://wa.me/${b.memberPhone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  return (
    <AdminPortalLayout activeItem="studios">
      <div className="space-y-5">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[var(--chip)] border border-[var(--accent)]/40 text-[var(--text)] text-[13px] font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-xl">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* =========================================================================
            HEADER & ACTIONS BAR
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)] tracking-tight">
                Signature Studios Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[var(--chip)] text-[var(--text)] border border-[var(--accent)]/30">
                5 Studios • 118 Stations
              </span>
            </div>
            <p className="body-label text-xs mt-1 text-[var(--muted)]">
              Branch-wise studio class occupancy, live member station assignments, and instant roster controls
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Branch Filter Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsBranchMenuOpen((prev) => !prev)}
                className="select-btn text-xs !h-[42px] !px-3 shrink-0 cursor-pointer flex items-center gap-2 min-w-[170px] justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span className="truncate text-xs font-semibold">
                    {effectiveBranchId
                      ? branches.find((b) => b.id === effectiveBranchId)?.name.replace("TriFit ", "") || "Branch"
                      : "All Flagships (4)"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
              </button>

              {isBranchMenuOpen && (
                <div className="menu shadow-2xl min-w-[240px]" role="listbox">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentBranchId(null);
                      setSelectedBranchFilter("ALL");
                      setIsBranchMenuOpen(false);
                    }}
                    className="menu-item w-full text-left"
                  >
                    <div>
                      <div className="font-bold">All Flagships</div>
                      <div className="text-[10.5px] opacity-75">Consolidated multi-club view</div>
                    </div>
                    {!effectiveBranchId && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="w-full h-[1px] my-1" style={{ background: "var(--line)" }} />
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setCurrentBranchId(b.id);
                        setSelectedBranchFilter(b.id);
                        setIsBranchMenuOpen(false);
                      }}
                      className="menu-item w-full text-left"
                    >
                      <div>
                        <div className="font-semibold">{b.name.replace("TriFit ", "")}</div>
                        <div className="text-[10.5px] opacity-75">{b.city} • {b.capacity} Max</div>
                      </div>
                      {effectiveBranchId === b.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="btn !h-[42px] !px-3 text-xs flex items-center gap-1.5 cursor-pointer"
              title="Download filtered roster as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Export CSV</span>
            </button>

            {/* Book Member Button */}
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="btn primary !h-[42px] !px-4 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Member into Studio</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TOP 4 METRICS CARDS (Obsidian HUD Glass)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {/* Card 1: Total Enrolled */}
          <div className="glass p-[20px] rounded-3xl flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Active Enrolled Members
              </span>
              <span className="admin-chip flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span>+14.8%</span>
              </span>
            </div>
            <div className="my-0.5">
              <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--text)]">
                {stats.totalBooked} <span className="text-sm font-normal text-[var(--muted)]">Booked</span>
              </div>
              <p className="text-[11.5px] text-[var(--muted)] mt-0.5">
                {stats.checkedInCount} Checked-in • {stats.reservedCount} Reserved
              </p>
            </div>
            <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: "82%" }} />
            </div>
          </div>

          {/* Card 2: Studio Utilization */}
          <div className="glass p-[20px] rounded-3xl flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Studio Utilization
              </span>
              <span className="admin-chip text-emerald-400 font-mono font-bold">Optimal</span>
            </div>
            <div className="my-0.5">
              <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--accent)]">
                88.3% <span className="text-sm font-normal text-[var(--muted)]">Fill Rate</span>
              </div>
              <p className="text-[11.5px] text-[var(--muted)] mt-0.5">
                118 stations across 5 signature studios
              </p>
            </div>
            <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: "88.3%" }} />
            </div>
          </div>

          {/* Card 3: Highest Demand Studio */}
          <div className="glass p-[20px] rounded-3xl flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Peak Demand Studio
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                100% Full
              </span>
            </div>
            <div className="my-0.5">
              <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--text)]">
                Pilates Reformer
              </div>
              <p className="text-[11.5px] text-[var(--muted)] mt-0.5">
                All 14 Allegro beds booked • {stats.waitlistCount} on waitlist
              </p>
            </div>
            <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-purple-400" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Card 4: Coaching Staff */}
          <div className="glass p-[20px] rounded-3xl flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Lead Instructors
              </span>
              <span className="admin-chip font-mono font-bold text-emerald-400">REPs L3</span>
            </div>
            <div className="my-0.5">
              <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--text)]">
                8 Coaches
              </div>
              <p className="text-[11.5px] text-[var(--muted)] mt-0.5">
                100% certified • 4.92 avg member rating
              </p>
            </div>
            <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: "95%" }} />
            </div>
          </div>
        </div>

        {/* =========================================================================
            STUDIO TAB SELECTOR (5 SIGNATURE STUDIOS)
           ========================================================================= */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedStudio("ALL")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedStudio === "ALL"
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                : "glass text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span>All Studios</span>
            <span className="text-[10px] opacity-80">({bookings.length})</span>
          </button>

          {STUDIOS.map((s) => {
            const count = bookings.filter((b) => b.studioType === s.id).length;
            const isSelected = selectedStudio === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStudio(s.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                    : "glass text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            5 STUDIO CARDS OVERVIEW GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3.5">
          {STUDIOS.map((s) => {
            const studioBookings = bookings.filter((b) => b.studioType === s.id);
            const isFiltered = selectedStudio === s.id;
            const fillPct = Math.min(100, Math.round((studioBookings.length / s.totalCapacity) * 100));

            return (
              <div
                key={s.id}
                onClick={() => setSelectedStudio(s.id === selectedStudio ? "ALL" : s.id)}
                className={`glass p-4 rounded-3xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden ${
                  isFiltered
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30 shadow-lg scale-[1.01]"
                    : "hover:border-[var(--accent)]/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{s.icon}</span>
                      <h3 className="font-display font-bold text-sm text-[var(--text)]">{s.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)]">
                      {studioBookings.length}/{s.totalCapacity}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed mb-3">
                    {s.description}
                  </p>

                  <div className="text-[10px] text-[var(--text)] p-2 rounded-xl bg-black/20 dark:bg-black/40 border border-[var(--card-border)] mb-3">
                    <span className="text-[var(--muted)] block font-semibold text-[9.5px]">EQUIPMENT</span>
                    <span className="line-clamp-1 font-medium">{s.equipment}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--muted)] mb-1">
                    <span>Occupancy</span>
                    <span className="text-[var(--text)] font-bold">{fillPct}%</span>
                  </div>
                  <div className="w-full bg-[var(--track)] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${fillPct}%`,
                        background: fillPct >= 90 ? "#FF3B30" : "var(--accent)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            ACTIONABLE MEMBER ROSTER TABLE (Which Member is Taking Which Studio Class)
           ========================================================================= */}
        <div className="glass rounded-3xl p-5 space-y-4">
          {/* Table Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="card-title text-base text-[var(--text)]">
                Studio Members &amp; Station Assignments
              </h2>
              <span className="text-xs font-mono font-bold text-[var(--muted)]">
                ({filteredBookings.length} {filteredBookings.length === 1 ? "member" : "members"})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search member, phone, class, station..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl glass text-xs text-[var(--text)] placeholder-[var(--muted)] border border-[var(--card-border)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl glass border border-[var(--card-border)] text-[11px] font-semibold">
                {(["ALL", "CHECKED_IN", "RESERVED", "WAITLIST"] as Array<"ALL" | BookingStatus>).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === st
                        ? "bg-[var(--accent)] text-[var(--on-accent)] font-bold shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {st === "ALL" ? "All" : st === "CHECKED_IN" ? "Checked In" : st === "RESERVED" ? "Reserved" : "Waitlist"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--line)] text-[10.5px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  <th className="py-2.5 px-3">Member &amp; Contact</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Branch Flagship</th>
                  <th className="py-2.5 px-3">Studio &amp; Class</th>
                  <th className="py-2.5 px-3">Station / Spot #</th>
                  <th className="py-2.5 px-3">Time Slot</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[var(--muted)]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-[var(--muted)] opacity-50" />
                        <span className="font-semibold text-sm">No studio members match your filter</span>
                        <span className="text-xs">Try selecting another studio or clearing the search query</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-[var(--chip)]/30 transition-colors group"
                    >
                      {/* Member Info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] font-bold font-display text-xs flex items-center justify-center shrink-0">
                            {b.memberName.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-bold text-[13px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors flex items-center gap-1.5">
                              <span>{b.memberName}</span>
                              {b.isPlusTier && (
                                <Crown className="w-3 h-3 text-[var(--accent)] fill-[var(--accent)]" />
                              )}
                            </div>
                            <div className="text-[10.5px] text-[var(--muted)] font-mono">
                              {b.memberPhone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.isPlusTier
                              ? "bg-[var(--accent)] text-[var(--on-accent)]"
                              : "bg-[var(--chip)] text-[var(--text)] border border-[var(--card-border)]"
                          }`}
                        >
                          {b.planName}
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="py-3 px-3">
                        <div className="text-[11.5px] font-medium text-[var(--text)] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[var(--accent)] shrink-0" />
                          <span>{b.branchName.replace(" (Flagship)", "")}</span>
                        </div>
                      </td>

                      {/* Studio & Class */}
                      <td className="py-3 px-3">
                        <div>
                          <div className="font-bold text-[12px] text-[var(--text)]">
                            {b.className}
                          </div>
                          <div className="text-[10.5px] text-[var(--muted)] flex items-center gap-1">
                            <span className="font-semibold text-[var(--accent)]">{b.studioType} Studio</span>
                            <span>•</span>
                            <span>Coach: {b.coachName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Station / Spot # */}
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl glass border border-[var(--accent)]/40 font-mono text-[11px] font-bold text-[var(--accent)] shadow-sm">
                          <span>{b.stationNumber}</span>
                        </div>
                      </td>

                      {/* Time Slot */}
                      <td className="py-3 px-3">
                        <div className="text-[11px] font-medium text-[var(--text)] flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-[var(--muted)] shrink-0" />
                          <span>{b.timeSlot}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        {b.status === "CHECKED_IN" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>Checked-In</span>
                          </span>
                        ) : b.status === "RESERVED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-500/15 text-[var(--accent)] border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            <span>Reserved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <AlertCircle className="w-3 h-3" />
                            <span>Waitlist</span>
                          </span>
                        )}
                      </td>

                      {/* Admin Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Checkin */}
                          <button
                            onClick={() => handleToggleCheckin(b.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              b.status === "CHECKED_IN"
                                ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                                : "btn primary !h-7 !px-2.5 text-[10.5px]"
                            }`}
                            title={b.status === "CHECKED_IN" ? "Mark as Reserved" : "Check-in Member"}
                          >
                            <Check className="w-3 h-3" />
                            <span>{b.status === "CHECKED_IN" ? "Attended" : "Check In"}</span>
                          </button>

                          {/* WhatsApp alert */}
                          <button
                            onClick={() => handleSendWhatsApp(b)}
                            className="p-1.5 rounded-xl glass hover:border-[var(--accent)] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                            title="Send WhatsApp class confirmation"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          {/* Cancel Reservation */}
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="p-1.5 rounded-xl glass hover:border-rose-500 text-[var(--muted)] hover:text-rose-400 transition-colors cursor-pointer"
                            title="Cancel Reservation & Release Spot"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================================
            BOOK MEMBER INTO STUDIO MODAL
           ========================================================================= */}
        {isBookModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg glass text-[var(--text)] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[var(--accent)]" />
                  <h3 className="font-display font-bold text-lg text-[var(--text)]">
                    Book Member into Signature Studio
                  </h3>
                </div>
                <button
                  onClick={() => setIsBookModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const memberId = (form.elements.namedItem("memberSelect") as HTMLSelectElement).value;
                  const targetMember = members.find((m) => m.id === memberId) || members[0];
                  const studio = (form.elements.namedItem("studioSelect") as HTMLSelectElement).value as StudioType;
                  const station = (form.elements.namedItem("stationInput") as HTMLInputElement).value || "Station #01";
                  const branchId = (form.elements.namedItem("branchSelect") as HTMLSelectElement).value;
                  const branch = branches.find((b) => b.id === branchId) || branches[0];

                  const planObj = plans.find((p) => p.id === targetMember.planId);
                  const planName = planObj?.name || "TriFit Plus (12M)";
                  const isPlusTier = planObj?.tier === "VIP" || planObj?.tier === "PRO" || planName.includes("Plus");

                  const newBooking: StudioBooking = {
                    id: `sb-${Date.now()}`,
                    memberId: targetMember.id,
                    memberName: targetMember.name,
                    memberPhone: targetMember.phone,
                    memberEmail: targetMember.email,
                    planName,
                    isPlusTier,
                    branchId: branch.id,
                    branchName: branch.name,
                    studioType: studio,
                    className: studio === "PILATES" ? "Athletic Reformer Core L2" : studio === "CYCLING" ? "Stages Flight RPM 60" : studio === "YOGA" ? "Infrared Vinyasa Flow" : "Apex Heart Rate HIIT",
                    coachName: "Tariq Mahmood",
                    timeSlot: "18:00 - 18:50 PKT",
                    stationNumber: station,
                    status: "RESERVED",
                    bookedAt: "Just now",
                  };

                  setBookings((prev) => [newBooking, ...prev]);
                  showToast(`Booked ${targetMember.name} into ${studio} Studio (${station})`);
                  setIsBookModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
                    Select Enrolled Member
                  </label>
                  <select
                    name="memberSelect"
                    className="select.native w-full text-xs font-semibold"
                    required
                  >
                    {members.map((m) => {
                      const pName = plans.find((p) => p.id === m.planId)?.name || "TriFit Regular";
                      return (
                        <option key={m.id} value={m.id}>
                          {m.name} — {pName} ({m.phone})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
                      Flagship Club
                    </label>
                    <select
                      name="branchSelect"
                      defaultValue={effectiveBranchId || branches[0]?.id}
                      className="select.native w-full text-xs font-semibold"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name.replace("TriFit ", "")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
                      Signature Studio
                    </label>
                    <select
                      name="studioSelect"
                      className="select.native w-full text-xs font-semibold"
                      defaultValue="PILATES"
                    >
                      {STUDIOS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.icon} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
                    Station / Spot Allocation
                  </label>
                  <input
                    type="text"
                    name="stationInput"
                    defaultValue="Reformer Bed #05"
                    className="w-full px-3 py-2 rounded-xl glass border border-[var(--card-border)] text-xs text-[var(--text)] font-mono font-bold focus:outline-none focus:border-[var(--accent)]"
                    placeholder="e.g. Reformer Bed #05, Stages SC3 #11, Turf Lane #02"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="btn !h-9 !px-4 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn primary !h-9 !px-5 text-xs font-bold cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  );
}
