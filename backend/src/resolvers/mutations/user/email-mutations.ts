import { User } from "@/models/User";
import { GraphQLError } from "graphql";
import { generateOTP, sendOTPEmail } from "@/utils";
import { storeVerificationOTP, otpStorage as verificationOTPStorage } from "@/utils/otp-storage";
import { encryptHash } from "@/utils/hash";
import { sendVerificationEmail as sendVerificationEmailHandler } from "@/utils/mail-handler";

interface ForgotPasswordInput {
  identifier: string;
}

interface ResetPasswordInput {
  identifier: string;
  otp: string;
  newPassword: string;
}

interface SendVerificationEmailInput {
  email: string;
}

const passwordResetOTPStorage = new Map<string, { otp: string; expiresAt: number }>();

const storeOTP = (identifier: string, otp: string) => {
  const OTP_TTL_MS = 10 * 60 * 1000; 
  const key = `reset_${identifier.toLowerCase().trim()}`;
  const expiresAt = Date.now() + OTP_TTL_MS;

  passwordResetOTPStorage.set(key, { otp, expiresAt });

  setTimeout(() => {
    const current = passwordResetOTPStorage.get(key);
    if (current && current.expiresAt === expiresAt) {
      passwordResetOTPStorage.delete(key);
    }
  }, OTP_TTL_MS);
};

const getStoredOTP = (identifier: string): string | null => {
  const key = `reset_${identifier.toLowerCase().trim()}`;
  const stored = passwordResetOTPStorage.get(key);
  
  if (!stored) return null;
  
  if (Date.now() > stored.expiresAt) {
    passwordResetOTPStorage.delete(key);
    return null;
  }
  
  return stored.otp;
};

const clearOTP = (identifier: string) => {
  const key = `reset_${identifier.toLowerCase().trim()}`;
  passwordResetOTPStorage.delete(key);
};

const getStoredVerificationOTP = (email: string): string | null => {
  const key = `verification_${email.toLowerCase().trim()}`;
  const stored = verificationOTPStorage.get(key);
  
  if (!stored) return null;
  
  if (Date.now() > stored.expiresAt) {
    verificationOTPStorage.delete(key);
    return null;
  }
  
  return stored.otp;
};

const clearVerificationOTP = (email: string) => {
  const key = `verification_${email.toLowerCase().trim()}`;
  verificationOTPStorage.delete(key);
};


export const forgotPassword = async (
  _parent: unknown,
  { input }: { input: ForgotPasswordInput }
): Promise<boolean> => {
  try {
    
    const { identifier } = input;

    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (!user.email) {
      throw new GraphQLError("User does not have an email address to send OTP", {
        extensions: { code: "EMAIL_NOT_FOUND" },
      });
    }

    const otp = generateOTP();
    storeOTP(user.email, otp);
    await sendOTPEmail(user.email, otp);

    return true;
  } catch (error: unknown) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to send password reset OTP", {
      extensions: { code: "FORGOT_PASSWORD_FAILED" },
    });
  }
};

export const resetPassword = async (
  _parent: unknown,
  { input }: { input: ResetPasswordInput }
): Promise<boolean> => {
  try {
    
    const { identifier, otp, newPassword } = input;

    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (!user.email) {
      throw new GraphQLError("User does not have an email address", {
        extensions: { code: "EMAIL_NOT_FOUND" },
      });
    }

    const storedOTP = getStoredOTP(user.email);
    if (!storedOTP || storedOTP !== otp) {
      throw new GraphQLError("Invalid or expired OTP", {
        extensions: { code: "INVALID_OTP" },
      });
    }

    const hashedPassword = await encryptHash(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    
    clearOTP(user.email);

    return true;
  } catch (error: unknown) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to reset password", {
      extensions: { code: "RESET_PASSWORD_FAILED" },
    });
  }
};

export const verifyOTP = async (
  _parent: unknown,
  { identifier, otp }: { identifier: string; otp: string }
): Promise<boolean> => {
  try {
    
    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (!user.email) {
      throw new GraphQLError("User does not have an email address", {
        extensions: { code: "EMAIL_NOT_FOUND" },
      });
    }

    const storedOTP = getStoredOTP(user.email);
    if (!storedOTP || storedOTP !== otp) {
      throw new GraphQLError("Invalid or expired OTP", {
        extensions: { code: "INVALID_OTP" },
      });
    }

    clearOTP(user.email);
    return true;
  } catch (error: unknown) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to verify OTP", {
      extensions: { code: "VERIFY_OTP_FAILED" },
    });
  }
};

export const sendVerificationEmail = async (
  _parent: unknown,
  { input }: { input: SendVerificationEmailInput }
): Promise<boolean> => {
  try {
    
    const { email } = input;

    const user = await User.findOne({ email });

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (user.isEmailVerified) {
      throw new GraphQLError("Email is already verified", {
        extensions: { code: "EMAIL_ALREADY_VERIFIED" },
      });
    }

    const otp = generateOTP();
    storeVerificationOTP(email, otp);
    await sendVerificationEmailHandler(email, otp);

    return true;
  } catch (error: unknown) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to send verification email", {
      extensions: { code: "SEND_VERIFICATION_EMAIL_FAILED" },
    });
  }
};

export const verifyEmailOTP = async (
  _parent: unknown,
  { email, otp }: { email: string; otp: string }
): Promise<boolean> => {
  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    const storedOTP = getStoredVerificationOTP(email);
    if (!storedOTP || storedOTP !== otp) {
      throw new GraphQLError("Invalid or expired verification code", {
        extensions: { code: "INVALID_VERIFICATION_OTP" },
      });
    }

    await User.findByIdAndUpdate(user._id, { isEmailVerified: true });
    clearVerificationOTP(email);

    return true;
  } catch (error: unknown) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to verify email", {
      extensions: { code: "VERIFY_EMAIL_FAILED" },
    });
  }
};

export const otpStorage = async (
  _parent: unknown,
  { input }: { input: { action: string; data?: unknown } }
): Promise<{ message: string; data?: unknown }> => {
  try {
    switch (input.action) {
      case 'clear':
        passwordResetOTPStorage.clear();
        return { message: 'All password reset OTPs cleared' };
      case 'list':
        const otps = Array.from(passwordResetOTPStorage.entries()).map(([key, value]) => ({
          key,
          otp: value.otp,
          expiresAt: new Date(value.expiresAt).toISOString()
        }));
        return { message: 'Password reset OTPs listed', data: otps };
      default:
        return { message: 'OTP storage utility - use "clear" or "list" actions' };
    }
  } catch {
    throw new GraphQLError('Failed to manage OTP storage', {
      extensions: { code: 'OTP_STORAGE_ERROR' },
    });
  }
};
