import { Report } from "@/models/Report";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";

export const deleteReport = async (
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

    const report = await Report.findById(_id);
    if (!report) {
      throw new GraphQLError("Report not found", {
        extensions: { code: "REPORT_NOT_FOUND" },
      });
    }

    // Only ADMIN and PSYCHOLOGIST can delete reports
    if (user.role !== 'ADMIN' && user.role !== 'PSYCHOLOGIST') {
      throw new GraphQLError("Only administrators and psychologists can delete reports", {
        extensions: { code: "INSUFFICIENT_PERMISSIONS" },
      });
    }

    await Report.findByIdAndDelete(_id);
    return true;
  } catch (error: unknown) {
    console.error("❌ DeleteReport Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to delete report", {
      extensions: { code: "DELETE_REPORT_FAILED" },
    });
  }
};
