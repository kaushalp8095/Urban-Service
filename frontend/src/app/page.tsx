'use client';
// Build trigger: 2026-05-07 10:11

import Link from 'next/link';
import { Search, Star, Shield, Clock, MapPin, ChevronRight, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoriesGrid } from '@/components/home/categories-grid';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/lib/api/hooks';

const CITIES_QUICK = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Jaipur'];

const POPULAR_SERVICES_HOME = [
  { id: 'ac-service-cleaning', category: 'ac-service', emoji: '❄️', name: 'AC Service & Cleaning', desc: 'Deep cleaning of filters, coils and drain pipe for optimal performance.', rating: 4.7, reviews: '14.3k reviews', price: 349 },
  { id: 'full-home-cleaning', category: 'home-cleaning', emoji: '🧹', name: 'Full Home Deep Clean', desc: 'End-to-end professional cleaning of your entire home.', rating: 4.9, reviews: '22.1k reviews', price: 1199 },
  { id: 'bathroom-cleaning', category: 'home-cleaning', emoji: '🚿', name: 'Bathroom Deep Clean', desc: 'Scrubbing of tiles, toilet, sink and all fixtures.', rating: 4.7, reviews: '18.4k reviews', price: 299 },
  { id: 'haircut-beard-combo', category: 'mens-haircut', emoji: '✂️', name: 'Haircut + Beard Combo', desc: "Complete men's grooming package at home.", rating: 4.9, reviews: '21.5k reviews', price: 299 },
  { id: 'facial', category: 'salon-women', emoji: '💆', name: 'Gold / Diamond Facial', desc: 'Luxury facial for glowing skin. Cleansing, massage, pack & toner.', rating: 4.9, reviews: '11.2k reviews', price: 599 },
  { id: 'cockroach-control', category: 'pest-control', emoji: '🐛', name: 'Cockroach Control', desc: 'Gel-based treatment for complete cockroach elimination. 90-day warranty.', rating: 4.8, reviews: '11.2k reviews', price: 399 },
  { id: 'fan-installation', category: 'electrician', emoji: '⚡', name: 'Fan Installation', desc: 'Ceiling or wall fan mounting with wiring by certified electricians.', rating: 4.8, reviews: '21k reviews', price: 149 },
  { id: 'water-purifier-service', category: 'appliance-repair', emoji: '💧', name: 'RO / Water Purifier Service', desc: 'Annual service with filter replacement and water quality test.', rating: 4.8, reviews: '7.8k reviews', price: 299 },
  { id: 'sofa-dry-clean', category: 'sofa-cleaning', emoji: '🛋️', name: 'Sofa Dry Cleaning', desc: 'Professional dry cleaning for all sofa types. Stain removal included.', rating: 4.7, reviews: '7.2k reviews', price: 599 },
];

// Local static data for instant suggestions (no backend needed)
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
  const [city, setCity] = useState('Mumbai');
  const [citySlug, setCitySlug] = useState('mumbai');
  
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity') || 'Mumbai';
    setCity(savedCity);
    setCitySlug(savedCity.toLowerCase());
  }, []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search input
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

  // Static instant suggestions
  const staticSuggestions = debouncedSearch.length >= 1
    ? ALL_STATIC_SUGGESTIONS.filter(s =>
        s.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(search.trim())}&city=${encodeURIComponent(city)}`);
    }
  };

  const handleSuggestionClick = (svc: typeof ALL_STATIC_SUGGESTIONS[0]) => {
    setShowDropdown(false);
    router.push(`/${city.toLowerCase()}/${svc.category}/${svc.id}`);
  };

  const handlePopularClick = (query: string) => {
    setSearch(query);
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-black text-white pt-16 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070')] bg-cover bg-center" />
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
            Quality home services,<br className="hidden sm:block" /> on demand
          </h1>
          <p className="text-base md:text-xl mb-8 md:mb-10 text-gray-300 px-2">
            Experienced, hand-picked professionals to serve you at your doorstep.
          </p>

          {/* Search Bar */}
          <div ref={wrapperRef} className="relative max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 text-black shadow-xl">
              {/* City selector */}
              <div className="flex items-center px-3 py-2 sm:border-r border-gray-200 w-full sm:w-auto">
                <MapPin className="w-5 h-5 text-gray-500 shrink-0 mr-2" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium w-full sm:w-28 cursor-pointer"
                >
                  {CITIES_QUICK.map(c => <option key={c}>{c}</option>)}
                </select>
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

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 text-black overflow-hidden z-50">
                {staticSuggestions.length > 0 ? (
                  <>
                    <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Suggestions
                    </div>
                    {staticSuggestions.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => handleSuggestionClick(svc)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left"
                      >
                        <span className="text-xl shrink-0">{svc.emoji}</span>
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
                ) : (
                  /* Popular suggestions when no input */
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

      {/* Trust Badges — on-brand charcoal + gold */}
      <section
        className="relative py-14 md:py-20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #111111 0%, #1a1a1a 50%, #111111 100%)' }}
      >
        {/* Subtle warm ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 opacity-30 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #d4a843 0%, transparent 70%)' }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section pill */}
          <div className="flex justify-center mb-10 md:mb-14">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.22em] px-5 py-1.5 rounded-full text-amber-400"
              style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)' }}
            >
              Why 2M+ customers trust us
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                stat: '100%',
                title: 'Quality Assured',
                desc: "If you don't love our service, we'll make it right.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ),
                stat: '4.9★',
                title: 'Top Rated Pros',
                desc: 'Only the best professionals in the city.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                stat: '98%',
                title: 'On-Time Delivery',
                desc: 'We respect your time. Punctuality guaranteed.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                stat: '₹0',
                title: 'Transparent Pricing',
                desc: 'No hidden charges. You pay what you see.',
              },
            ].map((b) => (
              <div
                key={b.title}
                className="group relative rounded-2xl p-5 md:p-7 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-5px)';
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.borderColor = 'rgba(212,168,67,0.35)';
                  el.style.boxShadow = '0 16px 48px rgba(212,168,67,0.12)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.background = 'rgba(255,255,255,0.035)';
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-11 h-11 md:w-13 md:h-13 rounded-xl flex items-center justify-center mb-4 text-amber-400 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}
                >
                  {b.icon}
                </div>

                {/* Stat */}
                <div
                  className="text-2xl md:text-3xl font-black mb-1.5 tracking-tight"
                  style={{ color: '#d4a843' }}
                >
                  {b.stat}
                </div>

                <h3 className="font-semibold text-white text-sm md:text-[15px] mb-1.5">{b.title}</h3>
                <p className="text-xs md:text-sm leading-relaxed hidden sm:block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {b.desc}
                </p>

                {/* Gold bottom line reveal */}
                <div
                  className="absolute bottom-0 left-5 right-5 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: 'linear-gradient(90deg, transparent, #d4a843, transparent)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Services Grid */}

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What are you looking for?</h2>
          <CategoriesGrid />

          {/* Popular Services below categories */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold">Most Booked Services</h3>
              <Link href={`/${citySlug}`} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {POPULAR_SERVICES_HOME.map((svc) => (
                <Link key={svc.id} href={`/${citySlug}/${svc.category}/${svc.id}`}>
                  <div className="bg-white border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer h-full">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl shrink-0">{svc.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm md:text-base">{svc.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2">{svc.desc}</p>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                              <Star className="w-3 h-3 fill-green-600 text-green-600" /> {svc.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">{svc.reviews}</span>
                          </div>
                          <div className="text-primary font-bold text-sm">₹{svc.price} onwards</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-16">How it works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 max-w-4xl mx-auto">
            {[
              { num: 1, title: 'Choose a Service', desc: 'Select from our wide range of home services.' },
              { num: 2, title: 'Pick a Time', desc: 'Schedule a time that works best for you.' },
              { num: 3, title: 'Job Done!', desc: 'Our professional arrives and completes the job.' },
            ].map((step, i) => (
              <div key={step.num} className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-xl font-bold text-primary">
                  {step.num}
                </div>
                <h3 className="font-semibold text-base md:text-lg">{step.title}</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-[200px]">{step.desc}</p>
                {i < 2 && <ChevronRight className="hidden md:block w-8 h-8 text-gray-300 absolute" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Banner — on-brand charcoal + gold */}
      <section
        className="relative overflow-hidden py-16 md:py-24 px-4"
        style={{ background: 'linear-gradient(160deg, #0e0e0e 0%, #181818 50%, #0e0e0e 100%)' }}
      >
        {/* Ambient warm glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-48 opacity-25 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #d4a843 0%, transparent 70%)' }}
        />
        {/* Decorative rings */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-5 border border-amber-400 pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full opacity-5 border border-amber-400 pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full opacity-5 border border-amber-400 pointer-events-none" />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          {/* Pill label */}
          <div className="flex justify-center mb-6">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.22em] px-5 py-1.5 rounded-full text-amber-400"
              style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)' }}
            >
              Coming Soon
            </span>
          </div>

          {/* Phone icon row */}
          <div className="flex justify-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}
            >
              📱
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}
            >
              🤖
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-white tracking-tight">
            Get the{' '}
            <span style={{ color: '#d4a843' }}>UrbanService</span>{' '}App
          </h2>
          <p className="mb-10 text-base md:text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Book faster, track live, and unlock exclusive in-app deals.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* iOS — Gold outline */}
            <button
              className="group flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300"
              style={{
                border: '1.5px solid #d4a843',
                color: '#d4a843',
                background: 'rgba(212,168,67,0.06)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#d4a843';
                el.style.color = '#111';
                el.style.boxShadow = '0 8px 32px rgba(212,168,67,0.3)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(212,168,67,0.06)';
                el.style.color = '#d4a843';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span>
                <div className="text-[10px] opacity-70 text-left leading-none mb-0.5">Download on the</div>
                <div className="text-sm font-bold leading-none">App Store</div>
              </span>
            </button>

            {/* Android — Gold filled */}
            <button
              className="group flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300"
              style={{
                background: '#d4a843',
                color: '#111',
                border: '1.5px solid #d4a843',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#c49a35';
                el.style.boxShadow = '0 8px 32px rgba(212,168,67,0.4)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#d4a843';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M17.523 15.341 7.637 20.847a1.05 1.05 0 0 1-1.043-.02L16.48 10.94l1.043 4.401zM5.472 19.9a1.05 1.05 0 0 1-.472-.89V4.99c0-.367.196-.689.49-.873L15.54 12 5.472 19.9zm13.01-5.53-1.388-.74L15.79 11l1.304-2.628 1.388-.74c.619-.33.919-1.01.719-1.652L14.49 1.82a1.05 1.05 0 0 0-1.421.49L11.9 4.94 6.072 1.76a1.052 1.052 0 0 0-1.55.921v18.637c0 .408.228.768.573.944l5.801-3.14 1.18 2.64a1.05 1.05 0 0 0 1.42.488l4.71-4.138c.198-.642-.1-1.322-.719-1.651z" />
              </svg>
              <span>
                <div className="text-[10px] opacity-70 text-left leading-none mb-0.5">Get it on</div>
                <div className="text-sm font-bold leading-none">Google Play</div>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
