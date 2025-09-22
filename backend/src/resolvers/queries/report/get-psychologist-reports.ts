import { Report } from "@/models/Report";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";

export const getPsychologistReports = async (
  _parent: unknown,
  { limit = 10, offset = 0 }: { limit?: number; offset?: number },
  context: { userId?: string }
) => {
  try {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    // Check if user exists and is a psychologist
    const user = await User.findById(context.userId);
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (user.role !== 'PSYCHOLOGIST') {
      throw new GraphQLError("Only psychologists can view psychologist reports", {
        extensions: { code: "INSUFFICIENT_PERMISSIONS" },
      });
    }

    // For now, psychologists can see all reports
    // In the future, this could be filtered by assigned reports
    const reports = await Report.find({})
      .populate('userId', '_id fullName userName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await Report.countDocuments({});

    const edges = reports.map((report) => {
      const reportObj = report.toObject();
      
      if (report.anonymous) {
        reportObj.userId = null;
      }
      return {
        node: reportObj,
        cursor: report._id?.toString() || '',
      };
    });

    return {
      edges,
      pageInfo: {
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
      totalCount,
    };
  } catch (error: unknown) {
    console.error("❌ GetPsychologistReports Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch psychologist reports", {
      extensions: { code: "GET_PSYCHOLOGIST_REPORTS_FAILED" },
    });
  }
};
