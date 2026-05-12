'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  HelpCircle, Search, MessageSquare, Phone, 
  ChevronRight, ArrowLeft, ShieldCheck, Mail 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

const FAQS = [
  { q: 'How do I book a service?', a: 'Browse services, select your city, choose a slot, and confirm. You\'ll receive instant confirmation via SMS & email.' },
  { q: 'Are the professionals verified?', a: 'Yes! Every professional undergoes background verification, skill testing, and ID checks before joining our platform.' },
  { q: 'Can I reschedule or cancel a booking?', a: 'Yes. You can reschedule or cancel for free up to 2 hours before the scheduled time from My Bookings.' },
  { q: 'What if I\'m not satisfied with the service?', a: 'We offer a 100% satisfaction guarantee. Raise a complaint within 48 hours and we\'ll resolve or re-do the service.' },
  { q: 'How do I become a partner?', a: 'Click "Become a Partner" in the footer or visit /partner to register and start earning.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on completion.' },
];

function HelpCenterContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Link href="/orders" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Bookings
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-6">How can we <span className="text-primary">help?</span></h1>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Search for help..."
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* FAQs */}
            <div className="lg:col-span-2 space-y-8">
              {bookingId && (
                <div className="bg-primary/5 border-2 border-primary/10 p-6 rounded-3xl mb-12 flex items-start gap-4">
                  <div className="bg-primary text-white p-2 rounded-xl">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Support for Booking #{bookingId.split('-')[0]}</h3>
                    <p className="text-sm text-muted-foreground mt-1">We've prioritized your request. How can we help with this specific booking?</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="font-bold">Reschedule</Button>
                      <Button size="sm" variant="outline" className="font-bold">Cancel Booking</Button>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-3xl font-black mb-8">Popular Questions</h2>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <details key={i} className="group border rounded-2xl overflow-hidden transition-all hover:border-primary/30">
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-bold list-none">
                      {faq.q}
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 text-slate-400" />
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Support Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-8 rounded-[2.5rem] border">
                <h3 className="text-xl font-black mb-6">Contact Support</h3>
                <div className="space-y-4">
                  <a href="#" className="flex items-center p-4 bg-white rounded-2xl border hover:border-primary transition-all group">
                    <MessageSquare className="w-5 h-5 mr-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">Chat with us</p>
                      <p className="text-xs text-muted-foreground">Response in 2 mins</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </a>
                  <a href="#" className="flex items-center p-4 bg-white rounded-2xl border hover:border-primary transition-all group">
                    <Phone className="w-5 h-5 mr-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">Call us</p>
                      <p className="text-xs text-muted-foreground">9am - 8pm IST</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </a>
                  <a href="#" className="flex items-center p-4 bg-white rounded-2xl border hover:border-primary transition-all group">
                    <Mail className="w-5 h-5 mr-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">Email Support</p>
                      <p className="text-xs text-muted-foreground">help@urbanservice.com</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden">
                <ShieldCheck className="w-12 h-12 text-primary/40 absolute -right-2 -bottom-2" />
                <h4 className="font-bold mb-2">UC Trust Guarantee</h4>
                <p className="text-sm text-slate-400">Every service is covered by our insurance and quality promise.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default function HelpCenterPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold">Loading...</div>}>
      <HelpCenterContent />
    </Suspense>
  );
}
