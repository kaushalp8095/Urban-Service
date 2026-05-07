import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata'];

async function main() {
  console.log('🌱 Start seeding...');

  // Clean in dependency order
  await prisma.package.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();

  // ─── Categories ───────────────────────────────────────────────
  const [catAC, catCleaning, catSalonW, catSalonM, catPlumbing,
         catElec, catAppliance, catPest, catPainting, catCarpentry,
         catSofa, catWater] = await Promise.all([
    prisma.category.create({ data: { name: 'AC Service & Repair', image_url: '❄️',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Home Cleaning',       image_url: '🧹',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Salon for Women',     image_url: '💅',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: "Men's Salon",         image_url: '✂️',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Plumbing',            image_url: '🔧',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Electrician',         image_url: '⚡',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Appliance Repair',    image_url: '📺',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Pest Control',        image_url: '🐛',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Home Painting',       image_url: '🎨',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Carpentry',           image_url: '🪚',  city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Sofa & Carpet',       image_url: '🛋️', city_ids: CITIES } }),
    prisma.category.create({ data: { name: 'Water Purifier',      image_url: '💧',  city_ids: CITIES } }),
  ]);

  // ─── Helper ───────────────────────────────────────────────────
  async function createService(
    name: string,
    description: string,
    categoryId: string,
    packages: { name: string; price: number; duration_min: number; inclusions: string[] }[]
  ) {
    const svc = await prisma.service.create({
      data: { name, description, category_id: categoryId, city_ids: CITIES, is_active: true },
    });
    await prisma.package.createMany({
      data: packages.map((p) => ({
        service_id: svc.id,
        name: p.name,
        price: p.price,
        duration_min: p.duration_min,
        inclusions_json: JSON.stringify(p.inclusions),
      })),
    });
    return svc;
  }

  // ─── AC Service & Repair ─────────────────────────────────────
  // slug: ac-service-cleaning
  await createService('AC Service Cleaning', 'Professional AC servicing and deep cleaning by certified technicians.', catAC.id, [
    { name: 'Basic AC Service', price: 499,  duration_min: 45,  inclusions: ['Filter cleaning', 'Basic health check', 'Performance test'] },
    { name: 'Deep AC Service',  price: 899,  duration_min: 90,  inclusions: ['Foam jet cleaning', 'Coil wash', 'Gas pressure check', 'Performance test'] },
    { name: 'AC Gas Refill',    price: 1499, duration_min: 120, inclusions: ['Gas top-up', 'Leak detection', 'Pressure test', 'Service report'] },
  ]);
  // slug: ac-gas-refill
  await createService('AC Gas Refill', 'Expert AC gas refilling and leak fixing for all AC brands.', catAC.id, [
    { name: 'Gas Refill (1 Ton)',   price: 599, duration_min: 60, inclusions: ['Refrigerant refill', 'Leak check', 'Pressure test'] },
    { name: 'Gas Refill (1.5 Ton)', price: 799, duration_min: 75, inclusions: ['Refrigerant refill', 'Leak check', 'Performance test'] },
    { name: 'Gas Refill (2 Ton)',   price: 999, duration_min: 90, inclusions: ['Refrigerant refill', 'Leak check', 'Full service check'] },
  ]);
  await createService('AC Installation', 'Quick and reliable AC installation for all brands and types.', catAC.id, [
    { name: 'Split AC Installation',  price: 1199, duration_min: 120, inclusions: ['Mounting brackets', 'Copper piping up to 3 ft', 'Electrical connection', 'Demo & testing'] },
    { name: 'Window AC Installation', price: 799,  duration_min: 90,  inclusions: ['Frame fitting', 'Electrical connection', 'Stabilizer fitting', 'Demo'] },
  ]);

  // ─── Home Cleaning ────────────────────────────────────────────
  // slug: full-home-deep-clean
  await createService('Full Home Deep Clean', 'Thorough deep cleaning of your entire home using professional equipment.', catCleaning.id, [
    { name: '1 BHK Deep Clean', price: 1199, duration_min: 180, inclusions: ['Kitchen degreasing', 'Bathroom scrubbing', 'Floor mopping', 'Dusting'] },
    { name: '2 BHK Deep Clean', price: 1799, duration_min: 240, inclusions: ['All rooms', 'Kitchen', '2 bathrooms', 'Balcony', 'Floor cleaning'] },
    { name: '3 BHK Deep Clean', price: 2399, duration_min: 300, inclusions: ['All rooms', 'Kitchen', '3 bathrooms', 'Balcony', 'Window cleaning'] },
  ]);
  // slug: bathroom-cleaning
  await createService('Bathroom Cleaning', 'Deep cleaning of bathrooms including tiles, fixtures and exhaust fans.', catCleaning.id, [
    { name: 'Single Bathroom', price: 299, duration_min: 60,  inclusions: ['Tile scrubbing', 'WC cleaning', 'Exhaust fan', 'Mirror cleaning'] },
    { name: '2 Bathrooms',     price: 499, duration_min: 90,  inclusions: ['Tile scrubbing', 'WC cleaning', 'Exhaust fan', 'Mirror cleaning'] },
    { name: '3 Bathrooms',     price: 699, duration_min: 120, inclusions: ['Tile scrubbing', 'WC cleaning', 'Exhaust fan', 'Mirror cleaning'] },
  ]);
  await createService('Kitchen Deep Clean', 'Complete kitchen deep cleaning including chimney, counters and appliances.', catCleaning.id, [
    { name: 'Basic Kitchen Clean', price: 599, duration_min: 90,  inclusions: ['Counter degreasing', 'Sink cleaning', 'Stove cleaning', 'Cabinet wipe-down'] },
    { name: 'Full Kitchen Clean',  price: 999, duration_min: 150, inclusions: ['Chimney cleaning', 'Full cabinet cleaning', 'Appliance exterior clean', 'Floor mopping'] },
  ]);

  // ─── Salon for Women ─────────────────────────────────────────
  await createService('Waxing & Threading', 'Professional waxing and threading services at home.', catSalonW.id, [
    { name: 'Full Body Wax',       price: 799, duration_min: 90, inclusions: ['Full body Rica wax', 'Post-wax lotion'] },
    { name: 'Half Leg + Underarm', price: 299, duration_min: 45, inclusions: ['Half leg wax', 'Underarm wax'] },
    { name: 'Threading (Face)',    price: 149, duration_min: 20, inclusions: ['Eyebrows', 'Upper lip', 'Forehead'] },
  ]);
  await createService('Facial & Cleanup', 'Rejuvenating facials and deep pore cleanup at home.', catSalonW.id, [
    { name: 'Basic Cleanup', price: 399,  duration_min: 45, inclusions: ['Steam', 'Scrub', 'Face mask', 'Moisturiser'] },
    { name: 'D-Tan Facial',  price: 699,  duration_min: 60, inclusions: ['D-Tan pack', 'Scrub', 'Face mask', 'Toner'] },
    { name: 'Gold Facial',   price: 1199, duration_min: 75, inclusions: ['Gold scrub', 'Gold gel', 'Massage', 'Gold mask'] },
  ]);
  await createService('Hair Care Women', 'Professional hair wash, blow-dry and treatment services.', catSalonW.id, [
    { name: 'Hair Wash + Blow Dry', price: 399,  duration_min: 60,  inclusions: ['Shampoo', 'Conditioning', 'Blow dry'] },
    { name: 'Hair Spa',             price: 799,  duration_min: 90,  inclusions: ['Deep conditioning', 'Scalp massage', 'Steam treatment'] },
    { name: 'Keratin Treatment',    price: 2499, duration_min: 180, inclusions: ['Keratin application', 'Straightening', 'Final blow dry'] },
  ]);

  // ─── Men's Salon ──────────────────────────────────────────────
  // slug: haircut-at-home
  await createService('Haircut at Home', 'Stylish haircuts and beard grooming by professional barbers at home.', catSalonM.id, [
    { name: 'Haircut',          price: 199, duration_min: 30, inclusions: ['Haircut', 'Hair wash', 'Styling'] },
    { name: 'Haircut + Beard',  price: 299, duration_min: 45, inclusions: ['Haircut', 'Beard trim & shaping', 'Moisturiser'] },
    { name: 'Premium Grooming', price: 499, duration_min: 60, inclusions: ['Haircut', 'Beard shaping', 'Face massage', 'Hair styling'] },
  ]);
  await createService('Beard Styling', 'Expert beard trim, shaping and grooming at home.', catSalonM.id, [
    { name: 'Beard Trim',   price: 149, duration_min: 20, inclusions: ['Trim & shape', 'Moisturiser'] },
    { name: 'Beard Design', price: 249, duration_min: 30, inclusions: ['Design shaping', 'Line-up', 'Serum'] },
  ]);

  // ─── Plumbing ─────────────────────────────────────────────────
  await createService('Pipe Leak Repair', 'Quick and reliable pipe leak detection and repair services.', catPlumbing.id, [
    { name: 'Minor Leak Fix', price: 299, duration_min: 30, inclusions: ['Leak detection', 'Pipe sealing', 'Testing'] },
    { name: 'Major Leak Fix', price: 699, duration_min: 90, inclusions: ['Pipe replacement', 'Fitting', 'Pressure testing'] },
  ]);
  await createService('Tap & Fixture Repair', 'Repair or replacement of taps, mixers and plumbing fixtures.', catPlumbing.id, [
    { name: 'Tap Repair',      price: 199, duration_min: 30, inclusions: ['Washer replacement', 'Tightening'] },
    { name: 'Mixer Repair',    price: 399, duration_min: 45, inclusions: ['Cartridge check', 'Repair or replace'] },
    { name: 'Fixture Install', price: 499, duration_min: 60, inclusions: ['Old removal', 'New fitting', 'Testing'] },
  ]);

  // ─── Electrician ──────────────────────────────────────────────
  await createService('Fan Installation', 'Safe and quick ceiling fan installation or repair.', catElec.id, [
    { name: 'Fan Install',     price: 199, duration_min: 30, inclusions: ['Mounting', 'Wiring', 'Testing'] },
    { name: 'Fan Repair',      price: 299, duration_min: 45, inclusions: ['Diagnosis', 'Capacitor change', 'Testing'] },
    { name: 'Fan Replacement', price: 399, duration_min: 60, inclusions: ['Old removal', 'New install', 'Wiring', 'Testing'] },
  ]);
  await createService('Switch & Wiring', 'Repair or replacement of switches, sockets and wiring.', catElec.id, [
    { name: 'Switch Repair',    price: 149, duration_min: 20,  inclusions: ['Diagnosis', 'Switch replacement'] },
    { name: 'Socket Repair',    price: 199, duration_min: 30,  inclusions: ['Socket replacement', 'Wiring check'] },
    { name: 'Full Room Wiring', price: 999, duration_min: 120, inclusions: ['Point-to-point wiring', 'DB connection', 'Testing'] },
  ]);

  // ─── Appliance Repair ─────────────────────────────────────────
  await createService('Washing Machine Repair', 'Expert repair of all types of washing machines at home.', catAppliance.id, [
    { name: 'Diagnosis Only', price: 99,   duration_min: 30,  inclusions: ['Full diagnosis', 'Report'] },
    { name: 'Minor Repair',   price: 499,  duration_min: 60,  inclusions: ['Part replacement', 'Testing'] },
    { name: 'Major Repair',   price: 999,  duration_min: 120, inclusions: ['Full servicing', 'Part replacement', 'Testing'] },
  ]);
  await createService('Refrigerator Repair', 'On-site refrigerator repair and gas refilling by experts.', catAppliance.id, [
    { name: 'Diagnosis',  price: 99,   duration_min: 30,  inclusions: ['Full check', 'Estimate'] },
    { name: 'Gas Refill', price: 799,  duration_min: 90,  inclusions: ['Compressor check', 'Gas refill', 'Testing'] },
    { name: 'Full Repair',price: 1299, duration_min: 150, inclusions: ['Part replacement', 'Gas refill', 'Testing'] },
  ]);

  // ─── Pest Control ─────────────────────────────────────────────
  await createService('Cockroach Control', 'Effective cockroach elimination using safe chemicals.', catPest.id, [
    { name: '1 BHK', price: 499, duration_min: 60,  inclusions: ['Gel treatment', 'Spray', '3 month warranty'] },
    { name: '2 BHK', price: 699, duration_min: 90,  inclusions: ['Gel treatment', 'Spray', '3 month warranty'] },
    { name: '3 BHK', price: 899, duration_min: 120, inclusions: ['Gel treatment', 'Spray', '3 month warranty'] },
  ]);
  await createService('Termite Control', 'Comprehensive termite treatment for wood and soil.', catPest.id, [
    { name: 'Wood Treatment', price: 999,  duration_min: 120, inclusions: ['Chemical injection', 'Drilling', '1 year warranty'] },
    { name: 'Full Home',      price: 1999, duration_min: 180, inclusions: ['Soil treatment', 'Wood treatment', 'Proofing', '1 year warranty'] },
  ]);

  // ─── Home Painting ────────────────────────────────────────────
  await createService('Interior Painting', 'Professional interior wall painting with premium paints.', catPainting.id, [
    { name: '1 Room',            price: 1499, duration_min: 240,  inclusions: ['Primer coat', '2 top coats', 'Putty', 'Newspaper protection'] },
    { name: '2 Rooms',           price: 2499, duration_min: 360,  inclusions: ['Primer coat', '2 top coats', 'Putty', 'Furniture protection'] },
    { name: 'Full Home (2 BHK)', price: 8999, duration_min: 1440, inclusions: ['Full wall preparation', 'Premium paint', '2 coats', 'Clean-up'] },
  ]);

  // ─── Carpentry ────────────────────────────────────────────────
  await createService('Furniture Repair', 'Repair and refurbishment of all types of wooden furniture.', catCarpentry.id, [
    { name: 'Minor Repair', price: 299, duration_min: 45,  inclusions: ['Hinge fix', 'Screw tightening', 'Basic touch-up'] },
    { name: 'Major Repair', price: 799, duration_min: 120, inclusions: ['Joint repair', 'Polish', 'Hardware replacement'] },
  ]);

  // ─── Sofa & Carpet ────────────────────────────────────────────
  await createService('Sofa Deep Clean', 'Deep shampooing and cleaning of sofa sets at home.', catSofa.id, [
    { name: '2 Seater Sofa', price: 499, duration_min: 60,  inclusions: ['Vacuum', 'Shampoo wash', 'Steam clean', 'Deodorizing'] },
    { name: '3 Seater Sofa', price: 699, duration_min: 90,  inclusions: ['Vacuum', 'Shampoo wash', 'Steam clean', 'Deodorizing'] },
    { name: 'L-Shape Sofa',  price: 999, duration_min: 120, inclusions: ['Vacuum', 'Shampoo wash', 'Steam clean', 'Deodorizing'] },
  ]);

  // ─── Water Purifier ───────────────────────────────────────────
  await createService('RO Service', 'Complete RO water purifier servicing and filter replacement.', catWater.id, [
    { name: 'Basic Service',      price: 349, duration_min: 45, inclusions: ['Filter check', 'Sanitization', 'TDS check'] },
    { name: 'Filter Replacement', price: 799, duration_min: 60, inclusions: ['Sediment filter', 'Carbon filter', 'Membrane check', 'TDS test'] },
    { name: 'Full Service',       price: 999, duration_min: 90, inclusions: ['All filters replaced', 'Membrane check', 'Sanitization', 'TDS test'] },
  ]);

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
