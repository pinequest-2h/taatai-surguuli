import { LoginInput } from "@/types/generated";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";
import { decryptHash } from "@/utils/hash";
import { generateToken } from "@/utils/jwt";

export const loginUser = async (
  _parent: unknown,
  { input }: { input: LoginInput }
) => {
  try {
    const { identifier, password } = input;

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { userName: identifier }
      ]
    });

    if (!user) {
      throw new GraphQLError("Invalid credentials", {
        extensions: { code: "INVALID_CREDENTIALS" },
      });
    }

    // Check if password is correct
    const isPasswordValid = decryptHash(password, user.password);
    if (!isPasswordValid) {
      throw new GraphQLError("Invalid credentials", {
        extensions: { code: "INVALID_CREDENTIALS" },
      });
    }

    // Generate JWT token
    const token = generateToken({ userId: user._id.toString() });

    // Return user data without password
    const userObject = user.toObject();
    delete userObject.password;

    // Ensure isPrivate field exists with default value for existing users
    if (userObject.isPrivate === undefined || userObject.isPrivate === null) {
      userObject.isPrivate = false;
    }

    return {
      user: userObject,
      token,
    };
  } catch (error: unknown) {
    console.error("❌ LoginUser Error:", error);
    
    if (error instanceof GraphQLError) {
      throw error;
    }
    
    throw new GraphQLError("Login failed", {
      extensions: { code: "LOGIN_FAILED" },
    });
  }
};
