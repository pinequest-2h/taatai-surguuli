import { CreateAppointmentInput } from "@/types/generated";
import { Appointment } from "@/models/Appointment";
import { GraphQLError } from "graphql";

export const createAppointment = async (
  _parent: unknown,
  { input }: { input: CreateAppointmentInput },
  context: { userId?: string }
) => {
  try {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    const appointment = new Appointment({
      ...input,
      child: context.userId, // Set the child to the authenticated user
      status: 'PENDING',
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('psychologist', '_id fullName userName profileImage')
      .populate('child', '_id fullName userName profileImage');

    return populatedAppointment?.toObject();
  } catch (error: unknown) {
    console.error("❌ CreateAppointment Error:", error);
    throw new GraphQLError("Failed to create appointment", {
      extensions: { code: "CREATE_APPOINTMENT_FAILED" },
    });
  }
};
