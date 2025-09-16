import { PsychologistProfile } from "@/models/PsychologistProfile";
import { GraphQLError } from "graphql";

export const getPsychologistProfile = async (
  _parent: unknown,
  { _id }: { _id: string }
) => {
  try {
    const profile = await PsychologistProfile.findOne({ user: _id })
      .populate('user', '_id fullName userName email profileImage');

    if (!profile) {
      return null;
    }

    return profile.toObject();
  } catch (error: unknown) {
    console.error("❌ GetPsychologistProfile Error:", error);
    throw new GraphQLError("Failed to fetch psychologist profile", {
      extensions: { code: "FETCH_PROFILE_FAILED" },
    });
  }
};

export const getPsychologistProfiles = async (
  _parent: unknown,
  { filters, limit = 20, offset = 0 }: { 
    filters?: any; 
    limit?: number; 
    offset?: number 
  }
) => {
  try {
    const query: any = {};
    
    if (filters) {
      if (filters.specializations && filters.specializations.length > 0) {
        query.specializations = { $in: filters.specializations };
      }
      if (filters.languages && filters.languages.length > 0) {
        query.languages = { $in: filters.languages };
      }
      if (filters.minExperience) {
        query.experience = { $gte: filters.minExperience };
      }
      if (filters.maxHourlyRate) {
        query.hourlyRate = { $lte: filters.maxHourlyRate };
      }
      if (filters.isAcceptingNewClients !== undefined) {
        query.isAcceptingNewClients = filters.isAcceptingNewClients;
      }
      if (filters.availability) {
        query.availability = filters.availability;
      }
    }

    const profiles = await PsychologistProfile.find(query)
      .populate('user', '_id fullName userName profileImage')
      .sort({ averageRating: -1, totalSessions: -1 })
      .skip(offset)
      .limit(limit);

    const totalCount = await PsychologistProfile.countDocuments(query);

    return {
      edges: profiles.map(profile => ({
        node: profile.toObject(),
        cursor: profile._id.toString(),
      })),
      pageInfo: {
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        startCursor: profiles[0]?._id.toString(),
        endCursor: profiles[profiles.length - 1]?._id.toString(),
      },
      totalCount,
    };
  } catch (error: unknown) {
    console.error("❌ GetPsychologistProfiles Error:", error);
    throw new GraphQLError("Failed to fetch psychologist profiles", {
      extensions: { code: "FETCH_PROFILES_FAILED" },
    });
  }
};

export const getAvailablePsychologists = async (
  _parent: unknown,
  { date, time, duration }: { date: string; time: string; duration: number }
) => {
  try {
    // For now, return all psychologists who are accepting new clients
    // In a real app, you'd check their availability schedule
    const profiles = await PsychologistProfile.find({
      isAcceptingNewClients: true,
    })
      .populate('user', '_id fullName userName profileImage');

    return profiles.map(profile => profile.toObject());
  } catch (error: unknown) {
    console.error("❌ GetAvailablePsychologists Error:", error);
    throw new GraphQLError("Failed to fetch available psychologists", {
      extensions: { code: "FETCH_AVAILABLE_PSYCHOLOGISTS_FAILED" },
    });
  }
};
