import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clean existing data
  await prisma.package.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();

  // 1. Create Categories
  const catAC = await prisma.category.create({
    data: {
      name: 'AC & Appliance Repair',
      city_ids: ['new-delhi', 'mumbai', 'bangalore'],
      image_url: '❄️',
    },
  });

  const catCleaning = await prisma.category.create({
    data: {
      name: 'Home Cleaning',
      city_ids: ['new-delhi', 'mumbai', 'bangalore'],
      image_url: '🧹',
    },
  });

  // 2. Create Services
  const acService = await prisma.service.create({
    data: {
      name: 'AC Service & Repair',
      description: 'Professional AC servicing, repair, and installation.',
      category_id: catAC.id,
      city_ids: ['new-delhi', 'mumbai'],
      is_active: true,
    },
  });

  // 3. Create Packages
  await prisma.package.createMany({
    data: [
      {
        name: 'Basic AC Service',
        price: 499,
        duration_min: 45,
        service_id: acService.id,
        inclusions_json: JSON.stringify(["Filter cleaning and basic checkup"])
      },
      {
        name: 'Deep AC Service',
        price: 899,
        duration_min: 90,
        service_id: acService.id,
        inclusions_json: JSON.stringify(["Foam jet cleaning", "gas check", "full wash"])
      },
      {
        name: 'AC Repair / Gas Leak Fix',
        price: 1499,
        duration_min: 150,
        service_id: acService.id,
        inclusions_json: JSON.stringify(["Comprehensive repair", "leak fixing", "gas refill"])
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
