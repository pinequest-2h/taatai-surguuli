import { Report } from "@/models/Report";
import { User } from "@/models/User";
import { GraphQLError } from "graphql";

export const createReport = async (
  _parent: unknown,
  { input }: { input: { school: string; class: string; description: string; anonymous: boolean } },
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
      throw new GraphQLError("Only children can create reports", {
        extensions: { code: "INSUFFICIENT_PERMISSIONS" },
      });
    }

    const report = new Report({
      userId: context.userId,
      school: input.school,
      class: input.class,
      description: input.description,
      anonymous: input.anonymous,
      status: "PENDING",
    });

    await report.save();

    // Populate user data only if not anonymous
    const populatedReport = await Report.findById(report._id)
      .populate('userId', '_id fullName userName email');

    // If anonymous, hide user details
    const reportObj = populatedReport?.toObject();
    if (reportObj && input.anonymous) {
      reportObj.userId = null;
    }

    return reportObj;
  } catch (error: unknown) {
    console.error("❌ CreateReport Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to create report", {
      extensions: { code: "CREATE_REPORT_FAILED" },
    });
  }
};
