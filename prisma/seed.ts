import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting unified APOLLO for TRI FIT shared database seed...");

  // 1. Clear existing tables in clean foreign key order
  await prisma.leadTour.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.replyTag.deleteMany();
  await prisma.message.deleteMany();
  await prisma.winbackCase.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.trainerShift.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.member.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.branchSettings.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  console.log("✓ Cleared existing records.");

  // 2. Seed 5 Branches (Preserving existing branch definitions)
  // Per spec: 4 active branches + Soha Mall as "Coming soon" with city "To be confirmed" and blank coordinates
  const branchesData = [
    {
      id: "branch-seaview",
      name: "TRI FIT Seaview Flagship",
      city: "Karachi",
      area: "DHA, Phase 6",
      address: "Seaview DHA, Phase 6, Karachi",
      type: "mixed",
      hours: "06:00 - 23:00",
      whatsappNumber: "0300-0000001",
      capacity: 450,
      status: "ACTIVE",
      latitude: null,
      longitude: null,
    },
    {
      id: "branch-clifton",
      name: "TRI FIT Clifton",
      city: "Karachi",
      area: "Clifton",
      address: "TRI FIT Clifton, Block 4, Clifton, Karachi",
      type: "mixed",
      hours: "06:00 - 23:00",
      whatsappNumber: "0300-0000004",
      capacity: 320,
      status: "ACTIVE",
      latitude: null,
      longitude: null,
    },
    {
      id: "branch-luckyone",
      name: "TRI FIT LuckyOne Mall",
      city: "Karachi",
      area: "Federal B Area",
      address: "LuckyOne Mall, Rashid Minhas Road, Federal B Area, Karachi",
      type: "mixed",
      hours: "06:00 - 23:00",
      whatsappNumber: "0300-0000005",
      capacity: 350,
      status: "ACTIVE",
      latitude: null,
      longitude: null,
    },
    {
      id: "branch-ajtower",
      name: "TRI FIT AJ Tower",
      city: "Islamabad",
      area: "Gulberg Greens",
      address: "AJ Tower, Gulberg Greens, Islamabad",
      type: "mixed",
      hours: "06:00 - 23:00",
      whatsappNumber: "0300-0000002",
      capacity: 380,
      status: "ACTIVE",
      latitude: null,
      longitude: null,
    },
    {
      id: "branch-sohamall",
      name: "TRI FIT Soha Mall",
      city: "To be confirmed",
      area: "Coming soon",
      address: "Soha Mall (Coming soon - Location To be confirmed)",
      type: "women",
      hours: "Coming soon",
      whatsappNumber: "0300-0000003",
      capacity: 260,
      status: "COMING_SOON",
      latitude: null,
      longitude: null,
    },
  ];

  for (const b of branchesData) {
    await prisma.branch.create({ data: b });
  }
  console.log("✓ Seeded 5 branches (4 Active + Soha Mall Coming soon).");

  // 3. Seed Branch Settings for all branches (Prayer times & quiet hours)
  const prayerTimingsKarachi = JSON.stringify({
    fajr: "05:25",
    dhuhr: "12:20",
    asr: "15:35",
    maghrib: "17:45",
    isha: "19:10",
  });

  const prayerTimingsIslamabad = JSON.stringify({
    fajr: "05:15",
    dhuhr: "12:10",
    asr: "15:20",
    maghrib: "17:35",
    isha: "19:00",
  });

  for (const b of branchesData) {
    await prisma.branchSettings.create({
      data: {
        branchId: b.id,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
        prayerTimes: b.city === "Islamabad" ? prayerTimingsIslamabad : prayerTimingsKarachi,
        autoSendEnabled: false,
      },
    });
  }
  console.log("✓ Seeded branch settings for all 5 clubs.");

  // 4. Seed Role Accounts
  const defaultPassword = hashPassword("Password123!");

  const adminUser = await prisma.user.create({
    data: {
      id: "usr-admin-01",
      email: "admin@trifit.com",
      passwordHash: defaultPassword,
      name: "TriFit Lead Admin",
      role: "ADMIN",
      branchId: null, // Global access
    },
  });

  const managersData = [
    { id: "usr-mgr-seaview", email: "manager.seaview@trifit.com", name: "Bilal Mansoor", branchId: "branch-seaview" },
    { id: "usr-mgr-clifton", email: "manager.clifton@trifit.com", name: "Sara Tariq", branchId: "branch-clifton" },
    { id: "usr-mgr-luckyone", email: "manager.luckyone@trifit.com", name: "Hamza Farooq", branchId: "branch-luckyone" },
    { id: "usr-mgr-ajtower", email: "manager.ajtower@trifit.com", name: "Zainab Malik", branchId: "branch-ajtower" },
  ];

  for (const m of managersData) {
    await prisma.user.create({
      data: {
        id: m.id,
        email: m.email,
        passwordHash: defaultPassword,
        name: m.name,
        role: "BRANCH_MANAGER",
        branchId: m.branchId,
      },
    });
  }
  console.log("✓ Seeded Admin and 4 Branch Managers.");

  // 5. Seed Trainers (3 per active branch = 12 coaches total)
  const trainersData = [
    // Seaview
    { id: "trn-sea-01", branchId: "branch-seaview", name: "Coach Marcus Chen", phone: "0300-0000011", certificateExpiry: new Date("2027-08-15") },
    { id: "trn-sea-02", branchId: "branch-seaview", name: "Coach Sarah Jenkins", phone: "0300-0000012", certificateExpiry: new Date("2026-12-31") },
    { id: "trn-sea-03", branchId: "branch-seaview", name: "Coach Hamza Ali", phone: "0300-0000013", certificateExpiry: new Date("2027-04-10") },
    // Clifton
    { id: "trn-cli-01", branchId: "branch-clifton", name: "Coach Alishba Raza", phone: "0300-0000014", certificateExpiry: new Date("2027-05-20") },
    { id: "trn-cli-02", branchId: "branch-clifton", name: "Coach Omer Sheikh", phone: "0300-0000015", certificateExpiry: new Date("2026-11-30") },
    { id: "trn-cli-03", branchId: "branch-clifton", name: "Coach Dania Tariq", phone: "0300-0000016", certificateExpiry: new Date("2027-09-12") },
    // LuckyOne
    { id: "trn-lck-01", branchId: "branch-luckyone", name: "Coach Bilal Qureshi", phone: "0300-0000017", certificateExpiry: new Date("2027-03-25") },
    { id: "trn-lck-02", branchId: "branch-luckyone", name: "Coach Mahnoor Butt", phone: "0300-0000018", certificateExpiry: new Date("2027-01-15") },
    { id: "trn-lck-03", branchId: "branch-luckyone", name: "Coach Kashif Abbasi", phone: "0300-0000019", certificateExpiry: new Date("2026-12-20") },
    // AJ Tower
    { id: "trn-ajt-01", branchId: "branch-ajtower", name: "Coach Tariq Mehmood", phone: "0300-0000021", certificateExpiry: new Date("2027-01-20") },
    { id: "trn-ajt-02", branchId: "branch-ajtower", name: "Coach Aisha Khan", phone: "0300-0000022", certificateExpiry: new Date("2026-11-28") },
    { id: "trn-ajt-03", branchId: "branch-ajtower", name: "Coach Daniel Vance", phone: "0300-0000023", certificateExpiry: new Date("2027-09-05") },
  ];

  for (const t of trainersData) {
    await prisma.trainer.create({ data: t });
  }
  console.log("✓ Seeded 12 coaches across 4 active clubs.");

  // 6. Seed Trainer Shifts
  const today = new Date();
  for (const t of trainersData) {
    const shiftStart = new Date(today);
    shiftStart.setHours(7, 0, 0, 0);
    const shiftEnd = new Date(today);
    shiftEnd.setHours(15, 0, 0, 0);

    await prisma.trainerShift.create({
      data: {
        trainerId: t.id,
        startsAt: shiftStart,
        endsAt: shiftEnd,
        checkedInAt: new Date(today.getTime() - 4 * 3600000),
      },
    });
  }

  // 7. Seed 45 to 55 Members per Active Branch (~200 total active members)
  const activeBranches = branchesData.filter((b) => b.status === "ACTIVE");
  const pakistaniFirstNames = [
    "Ali", "Usman", "Bilal", "Zubair", "Hamza", "Tariq", "Hassan", "Ahmed", "Saad", "Fahad",
    "Aamir", "Omer", "Farhan", "Kashif", "Adeel", "Imran", "Salman", "Nabeel", "Waqas", "Shahid",
    "Sara", "Ayesha", "Fatima", "Zainab", "Maryam", "Sana", "Hina", "Noor", "Alishba", "Mahnoor",
    "Hira", "Rabia", "Anum", "Sadia", "Khadija", "Zara", "Amna", "Iqra", "Bushra", "Sidra",
    "Kamran", "Asad", "Haris", "Junaid", "Mustafa", "Zeeshan", "Daniyal", "Arsalan", "Babar", "Rizwan",
  ];

  const pakistaniLastNames = [
    "Khan", "Malik", "Sheikh", "Raza", "Ahmed", "Mirza", "Chaudhry", "Siddiqui", "Qureshi", "Farooq",
    "Bhatti", "Rehman", "Abbasi", "Butt", "Iqbal", "Shah", "Ghafoor", "Akram", "Latif", "Dar",
  ];

  const goals = ["Strength", "Hypertrophy", "Fat Loss", "Endurance", "Recovery"];
  const studios = ["Studio Alpha", "Strength Forge", "Cardio Loft", "Olympic Arena"];
  const plans = ["ELITE", "PRO", "STANDARD"];
  const planPrices: Record<string, number> = {
    ELITE: 28000,
    PRO: 18500,
    STANDARD: 12500,
  };

  const banks = ["Meezan Bank", "HBL", "Bank Alfalah", "Raast"];
  const paymentMethods = ["IBFT", "CARD", "CASH", "RAAST"];

  let globalMemberCounter = 1;
  const branchMemberCounts: Record<string, number> = {
    "branch-seaview": 54,
    "branch-clifton": 46,
    "branch-luckyone": 50,
    "branch-ajtower": 48,
  };

  for (const branch of activeBranches) {
    const branchTrainers = trainersData.filter((t) => t.branchId === branch.id);
    const count = branchMemberCounts[branch.id] || 48;

    for (let i = 0; i < count; i++) {
      const firstName = pakistaniFirstNames[(i + globalMemberCounter) % pakistaniFirstNames.length];
      const lastName = pakistaniLastNames[(i + globalMemberCounter * 2) % pakistaniLastNames.length];
      const memberName = `${firstName} ${lastName}`;
      const phoneNum = `0300-${String(globalMemberCounter).padStart(7, "0")}`;
      const cnicNum = `42${String(100 + (globalMemberCounter % 800))}-` +
                      `${String(1000000 + (globalMemberCounter * 17) % 9000000)}-` +
                      `${(globalMemberCounter % 9) + 1}`;
      const goal = goals[i % goals.length];
      const studio = studios[i % studios.length];
      const plan = plans[i % plans.length];
      const lang = i % 3 === 0 ? "ur" : "en";
      const assignedTrainer = branchTrainers[i % branchTrainers.length];

      // Expiration date profile:
      // ~6 members per branch expire in the next 7 days (Part 2 feature: Renewal reminders)
      const expiresSoon = i >= 5 && i <= 10;
      const daysUntilExpiry = expiresSoon ? (i % 6) + 1 : 14 + (i % 60);
      const expirationDate = new Date(today.getTime() + daysUntilExpiry * 86400000);

      // Attendance Profile:
      // ~8 members per branch are absent >14 days (Part 1 & Brain retention telemetry)
      const isAbsent = i < 8;
      const daysAway = isAbsent ? 15 + (i % 12) : (i % 4) === 0 ? 0 : (i % 3) + 1;
      const normalFrequency = 2.5 + ((i % 4) * 0.5); // 2.5 to 4.0 visits/week

      // Opt-in & Privacy (Part 3)
      const whatsappOptIn = i !== count - 1; // 1 member per branch opted-out
      const biometricConsent = i !== count - 2; // 1 member per branch opted-out of biometrics

      const member = await prisma.member.create({
        data: {
          id: `mem-${branch.id.replace("branch-", "")}-${String(i + 1).padStart(3, "0")}`,
          branchId: branch.id,
          name: memberName,
          phone: phoneNum,
          cnic: cnicNum,
          goal,
          studio,
          trainerId: assignedTrainer.id,
          planId: plan,
          status: i === count - 3 ? "FROZEN" : "ACTIVE",
          frozenUntil: i === count - 3 ? new Date(today.getTime() + 14 * 86400000) : null,
          expirationDate,
          whatsappOptIn,
          optInAt: new Date(today.getTime() - 60 * 86400000),
          optInMethod: i % 2 === 0 ? "PAPER_FORM" : "DESK_POS",
          biometricConsent,
          language: lang,
        },
      });

      // Seed Visit History over last 60 days
      const totalVisitsCount = Math.round(normalFrequency * 8);

      // If visited today, set check-in at a specific realistic hour slot
      if (daysAway === 0) {
        const checkinHours = [6, 8, 10, 12, 14, 16, 18, 18, 18, 20, 22];
        const checkinHour = checkinHours[i % checkinHours.length];
        const visitTime = new Date(today);
        visitTime.setHours(checkinHour, (i * 7) % 60, 0, 0);

        await prisma.visit.create({
          data: {
            memberId: member.id,
            branchId: branch.id,
            checkedInAt: visitTime,
          },
        });
      } else {
        // Last visit was daysAway ago
        await prisma.visit.create({
          data: {
            memberId: member.id,
            branchId: branch.id,
            checkedInAt: new Date(today.getTime() - daysAway * 86400000),
          },
        });
      }

      // Historical visits
      for (let v = 1; v < totalVisitsCount; v++) {
        const visitDay = daysAway + Math.round(v * (7 / normalFrequency));
        if (visitDay <= 60) {
          await prisma.visit.create({
            data: {
              memberId: member.id,
              branchId: branch.id,
              checkedInAt: new Date(today.getTime() - visitDay * 86400000 + (v % 8) * 3600000),
            },
          });
        }
      }

      // Seed Payment Records for this member
      const memberFeePKR = planPrices[plan] || 18500;
      const bankName = banks[i % banks.length];
      const method = paymentMethods[i % paymentMethods.length];
      const tid = `${bankName.substring(0, 3).toUpperCase()}-${String(10000000 + globalMemberCounter * 123).substring(0, 8)}`;

      // 1. Primary Monthly Membership Payment
      await prisma.payment.create({
        data: {
          memberId: member.id,
          branchId: branch.id,
          amountPKR: memberFeePKR,
          method,
          bankName,
          tid,
          status: "APPROVED",
          description: `Monthly Membership Dues - ${plan} Tier`,
          createdAt: new Date(today.getTime() - ((i % 25) + 2) * 86400000),
        },
      });

      // 2. Ancillary PT or Shake bar payment for some members
      if (i % 3 === 0) {
        await prisma.payment.create({
          data: {
            memberId: member.id,
            branchId: branch.id,
            amountPKR: 12000,
            method: "CARD",
            bankName: "HBL",
            tid: `POS-${String(500000 + globalMemberCounter)}`,
            status: "APPROVED",
            description: "Personal Training Session 6-Pack",
            createdAt: new Date(today.getTime() - (i % 15) * 86400000),
          },
        });
      }

      if (i % 4 === 0) {
        await prisma.payment.create({
          data: {
            memberId: member.id,
            branchId: branch.id,
            amountPKR: 850,
            method: "CASH",
            status: "APPROVED",
            description: "Juice Bar Whey Protein Shake (Chocolate)",
            createdAt: new Date(today.getTime() - (i % 5) * 86400000),
          },
        });
      }

      // Seed 1-on-1 PT Booking
      if (i % 2 === 0) {
        const bookingTime = new Date(today);
        bookingTime.setHours(10 + (i % 8), 0, 0, 0);
        await prisma.booking.create({
          data: {
            memberId: member.id,
            trainerId: assignedTrainer.id,
            startsAt: bookingTime,
            status: "COMPLETED",
          },
        });
      }

      // If absent, create WinbackCase
      if (isAbsent) {
        const wb = await prisma.winbackCase.create({
          data: {
            memberId: member.id,
            flaggedAt: new Date(today.getTime() - (daysAway - 4) * 86400000),
            daysAway,
            normalVisitsPerWeek: normalFrequency,
            status: i < 3 ? "CONTACTED" : "OPEN",
          },
        });

        // Seed sample message for contacted cases
        if (i < 3) {
          await prisma.message.create({
            data: {
              caseId: wb.id,
              direction: "OUTBOUND",
              body: lang === "ur"
                ? `Salam ${firstName}! Humne notice kiya ke aap kuch dino se gym nahi aye. Umeed hai sab khairiyat hai? Kya hum timing adjust karein?`
                : `Hi ${firstName}! Coach ${assignedTrainer.name.split(" ")[1]} noticed you haven't been in for your ${goal} sessions. When can we welcome you back?`,
              language: lang,
              status: "sent",
              approvedBy: managersData.find((m) => m.branchId === branch.id)?.id,
              sentAt: new Date(today.getTime() - 24 * 3600000),
            },
          });
        }
      }

      globalMemberCounter++;
    }
  }

  console.log(`✓ Seeded ${globalMemberCounter - 1} members across 4 active branches with visits, payments, and bookings.`);

  // 8. Seed Trial and Tour Conversion Funnel Leads (Part 2 feature)
  // Per branch: ~40 leads across ENQUIRY -> TOUR_BOOKED -> TRIAL_ATTENDED -> JOINED
  for (const branch of activeBranches) {
    const leadNames = [
      "Zain Ul Abideen", "Shahmeer Afridi", "Mustafa Kamal", "Areeba Siddiqui",
      "Farah Naz", "Khurram Shehzad", "Bilal Tanveer", "Sonia Hashmi",
      "Waqar Younis", "Shoaib Akhtar", "Misbah Ul Haq", "Azhar Ali",
      "Fawad Alam", "Babar Azam", "Shaheen Shah", "Haris Rauf",
      "Naseem Shah", "Mohammad Rizwan", "Shadab Khan", "Imad Wasim",
      "Sarfraz Ahmed", "Wahab Riaz", "Umar Akmal", "Kamran Akmal",
      "Ahmed Shehzad", "Asad Shafiq", "Shan Masood", "Abdullah Shafique",
      "Saud Shakeel", "Agha Salman", "Usama Mir", "Mohammad Nawaz",
      "Ihsanullah Khan", "Zaman Khan", "Saim Ayub", "Mohammad Haris",
      "Haseebullah Khan", "Abbas Afridi", "Aamer Jamal", "Mehran Mumtaz",
    ];

    for (let l = 0; l < leadNames.length; l++) {
      let stage = "ENQUIRY";
      if (l >= 10 && l < 22) stage = "TOUR_BOOKED";
      else if (l >= 22 && l < 32) stage = "TRIAL_ATTENDED";
      else if (l >= 32) stage = "JOINED";

      await prisma.leadTour.create({
        data: {
          branchId: branch.id,
          name: leadNames[l],
          phone: `0311-${String(l * 12345).padStart(7, "0")}`,
          stage,
          createdAt: new Date(today.getTime() - (l % 20) * 86400000),
        },
      });
    }
  }
  console.log("✓ Seeded trial & tour conversion funnel records for all active clubs.");

  // 9. Seed Equipment Assets across all 4 active branches
  const equipmentCatalog = [
    { name: "Eleiko Olympic Power Platform #01", category: "STRENGTH", repairCost: 0, status: "OPERATIONAL" },
    { name: "Eleiko Olympic Power Platform #02", category: "STRENGTH", repairCost: 0, status: "OPERATIONAL" },
    { name: "Woodway Curve Treadmill #01", category: "CARDIO", repairCost: 18500, status: "ATTENTION" },
    { name: "Woodway Curve Treadmill #02", category: "CARDIO", repairCost: 0, status: "OPERATIONAL" },
    { name: "Concept2 RowErg #01", category: "CARDIO", repairCost: 8500, status: "OPERATIONAL" },
    { name: "Hammer Strength Dual Pulley Cable", category: "CABLE", repairCost: 24000, status: "MAINTENANCE" },
  ];

  for (const b of activeBranches) {
    for (const eq of equipmentCatalog) {
      await prisma.equipment.create({
        data: {
          branchId: b.id,
          name: `${b.name.split(" ")[2]} ${eq.name}`,
          category: eq.category,
          warrantyEnd: new Date("2028-06-30"),
          repairCost: eq.repairCost,
          status: eq.status,
        },
      });
    }
  }
  console.log("✓ Seeded equipment inventory across active clubs.");

  // 10. Seed Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      role: "ADMIN",
      action: "DATABASE_SEEDED",
      target: "network",
      details: "Unified database initialized with 4 active branches + Soha Mall, ~200 members, visits, payments, and conversion funnels.",
      at: today,
    },
  });

  console.log("🎉 Unified APOLLO database seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
