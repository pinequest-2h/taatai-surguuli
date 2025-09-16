import { User } from "@/models/User";
import { GraphQLError } from "graphql";

export const getUserById = async (_parent: unknown, { id }: { id: string }) => {
  try {
    const user = await User.findById(id)
      .populate("followers", "_id userName fullName profileImage")
      .populate("followings", "_id userName fullName profileImage")
      .populate("posts")
      .populate("stories");

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    return user.toObject();
  } catch (error) {
    throw new GraphQLError("Failed to fetch user", {
      extensions: { code: "GET_USER_FAILED" },
    });
  }
};
