"use client";

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { 
  FORGOT_PASSWORD, 
  RESET_PASSWORD, 
  SEND_VERIFICATION_EMAIL, 
  VERIFY_EMAIL_OTP 
} from '@/lib/graphql/mutations';

interface UseEmailOptions {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export const useEmail = (options?: UseEmailOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [forgotPassword] = useMutation(FORGOT_PASSWORD);
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [sendVerificationEmail] = useMutation(SEND_VERIFICATION_EMAIL);
  const [verifyEmailOTP] = useMutation(VERIFY_EMAIL_OTP);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError('');
    options?.onSuccess?.(message);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess('');
    options?.onError?.(errorMessage);
  };

  const requestPasswordReset = async (identifier: string) => {
    setIsLoading(true);
    clearMessages();

    try {
      await forgotPassword({
        variables: {
          input: { identifier: identifier.trim() }
        }
      });
      
      handleSuccess('Password reset instructions have been sent to your email if the account exists.');
    } catch (err: unknown) {
      handleError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (identifier: string, otp: string, newPassword: string) => {
    setIsLoading(true);
    clearMessages();

    try {
      await resetPassword({
        variables: {
          input: {
            identifier: identifier.trim(),
            otp: otp.trim(),
            newPassword: newPassword.trim()
          }
        }
      });
      
      handleSuccess('Password reset successfully! You can now log in with your new password.');
    } catch (err: unknown) {
      handleError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailVerification = async (email: string) => {
    setIsLoading(true);
    clearMessages();

    try {
      await sendVerificationEmail({
        variables: {
          input: { email: email.trim() }
        }
      });
      
      handleSuccess('Verification email sent! Check your inbox.');
    } catch (err: unknown) {
      handleError(err instanceof Error ? err.message : 'Failed to send verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    setIsLoading(true);
    clearMessages();

    try {
      await verifyEmailOTP({
        variables: {
          email: email.trim(),
          otp: otp.trim()
        }
      });
      
      handleSuccess('Email verified successfully!');
    } catch (err: unknown) {
      handleError(err instanceof Error ? err.message : 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    isLoading,
    error,
    success,
    
    // Actions
    requestPasswordReset,
    resetUserPassword,
    sendEmailVerification,
    verifyEmail,
    clearMessages,
    
    // Utilities
    setError: handleError,
    setSuccess: handleSuccess
  };
};

// Hook for OTP input handling
export const useOTPInput = (length: number = 6) => {
  const [otp, setOtp] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleChange = (value: string) => {
    // Only allow numbers and limit to specified length
    const numericValue = value.replace(/\D/g, '').slice(0, length);
    setOtp(numericValue);
    setIsComplete(numericValue.length === length);
  };

  const clearOTP = () => {
    setOtp('');
    setIsComplete(false);
  };

  return {
    otp,
    isComplete,
    handleChange,
    clearOTP
  };
};

// Hook for email validation
export const useEmailValidation = () => {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      setIsValid(false);
      setError('');
      return false;
    }

    if (!emailRegex.test(email)) {
      setIsValid(false);
      setError('Please enter a valid email address');
      return false;
    }

    setIsValid(true);
    setError('');
    return true;
  };

  return {
    isValid,
    error,
    validateEmail
  };
};
