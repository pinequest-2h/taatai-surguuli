"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import OTPInput from './OTPInput';
import { useEmail } from '@/hooks/useEmail';

interface EmailVerificationProps {
  email: string;
  onVerified?: () => void;
  onCancel?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  onVerified, 
  onCancel 
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  const {
    isLoading,
    error,
    success,
    sendEmailVerification,
    verifyEmail
  } = useEmail({
    onSuccess: (message) => {
      if (message.includes('verified')) {
        setTimeout(() => {
          if (onVerified) {
            onVerified();
          } else {
            router.push('/dashboard');
          }
        }, 1500);
      }
    }
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    await verifyEmail(email, otp);
  };

  const handleResendCode = async () => {
    await sendEmailVerification(email);
    setTimeLeft(60); // 60 seconds cooldown
  };

  const handleOTPChange = (newOtp: string) => {
    setOtp(newOtp);
  };

  const handleOTPComplete = (newOtp: string) => {
    setOtp(newOtp);
    // Auto-submit when OTP is complete
    verifyEmail(email, newOtp);
  };

  const handleSkip = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a verification code to
          </p>
          <p className="text-sm font-medium text-blue-600">
            {email}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Verification Form */}
        <form className="mt-8 space-y-6" onSubmit={handleVerifyEmail}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Verification Code
            </label>
            <div className="flex justify-center">
              <OTPInput
                length={6}
                value={otp}
                onChange={handleOTPChange}
                onComplete={handleOTPComplete}
                disabled={isLoading}
                className="justify-center"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn&apos;t receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={isLoading || timeLeft > 0}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend Code'}
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Need help?</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure you entered the correct email address</li>
            <li>• The code expires in 10 minutes</li>
            <li>• You can resend the code if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
