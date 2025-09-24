import { PsychologistProfile } from "@/models/PsychologistProfile";
import { GraphQLError } from "graphql";

export const getPsychologistProfile = async (
  _parent: unknown,
  { _id }: { _id: string },
  context: { userId?: string }
) => {
  try {
    const profile = await PsychologistProfile.findById(_id)
      .populate({
        path: 'user',
        select: '_id fullName userName email profileImage role isPrivate',
        match: context.userId ? {} : { isPrivate: { $ne: true } }
      });

    if (!profile || !profile.user) {
      return null;
    }

    return profile.toObject();
  } catch {
    throw new GraphQLError("Failed to fetch psychologist profile", {
      extensions: { code: "FETCH_PROFILE_FAILED" },
    });
  }
};

export const getPsychologistProfileByUserId = async (
  _parent: unknown,
  { userId }: { userId: string },
  context: { userId?: string }
) => {
  try {
    
    // If user is requesting their own profile, allow it regardless of isPrivate
    const isOwnProfile = context.userId === userId;
    
    const profile = await PsychologistProfile.findOne({ user: userId })
      .populate({
        path: 'user',
        select: '_id fullName userName email profileImage role isPrivate',
        // Allow access to own profile even if private, or if user is authenticated and profile is not private
        match: isOwnProfile ? {} : (context.userId ? {} : { isPrivate: { $ne: true } })
      });

    if (!profile) {
      return null;
    }

    if (!profile.user) {
      return null;
    }

    
    return profile.toObject();
  } catch {
    throw new GraphQLError("Failed to fetch psychologist profile by user ID", {
      extensions: { code: "FETCH_PROFILE_BY_USER_ID_FAILED" },
    });
  }
};

export const getPsychologistProfiles = async (
  _parent: unknown,
  { filters, limit = 20, offset = 0 }: { 
    filters?: Record<string, unknown>; 
    limit?: number; 
    offset?: number 
  },
  context: { userId?: string }
) => {
  try {
    const query: Record<string, unknown> = {};
    const specializationEnumToMn: Record<string, string> = {
      CHILD_PSYCHOLOGY: "ХҮҮХДИЙН_СЭТГЭЛ_СУДЛАЛ",
      ADOLESCENT_PSYCHOLOGY: "ӨСВӨР_НАСНЫ_СЭТГЭЛ_СУДЛАЛ",
      FAMILY_THERAPY: "ГЭР_БҮЛИЙН_СЭТГЭЛ_ЗАСАЛ",
      COGNITIVE_BEHAVIORAL_THERAPY: "ТАНИН_МЭДЭХҮЙН_ЗАН_ҮЙЛИЙН_СЭТГЭЛ_ЗАСАЛ",
      TRAUMA_THERAPY: "СЭТГЭЛ_ЗҮЙН_ГЭМТЛИЙН_ЭМЧИЛГЭЭ",
      ANXIETY_DISORDERS: "ТҮГШҮҮРИЙН_ЭМГЭГҮҮД",
      DEPRESSION: "СЭТГЭЛ_ГУТРАЛ",
      AUTISM_SPECTRUM: "АУТИЗМЫН_ХҮРЭЭНИЙ_ЭМГЭГ",
      LEARNING_DISABILITIES: "СУРГАЛТЫН_БЭРХШЭЭЛ",
      BEHAVIORAL_ISSUES: "ЗАН_ҮЙЛИЙН_АСУУДАЛ",
      SOCIAL_SKILLS: "НИЙГМИЙН_УР_ЧАДВАР",
      EMOTIONAL_REGULATION: "СЭТГЭЛ_ХӨДЛӨЛӨӨ_ЗОХИЦУУЛАХ_ЧАДВАР",
    };
    
    if (filters) {
      if (filters.specializations && Array.isArray(filters.specializations) && filters.specializations.length > 0) {
        const mappedSpecs = (filters.specializations as string[])
          .map((s) => specializationEnumToMn[s] || s);
        query.specializations = { $in: mappedSpecs };
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
      .populate({
        path: 'user',
        select: '_id fullName userName profileImage role isPrivate',
        // Filter out private profiles for non-authenticated users
        match: context.userId ? {} : { isPrivate: { $ne: true } }
      })
      .sort({ averageRating: -1, totalSessions: -1 })
      .skip(offset)
      .limit(limit);

    // Filter out profiles where user population failed (due to isPrivate filter)
    const filteredProfiles = profiles.filter(profile => profile.user);

    const totalCount = await PsychologistProfile.countDocuments(query);

    return {
      edges: filteredProfiles.map(profile => ({
        node: profile.toObject(),
        cursor: profile._id.toString(),
      })),
      pageInfo: {
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        startCursor: filteredProfiles[0]?._id.toString(),
        endCursor: filteredProfiles[filteredProfiles.length - 1]?._id.toString(),
      },
      totalCount,
    };
  } catch {
    throw new GraphQLError("Failed to fetch psychologist profiles", {
      extensions: { code: "FETCH_PROFILES_FAILED" },
    });
  }
};

export const getAvailablePsychologists = async (
  _parent: unknown,
  _args: unknown,
  context: { userId?: string }
) => {
  try {
    const profiles = await PsychologistProfile.find({
      isAcceptingNewClients: true,
    })
      .populate({
        path: 'user',
        select: '_id fullName userName profileImage role isPrivate',
        // Filter out private profiles for non-authenticated users
        match: context.userId ? {} : { isPrivate: { $ne: true } }
      });

    // Filter out profiles where user population failed (due to isPrivate filter)
    const filteredProfiles = profiles.filter(profile => profile.user);

    return filteredProfiles.map(profile => profile.toObject());
  } catch {
    throw new GraphQLError("Failed to fetch available psychologists", {
      extensions: { code: "FETCH_AVAILABLE_PSYCHOLOGISTS_FAILED" },
    });
  }
};
