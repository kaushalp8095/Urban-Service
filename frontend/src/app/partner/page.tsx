'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, Users, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePartnerRegister, useCategories } from '@/lib/api/hooks';
import { useRouter } from 'next/navigation';

export default function PartnerLandingPage() {
  const router = useRouter();
  const { data: categoriesData } = useCategories();
  const registerMutation = usePartnerRegister();
  
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleRegister = async () => {
    if (selectedCats.length === 0) {
      alert('Please select at least one category');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await registerMutation.mutateAsync({ category_ids: selectedCats });
      router.push('/partner/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-black text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Be your own boss.<br/>
            <span className="text-amber-400">Earn more with UrbanService.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Join 50,000+ service professionals across India. Get consistent jobs, fair payouts, and 24/7 support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-14 px-10 text-lg" onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Join as a Partner
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black h-14 px-10 text-lg">
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">High Earnings</h3>
              <p className="text-muted-foreground">Our top partners earn over ₹35,000 every month with timely payouts.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Health Insurance</h3>
              <p className="text-muted-foreground">Get comprehensive insurance cover for you and your family.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">UC Premium Jobs</h3>
              <p className="text-muted-foreground">Direct access to high-value customers without any marketing spend.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="register-form" className="py-24 border-t">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-8 md:p-12 rounded-3xl border shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center">Ready to get started?</h2>
            <p className="text-muted-foreground text-center mb-10">Select the services you provide to begin your application.</p>
            
            <div className="space-y-8">
              <div>
                <label className="block font-bold mb-4 text-lg">Which services do you provide?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoriesData?.data?.map((cat: any) => (
                    <div 
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center text-sm font-semibold flex flex-col items-center justify-center gap-2 ${selectedCats.includes(cat.id) ? 'border-amber-500 bg-amber-50 text-amber-900' : 'hover:border-gray-300'}`}
                    >
                      {selectedCats.includes(cat.id) && <CheckCircle className="w-4 h-4 text-amber-600 absolute top-2 right-2" />}
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 flex items-center mb-2">
                  <Shield className="w-5 h-5 mr-2" /> Verification Process
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  After registration, our team will call you for KYC verification. Please keep your Aadhar and Bank details ready.
                </p>
              </div>

              <Button 
                onClick={handleRegister}
                disabled={isSubmitting || selectedCats.length === 0}
                className="w-full h-14 text-lg font-bold bg-black hover:bg-gray-800 text-white rounded-xl"
              >
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Registering...</> : 'Complete Registration'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
