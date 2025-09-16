import { User } from "@/models/User";
import { GraphQLError } from "graphql";

interface UpdatePsychologistProfileInput {
  _id: string;
  fullName?: string;
  userName?: string;
  bio?: string;
  profileImage?: string;
  phoneNumber?: string;
  email?: string;
}

// Update psychologist profile
export const updatePsychologistProfile = async (
  _parent: unknown,
  { input }: { input: UpdatePsychologistProfileInput }
) => {
  try {
    const { _id, ...updateData } = input;
    
    // Verify the user is a psychologist
    const existingUser = await User.findOne({ _id, role: "PSYCHOLOGIST" });
    if (!existingUser) {
      throw new GraphQLError("Psychologist not found", {
        extensions: { code: "PSYCHOLOGIST_NOT_FOUND" },
      });
    }
    
    // Update the psychologist profile
    const updatedPsychologist = await User.findByIdAndUpdate(
      _id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updatedPsychologist) {
      throw new GraphQLError("Failed to update psychologist profile", {
        extensions: { code: "UPDATE_FAILED" },
      });
    }
    
    return updatedPsychologist;
  } catch (error: unknown) {
    console.error("❌ UpdatePsychologistProfile Error:", error);
    
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
    
    throw new GraphQLError("Failed to update psychologist profile", {
      extensions: { code: "UPDATE_PSYCHOLOGIST_FAILED" },
    });
  }
};
