import { useState } from 'react';
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authApiClient } from './axios';
import { Phone } from 'lucide-react';

interface UseFirebasePhoneAuthReturn {
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (otp: string, confirmationResult: ConfirmationResult) => Promise<any>;
  setupRecaptcha: () => Promise<RecaptchaVerifier | null>;
  loading: boolean;
  error: string | null;
  confirmationResult: ConfirmationResult | null;
}

export const useFirebasePhoneAuth = (): UseFirebasePhoneAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const setupRecaptcha = async (): Promise<RecaptchaVerifier | null> => {
    try {
      // Clean up existing recaptcha
      const existingDiv = document.getElementById('recaptcha-container');
      if (existingDiv) {
        existingDiv.innerHTML = '';
      }

      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {},
        'expired-callback': () => {
          setError('Recaptcha expired. Please try again.');
        },
      });

      await recaptchaVerifier.render();
      return recaptchaVerifier;
    } catch (err: any) {
      console.error('Recaptcha setup error:', err);
      setError('Failed to setup verification. Please try again.');
      return null;
    }
  };

  const sendOTP = async (phone: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Format phone number
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      // First, call backend to send OTP via Firebase
      await authApiClient.post('/auth/send-otp', { phone: formattedPhone });

      // Setup Recaptcha
      const recaptchaVerifier = await setupRecaptcha();
      if (!recaptchaVerifier) {
        throw new Error('Failed to setup recaptcha');
      }

      // Send OTP via Firebase client SDK
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);

    } catch (err: any) {
      console.error('Send OTP error:', err);
      const message = err.message || 'Failed to send OTP';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string, result: ConfirmationResult): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      // Verify with Firebase
      const userCredential = await result.confirm(otp);

      // Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Verify with backend and get JWT
      const response = await authApiClient.post('/auth/verify-otp-firebase', {
        idToken,
      });

      return response.data;

    } catch (err: any) {
      console.error('Verify OTP error:', err);
      const message = err.message || 'Invalid OTP';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    setupRecaptcha,
    loading,
    error,
    confirmationResult,
  };
};
