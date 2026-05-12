'use client';

import Link from 'next/link';
import { Search, Star, Shield, Clock, MapPin, ChevronRight, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoriesGrid } from '@/components/home/categories-grid';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch, usePopularServices } from '@/lib/api/hooks';
import { CitySelect } from '@/components/ui/city-select';
import { useCity } from '@/components/providers/city-provider';

const CITIES_QUICK = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Jaipur'];

const ALL_STATIC_SUGGESTIONS = [
  { id: 'ac-service-cleaning', category: 'ac-service', emoji: '❄️', name: 'AC Service & Cleaning' },
  { id: 'ac-gas-refill', category: 'ac-service', emoji: '❄️', name: 'AC Gas Refill' },
  { id: 'full-home-cleaning', category: 'home-cleaning', emoji: '🧹', name: 'Full Home Deep Clean' },
  { id: 'bathroom-cleaning', category: 'home-cleaning', emoji: '🚿', name: 'Bathroom Deep Clean' },
  { id: 'kitchen-cleaning', category: 'home-cleaning', emoji: '🍳', name: 'Kitchen Deep Clean' },
  { id: 'haircut-beard-combo', category: 'mens-haircut', emoji: '✂️', name: 'Haircut + Beard Combo' },
  { id: 'hair-color-men', category: 'mens-haircut', emoji: '✂️', name: 'Hair Color (Men)' },
  { id: 'facial', category: 'salon-women', emoji: '💆', name: 'Gold / Diamond Facial' },
  { id: 'waxing', category: 'salon-women', emoji: '💅', name: 'Full Body Waxing' },
  { id: 'cockroach-control', category: 'pest-control', emoji: '🐛', name: 'Cockroach Control' },
  { id: 'termite-control', category: 'pest-control', emoji: '🐛', name: 'Termite Control' },
  { id: 'fan-installation', category: 'electrician', emoji: '⚡', name: 'Fan Installation' },
  { id: 'switchboard-repair', category: 'electrician', emoji: '⚡', name: 'Switchboard Repair' },
  { id: 'water-purifier-service', category: 'appliance-repair', emoji: '💧', name: 'RO / Water Purifier Service' },
  { id: 'washing-machine-repair', category: 'appliance-repair', emoji: '📺', name: 'Washing Machine Repair' },
  { id: 'sofa-dry-clean', category: 'sofa-cleaning', emoji: '🛋️', name: 'Sofa Dry Cleaning' },
  { id: 'pipe-leakage', category: 'plumbing', emoji: '🔧', name: 'Pipe Leakage Fix' },
  { id: 'tap-replacement', category: 'plumbing', emoji: '🔧', name: 'Tap / Faucet Replacement' },
  { id: 'interior-painting', category: 'painting', emoji: '🎨', name: 'Interior Painting' },
];

const POPULAR_QUERIES = ['AC Service', 'Home Cleaning', 'Electrician', 'Plumbing', "Men's Haircut", 'Pest Control'];

export default function Home() {
  const [search, setSearch] = useState('');
  const { city, citySlug, setSelectedCity } = useCity();
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: popularData, isLoading: isLoadingPopular } = usePopularServices(city || 'Mumbai');
  const dynamicPopularServices = popularData?.data || [];

  // Debounce search input
  // ...
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data: searchData, isLoading: isLoadingSearch } = useSearch(debouncedSearch, city || 'Mumbai');
  const dynamicSuggestions = searchData?.data?.services || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(search.trim())}&city=${encodeURIComponent(city || 'Mumbai')}`);
    }
  };

  const handleSuggestionClick = (svc: any) => {
    setShowDropdown(false);
    router.push(`/${(city || 'Mumbai').toLowerCase()}/${svc.category?.id || 'service'}/${svc.id}`);
  };

  const handlePopularClick = (query: string) => {
    setSearch(query);
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city || 'Mumbai')}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section - Removed overflow-hidden to allow dropdown to show */}
      <section className="relative bg-black text-white pt-16 pb-24 px-4 overflow-visible">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070')] bg-cover bg-center pointer-events-none" />
        <div className="container mx-auto relative z-20 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
            Quality home services,<br className="hidden sm:block" /> on demand
          </h1>
          <p className="text-base md:text-xl mb-8 md:mb-10 text-gray-300 px-2">
            Experienced, hand-picked professionals to serve you at your doorstep.
          </p>

          {/* Search Bar - High Z-index */}
          <div ref={wrapperRef} className="relative max-w-2xl mx-auto z-50">
            <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 text-black shadow-xl">
              {/* City selector - No redirect here */}
              <div className="flex items-center sm:border-r border-gray-200 w-full sm:w-auto">
                <CitySelect 
                  variant="searchbar" 
                  shouldRedirect={false}
                  onSelect={(val) => { if (val) setSelectedCity(val); }} 
                />
              </div>

              {/* Search input */}
              <div className="flex items-center flex-1 px-3 py-2">
                <Search className="w-5 h-5 text-gray-500 shrink-0 mr-2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search for a service..."
                  className="w-full bg-transparent border-none outline-none text-sm"
                  autoComplete="off"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => { setSearch(''); setShowDropdown(true); }}
                    className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Button type="submit" className="w-full sm:w-auto px-6 rounded-lg">
                Search
              </Button>
            </form>

            {/* Dropdown suggestions */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 text-black overflow-hidden z-50">
                {isLoadingSearch ? (
                  <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
                ) : dynamicSuggestions.length > 0 ? (
                  <>
                    <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Suggestions
                    </div>
                    {dynamicSuggestions.map((svc: any) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => handleSuggestionClick(svc)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left"
                      >
                        <span className="text-xl shrink-0">{svc.category?.image_url || '🛠️'}</span>
                        <span className="text-sm font-medium text-gray-800">{svc.name}</span>
                        <span className="ml-auto text-xs text-primary font-medium hidden sm:block">Book now →</span>
                      </button>
                    ))}
                    <div className="px-4 py-2 border-t">
                      <button
                        type="button"
                        onClick={handleSearch as any}
                        className="w-full text-sm text-primary font-semibold hover:underline text-center py-1"
                      >
                        See all results for "{search}" →
                      </button>
                    </div>
                  </>
                ) : search.length >= 2 ? (
                   <div className="px-4 py-3 text-sm text-muted-foreground italic">No services found for "{search}"</div>
                ) : (
                  <div className="px-4 py-3">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_QUERIES.map(q => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handlePopularClick(q)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-primary/10 hover:text-primary rounded-full text-xs font-medium transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick city pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CITIES_QUICK.slice(0, 6).map(c => (
              <Link key={c} href={`/${c.toLowerCase()}`}>
                <span className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full px-3 py-1.5 cursor-pointer transition-colors">
                  {c}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative py-14 md:py-20 overflow-hidden bg-[#111]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center mb-10 md:mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] px-5 py-1.5 rounded-full text-amber-400 bg-amber-400/10 border border-amber-400/20">
              Why 2M+ customers trust us
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[
              { icon: '✅', stat: '100%', title: 'Quality Assured', desc: "If you don't love our service, we'll make it right." },
              { icon: '⭐', stat: '4.9★', title: 'Top Rated Pros', desc: 'Only the best professionals in the city.' },
              { icon: '🕒', stat: '98%', title: 'On-Time Delivery', desc: 'We respect your time. Punctuality guaranteed.' },
              { icon: '💰', stat: '₹0', title: 'Transparent Pricing', desc: 'No hidden charges. You pay what you see.' },
            ].map((b) => (
              <div key={b.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-7 hover:border-amber-400/30 transition-all">
                <div className="text-2xl mb-4 text-amber-400">{b.icon}</div>
                <div className="text-2xl font-black mb-1.5 text-amber-500">{b.stat}</div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{b.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed hidden sm:block">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Services */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What are you looking for?</h2>
          <CategoriesGrid />

          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold">Most Booked Services</h3>
              <Link href={`/${citySlug || 'mumbai'}`} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {isLoadingPopular ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                ))
              ) : dynamicPopularServices.length > 0 ? (
                dynamicPopularServices.map((svc: any) => (
                  <Link key={svc.id} href={`/${citySlug || 'mumbai'}/${svc.category?.id || 'service'}/${svc.id}`}>
                    <div className="bg-white border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group h-full">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl shrink-0">{svc.category?.image_url || '🛠️'}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm md:text-base">{svc.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2">{svc.description}</p>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 fill-green-600 text-green-600" /> 4.8
                              </span>
                            </div>
                            <div className="text-primary font-bold text-sm">₹{svc.packages?.[0]?.price || 0} onwards</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-muted-foreground italic">No popular services found for this city.</div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* How it works */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 md:mb-20">How it works</h2>
          <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-16 max-w-5xl mx-auto">
            {[
              { num: 1, title: 'Choose a Service', desc: 'Select from our wide range of premium home services.' },
              { num: 2, title: 'Pick a Time', desc: 'Schedule a time that works best for your busy schedule.' },
              { num: 3, title: 'Job Done!', desc: 'Our certified professional arrives and completes the job with a smile.' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-2xl font-bold text-primary transform rotate-3 hover:rotate-0 transition-transform">
                  {step.num}
                </div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Banner */}
      <section className="py-20 bg-black text-white text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070')] bg-cover bg-center" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Experience UrbanService on Mobile</h2>
          <p className="text-gray-400 mb-10 text-lg md:text-xl max-w-2xl mx-auto">Book faster, track your professional in real-time, and get exclusive app-only deals.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-14 px-8 rounded-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🍎</span>
              <div className="text-left leading-none">
                <div className="text-[10px] uppercase font-bold opacity-60">Download on the</div>
                <div className="text-lg">App Store</div>
              </div>
            </Button>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-14 px-8 rounded-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div className="text-left leading-none">
                <div className="text-[10px] uppercase font-bold opacity-60">Get it on</div>
                <div className="text-lg">Google Play</div>
              </div>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
