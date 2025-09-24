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
    

    const existingUser = await User.findOne({
      $or: [
        { email: input.email },
        { userName: input.userName }
      ]
    });


    if (existingUser) {
      if (existingUser.email === input.email) {
        throw new GraphQLError("Email already exists", {
          extensions: { code: "EMAIL_ALREADY_EXISTS" },
        });
      }
      if (existingUser.userName === input.userName) {
        throw new GraphQLError("Username already exists", {
          extensions: { code: "USERNAME_ALREADY_EXISTS" },
        });
      }
    }

    const user = createUserObject(input);
    
    await user.save();

    if (input.email) {
      try {
        const otp = generateOTP();
        storeVerificationOTP(input.email, otp);
        await sendVerificationEmail(input.email, otp);
      } catch (emailError) {
      }
    }

    const populatedUser = await User.findById(user._id);
    return populatedUser?.toObject();
  } catch (error: unknown) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      const err = error as Record<string, unknown>;
      
      if ('keyPattern' in err && err.keyPattern && typeof err.keyPattern === 'object') {
        const keyPattern = err.keyPattern as Record<string, unknown>;
        
        if ('email' in keyPattern) {
          throw new GraphQLError("Email already exists", {
            extensions: { code: "EMAIL_ALREADY_EXISTS" },
          });
        }
        if ('userName' in keyPattern) {
          throw new GraphQLError("Username already exists", {
            extensions: { code: "USERNAME_ALREADY_EXISTS" },
          });
        }
      }
    }
    
    throw new GraphQLError("Failed to create user", {
      extensions: { code: "CREATE_USER_FAILED" },
    });
  }
};
