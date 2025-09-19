import { User } from "@/models/User";
import { GraphQLError } from "graphql";
import { encryptHash } from "@/utils/hash";
import { CreatePsychologistInput } from "@/types/generated";

export const createPsychologist = async (
  _parent: unknown,
  { input }: { input: CreatePsychologistInput }
) => {
  try {
    const hashedPassword = encryptHash(input.password);
    const psychologist = new User({
      ...input,
      password: hashedPassword,
      role: "PSYCHOLOGIST",
      isVerified: false,
    });

    await psychologist.save();
    return psychologist.toObject();
  } catch (_error) {
    throw new GraphQLError("Failed to create psychologist", {
      extensions: { code: "CREATE_PSY_FAILED" },
    });
  }
};
