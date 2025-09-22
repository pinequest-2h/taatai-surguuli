import { User } from "@/models/User";
import { GraphQLError } from "graphql";
import { UpdateUserInput } from "@/types/generated";

export const updateUser = async (
  _parent: unknown,
  { _id, input }: { _id: string; input: UpdateUserInput }
) => {
  try {
    console.log("🔄 UpdateUser called with:", { _id, input });
    
    const updatedUser = await User.findByIdAndUpdate(_id, input, {
      new: true,
      runValidators: true,
    })
      .populate("followers", "_id userName fullName profileImage")
      .populate("followings", "_id userName fullName profileImage")
      .select("-password");

    if (!updatedUser) {
      console.error("❌ User not found with ID:", _id);
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    console.log("✅ User updated successfully:", updatedUser._id);
    const userObject = updatedUser.toObject();
    
    // Ensure isPrivate field exists with default value for existing users
    if (userObject.isPrivate === undefined || userObject.isPrivate === null) {
      userObject.isPrivate = false;
    }

    return userObject;
  } catch (error: unknown) {
    console.error("❌ UpdateUser Error:", error);
    
    // Handle duplicate key errors
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
    
    if (error instanceof GraphQLError) {
      throw error;
    }
    
    throw new GraphQLError("Failed to update user", {
      extensions: { code: "UPDATE_USER_FAILED" },
    });
  }
};
