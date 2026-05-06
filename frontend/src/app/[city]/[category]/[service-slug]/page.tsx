import { Star, Clock, CheckCircle2, ChevronRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ServicePage({ params }: { params: Promise<{ 'service-slug': string, city: string, category: string }> }) {
  const resolvedParams = await params;
  const serviceName = resolvedParams['service-slug'].replace(/-/g, ' ');
  const city = resolvedParams.city;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const packages = [
    { name: 'Basic', price: 499, duration: 45, features: ['Standard cleaning', 'Dusting', 'Mopping'] },
    { name: 'Standard', price: 899, duration: 90, features: ['Deep cleaning', 'Dusting', 'Mopping', 'Bathroom washing', 'Window cleaning'], popular: true },
    { name: 'Premium', price: 1499, duration: 150, features: ['Full home deep cleaning', 'Sanitization', 'Pest control check', 'Sofa dry cleaning'] },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-muted-foreground flex-wrap gap-1">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${city}`} className="hover:text-black capitalize">{cityName}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="capitalize font-medium text-black">{serviceName}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Header section */}
            <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border">
              <h1 className="text-2xl md:text-4xl font-bold capitalize mb-3 md:mb-4">{serviceName}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                <div className="flex items-center text-green-600 font-semibold bg-green-50 px-2 py-1 rounded text-sm">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  4.8 <span className="text-muted-foreground font-normal ml-1">(12k reviews)</span>
                </div>
                <div className="text-muted-foreground flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-1" /> Takes ~90 mins
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Professional {serviceName} services performed by highly trained experts.
                We use industry-grade equipment and 100% safe chemicals to ensure the best results for your home.
              </p>
            </div>

            {/* Image Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden aspect-video relative flex items-center justify-center">
              <div className="absolute inset-0 bg-black/5" />
              <div className="text-muted-foreground flex flex-col items-center">
                <span className="text-4xl mb-2">📸</span>
                <span className="text-sm">Service Image Showcase</span>
              </div>
            </div>

            {/* Packages */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Select a Package</h2>
              <div className="space-y-4">
                {packages.map((pkg, idx) => (
                  <div key={idx} className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm border relative ${pkg.popular ? 'border-primary ring-1 ring-primary' : ''}`}>
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold">{pkg.name} Package</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="w-4 h-4 mr-1" /> {pkg.duration} mins
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl md:text-2xl font-bold">₹{pkg.price}</div>
                      </div>
                    </div>
                    <div className="border-t pt-3 md:pt-4 mt-3 md:mt-4">
                      <h4 className="font-semibold text-sm mb-2 md:mb-3">What's included:</h4>
                      <ul className="space-y-1.5 md:space-y-2">
                        {pkg.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Mobile Book Button */}
                    <div className="mt-4 lg:hidden">
                      <Link href="/booking">
                        <Button className="w-full">Book {pkg.name} — ₹{pkg.price}</Button>
                      </Link>
                    </div>
                  </div>
                ))}
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
              <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Standard Package</span><span className="font-medium text-black">₹899</span></div>
                <div className="flex justify-between"><span>Taxes & Fee</span><span className="font-medium text-black">₹45</span></div>
                <div className="flex justify-between border-t pt-3 font-bold text-lg text-black"><span>Total</span><span>₹944</span></div>
              </div>
              <Link href="/booking" className="block w-full">
                <Button className="w-full text-lg h-12" size="lg">Book Now</Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground mt-4">You won't be charged yet.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex items-center justify-between lg:hidden z-40">
        <div>
          <div className="text-lg font-bold">₹944</div>
          <div className="text-xs text-muted-foreground">Standard Package · incl. taxes</div>
        </div>
        <Link href="/booking">
          <Button size="lg" className="px-8">Book Now</Button>
        </Link>
      </div>
    </div>
  );
}
