import { ForgotPasswordInput, ResetPasswordInput, SendVerificationEmailInput } from "@/types/generated";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";
import { generateOTP, sendOTPEmail, sendVerificationEmail } from "@/utils";
import { 
  storeOTP, 
  getStoredOTP, 
  clearOTP,
  storeVerificationOTP,
  getStoredVerificationOTP,
  clearVerificationOTP
} from "@/utils/otp-storage";
import { encryptHash } from "@/utils/hash";

export const forgotPassword = async (
  _parent: unknown,
  { input }: { input: ForgotPasswordInput }
): Promise<boolean> => {
  try {
    console.log("🔄 ForgotPassword called with:", input);
    
    const { identifier } = input;

    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      console.log("❌ User not found with identifier:", identifier);
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (!user.email) {
      console.log("❌ User has no email address:", user._id);
      throw new GraphQLError("User does not have an email address to send OTP", {
        extensions: { code: "EMAIL_NOT_FOUND" },
      });
    }

    const otp = generateOTP();
    storeOTP(user.email, otp);
    await sendOTPEmail(user.email, otp);

    console.log("✅ Password reset OTP sent successfully to:", user.email);
    return true;
  } catch (error: unknown) {
    console.error("❌ ForgotPassword Error:", error);
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
    console.log("🔄 ResetPassword called with:", input);
    
    const { identifier, otp, newPassword } = input;

    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      console.log("❌ User not found with identifier:", identifier);
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (!user.email) {
      console.log("❌ User has no email address:", user._id);
      throw new GraphQLError("User does not have an email address", {
        extensions: { code: "EMAIL_NOT_FOUND" },
      });
    }

    const storedOTP = getStoredOTP(user.email);
    if (!storedOTP || storedOTP !== otp) {
      console.log("❌ Invalid OTP for user:", user.email);
      throw new GraphQLError("Invalid or expired OTP", {
        extensions: { code: "INVALID_OTP" },
      });
    }

    const hashedPassword = await encryptHash(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    
    clearOTP(user.email);

    console.log("✅ Password reset successfully for user:", user._id);
    return true;
  } catch (error: unknown) {
    console.error("❌ ResetPassword Error:", error);
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
    console.log("🔄 VerifyOTP called with:", { identifier, otp });
    
    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      console.log("❌ User not found with identifier:", identifier);
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (!user.email) {
      console.log("❌ User has no email address:", user._id);
      throw new GraphQLError("User does not have an email address", {
        extensions: { code: "EMAIL_NOT_FOUND" },
      });
    }

    const storedOTP = getStoredOTP(user.email);
    if (!storedOTP || storedOTP !== otp) {
      console.log("❌ Invalid OTP for user:", user.email);
      throw new GraphQLError("Invalid or expired OTP", {
        extensions: { code: "INVALID_OTP" },
      });
    }

    clearOTP(user.email);
    console.log("✅ OTP verified successfully for user:", user._id);
    return true;
  } catch (error: unknown) {
    console.error("❌ VerifyOTP Error:", error);
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
    console.log("🔄 SendVerificationEmail called with:", input);
    
    const { email } = input;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found with email:", email);
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (user.isEmailVerified) {
      console.log("❌ Email already verified for user:", user._id);
      throw new GraphQLError("Email is already verified", {
        extensions: { code: "EMAIL_ALREADY_VERIFIED" },
      });
    }

    const otp = generateOTP();
    storeVerificationOTP(email, otp);
    await sendVerificationEmail(email, otp);

    console.log("✅ Verification email sent successfully to:", email);
    return true;
  } catch (error: unknown) {
    console.error("❌ SendVerificationEmail Error:", error);
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
    console.log("🔄 VerifyEmailOTP called with:", { email, otp });
    
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found with email:", email);
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    const storedOTP = getStoredVerificationOTP(email);
    if (!storedOTP || storedOTP !== otp) {
      console.log("❌ Invalid verification OTP for email:", email);
      throw new GraphQLError("Invalid or expired verification code", {
        extensions: { code: "INVALID_VERIFICATION_OTP" },
      });
    }

    await User.findByIdAndUpdate(user._id, { isEmailVerified: true });
    clearVerificationOTP(email);

    console.log("✅ Email verified successfully for user:", user._id);
    return true;
  } catch (error: unknown) {
    console.error("❌ VerifyEmailOTP Error:", error);
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
  { input }: { input: any }
): Promise<any> => {
  // This is a utility mutation for debugging/managing OTP storage
  // Implementation depends on your specific needs
  return { message: "OTP storage utility" };
};
