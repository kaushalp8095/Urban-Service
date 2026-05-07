'use client';

import { Star, Clock, CheckCircle2, ChevronRight, Shield, Loader2, AlertCircle, ShoppingCart, Info, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, use, useEffect } from 'react';
import { useService } from '@/lib/api/hooks';
import { useRouter } from 'next/navigation';

export default function ServicePage({ params }: { params: Promise<{ 'service-slug': string, city: string, category: string }> }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams['service-slug'];
  const city = resolvedParams.city;
  const categoryId = resolvedParams.category;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const router = useRouter();

  const { data, isLoading, isError } = useService(serviceId);
  const service = data?.data;
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    if (service?.packages?.length > 0 && !selectedPackage) {
      setSelectedPackage(service.packages[0]);
    }
  }, [service]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
            <p className="font-bold text-gray-500 tracking-widest animate-pulse">PREPARING PLANS...</p>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Service unreachable</h1>
        <p className="text-gray-500 mb-8 max-w-sm">We couldn't find the details for this service. It might be temporarily unavailable in your area.</p>
        <Button onClick={() => router.push('/')} className="bg-black text-white px-8 h-12 rounded-xl">Back to Home</Button>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!selectedPackage) return;
    router.push(`/booking?serviceId=${service.id}&packageId=${selectedPackage.id}`);
  };

  const taxAmount = selectedPackage ? Math.round(selectedPackage.price * 0.05) : 0;
  const totalAmount = selectedPackage ? selectedPackage.price + taxAmount : 0;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24">
      {/* Breadcrumb & Top Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest gap-1 overflow-hidden whitespace-nowrap">
                <Link href="/" className="hover:text-black">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${city}`} className="hover:text-black">{cityName}</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${city}/${categoryId}`} className="hover:text-black truncate">Category</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-black truncate">{service.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-600" /> Fully Insured
                </span>
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500" /> Top Rated
                </span>
            </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b pt-10 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Best Seller</span>
                        <div className="flex items-center text-green-700 font-bold text-sm">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            4.8 <span className="text-gray-400 font-medium ml-2">(14,200+ Reviews)</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight capitalize">{service.name}</h1>
                    <p className="text-lg text-gray-500 leading-relaxed font-medium">
                        {service.description || `Experience premium ${service.name.toLowerCase()} with our background-verified experts. We provide hospital-grade sanitization and professional equipment for the best results.`}
                    </p>
                </div>
                <div className="hidden md:block">
                     <div className="w-48 h-48 bg-gray-100 rounded-[3rem] flex items-center justify-center text-6xl shadow-inner animate-pulse">
                        ✨
                     </div>
                </div>
            </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Package Selection */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-black text-gray-900">Choose Your Plan</h2>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {service.packages?.map((pkg: any) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  const inclusions = pkg.inclusions_json ? JSON.parse(pkg.inclusions_json) : [];

                  return (
                    <div 
                      key={pkg.id} 
                      onClick={() => setSelectedPackage(pkg)}
                      className={`group bg-white p-8 rounded-[2rem] border-2 transition-all duration-300 relative cursor-pointer shadow-sm ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/10 bg-amber-50/10 shadow-xl' : 'border-white hover:border-gray-200 hover:shadow-lg'}`}
                    >
                      {isSelected && (
                         <div className="absolute -top-3 left-8 bg-amber-400 text-black text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-lg">
                            Selected Plan
                         </div>
                      )}
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">{pkg.name}</h3>
                          <div className="flex items-center gap-4 text-gray-400 text-sm font-bold mt-2">
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {pkg.duration_min} mins</span>
                            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Safety Guaranteed</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-6 pt-6 border-t border-gray-50">
                            {inclusions.map((feature: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-start text-sm text-gray-600 font-medium list-none">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mr-3 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-3 min-w-[120px]">
                          <div className="text-3xl font-black text-gray-900">₹{pkg.price}</div>
                          {!isSelected && (
                             <Button variant="outline" className="rounded-xl border-gray-200 font-bold group-hover:bg-black group-hover:text-white transition-all">
                                Select Plan
                             </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why Us Section */}
            <div className="bg-black rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                        <Award className="text-amber-400 w-8 h-8" /> The UC Standard
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-medium">
                        Join 20 million+ happy customers. Our partners follow a strict 10-step hygiene protocol and use only high-end products.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                        <p className="text-2xl font-black text-amber-400">100%</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Safe Chemicals</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                        <p className="text-2xl font-black text-amber-400">4.8★</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Customer Rating</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Right: Sticky Checkout */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] border shadow-2xl p-8 sticky top-24 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />
              
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center justify-between">
                Booking Summary <ShoppingCart className="w-5 h-5 text-gray-400" />
              </h3>

              {selectedPackage ? (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Selected Package</p>
                    <p className="font-black text-lg text-gray-900">{selectedPackage.name}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedPackage.duration_min} mins session</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-gray-500">
                      <span>Base Price</span>
                      <span>₹{selectedPackage.price}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-500">
                      <span>Taxes & Processing</span>
                      <span className="text-green-600">₹{taxAmount}</span>
                    </div>
                    <div className="h-px bg-dashed bg-gray-200 my-4" />
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-black text-gray-900">Total Payable</span>
                      <span className="text-3xl font-black text-black">₹{totalAmount}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBookNow} 
                    className="w-full h-16 rounded-2xl text-xl font-black bg-black hover:bg-gray-800 text-white shadow-xl shadow-black/10 flex items-center justify-center gap-3 group-hover:scale-[1.02] transition-transform"
                  >
                    Continue to Book <ChevronRight className="w-5 h-5" />
                  </Button>
                  
                  <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-green-800 font-bold leading-relaxed">
                        Free cancellation until 4 hours before the service. 
                        No charges will be deducted right now.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      ✨
                   </div>
                   <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Please Select a Plan</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Fixed Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t shadow-[0_-10px_20px_rgba(0,0,0,0.05)] p-5 flex items-center justify-between lg:hidden z-50 rounded-t-[2rem]">
        <div className="flex flex-col">
          {selectedPackage ? (
            <>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pay</span>
              <div className="text-2xl font-black text-gray-900">₹{totalAmount}</div>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-400">Select Plan</span>
          )}
        </div>
        <Button 
            size="lg" 
            className="h-14 px-10 rounded-2xl bg-black text-white font-black text-lg shadow-lg shadow-black/10" 
            onClick={handleBookNow} 
            disabled={!selectedPackage}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
