import { Appointment } from "@/models/Appointment";
import { GraphQLError } from "graphql";

export const getUpcomingAppointments = async (
  _parent: unknown,
  { userId, limit = 10 }: { userId: string; limit?: number }
) => {
  try {
    const now = new Date();
    
    const appointments = await Appointment.find({
      $or: [
        { psychologist: userId },
        { child: userId }
      ],
      scheduledDate: { $gte: now },
      status: { $in: ['PENDING', 'CONFIRMED'] }
    })
    .populate('psychologist', '_id fullName userName profileImage')
    .populate('child', '_id fullName userName profileImage')
    .sort({ scheduledDate: 1 })
    .limit(limit);

    return appointments.map(appointment => appointment.toObject());
  } catch (error: unknown) {
    console.error("❌ GetUpcomingAppointments Error:", error);
    throw new GraphQLError("Failed to fetch upcoming appointments", {
      extensions: { code: "FETCH_APPOINTMENTS_FAILED" },
    });
  }
};
