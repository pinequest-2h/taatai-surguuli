import { User } from "@/models/User";
import { GraphQLError } from "graphql";
import { UpdateUserInput } from "@/types/generated";

export const updateUser = async (
  _parent: unknown,
  { id, input }: { id: string; input: UpdateUserInput }
) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, input, {
      new: true,
    })
      .populate("followers", "_id userName fullName profileImage")
      .populate("followings", "_id userName fullName profileImage")
     

    if (!updatedUser) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    return updatedUser.toObject();
  } catch (error) {
    throw new GraphQLError("Failed to update user", {
      extensions: { code: "UPDATE_USER_FAILED" },
    });
  }
};
