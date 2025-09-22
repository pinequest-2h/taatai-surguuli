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
  { _id, input }: { _id: string; input: UpdatePsychologistProfileInput }
) => {
  try {
    // Find the psychologist profile by user ID
    const existingProfile = await PsychologistProfile.findOne({ user: _id });
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
