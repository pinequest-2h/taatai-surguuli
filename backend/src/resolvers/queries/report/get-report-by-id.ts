import { Report } from "@/models/Report";
import { GraphQLError } from "graphql";

export const getReportById = async (
  _parent: unknown,
  { _id }: { _id: string },
  context: { userId?: string }
) => {
  try {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    const report = await Report.findById(_id)
      .populate('userId', '_id fullName userName email');

    if (!report) {
      throw new GraphQLError("Report not found", {
        extensions: { code: "REPORT_NOT_FOUND" },
      });
    }

    return report.toObject();
  } catch (error: unknown) {
    console.error("❌ GetReportById Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch report", {
      extensions: { code: "GET_REPORT_FAILED" },
    });
  }
};
