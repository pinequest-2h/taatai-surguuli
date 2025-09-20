import { Report } from "@/models/Report";
import { GraphQLError } from "graphql";

export const createReport = async (
  _parent: unknown,
  { input }: { input: { description: string } },
  context: { userId?: string }
) => {
  try {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    const report = new Report({
      userId: context.userId,
      description: input.description,
      status: "PENDING",
    });

    await report.save();

    const populatedReport = await Report.findById(report._id)
      .populate('userId', '_id fullName userName email');

    return populatedReport?.toObject();
  } catch (error: unknown) {
    console.error("❌ CreateReport Error:", error);
    throw new GraphQLError("Failed to create report", {
      extensions: { code: "CREATE_REPORT_FAILED" },
    });
  }
};
