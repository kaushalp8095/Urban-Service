'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, Clock, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCreateBooking, useService } from '@/lib/api/hooks';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const packageId = searchParams.get('packageId');

  const [step, setStep] = useState(1);
  const [date, setDate] = useState('2026-05-08');
  const [time, setTime] = useState('09:00 AM');
  
  // Address form state
  const [address, setAddress] = useState({
    line1: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: ''
  });

  const { data: serviceData, isLoading: isLoadingService } = useService(serviceId as string);
  const service = serviceData?.data;
  const selectedPackage = service?.packages?.find((p: any) => p.id === packageId);

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
      await createBookingMutation.mutateAsync({
        package_id: packageId as string,
        slot_datetime: `${date}T${time.split(' ')[0]}:00.000Z`, 
        address: address
      });
      nextStep();
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  if (!serviceId || !packageId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Invalid Booking Link</h2>
        <p className="text-muted-foreground mb-6">Please select a service and package first.</p>
        <Button onClick={() => router.push('/')}>Go to Home</Button>
      </div>
    );
  }

  if (isLoadingService) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Package Not Found</h2>
        <p className="text-muted-foreground mb-6">The package you selected is no longer available.</p>
        <Button onClick={() => router.push('/')}>Go to Home</Button>
      </div>
    );
  }

  const taxAmount = Math.round(selectedPackage.price * 0.05);
  const totalAmount = selectedPackage.price + taxAmount;

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
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">House/Flat No. & Building Name</label>
                  <input
                    type="text"
                    required
                    value={address.line1}
                    onChange={(e) => setAddress({...address, line1: e.target.value})}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary text-sm"
                    placeholder="e.g. Flat 402, Sunshine Apartments"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={address.pinCode}
                      onChange={(e) => setAddress({...address, pinCode: e.target.value.replace(/\D/g, '')})}
                      maxLength={6}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary text-sm"
                      placeholder="e.g. 400053"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button 
                  onClick={nextStep} 
                  size="lg"
                  disabled={!address.line1 || !address.pinCode}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold mb-6">Payment Summary</h2>
              
              {createBookingMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Failed to create booking. Make sure you are logged in.
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6 mb-8 border">
                <h3 className="font-semibold mb-4 border-b pb-2">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>{service?.name} - {selectedPackage.name}</span>
                    <span className="font-medium">₹{selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes & Fee</span>
                    <span>₹{taxAmount}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
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
                  {createBookingMutation.isPending ? 'Processing...' : `Pay ₹${totalAmount} & Book`}
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
                Your booking ID is <span className="font-bold text-black">#{createBookingMutation.data?.data?.id?.split('-')[0].toUpperCase()}</span>.<br/>
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

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <BookingContent />
    </Suspense>
  );
}
