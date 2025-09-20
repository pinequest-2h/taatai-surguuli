import { Report } from "@/models/Report";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";

export const getReports = async (
  _parent: unknown,
  { filters, limit = 10, offset = 0 }: { 
    filters?: { school?: string; class?: string; status?: string }; 
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

    // Check if user exists and has permission
    const user = await User.findById(context.userId);
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    // Only ADMIN and PSYCHOLOGIST can see all reports
    if (user.role !== 'ADMIN' && user.role !== 'PSYCHOLOGIST') {
      throw new GraphQLError("Only administrators and psychologists can view all reports", {
        extensions: { code: "INSUFFICIENT_PERMISSIONS" },
      });
    }

    const query: { school?: string; class?: string; status?: string } = {};
    
    if (filters?.school) {
      query.school = filters.school;
    }
    
    if (filters?.class) {
      query.class = filters.class;
    }
    
    if (filters?.status) {
      query.status = filters.status;
    }

    const reports = await Report.find(query)
      .populate('userId', '_id fullName userName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await Report.countDocuments(query);

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
    console.error("❌ GetReports Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch reports", {
      extensions: { code: "GET_REPORTS_FAILED" },
    });
  }
};
