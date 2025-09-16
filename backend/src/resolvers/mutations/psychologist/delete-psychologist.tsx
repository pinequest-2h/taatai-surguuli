import { User } from "@/models/User";
import { GraphQLError } from "graphql";

interface DeletePsychologistArgs {
  _id: string;
}

export const deletePsychologist = async (
  _parent: unknown,
  { _id }: DeletePsychologistArgs
): Promise<{ success: boolean; message: string }> => {
  try {
    const psychologist = await User.findById(_id);

    if (!psychologist || psychologist.role !== "PSYCHOLOGIST") {
      throw new GraphQLError("Psychologist not found", {
        extensions: { code: "PSYCHOLOGIST_NOT_FOUND" },
      });
    }

    await psychologist.deleteOne();

    return {
      success: true,
      message: "Psychologist deleted successfully",
    };
  } catch (error) {
    console.error("❌ DeletePsychologist Error:", error);

    if (error instanceof GraphQLError) throw error;

    throw new GraphQLError("Failed to delete psychologist", {
      extensions: { code: "DELETE_PSYCHOLOGIST_FAILED" },
    });
  }
};
