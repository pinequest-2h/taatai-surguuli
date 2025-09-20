import { Report } from "@/models/Report";
import { User } from "@/models/User";
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

    // Check if user exists
    const user = await User.findById(context.userId);
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    const report = await Report.findById(_id)
      .populate('userId', '_id fullName userName email');

    if (!report) {
      throw new GraphQLError("Report not found", {
        extensions: { code: "REPORT_NOT_FOUND" },
      });
    }

    // Access control: CHILD users can only see their own reports
    // ADMIN and PSYCHOLOGIST can see all reports
    if (user.role === 'CHILD' && report.userId && report.userId._id.toString() !== context.userId) {
      throw new GraphQLError("You can only view your own reports", {
        extensions: { code: "INSUFFICIENT_PERMISSIONS" },
      });
    }

    const reportObj = report.toObject();
    
    // Hide user details if report is anonymous (except for the creator)
    if (report.anonymous && report.userId && report.userId._id.toString() !== context.userId) {
      reportObj.userId = null;
    }

    return reportObj;
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
