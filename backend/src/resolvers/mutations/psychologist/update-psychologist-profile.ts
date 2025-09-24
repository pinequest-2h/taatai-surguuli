import { PsychologistProfile } from "@/models/PsychologistProfile";
import { GraphQLError } from "graphql";

interface UpdatePsychologistProfileInput {
  specializations?: string[];
  experience?: number;
  education?: string[];
  certifications?: string[];
  hourlyRate?: number;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  isAcceptingNewClients?: boolean;
  workingHours?: any;
}

export const updatePsychologistProfile = async (
  _parent: unknown,
  { input }: { input: UpdatePsychologistProfileInput },
  context: { userId?: string }
) => {
  try {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    // Find the psychologist profile by user ID
    const existingProfile = await PsychologistProfile.findOne({ user: context.userId });
    if (!existingProfile) {
      throw new GraphQLError("Psychologist profile not found", {
        extensions: { code: "PROFILE_NOT_FOUND" },
      });
    }

    // Update the profile
    const updatedProfile = await PsychologistProfile.findByIdAndUpdate(
      existingProfile._id,
      { ...input, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('user', '_id fullName userName email profileImage role isPrivate');
    
    if (!updatedProfile) {
      throw new GraphQLError("Failed to update psychologist profile", {
        extensions: { code: "UPDATE_FAILED" },
      });
    }
    
    return updatedProfile.toObject();
  } catch (error: unknown) {
    console.error("❌ UpdatePsychologistProfile Error:", error);
    
    throw new GraphQLError("Failed to update psychologist profile", {
      extensions: { code: "UPDATE_PSYCHOLOGIST_FAILED" },
    });
  }
};
