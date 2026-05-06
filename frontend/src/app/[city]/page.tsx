import Link from 'next/link';
import { MapPin, Star, Shield, Clock, ChevronRight } from 'lucide-react';

const SERVICE_CATEGORIES = [
  { id: 'ac-service', name: 'AC Service & Repair', emoji: '❄️', desc: 'Gas refill, cleaning & repair', count: 12 },
  { id: 'home-cleaning', name: 'Home Cleaning', emoji: '🧹', desc: 'Deep clean, bathroom & kitchen', count: 18 },
  { id: 'salon-women', name: 'Salon for Women', emoji: '💅', desc: 'Waxing, facials, hair & more', count: 22 },
  { id: 'mens-haircut', name: "Men's Salon", emoji: '✂️', desc: 'Haircut, shave, beard styling', count: 8 },
  { id: 'plumbing', name: 'Plumbing', emoji: '🔧', desc: 'Leakage, fixture & pipe repair', count: 14 },
  { id: 'electrician', name: 'Electrician', emoji: '⚡', desc: 'Wiring, fans, switches & more', count: 10 },
  { id: 'appliance-repair', name: 'Appliance Repair', emoji: '📺', desc: 'Washing machine, fridge, TV', count: 16 },
  { id: 'pest-control', name: 'Pest Control', emoji: '🐛', desc: 'Cockroach, termite & bed bugs', count: 6 },
  { id: 'painting', name: 'Home Painting', emoji: '🎨', desc: 'Interior, exterior & waterproof', count: 9 },
  { id: 'carpentry', name: 'Carpentry', emoji: '🪚', desc: 'Furniture repair & installation', count: 11 },
  { id: 'sofa-cleaning', name: 'Sofa & Carpet', emoji: '🛋️', desc: 'Dry cleaning & shampooing', count: 5 },
  { id: 'water-purifier', name: 'Water Purifier', emoji: '💧', desc: 'RO service, install & repair', count: 7 },
];

const POPULAR_SERVICES = [
  { name: 'AC Gas Refill', category: 'ac-service', rating: 4.8, price: '₹599' },
  { name: 'Full Home Deep Clean', category: 'home-cleaning', rating: 4.9, price: '₹1,199' },
  { name: 'Bathroom Cleaning', category: 'home-cleaning', rating: 4.7, price: '₹299' },
  { name: 'Haircut at Home', category: 'mens-haircut', rating: 4.8, price: '₹199' },
];

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const city = resolvedParams.city;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* City Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-10 md:py-14 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center text-sm text-blue-300 mb-3 md:mb-4 space-x-1 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{cityName}</span>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Services in {cityName}</h1>
          </div>
          <p className="text-blue-200 text-base md:text-lg mb-6 md:mb-8 max-w-2xl pl-12">
            Professional home services at your doorstep. Trusted by thousands in {cityName}.
          </p>
          {/* Trust Bar */}
          <div className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-blue-200 pl-0 md:pl-12">
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> 4.8 Avg. Rating</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-400" /> UC Guarantee</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> Same-day available</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
        {/* Categories Grid */}
        <h2 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">What are you looking for?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-14">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/${city}/${cat.id}`}
              className="group bg-white border rounded-xl md:rounded-2xl p-4 md:p-5 hover:shadow-lg hover:border-primary/40 transition-all duration-200 cursor-pointer"
            >
              <div className="text-3xl md:text-4xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">
                {cat.emoji}
              </div>
              <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-1 leading-tight">{cat.name}</h3>
              <p className="text-xs text-muted-foreground leading-tight hidden sm:block">{cat.desc}</p>
              <div className="mt-2 md:mt-3 text-xs text-primary font-medium">{cat.count} services →</div>
            </Link>
          ))}
        </div>

        {/* Popular in This City */}
        <div className="mb-10 md:mb-14">
          <h2 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">Popular in {cityName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {POPULAR_SERVICES.map((svc) => (
              <Link
                key={svc.name}
                href={`/${city}/${svc.category}/${svc.name.toLowerCase().replace(/ /g, '-')}`}
                className="bg-white border rounded-xl md:rounded-2xl p-4 md:p-5 hover:shadow-md hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-green-600 text-green-600" /> {svc.rating}
                  </span>
                </div>
                <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-1 md:mb-2 group-hover:text-primary transition-colors leading-tight">{svc.name}</h3>
                <div className="text-primary font-bold text-sm md:text-base">{svc.price}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Us */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl md:rounded-2xl p-6 md:p-8 text-white text-center">
          <h2 className="text-lg md:text-2xl font-bold mb-2">Why choose UrbanService in {cityName}?</h2>
          <p className="text-blue-100 mb-6 text-sm">Background-verified professionals, guaranteed quality.</p>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: '✅', label: 'Verified Pros', desc: 'Background checked' },
              { icon: '⚡', label: 'Quick Booking', desc: 'Book in 60 seconds' },
              { icon: '💰', label: 'Best Prices', desc: 'Transparent & fixed' },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">{item.icon}</div>
                <div className="font-semibold text-xs md:text-sm">{item.label}</div>
                <div className="text-blue-200 text-xs mt-1 hidden sm:block">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
