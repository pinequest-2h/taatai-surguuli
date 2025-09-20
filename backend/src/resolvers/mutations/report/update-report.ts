import { Report } from "@/models/Report";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";

export const updateReport = async (
  _parent: unknown,
  { _id, input }: { _id: string; input: { status?: string; description?: string } },
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

    const report = await Report.findById(_id);
    if (!report) {
      throw new GraphQLError("Report not found", {
        extensions: { code: "REPORT_NOT_FOUND" },
      });
    }

    // Only ADMIN and PSYCHOLOGIST can update reports
    if (user.role !== 'ADMIN' && user.role !== 'PSYCHOLOGIST') {
      throw new GraphQLError("Only administrators and psychologists can update reports", {
        extensions: { code: "INSUFFICIENT_PERMISSIONS" },
      });
    }

    const updateData: { status?: string; description?: string } = {};
    if (input.status) updateData.status = input.status;
    if (input.description) updateData.description = input.description;

    const updatedReport = await Report.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    ).populate('userId', '_id fullName userName email');

    // If report is anonymous, hide user details
    const reportObj = updatedReport?.toObject();
    if (reportObj && report.anonymous) {
      reportObj.userId = null;
    }

    return reportObj;
  } catch (error: unknown) {
    console.error("❌ UpdateReport Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to update report", {
      extensions: { code: "UPDATE_REPORT_FAILED" },
    });
  }
};
