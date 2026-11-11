import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding trainer shifts and bookings...");

  const trainers = await prisma.trainer.findMany({
    include: { members: true },
  });

  const now = new Date();
  const todayMorning = new Date(now);
  todayMorning.setHours(6, 0, 0, 0);

  const todayAfternoon = new Date(now);
  todayAfternoon.setHours(14, 0, 0, 0);

  const todayEvening = new Date(now);
  todayEvening.setHours(22, 0, 0, 0);

  for (let i = 0; i < trainers.length; i++) {
    const trainer = trainers[i];

    // Delete existing shifts & bookings for this trainer
    await prisma.trainerShift.deleteMany({ where: { trainerId: trainer.id } });
    await prisma.booking.deleteMany({ where: { trainerId: trainer.id } });

    // Realistic shift distributions
    let shiftStart;
    let shiftEnd;

    if (i % 3 === 0) {
      // Mid-day Floor Lead (10:00 - 19:00)
      shiftStart = new Date(now);
      shiftStart.setHours(10, 0, 0, 0);
      shiftEnd = new Date(now);
      shiftEnd.setHours(19, 0, 0, 0);
    } else if (i % 3 === 1) {
      // Evening Peak Rush (13:00 - 21:30)
      shiftStart = new Date(now);
      shiftStart.setHours(13, 0, 0, 0);
      shiftEnd = new Date(now);
      shiftEnd.setHours(21, 30, 0, 0);
    } else {
      // Morning Dawn Opener (06:00 - 14:00)
      shiftStart = new Date(now);
      shiftStart.setHours(6, 0, 0, 0);
      shiftEnd = new Date(now);
      shiftEnd.setHours(14, 0, 0, 0);
    }

    await prisma.trainerShift.create({
      data: {
        trainerId: trainer.id,
        startsAt: shiftStart,
        endsAt: shiftEnd,
        checkedInAt: new Date(shiftStart.getTime() + 8 * 60 * 1000), // checked in on time
      },
    });

    // Create 3 bookings today for this trainer with their assigned members
    if (trainer.members.length > 0) {
      const times = [
        new Date(todayMorning.getTime() + 2 * 60 * 60 * 1000), // 08:00
        new Date(todayMorning.getTime() + 4 * 60 * 60 * 1000), // 10:00
        new Date(todayAfternoon.getTime() + 3 * 60 * 60 * 1000), // 17:00
      ];

      for (let b = 0; b < Math.min(3, trainer.members.length); b++) {
        await prisma.booking.create({
          data: {
            trainerId: trainer.id,
            memberId: trainer.members[b].id,
            startsAt: times[b],
            status: b === 0 ? "COMPLETED" : "SCHEDULED",
          },
        });
      }
    }
  }

  console.log("Trainer shifts and bookings seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
