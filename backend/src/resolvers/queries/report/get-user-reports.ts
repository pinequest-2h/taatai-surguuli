import { Report } from "@/models/Report";
import { GraphQLError } from "graphql";

export const getUserReports = async (
  _parent: unknown,
  { userId, limit = 10, offset = 0 }: { 
    userId: string; 
    limit?: number; 
    offset?: number 
  },
  context: { userId?: string }
) => {
  try {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    // Only allow users to see their own reports or admin access
    if (context.userId !== userId) {
      throw new GraphQLError("Unauthorized to view these reports", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    const reports = await Report.find({ userId })
      .populate('userId', '_id fullName userName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await Report.countDocuments({ userId });

    const edges = reports.map((report) => ({
      node: report.toObject(),
      cursor: report._id?.toString() || '',
    }));

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
    console.error("❌ GetUserReports Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch user reports", {
      extensions: { code: "GET_USER_REPORTS_FAILED" },
    });
  }
};
