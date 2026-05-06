'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, Clock, CreditCard, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useCreateBooking } from '@/lib/api/hooks';

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('2026-05-08');
  const [time, setTime] = useState('09:00 AM');
  
  const createBookingMutation = useCreateBooking();

  const dates = ["Today, 6 May", "Tomorrow, 7 May", "Wed, 8 May", "Thu, 9 May"];
  const times = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

  const nextStep = () => setStep(s => Math.min(s + 1, 4));

  const handleBook = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to book a service. Redirecting to login...');
      router.push('/login');
      return;
    }

    try {
      // Hardcoded serviceId and packageId for demonstration
      await createBookingMutation.mutateAsync({
        serviceId: 'dummy-service-id',
        packageId: 'dummy-package-id',
        scheduledAt: `${date}T${time}`,
        address: {
          line1: 'Flat 402, Sunshine Apartments',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400053'
        }
      });
      nextStep();
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div className={`absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[
            { num: 1, label: "Slot", icon: Clock },
            { num: 2, label: "Address", icon: MapPin },
            { num: 3, label: "Payment", icon: CreditCard },
            { num: 4, label: "Done", icon: CheckCircle2 }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center bg-gray-50 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${step >= s.num ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-black' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border min-h-[400px]">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6">Select Date and Time</h2>
              
              <h3 className="font-semibold mb-3">Select Date</h3>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {dates.map((d, i) => (
                  <div key={i} className={`flex-shrink-0 border rounded-xl p-4 cursor-pointer text-center min-w-[120px] ${i === 0 ? 'border-primary ring-1 ring-primary bg-blue-50/50' : 'hover:border-gray-400'}`}>
                    <div className="font-semibold">{d.split(',')[0]}</div>
                    <div className="text-sm text-muted-foreground">{d.split(',')[1]}</div>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold mb-3 mt-6">Select Time</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {times.map((t, i) => (
                  <div key={i} className={`border rounded-lg py-3 text-center cursor-pointer text-sm font-medium ${i === 1 ? 'border-primary ring-1 ring-primary bg-blue-50/50 text-primary' : 'hover:border-gray-400'}`}>
                    {t}
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-end">
                <Button onClick={nextStep} size="lg">Continue to Address</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6">Service Address</h2>
              
              <div className="border rounded-xl p-6 mb-6 relative overflow-hidden bg-blue-50/30 border-primary/30">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">Selected</div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mt-1 mr-3 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Home</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Flat 402, Sunshine Apartments, Link Road, Andheri West, Mumbai, Maharashtra 400053
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full border-dashed border-2 py-8">
                + Add New Address
              </Button>

              <div className="mt-12 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={nextStep} size="lg">Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6">Payment Summary</h2>
              
              {createBookingMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Failed to create booking. Make sure backend is running and you are logged in.
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6 mb-8 border">
                <h3 className="font-semibold mb-4 border-b pb-2">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>AC Service - Standard Package</span>
                    <span className="font-medium">₹899</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes & Fee</span>
                    <span>₹45</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹944</span>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold mb-4">Pay Using</h3>
              <div className="space-y-3">
                {['UPI (GPay, PhonePe, Paytm)', 'Credit / Debit Card', 'Cash on Delivery'].map((method, i) => (
                  <div key={i} className="flex items-center border rounded-lg p-4 cursor-pointer hover:border-primary">
                    <input type="radio" name="payment" className="mr-4 w-4 h-4 text-primary" defaultChecked={i === 0} />
                    <span className="font-medium">{method}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  onClick={handleBook} 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={createBookingMutation.isPending}
                >
                  {createBookingMutation.isPending ? 'Processing...' : 'Pay ₹944 & Book'}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-8">
                Your booking ID is <span className="font-bold text-black">#UC-8842-192</span>.<br/>
                We have assigned a top-rated professional for your service.
              </p>
              
              <div className="flex justify-center space-x-4">
                <Link href="/orders">
                  <Button variant="outline">View Order Status</Button>
                </Link>
                <Link href="/">
                  <Button>Back to Home</Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
