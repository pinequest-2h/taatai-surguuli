import { Report } from "@/models/Report";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";

export const getMyReports = async (
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

    // Check if user exists and has CHILD role
    const user = await User.findById(context.userId);
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (user.role !== 'CHILD') {
      throw new GraphQLError("Only children can view their own reports", {
        extensions: { code: "INSUFFICIENT_PERMISSIONS" },
      });
    }

    const reports = await Report.find({ userId: context.userId })
      .populate('userId', '_id fullName userName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await Report.countDocuments({ userId: context.userId });

    const edges = reports.map((report) => {
      const reportObj = report.toObject();
      // For child's own reports, always show user details even if anonymous
      // (they should be able to see their own reports)
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
    console.error("❌ GetMyReports Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch user reports", {
      extensions: { code: "GET_MY_REPORTS_FAILED" },
    });
  }
};
