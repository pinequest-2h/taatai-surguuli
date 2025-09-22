"use client";

import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  className?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  className = ''
}) => {
  const [otp, setOtp] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync with external value
  useEffect(() => {
    if (value !== otp) {
      setOtp(value);
      setIsComplete(value.length === length);
    }
  }, [value, length, otp]);

  // Notify parent when OTP changes
  useEffect(() => {
    onChange?.(otp);
  }, [otp, onChange]);

  // Notify parent when OTP is complete
  useEffect(() => {
    if (isComplete) {
      onComplete?.(otp);
    }
  }, [isComplete, otp, onComplete]);

  const handleInputChange = (index: number, value: string) => {
    const newOtp = otp.split('');
    newOtp[index] = value;
    const updatedOtp = newOtp.join('');
    
    setOtp(updatedOtp);
    setIsComplete(updatedOtp.length === length);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, length);
        setOtp(pastedOtp);
        setIsComplete(pastedOtp.length === length);
        
        // Focus the last filled input
        const lastIndex = Math.min(pastedOtp.length - 1, length - 1);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select();
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={`
            w-12 h-12 text-center text-lg font-semibold
            border-2 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${disabled 
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
            }
            ${otp[index] ? 'border-blue-500 bg-blue-50' : ''}
          `}
        />
      ))}
    </div>
  );
};

export default OTPInput;
