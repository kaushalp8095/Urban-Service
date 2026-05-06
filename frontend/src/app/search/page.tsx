'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, ArrowLeft, Loader2, SearchX } from 'lucide-react';
import { useSearch } from '@/lib/api/hooks';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Jaipur'];

// Static fallback data (used when backend is offline)
const ALL_SERVICES = [
  { id: 'ac-service-cleaning', category: 'ac-service', categoryName: 'AC Service & Repair', emoji: '❄️', name: 'AC Service & Cleaning', desc: 'Deep cleaning of filters, coils and drain pipe.', rating: 4.7, reviews: '14.3k', price: 349 },
  { id: 'ac-gas-refill', category: 'ac-service', categoryName: 'AC Service & Repair', emoji: '❄️', name: 'AC Gas Refill', desc: 'Refrigerant gas top-up for all AC types.', rating: 4.8, reviews: '9.1k', price: 599 },
  { id: 'full-home-cleaning', category: 'home-cleaning', categoryName: 'Home Cleaning', emoji: '🧹', name: 'Full Home Deep Clean', desc: 'End-to-end professional cleaning of your entire home.', rating: 4.9, reviews: '22.1k', price: 1199 },
  { id: 'bathroom-cleaning', category: 'home-cleaning', categoryName: 'Home Cleaning', emoji: '🚿', name: 'Bathroom Deep Clean', desc: 'Scrubbing of tiles, toilet, sink and all fixtures.', rating: 4.7, reviews: '18.4k', price: 299 },
  { id: 'kitchen-cleaning', category: 'home-cleaning', categoryName: 'Home Cleaning', emoji: '🍳', name: 'Kitchen Deep Clean', desc: 'Chimney, tiles, sink and countertop deep clean.', rating: 4.8, reviews: '12.3k', price: 499 },
  { id: 'haircut-beard-combo', category: 'mens-haircut', categoryName: "Men's Salon", emoji: '✂️', name: 'Haircut + Beard Combo', desc: "Complete men's grooming package at home.", rating: 4.9, reviews: '21.5k', price: 299 },
  { id: 'hair-color-men', category: 'mens-haircut', categoryName: "Men's Salon", emoji: '✂️', name: 'Hair Color (Men)', desc: 'Global or highlights with premium products.', rating: 4.7, reviews: '5.2k', price: 499 },
  { id: 'facial', category: 'salon-women', categoryName: 'Salon for Women', emoji: '💆', name: 'Gold / Diamond Facial', desc: 'Luxury facial with cleansing, massage and toner.', rating: 4.9, reviews: '11.2k', price: 599 },
  { id: 'waxing', category: 'salon-women', categoryName: 'Salon for Women', emoji: '💅', name: 'Full Body Waxing', desc: 'Full body Rica wax with soothing lotion.', rating: 4.8, reviews: '8.7k', price: 799 },
  { id: 'cockroach-control', category: 'pest-control', categoryName: 'Pest Control', emoji: '🐛', name: 'Cockroach Control', desc: 'Gel-based treatment. 90-day warranty.', rating: 4.8, reviews: '11.2k', price: 399 },
  { id: 'termite-control', category: 'pest-control', categoryName: 'Pest Control', emoji: '🐛', name: 'Termite Control', desc: 'Anti-termite treatment with 1-year warranty.', rating: 4.7, reviews: '6.3k', price: 1499 },
  { id: 'fan-installation', category: 'electrician', categoryName: 'Electrician', emoji: '⚡', name: 'Fan Installation', desc: 'Ceiling or wall fan mounting with wiring.', rating: 4.8, reviews: '21k', price: 149 },
  { id: 'switchboard-repair', category: 'electrician', categoryName: 'Electrician', emoji: '⚡', name: 'Switchboard Repair', desc: 'Fix faulty switches, sockets and MCBs.', rating: 4.7, reviews: '9.4k', price: 199 },
  { id: 'water-purifier-service', category: 'appliance-repair', categoryName: 'Appliance Repair', emoji: '💧', name: 'RO / Water Purifier Service', desc: 'Annual service with filter replacement.', rating: 4.8, reviews: '7.8k', price: 299 },
  { id: 'washing-machine-repair', category: 'appliance-repair', categoryName: 'Appliance Repair', emoji: '📺', name: 'Washing Machine Repair', desc: 'Diagnosis and fix for all brands.', rating: 4.7, reviews: '13.2k', price: 349 },
  { id: 'sofa-dry-clean', category: 'sofa-cleaning', categoryName: 'Sofa & Carpet', emoji: '🛋️', name: 'Sofa Dry Cleaning', desc: 'Professional dry cleaning. Stain removal included.', rating: 4.7, reviews: '7.2k', price: 599 },
  { id: 'pipe-leakage', category: 'plumbing', categoryName: 'Plumbing', emoji: '🔧', name: 'Pipe Leakage Fix', desc: 'Detection and fixing of concealed/open leaks.', rating: 4.8, reviews: '10.5k', price: 249 },
  { id: 'tap-replacement', category: 'plumbing', categoryName: 'Plumbing', emoji: '🔧', name: 'Tap / Faucet Replacement', desc: 'Remove and install any tap or faucet.', rating: 4.7, reviews: '8.9k', price: 149 },
  { id: 'interior-painting', category: 'painting', categoryName: 'Home Painting', emoji: '🎨', name: 'Interior Painting', desc: 'Full room painting with premium emulsion.', rating: 4.9, reviews: '6.1k', price: 2999 },
];

const ALL_CATEGORIES = [
  { id: 'ac-service', name: 'AC Service & Repair', emoji: '❄️' },
  { id: 'home-cleaning', name: 'Home Cleaning', emoji: '🧹' },
  { id: 'salon-women', name: 'Salon for Women', emoji: '💅' },
  { id: 'mens-haircut', name: "Men's Salon", emoji: '✂️' },
  { id: 'plumbing', name: 'Plumbing', emoji: '🔧' },
  { id: 'electrician', name: 'Electrician', emoji: '⚡' },
  { id: 'appliance-repair', name: 'Appliance Repair', emoji: '📺' },
  { id: 'pest-control', name: 'Pest Control', emoji: '🐛' },
  { id: 'painting', name: 'Home Painting', emoji: '🎨' },
  { id: 'carpentry', name: 'Carpentry', emoji: '🪚' },
  { id: 'sofa-cleaning', name: 'Sofa & Carpet', emoji: '🛋️' },
];

function filterLocally(query: string) {
  const q = query.toLowerCase();
  const services = ALL_SERVICES.filter(
    s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.categoryName.toLowerCase().includes(q)
  );
  const categories = ALL_CATEGORIES.filter(c => c.name.toLowerCase().includes(q));
  return { services, categories };
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || 'Mumbai';

  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce the query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Update URL when search changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const params = new URLSearchParams({ q: debouncedQuery, city });
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, city]);

  const { data: apiData, isLoading, isError } = useSearch(debouncedQuery, city.toLowerCase());

  // Use API results if available, otherwise fall back to local filter
  const results = apiData?.data
    ? apiData.data
    : debouncedQuery.length >= 2
    ? filterLocally(debouncedQuery)
    : { services: [], categories: [] };

  const services: any[] = results.services || [];
  const categories: any[] = results.categories || [];
  const hasResults = services.length > 0 || categories.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="container mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* City Selector */}
            <div className="flex items-center gap-1.5 px-3 py-2 border rounded-lg bg-gray-50 shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer"
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Query label */}
        {debouncedQuery && (
          <p className="text-sm text-muted-foreground mb-5">
            {hasResults
              ? `Showing results for "${debouncedQuery}" in ${city}`
              : `No results found for "${debouncedQuery}" in ${city}`}
          </p>
        )}

        {/* Categories Matches */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-700 mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/${city.toLowerCase()}/${cat.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full hover:border-primary hover:text-primary hover:shadow-sm transition-all text-sm font-medium"
                >
                  <span>{cat.image_url || cat.emoji || '✨'}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Service Results */}
        {services.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-3">
              Services ({services.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc: any) => {
                const emoji = svc.emoji || svc.image_url || '✨';
                const categoryId = svc.category_id || svc.category?.id || svc.category || 'home-cleaning';
                const categoryName = svc.categoryName || svc.category?.name || 'Service';
                const price = svc.price || svc.packages?.[0]?.price || 0;
                const slug = svc.id || svc.name?.toLowerCase().replace(/\s+/g, '-');

                return (
                  <Link
                    key={svc.id || svc.name}
                    href={`/${city.toLowerCase()}/${categoryId}/${slug}`}
                  >
                    <div className="bg-white border rounded-2xl p-4 hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer h-full flex gap-4">
                      <div className="text-3xl shrink-0 mt-0.5">{emoji}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {categoryName}
                        </span>
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mt-1.5 text-sm">
                          {svc.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{svc.desc || svc.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                              <Star className="w-3 h-3 fill-green-600 text-green-600" />
                              {svc.rating || '4.8'}
                            </span>
                            {svc.reviews && (
                              <span className="text-xs text-muted-foreground">{svc.reviews}</span>
                            )}
                          </div>
                          {price > 0 && (
                            <div className="text-primary font-bold text-sm">₹{price} onwards</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && debouncedQuery.length >= 2 && !hasResults && (
          <div className="text-center py-20">
            <SearchX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">No results found</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Try different keywords or browse categories below
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {ALL_CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  href={`/${city.toLowerCase()}/${cat.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-full hover:border-primary hover:text-primary transition-all text-xs font-medium"
                >
                  {cat.emoji} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prompt state */}
        {debouncedQuery.length < 2 && (
          <div className="text-center py-16">
            <Search className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Type at least 2 characters to search</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
