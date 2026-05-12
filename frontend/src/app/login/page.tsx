'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { authApiClient } from '@/lib/api/axios';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Load reCAPTCHA on mount
    loadRecaptcha();
  }, []);

  const loadRecaptcha = () => {
    try {
      // Clean up existing recaptcha
      const existingDiv = document.getElementById('recaptcha-container');
      if (existingDiv) {
        existingDiv.innerHTML = '';
      }

      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {
          setRecaptchaReady(true);
        },
        'expired-callback': () => {
          setError('Verification expired. Please try again.');
          setRecaptchaReady(false);
        },
      });

      recaptchaVerifier.render().then(() => {
        setRecaptchaReady(true);
      }).catch(() => {
        setError('Failed to load verification. Please refresh the page.');
      });
    } catch (err) {
      console.error('Recaptcha error:', err);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;

    setLoading(true);
    setError(null);

    try {
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      // Send OTP via Firebase
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
        })
      );

      setConfirmationResult(result);
      setStep('OTP');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      if (err.code === 'Firebase: FIRTV0001') {
        setError('Invalid phone number. Please check and try again.');
      } else if (err.code === 'Firebase: TOO_MANY_REQUESTS') {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
      // Reload recaptcha on error
      loadRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6 || !confirmationResult) return;

    setLoading(true);
    setError(null);

    try {
      // Verify OTP with Firebase
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();

      // Send Firebase token to backend to get JWT
      const res = await authApiClient.post('/auth/verify-firebase-token', {
        idToken,
      });

      const { token, user } = res.data.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      if (user?.phone) localStorage.setItem('userPhone', user.phone);
      if (user?.name) localStorage.setItem('userName', user.name);
      if (user?.role) localStorage.setItem('userRole', user.role);
      if (user?.id) localStorage.setItem('userId', user.id);

      router.push('/');
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      if (err.code === 'Firebase: ERROR_INVALID_VERIFICATION_CODE') {
        setError('Invalid OTP. Please check and try again.');
      } else {
        setError(err.response?.data?.error?.message || 'Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setStep('PHONE');
    setOtp('');
    loadRecaptcha();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login or Sign Up
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            {error}
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
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

            {/* reCAPTCHA container */}
            <div id="recaptcha-container" className="flex justify-center" />

            <Button
              type="submit"
              className="w-full"
              disabled={phone.length < 10 || loading || !recaptchaReady}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from UrbanService and its affiliates.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">OTP sent to +91 {phone}</span>
              <button
                type="button"
                onClick={() => { setStep('PHONE'); setOtp(''); }}
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
                placeholder="000000"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={otp.length < 6 || loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Verifying...' : 'Verify & Proceed'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-primary hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
