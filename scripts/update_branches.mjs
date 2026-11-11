import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateBranches() {
  console.log('Updating branch records in SQLite dev.db...');

  const branches = [
    {
      id: 'branch-seaview',
      name: 'TRI FIT Seaview Flagship',
      city: 'Karachi',
      area: 'DHA, Phase 6',
      address: 'Seaview DHA, Phase 6, Karachi',
      type: 'mixed',
      hours: '06:00 - 23:00',
      whatsappNumber: '0300-0000001',
      capacity: 450,
      status: 'ACTIVE',
      latitude: 24.7892,
      longitude: 67.0652,
    },
    {
      id: 'branch-ajtower',
      name: 'TRI FIT AJ Tower',
      city: 'Islamabad',
      area: 'Gulberg Greens',
      address: 'AJ Tower, Gulberg Greens, Islamabad',
      type: 'mixed',
      hours: '06:00 - 23:00',
      whatsappNumber: '0300-0000002',
      capacity: 380,
      status: 'ACTIVE',
      latitude: 33.6012,
      longitude: 73.1254,
    },
    {
      id: 'branch-clifton',
      name: 'TRI FIT Clifton',
      city: 'Karachi',
      area: 'Clifton',
      address: 'TRI FIT Clifton, Block 4, Clifton, Karachi',
      type: 'mixed',
      hours: '06:00 - 23:00',
      whatsappNumber: '0300-0000004',
      capacity: 320,
      status: 'ACTIVE',
      latitude: 24.8150,
      longitude: 67.0315,
    },
    {
      id: 'branch-luckyone',
      name: 'TRI FIT LuckyOne Mall',
      city: 'Karachi',
      area: 'Federal B Area',
      address: 'LuckyOne Mall, Rashid Minhas Road, Federal B Area, Karachi',
      type: 'mixed',
      hours: '06:00 - 23:00',
      whatsappNumber: '0300-0000005',
      capacity: 350,
      status: 'ACTIVE',
      latitude: 24.9385,
      longitude: 67.0872,
    },
    {
      id: 'branch-sohamall',
      name: 'TRI FIT Soha Mall',
      city: 'To be confirmed',
      area: 'Coming soon',
      address: 'Soha Mall (Coming soon - Location To be confirmed)',
      type: 'women',
      hours: 'Coming soon',
      whatsappNumber: '0300-0000003',
      capacity: 260,
      status: 'COMING_SOON',
      latitude: null,
      longitude: null,
    },
  ];

  for (const b of branches) {
    const existing = await prisma.branch.findUnique({ where: { id: b.id } });
    if (existing) {
      await prisma.branch.update({
        where: { id: b.id },
        data: b,
      });
      console.log(`Updated branch: ${b.name}`);
    } else {
      await prisma.branch.create({
        data: b,
      });
      console.log(`Created branch: ${b.name}`);
    }

    // Ensure branch settings exist
    const settings = await prisma.branchSettings.findUnique({ where: { branchId: b.id } });
    if (!settings) {
      await prisma.branchSettings.create({
        data: {
          branchId: b.id,
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00',
          prayerTimes: JSON.stringify({
            fajr: '05:25',
            dhuhr: '12:20',
            asr: '15:35',
            maghrib: '17:45',
            isha: '19:10',
          }),
          autoSendEnabled: false,
        },
      });
      console.log(`Created default branchSettings for: ${b.id}`);
    }
  }

  const all = await prisma.branch.findMany();
  console.log('All branches now in dev.db:');
  console.log(JSON.stringify(all, null, 2));

  await prisma.$disconnect();
}

updateBranches().catch(e => {
  console.error(e);
  process.exit(1);
});
