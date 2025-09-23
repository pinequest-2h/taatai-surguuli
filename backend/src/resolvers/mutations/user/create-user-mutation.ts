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
    console.log("🔄 CreateUser called with:", { email: input.email, userName: input.userName });
    
    // Debug: Show database connection info
    console.log("🔍 Database info:", {
      modelName: User.modelName,
      collectionName: User.collection.name,
      dbName: User.db?.name
    });

    // Check if user already exists before attempting to create
    const existingUser = await User.findOne({
      $or: [
        { email: input.email },
        { userName: input.userName }
      ]
    });

    console.log("🔍 Checking for existing user with:", { email: input.email, userName: input.userName });
    console.log("🔍 Found existing user:", existingUser ? {
      id: existingUser._id,
      email: existingUser.email,
      userName: existingUser.userName
    } : "None");

    if (existingUser) {
      if (existingUser.email === input.email) {
        console.log("❌ User creation failed - Email already exists:", input.email);
        console.log("🔍 Existing user details:", {
          id: existingUser._id,
          email: existingUser.email,
          userName: existingUser.userName,
          createdAt: existingUser.createdAt
        });
        throw new GraphQLError("Email already exists", {
          extensions: { code: "EMAIL_ALREADY_EXISTS" },
        });
      }
      if (existingUser.userName === input.userName) {
        console.log("❌ User creation failed - Username already exists:", input.userName);
        throw new GraphQLError("Username already exists", {
          extensions: { code: "USERNAME_ALREADY_EXISTS" },
        });
      }
    }

    const user = createUserObject(input);
    
    await user.save();
    console.log("✅ User created successfully:", user._id);

    if (input.email) {
      try {
        const otp = generateOTP();
        storeVerificationOTP(input.email, otp);
        await sendVerificationEmail(input.email, otp);
        console.log("✅ Verification email sent to:", input.email);
      } catch (emailError) {
        console.warn("⚠️ Failed to send verification email (user still created):", emailError);
      }
    }

    const populatedUser = await User.findById(user._id);
    return populatedUser?.toObject();
  } catch (error: unknown) {
    // Handle GraphQL errors (already properly formatted)
    if (error instanceof GraphQLError) {
      throw error;
    }

    console.error("❌ CreateUser Error:", error);
    
    // Handle MongoDB duplicate key errors as fallback
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      const err = error as Record<string, unknown>;
      
      if ('keyPattern' in err && err.keyPattern && typeof err.keyPattern === 'object') {
        const keyPattern = err.keyPattern as Record<string, unknown>;
        
        if ('email' in keyPattern) {
          console.log("❌ Duplicate email detected:", input.email);
          throw new GraphQLError("Email already exists", {
            extensions: { code: "EMAIL_ALREADY_EXISTS" },
          });
        }
        if ('userName' in keyPattern) {
          console.log("❌ Duplicate username detected:", input.userName);
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
