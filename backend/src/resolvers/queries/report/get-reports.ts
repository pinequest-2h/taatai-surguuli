import { Report } from "@/models/Report";
import { GraphQLError } from "graphql";

export const getReports = async (
  _parent: unknown,
  { filters, limit = 10, offset = 0 }: { 
    filters?: { userId?: string; status?: string }; 
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

    const query: { userId?: string; status?: string } = {};
    
    if (filters?.userId) {
      query.userId = filters.userId;
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
    console.error("❌ GetReports Error:", error);
    throw new GraphQLError("Failed to fetch reports", {
      extensions: { code: "GET_REPORTS_FAILED" },
    });
  }
};
