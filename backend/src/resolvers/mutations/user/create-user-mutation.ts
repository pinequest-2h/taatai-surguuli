import { CreateUserInput } from "@/types/generated";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";
import { encryptHash, generateOTP, sendVerificationEmail } from "@/utils";
import { storeVerificationOTP } from "@/utils/otp-storage";


const createUserObject = (input: CreateUserInput) => {
  const hashedPassword = encryptHash(input.password);

  return new User({
    ...input,
    password: hashedPassword,
    profileImage: "",
    isVerified: false,
    role: input.role || "CHILD",
  });
};



export const createUser = async (
  _parent: unknown,
  { input }: { input: CreateUserInput }
) => {
  try {

    const user = createUserObject(input);
    
    await user.save();

    if (input.email) {
      try {
        const otp = generateOTP();
        storeVerificationOTP(input.email, otp);
        await sendVerificationEmail(input.email, otp);
      } catch (emailError) {
        console.warn("⚠️ Failed to send verification email (user still created):", emailError);

      }
    }


    const populatedUser = await User.findById(user._id);

    return populatedUser?.toObject();
  } catch (error: unknown) {
    console.error("❌ CreateUser Error:", error);
    

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      if ('keyPattern' in error && error.keyPattern && typeof error.keyPattern === 'object' && 'email' in error.keyPattern) {
        throw new GraphQLError("Email already exists", {
          extensions: { code: "EMAIL_ALREADY_EXISTS" },
        });
      }
      if ('keyPattern' in error && error.keyPattern && typeof error.keyPattern === 'object' && 'userName' in error.keyPattern) {
        throw new GraphQLError("Username already exists", {
          extensions: { code: "USERNAME_ALREADY_EXISTS" },
        });
      }
    }
    
    throw new GraphQLError("Failed to create user", {
      extensions: { code: "CREATE_USER_FAILED" },
    });
  }
};
