import Link from 'next/link';
import { Star, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// All services data by category
const SERVICES_BY_CATEGORY: Record<string, { id: string; name: string; desc: string; price: number; duration: string; rating: number; reviews: number; includes: string[] }[]> = {
  'ac-service': [
    { id: 'ac-gas-refill', name: 'AC Gas Refill', desc: 'Recharge refrigerant gas for optimal cooling performance.', price: 599, duration: '45 mins', rating: 4.8, reviews: 8200, includes: ['Gas top-up', 'Leak check', 'Performance test'] },
    { id: 'ac-service-cleaning', name: 'AC Service & Cleaning', desc: 'Deep cleaning of filters, coils and drain pipe.', price: 349, duration: '60 mins', rating: 4.7, reviews: 14300, includes: ['Filter cleaning', 'Coil wash', 'Drainage check'] },
    { id: 'ac-installation', name: 'AC Installation', desc: 'Professional wall-mount AC installation with copper pipe.', price: 999, duration: '2-3 hrs', rating: 4.9, reviews: 5100, includes: ['Wall mounting', 'Copper piping', 'Testing & demo'] },
    { id: 'ac-repair', name: 'AC Repair', desc: 'Diagnosis and repair of all AC problems.', price: 449, duration: '60-90 mins', rating: 4.6, reviews: 6700, includes: ['Full diagnosis', 'Part replacement', '30-day warranty'] },
    { id: 'ac-uninstallation', name: 'AC Uninstallation', desc: 'Safe removal of your AC unit.', price: 299, duration: '30 mins', rating: 4.8, reviews: 2900, includes: ['Safe removal', 'Gas recovery', 'Packaging'] },
  ],
  'home-cleaning': [
    { id: 'full-home-cleaning', name: 'Full Home Deep Clean', desc: 'End-to-end professional cleaning of your entire home.', price: 1199, duration: '3-4 hrs', rating: 4.9, reviews: 22100, includes: ['Kitchen degreasing', 'Bathroom scrub', 'Floor mopping', 'Dusting all surfaces'] },
    { id: 'bathroom-cleaning', name: 'Bathroom Cleaning', desc: 'Deep cleaning of toilet, tiles, sink and fixtures.', price: 299, duration: '45 mins', rating: 4.7, reviews: 18400, includes: ['Toilet disinfection', 'Tile scrubbing', 'Mirror cleaning', 'Floor mopping'] },
    { id: 'kitchen-cleaning', name: 'Kitchen Cleaning', desc: 'Grease removal and full kitchen deep cleaning.', price: 449, duration: '60 mins', rating: 4.8, reviews: 9800, includes: ['Chimney & hob cleaning', 'Counter degreasing', 'Sink cleaning', 'Cabinet exterior wipe'] },
    { id: 'sofa-cleaning', name: 'Sofa Cleaning', desc: 'Dry cleaning and stain removal for sofas.', price: 599, duration: '90 mins', rating: 4.7, reviews: 7200, includes: ['Vacuum & brush', 'Shampoo wash', 'Stain removal', 'Drying'] },
    { id: 'carpet-shampooing', name: 'Carpet Shampooing', desc: 'Machine-based carpet deep clean and deodorization.', price: 499, duration: '60 mins', rating: 4.6, reviews: 4100, includes: ['Machine wash', 'Deodorize', 'Stain treatment'] },
  ],
  'salon-women': [
    { id: 'full-body-waxing', name: 'Full Body Waxing', desc: 'Smooth, long-lasting full body wax at home.', price: 799, duration: '90 mins', rating: 4.8, reviews: 16300, includes: ['Legs', 'Arms', 'Underarms', 'Bikini (optional)'] },
    { id: 'facial', name: 'Facial (Gold/Diamond)', desc: 'Luxury facial for glowing skin.', price: 599, duration: '60 mins', rating: 4.9, reviews: 11200, includes: ['Cleansing', 'Exfoliation', 'Massage', 'Pack & toner'] },
    { id: 'hair-spa', name: 'Hair Spa', desc: 'Deep conditioning hair spa for silky smooth hair.', price: 499, duration: '60 mins', rating: 4.7, reviews: 8900, includes: ['Steam treatment', 'Mask application', 'Blow dry'] },
    { id: 'manicure-pedicure', name: 'Manicure + Pedicure', desc: 'Relaxing mani-pedi with nail paint.', price: 499, duration: '75 mins', rating: 4.8, reviews: 13200, includes: ['Scrubbing', 'Massage', 'Nail filing', 'Nail paint'] },
    { id: 'threading', name: 'Eyebrow & Upper Lip Threading', desc: 'Precise threading for perfect brows.', price: 99, duration: '15 mins', rating: 4.9, reviews: 31000, includes: ['Eyebrow shaping', 'Upper lip', 'Forehead'] },
    { id: 'hair-color', name: 'Hair Color', desc: 'Professional hair coloring at home.', price: 999, duration: '120 mins', rating: 4.7, reviews: 5400, includes: ['Color application', 'Wash & conditioning', 'Blow dry'] },
  ],
  'mens-haircut': [
    { id: 'haircut', name: 'Haircut', desc: 'Professional haircut by expert barbers at home.', price: 199, duration: '30 mins', rating: 4.8, reviews: 28000, includes: ['Style cut', 'Neck & sideburn trim', 'Hair styling'] },
    { id: 'beard-trim', name: 'Beard Trim & Styling', desc: 'Expert beard shaping and trimming.', price: 149, duration: '20 mins', rating: 4.9, reviews: 19300, includes: ['Beard trim', 'Shape & style', 'Razor edge'] },
    { id: 'haircut-beard-combo', name: 'Haircut + Beard Combo', desc: 'Complete grooming package for men.', price: 299, duration: '45 mins', rating: 4.9, reviews: 21500, includes: ['Haircut', 'Beard trim', 'Face wash', 'Styling'] },
    { id: 'hair-color-men', name: "Men's Hair Color", desc: 'Natural looking hair color at home.', price: 499, duration: '60 mins', rating: 4.7, reviews: 4200, includes: ['Color application', 'Shampoo & wash', 'Blow dry'] },
    { id: 'hair-spa-men', name: "Men's Hair Spa", desc: 'Relaxing hair treatment for healthy scalp.', price: 399, duration: '45 mins', rating: 4.6, reviews: 3100, includes: ['Scalp massage', 'Mask treatment', 'Blow dry'] },
  ],
  'plumbing': [
    { id: 'tap-repair', name: 'Tap & Faucet Repair', desc: 'Fix leaking, dripping or broken taps.', price: 199, duration: '30 mins', rating: 4.7, reviews: 12100, includes: ['Diagnosis', 'Part replacement', 'Testing'] },
    { id: 'drain-unclog', name: 'Drain Unclogging', desc: 'Clear blocked drains in kitchen, bathroom.', price: 299, duration: '45 mins', rating: 4.8, reviews: 9400, includes: ['Blockage removal', 'Pipe cleaning', 'Flush test'] },
    { id: 'toilet-repair', name: 'Toilet Repair', desc: 'Fix flush tank, seat, or leakage issues.', price: 249, duration: '45 mins', rating: 4.7, reviews: 7600, includes: ['Diagnosis', 'Part fix/replace', 'Testing'] },
    { id: 'pipe-leak', name: 'Pipe Leak Repair', desc: 'Fix pipeline leaks inside walls or exposed.', price: 349, duration: '60 mins', rating: 4.6, reviews: 5200, includes: ['Leak detection', 'Sealing/repair', 'Check & test'] },
    { id: 'water-heater', name: 'Water Heater Installation', desc: 'Install geyser or water heater safely.', price: 449, duration: '60 mins', rating: 4.9, reviews: 4800, includes: ['Wall mounting', 'Water connection', 'Safety check'] },
  ],
  'electrician': [
    { id: 'fan-installation', name: 'Fan Installation', desc: 'Ceiling or wall fan installation at home.', price: 149, duration: '30 mins', rating: 4.8, reviews: 21000, includes: ['Fan mounting', 'Wiring', 'Testing'] },
    { id: 'switchboard-repair', name: 'Switchboard Repair', desc: 'Fix faulty switches, sockets or boards.', price: 149, duration: '30 mins', rating: 4.7, reviews: 15300, includes: ['Diagnosis', 'Switch/socket replace', 'Safety check'] },
    { id: 'wiring', name: 'New Wiring / Rewiring', desc: 'Complete new wiring for a room or home.', price: 799, duration: '3-4 hrs', rating: 4.8, reviews: 3900, includes: ['Wire laying', 'Junction boxes', 'Testing & safety'] },
    { id: 'light-installation', name: 'Light Fixture Installation', desc: 'Install LED panels, chandeliers or ceiling lights.', price: 199, duration: '30 mins', rating: 4.7, reviews: 8700, includes: ['Fixture mounting', 'Wiring', 'Testing'] },
    { id: 'mcb-fuse', name: 'MCB / Fuse Replacement', desc: 'Replace faulty MCB or fuse box components.', price: 249, duration: '30 mins', rating: 4.9, reviews: 5600, includes: ['Old part removal', 'New MCB install', 'Load testing'] },
  ],
  'appliance-repair': [
    { id: 'washing-machine-repair', name: 'Washing Machine Repair', desc: 'Fix any washing machine brand or model.', price: 349, duration: '60 mins', rating: 4.7, reviews: 13200, includes: ['Full diagnosis', 'Part replacement', '30-day warranty'] },
    { id: 'refrigerator-repair', name: 'Refrigerator Repair', desc: 'Fix cooling, compressor or electrical issues.', price: 449, duration: '60 mins', rating: 4.7, reviews: 9800, includes: ['Diagnosis', 'Part fix', '30-day warranty'] },
    { id: 'microwave-repair', name: 'Microwave Repair', desc: 'Repair magnetron, turntable or heating issues.', price: 299, duration: '45 mins', rating: 4.6, reviews: 4100, includes: ['Diagnosis', 'Part replacement', 'Testing'] },
    { id: 'tv-repair', name: 'TV Repair', desc: 'Fix LED/LCD screen, remote or display issues.', price: 399, duration: '60 mins', rating: 4.7, reviews: 6700, includes: ['Diagnosis', 'Board/Part fix', 'Testing'] },
    { id: 'water-purifier-service', name: 'RO Water Purifier Service', desc: 'Annual service and filter replacement.', price: 299, duration: '45 mins', rating: 4.8, reviews: 7800, includes: ['Filter change', 'Membrane check', 'Water quality test'] },
  ],
  'pest-control': [
    { id: 'cockroach-control', name: 'Cockroach Control', desc: 'Gel-based treatment for complete cockroach elimination.', price: 399, duration: '45 mins', rating: 4.8, reviews: 11200, includes: ['Gel bait treatment', 'Kitchen & bathroom focus', '90-day warranty'] },
    { id: 'bed-bugs', name: 'Bed Bug Treatment', desc: 'Heat + spray treatment for bed bugs.', price: 999, duration: '2-3 hrs', rating: 4.7, reviews: 5400, includes: ['Full room spray', 'Mattress treatment', '3-visit plan'] },
    { id: 'termite-control', name: 'Termite Control', desc: 'Chemical and bait-based termite treatment.', price: 1499, duration: '3-4 hrs', rating: 4.9, reviews: 3100, includes: ['Drilling & chemical fill', 'Wood treatment', '1-year warranty'] },
    { id: 'general-pest', name: 'General Pest Control', desc: 'Spraying for ants, lizards, spiders, mosquitoes.', price: 499, duration: '60 mins', rating: 4.7, reviews: 8900, includes: ['Full home spray', 'All common pests', '30-day warranty'] },
  ],
  'painting': [
    { id: 'interior-painting', name: 'Interior Painting', desc: 'Premium paint finish for walls and ceilings.', price: 2999, duration: '2-3 days', rating: 4.8, reviews: 4200, includes: ['Wall prep', '2 coats primer', '2 coats paint', 'Clean-up'] },
    { id: 'exterior-painting', name: 'Exterior Painting', desc: 'Weather-proof exterior wall painting.', price: 4999, duration: '3-5 days', rating: 4.9, reviews: 1800, includes: ['Putty filling', 'Weather coat', '2 coats paint'] },
    { id: 'waterproof-coating', name: 'Waterproof Coating', desc: 'Protect your terrace and walls from water seepage.', price: 3499, duration: '1-2 days', rating: 4.8, reviews: 2200, includes: ['Surface prep', 'Waterproof layer', 'Top coat'] },
    { id: 'texture-painting', name: 'Texture / Designer Painting', desc: 'Unique texture and designer wall finishes.', price: 2499, duration: '1-2 days', rating: 4.7, reviews: 1600, includes: ['Design selection', 'Base coat', 'Texture application'] },
  ],
  'carpentry': [
    { id: 'furniture-repair', name: 'Furniture Repair', desc: 'Fix broken hinges, handles, or loose joints.', price: 299, duration: '45 mins', rating: 4.7, reviews: 8600, includes: ['Diagnosis', 'Part fix/replace', 'Polishing'] },
    { id: 'door-window-repair', name: 'Door & Window Repair', desc: 'Fix creaky, stuck or damaged doors and windows.', price: 249, duration: '30-45 mins', rating: 4.8, reviews: 11400, includes: ['Hinge fix', 'Lock repair', 'Weather sealing'] },
    { id: 'wardrobe-installation', name: 'Wardrobe Installation', desc: 'Assemble and install modular wardrobes.', price: 599, duration: '2-3 hrs', rating: 4.9, reviews: 3200, includes: ['Assembly', 'Wall fixing', 'Handle & hinge fitting'] },
    { id: 'furniture-assembly', name: 'Flat-pack Furniture Assembly', desc: 'Assemble IKEA or any flat-pack furniture.', price: 399, duration: '60-90 mins', rating: 4.8, reviews: 6700, includes: ['Full assembly', 'Wall mounting if needed', 'Clean-up'] },
  ],
  'sofa-cleaning': [
    { id: 'sofa-dry-clean', name: 'Sofa Dry Cleaning', desc: 'Professional dry cleaning for all sofa types.', price: 599, duration: '90 mins', rating: 4.7, reviews: 7200, includes: ['Vacuum & brush', 'Dry foam clean', 'Stain removal'] },
    { id: 'carpet-shampooing', name: 'Carpet Shampooing', desc: 'Machine-based deep clean for carpets and rugs.', price: 499, duration: '60 mins', rating: 4.6, reviews: 4100, includes: ['Machine wash', 'Deodorize', 'Stain treatment'] },
    { id: 'mattress-cleaning', name: 'Mattress Cleaning', desc: 'Deep clean and sanitize your mattress.', price: 449, duration: '60 mins', rating: 4.8, reviews: 5600, includes: ['Vacuum', 'UV treatment', 'Deodorize'] },
  ],
  'water-purifier': [
    { id: 'ro-service', name: 'RO Service (Annual)', desc: 'Full annual service with filter replacement.', price: 299, duration: '45 mins', rating: 4.8, reviews: 7800, includes: ['Filter change', 'Membrane check', 'Water quality test'] },
    { id: 'ro-installation', name: 'RO Installation', desc: 'Install new RO or water purifier.', price: 499, duration: '60 mins', rating: 4.9, reviews: 3400, includes: ['Wall/under-sink mounting', 'Pipe connection', 'Test run'] },
    { id: 'ro-repair', name: 'RO Repair', desc: 'Fix leaks, low flow, or quality issues.', price: 349, duration: '45 mins', rating: 4.7, reviews: 2900, includes: ['Diagnosis', 'Part fix', 'Water test'] },
  ],
};

const CATEGORY_META: Record<string, { name: string; emoji: string; desc: string }> = {
  'ac-service': { name: 'AC Service & Repair', emoji: '❄️', desc: 'Expert AC repairs, gas refill, cleaning and installation.' },
  'home-cleaning': { name: 'Home Cleaning', emoji: '🧹', desc: 'Professional deep cleaning for every corner of your home.' },
  'salon-women': { name: "Salon for Women", emoji: '💅', desc: 'Premium beauty services delivered at your doorstep.' },
  'mens-haircut': { name: "Men's Salon", emoji: '✂️', desc: 'Expert grooming, haircuts and beard styling at home.' },
  'plumbing': { name: 'Plumbing', emoji: '🔧', desc: 'Fast and reliable plumbing solutions for home and office.' },
  'electrician': { name: 'Electrician', emoji: '⚡', desc: 'Safe, certified electricians for all wiring and fixture needs.' },
  'appliance-repair': { name: 'Appliance Repair', emoji: '📺', desc: 'All major home appliances repaired by certified technicians.' },
  'pest-control': { name: 'Pest Control', emoji: '🐛', desc: 'Safe and effective pest control for a healthy home.' },
  'painting': { name: 'Home Painting', emoji: '🎨', desc: 'Transform your home with professional painters.' },
  'carpentry': { name: 'Carpentry', emoji: '🪚', desc: 'Skilled carpenters for furniture, doors and installations.' },
  'sofa-cleaning': { name: 'Sofa & Carpet Cleaning', emoji: '🛋️', desc: 'Deep cleaning for sofas, carpets and mattresses.' },
  'water-purifier': { name: 'Water Purifier', emoji: '💧', desc: 'RO and water purifier service, installation & repair.' },
};

export default async function CategoryPage({ params }: { params: Promise<{ city: string; category: string }> }) {
  const resolvedParams = await params;
  const { city, category } = resolvedParams;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');

  const meta = CATEGORY_META[category] || { name: category.replace(/-/g, ' '), emoji: '🔧', desc: 'Professional services at your doorstep.' };
  const services = SERVICES_BY_CATEGORY[category] || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-muted-foreground flex-wrap gap-1">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${city}`} className="hover:text-black capitalize">{cityName}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-black capitalize">{meta.name}</span>
        </div>
      </div>

      {/* Category Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl md:text-5xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">{meta.name} in {cityName}</h1>
              <p className="text-blue-200 mt-1 text-sm md:text-base">{meta.desc}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> 4.8 Avg. Rating</span>
            <span className="flex items-center gap-1.5">✅ {services.length} Services Available</span>
            <span className="flex items-center gap-1.5">🛡️ UC Guarantee on all bookings</span>
          </div>
        </div>
      </section>

      {/* Services List */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {services.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border shadow-sm">
            <div className="text-5xl mb-4">🔧</div>
            <h2 className="text-xl font-bold mb-2">Services Coming Soon</h2>
            <p className="text-muted-foreground text-sm">We're adding services for this category in {cityName}. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-5">{services.length} Services Available</h2>
            {services.map((svc) => (
              <div key={svc.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{svc.name}</h3>
                        <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-green-600 text-green-600" /> {svc.rating}
                          <span className="font-normal text-green-600 ml-0.5">({(svc.reviews / 1000).toFixed(1)}k)</span>
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{svc.desc}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Clock className="w-3.5 h-3.5" /> {svc.duration}
                      </div>
                      {/* Includes */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {svc.includes.map((item) => (
                          <span key={item} className="flex items-center gap-1 text-xs text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" /> {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Price + CTA */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:min-w-[140px]">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Starts at</div>
                        <div className="text-2xl font-bold text-gray-900">₹{svc.price}</div>
                      </div>
                      <Link href={`/${city}/${category}/${svc.id}`}>
                        <Button className="shrink-0 sm:w-full">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
