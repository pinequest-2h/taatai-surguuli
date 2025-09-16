// OTP хадгалах Map
export const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

// ✨ OTP хадгалах функц
export const storeVerificationOTP = (email: string, otp: string) => {
  const OTP_TTL_MS = 10 * 60 * 1000; // 10 минут
  const key = `verification_${email.toLowerCase().trim()}`;
  const expiresAt = Date.now() + OTP_TTL_MS;

  otpStorage.set(key, { otp, expiresAt });

  setTimeout(() => {
    const current = otpStorage.get(key);
    if (current && current.expiresAt === expiresAt) {
      otpStorage.delete(key);
    }
  }, OTP_TTL_MS);
};
