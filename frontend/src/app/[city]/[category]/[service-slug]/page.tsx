'use client';

import { Star, Clock, CheckCircle2, ChevronRight, Shield, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, use, useEffect } from 'react';
import { useService } from '@/lib/api/hooks';
import { useRouter } from 'next/navigation';

export default function ServicePage({ params }: { params: Promise<{ 'service-slug': string, city: string, category: string }> }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams['service-slug'];
  const city = resolvedParams.city;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const router = useRouter();

  const { data, isLoading, isError } = useService(serviceId);
  const service = data?.data;
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // Auto-select first popular package or just the first package
  useEffect(() => {
    if (service?.packages?.length > 0 && !selectedPackage) {
      setSelectedPackage(service.packages[0]);
    }
  }, [service]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Service not found</h1>
        <p className="text-muted-foreground mb-6">The service you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push('/')}>Back to Home</Button>
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
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-muted-foreground flex-wrap gap-1">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${city}`} className="hover:text-black capitalize">{cityName}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="capitalize font-medium text-black">{service.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Header section */}
            <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border">
              <h1 className="text-2xl md:text-4xl font-bold capitalize mb-3 md:mb-4">{service.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                <div className="flex items-center text-green-600 font-semibold bg-green-50 px-2 py-1 rounded text-sm">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  4.8 <span className="text-muted-foreground font-normal ml-1">(12k reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {service.description || `Professional ${service.name} services performed by highly trained experts. We use industry-grade equipment and 100% safe chemicals to ensure the best results for your home.`}
              </p>
            </div>

            {/* Packages */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Select a Package</h2>
              <div className="space-y-4">
                {service.packages?.map((pkg: any) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  const inclusions = pkg.inclusions_json ? JSON.parse(pkg.inclusions_json) : [];

                  return (
                    <div 
                      key={pkg.id} 
                      onClick={() => setSelectedPackage(pkg)}
                      className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm border relative cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary bg-blue-50/10' : 'hover:border-gray-300'}`}
                    >
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg md:text-xl font-bold">{pkg.name}</h3>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="w-4 h-4 mr-1" /> {pkg.duration_min} mins
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl md:text-2xl font-bold">₹{pkg.price}</div>
                        </div>
                      </div>
                      
                      {inclusions.length > 0 && (
                        <div className="border-t pt-3 md:pt-4 mt-3 md:mt-4">
                          <h4 className="font-semibold text-sm mb-2 md:mb-3">What's included:</h4>
                          <ul className="space-y-1.5 md:space-y-2">
                            {inclusions.map((feature: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-start text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                                <span className="capitalize">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Mobile Select Button */}
                      <div className="mt-4 lg:hidden">
                        <Button 
                          className="w-full" 
                          variant={isSelected ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPackage(pkg);
                          }}
                        >
                          {isSelected ? 'Selected' : `Select ${pkg.name}`}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar — Desktop only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border sticky top-24">
              <h3 className="text-xl font-bold mb-4">Book this service</h3>
              <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium">
                <span><Shield className="w-4 h-4 inline mr-1 mb-0.5" /> UC Guarantee</span>
                <span>Included</span>
              </div>
              
              {selectedPackage ? (
                <>
                  <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                    <div className="flex justify-between"><span>{selectedPackage.name}</span><span className="font-medium text-black">₹{selectedPackage.price}</span></div>
                    <div className="flex justify-between"><span>Taxes & Fee</span><span className="font-medium text-black">₹{taxAmount}</span></div>
                    <div className="flex justify-between border-t pt-3 font-bold text-lg text-black"><span>Total</span><span>₹{totalAmount}</span></div>
                  </div>
                  <Button onClick={handleBookNow} className="w-full text-lg h-12" size="lg">Book Now</Button>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Please select a package to continue
                </div>
              )}
              
              <p className="text-xs text-center text-muted-foreground mt-4">You won't be charged yet.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex items-center justify-between lg:hidden z-40">
        <div>
          {selectedPackage ? (
            <>
              <div className="text-lg font-bold">₹{totalAmount}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[150px]">{selectedPackage.name} · incl. taxes</div>
            </>
          ) : (
            <div className="text-sm font-medium text-muted-foreground mt-2">Select a package</div>
          )}
        </div>
        <Button size="lg" className="px-8" onClick={handleBookNow} disabled={!selectedPackage}>
          Book Now
        </Button>
      </div>
    </div>
  );
}
