'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Clock, ChevronRight, CheckCircle2, Shield, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServicesByCategory, useCategories } from '@/lib/api/hooks';

export default function CategoryPage({ params }: { params: Promise<{ city: string; category: string }> }) {
  const resolvedParams = use(params);
  const { city, category: categoryId } = resolvedParams;
  
  const { data: servicesResponse, isLoading: isLoadingServices, isError } = useServicesByCategory(categoryId);
  const { data: categoriesResponse } = useCategories();
  
  const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');
  const services = servicesResponse?.data || [];
  
  // Find category meta from fetched categories — match by UUID or by slug (name-derived)
  const slugToName = (slug: string) => slug.replace(/-/g, ' ').toLowerCase();
  const category = categoriesResponse?.data?.find(
    (c: any) => c.id === categoryId || slugToName(c.name) === slugToName(categoryId)
  ) ||
  // Fallback: use the first service's category if available
  (services[0]?.category) ||
  { name: categoryId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), image_url: '✨' };

  if (isLoadingServices) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
          <p className="text-gray-500 font-medium animate-pulse">Finding best services for you...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Could not load services</h2>
        <p className="text-muted-foreground mt-2 mb-6">Please check your connection or try again later.</p>
        <div className="flex gap-3">
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      {/* Dynamic Header */}
      <section className="relative pt-20 pb-28 bg-[#0a0a0a] text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-amber-400/80 text-sm font-bold uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{cityName}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">{category.image_url}</span>
                <h1 className="text-4xl md:text-6xl font-black">{category.name}</h1>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                Premium {category.name.toLowerCase()} solutions in {cityName}. Verified experts, upfront pricing, and guaranteed satisfaction.
              </p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">4.8/5</span>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Platform Rating</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-1 text-green-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">{services.length}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Live Services</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        {services.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border shadow-xl max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🏘️</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Expanding to {cityName} Soon!</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">We haven't launched {category.name} in this location yet. Be the first to know when we arrive.</p>
            <Button className="bg-black text-white px-8 h-12 rounded-xl font-bold">Notify Me</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc: any) => (
              <div key={svc.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-50 group-hover:scale-110 transition-all duration-500">
                      {category.image_url}
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-current" /> 4.8
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">{svc.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {svc.description || `Professional ${svc.name.toLowerCase()} service with top-rated experts and quality guarantee.`}
                  </p>
                  
                  <div className="space-y-3">
                    {svc.packages?.[0]?.inclusions_json && JSON.parse(svc.packages[0].inclusions_json).slice(0, 3).map((item: string) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                    <p className="text-2xl font-black text-gray-900">₹{svc.packages?.[0]?.price || '---'}</p>
                  </div>
                  <Link href={`/${city}/${categoryId}/${svc.id}`}>
                    <Button className="bg-black hover:bg-gray-800 text-white rounded-2xl px-6 h-12 font-bold shadow-lg shadow-black/10">
                      View Plans
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Section */}
      <section className="container mx-auto px-4 mt-24">
          <div className="bg-[#111111] rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-600/10 to-transparent" />
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Why Choose <span className="text-amber-400">UrbanService</span>?</h2>
                    <div className="space-y-6">
                        <div className="flex gap-5">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">🛡️</div>
                            <div>
                                <h4 className="font-bold text-xl mb-1">Service Guarantee</h4>
                                <p className="text-gray-400 text-sm">Every booking is covered under our quality protection plan.</p>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">🤝</div>
                            <div>
                                <h4 className="font-bold text-xl mb-1">Expert Partners</h4>
                                <p className="text-gray-400 text-sm">Background verified and top-rated professionals only.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-xl">
                    <p className="text-amber-400 font-bold mb-4">MEMBER BENEFIT</p>
                    <h3 className="text-2xl font-black mb-4">Get Flat 10% OFF on your first booking!</h3>
                    <p className="text-gray-400 mb-8">Join the thousands of happy customers in {cityName} who trust us for their home services.</p>
                    <Button className="bg-amber-400 hover:bg-amber-500 text-black font-black w-full h-14 rounded-2xl text-lg">Claim Offer Now</Button>
                </div>
             </div>
          </div>
      </section>
    </div>
  );
}
