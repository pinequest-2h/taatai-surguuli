import { Report } from "@/models/Report";
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

    const report = await Report.findById(_id);
    if (!report) {
      throw new GraphQLError("Report not found", {
        extensions: { code: "REPORT_NOT_FOUND" },
      });
    }

    // Only allow the user who created the report or admin to update
    if (report.userId.toString() !== context.userId) {
      throw new GraphQLError("Unauthorized to update this report", {
        extensions: { code: "UNAUTHORIZED" },
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

    return updatedReport?.toObject();
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
