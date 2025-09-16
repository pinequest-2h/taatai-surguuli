import { CreatePsychologistProfileInput } from "@/types/generated";
import { PsychologistProfile } from "@/models/PsychologistProfile";
import { GraphQLError } from "graphql";

export const createPsychologistProfile = async (
  _parent: unknown,
  { input }: { input: CreatePsychologistProfileInput },
  context: { userId?: string }
) => {
  try {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    const profile = new PsychologistProfile({
      ...input,
      user: context.userId,
      totalSessions: 0,
      totalClients: 0,
      isVerified: false,
    });

    await profile.save();

    const populatedProfile = await PsychologistProfile.findById(profile._id)
      .populate('user', '_id fullName userName email');

    return populatedProfile?.toObject();
  } catch (error: unknown) {
    console.error("❌ CreatePsychologistProfile Error:", error);
    throw new GraphQLError("Failed to create psychologist profile", {
      extensions: { code: "CREATE_PROFILE_FAILED" },
    });
  }
};
