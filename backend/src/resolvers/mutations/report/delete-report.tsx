import { Report } from "@/models/Report";
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

    const report = await Report.findById(_id);
    if (!report) {
      throw new GraphQLError("Report not found", {
        extensions: { code: "REPORT_NOT_FOUND" },
      });
    }

    // Only allow the user who created the report or admin to delete
    if (report.userId.toString() !== context.userId) {
      throw new GraphQLError("Unauthorized to delete this report", {
        extensions: { code: "UNAUTHORIZED" },
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
