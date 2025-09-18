import { User } from "@/models/User";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";

export const getUserById = async (_parent: unknown, { _id }: { _id: string }) => {
  try {
    if (!_id) {
      throw new GraphQLError("User ID is required", {
        extensions: { code: "INVALID_USER_ID" },
      });
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(_id)) {
      throw new GraphQLError("Invalid user ID format", {
        extensions: { code: "INVALID_USER_ID_FORMAT" },
      });
    }

    const user = await User.findById(_id)
      .populate("followers", "_id userName fullName profileImage")
      .populate("followings", "_id userName fullName profileImage");

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    const userObject = user.toObject();
    
    // Ensure isPrivate field exists with default value for existing users
    if (userObject.isPrivate === undefined || userObject.isPrivate === null) {
      userObject.isPrivate = false;
    }

    return userObject;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    
    throw new GraphQLError("Failed to fetch user", {
      extensions: { code: "GET_USER_FAILED" },
    });
  }
};
