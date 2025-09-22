"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useEmail } from '@/hooks/useEmail';
import OTPInput from '@/components/OTPInput';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    isLoading,
    error,
    success,
    requestPasswordReset,
    resetUserPassword,
    clearMessages
  } = useEmail({
    onSuccess: (message) => {
      if (message.includes('reset successfully')) {
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      }
    }
  });

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    await requestPasswordReset(identifier);
    if (!error) {
      setStep('reset');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    // Validation
    if (newPassword !== confirmPassword) {
      return;
    }

    if (newPassword.length < 6) {
      return;
    }

    await resetUserPassword(identifier, otp, newPassword);
  };

  const handleOTPChange = (newOtp: string) => {
    setOtp(newOtp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/signin" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
          
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {step === 'request' ? 'Reset Your Password' : 'Enter New Password'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {step === 'request' 
              ? 'Enter your email or username to receive password reset instructions'
              : 'Enter the OTP sent to your email and your new password'
            }
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

        {/* Forms */}
        {step === 'request' ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email or username"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="flex justify-center">
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={handleOTPChange}
                  disabled={isLoading}
                  className="justify-center"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="flex-1 py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || newPassword !== confirmPassword || newPassword.length < 6}
                className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
