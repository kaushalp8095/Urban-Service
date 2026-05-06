'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSendOtp, useVerifyOtp } from '@/lib/api/hooks';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    try {
      await sendOtpMutation.mutateAsync({ phone, role: 'CUSTOMER' });
      setStep('OTP');
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;

    try {
      const res = await verifyOtpMutation.mutateAsync({ phone, otp, role: 'CUSTOMER', name: name || undefined });
      
      const token = res.data?.token || res.token;
      const user = res.data?.user || res.user;

      localStorage.setItem('token', token);
      if (user) {
        if (user.phone) localStorage.setItem('userPhone', user.phone);
        if (user.name) localStorage.setItem('userName', user.name);
      }
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login or Sign Up
        </h1>

        {sendOtpMutation.isError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            Failed to send OTP. Please try again.
          </div>
        )}

        {verifyOtpMutation.isError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            Invalid OTP. Please try again.
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Enter 10 digit number"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={phone.length < 10 || sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? 'Sending...' : 'Continue'}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from UrbanService and its affiliates.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">OTP sent to +91 {phone}</span>
              <button 
                type="button" 
                onClick={() => setStep('PHONE')} 
                className="text-xs text-primary font-bold hover:underline"
              >
                Edit
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name (New Users Only)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="John Doe"
              />
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Leave blank if you already have an account.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm text-center tracking-widest text-lg"
                placeholder="0000"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Hint: Check backend console for mock OTP
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={otp.length < 4 || verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify & Proceed'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
