import { Appointment } from "@/models/Appointment";
import { GraphQLError } from "graphql";

export const getAppointments = async (
  _parent: unknown,
  { filters, limit = 20, offset = 0 }: { 
    filters?: any; 
    limit?: number; 
    offset?: number 
  }
) => {
  try {
    const query: any = {};
    
    if (filters) {
      if (filters.psychologistId) query.psychologist = filters.psychologistId;
      if (filters.childId) query.child = filters.childId;
      if (filters.status) query.status = filters.status;
      if (filters.type) query.type = filters.type;
      if (filters.dateFrom || filters.dateTo) {
        query.scheduledDate = {};
        if (filters.dateFrom) query.scheduledDate.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) query.scheduledDate.$lte = new Date(filters.dateTo);
      }
    }

    const appointments = await Appointment.find(query)
      .populate('psychologist', '_id fullName userName profileImage')
      .populate('child', '_id fullName userName profileImage')
      .sort({ scheduledDate: -1 })
      .skip(offset)
      .limit(limit);

    const totalCount = await Appointment.countDocuments(query);

    return {
      edges: appointments.map(appointment => ({
        node: appointment.toObject(),
        cursor: appointment._id.toString(),
      })),
      pageInfo: {
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        startCursor: appointments[0]?._id.toString(),
        endCursor: appointments[appointments.length - 1]?._id.toString(),
      },
      totalCount,
    };
  } catch (error: unknown) {
    console.error("❌ GetAppointments Error:", error);
    throw new GraphQLError("Failed to fetch appointments", {
      extensions: { code: "FETCH_APPOINTMENTS_FAILED" },
    });
  }
};

export const getPsychologistAppointments = async (
  _parent: unknown,
  { psychologistId, status, limit = 20, offset = 0 }: { 
    psychologistId: string; 
    status?: string; 
    limit?: number; 
    offset?: number 
  }
) => {
  try {
    const query: any = { psychologist: psychologistId };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('child', '_id fullName userName profileImage')
      .sort({ scheduledDate: -1 })
      .skip(offset)
      .limit(limit);

    const totalCount = await Appointment.countDocuments(query);

    return {
      edges: appointments.map(appointment => ({
        node: appointment.toObject(),
        cursor: appointment._id.toString(),
      })),
      pageInfo: {
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        startCursor: appointments[0]?._id.toString(),
        endCursor: appointments[appointments.length - 1]?._id.toString(),
      },
      totalCount,
    };
  } catch (error: unknown) {
    console.error("❌ GetPsychologistAppointments Error:", error);
    throw new GraphQLError("Failed to fetch psychologist appointments", {
      extensions: { code: "FETCH_APPOINTMENTS_FAILED" },
    });
  }
};

export const getChildAppointments = async (
  _parent: unknown,
  { childId, status, limit = 20, offset = 0 }: { 
    childId: string; 
    status?: string; 
    limit?: number; 
    offset?: number 
  }
) => {
  try {
    const query: any = { child: childId };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('psychologist', '_id fullName userName profileImage')
      .sort({ scheduledDate: -1 })
      .skip(offset)
      .limit(limit);

    const totalCount = await Appointment.countDocuments(query);

    return {
      edges: appointments.map(appointment => ({
        node: appointment.toObject(),
        cursor: appointment._id.toString(),
      })),
      pageInfo: {
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        startCursor: appointments[0]?._id.toString(),
        endCursor: appointments[appointments.length - 1]?._id.toString(),
      },
      totalCount,
    };
  } catch (error: unknown) {
    console.error("❌ GetChildAppointments Error:", error);
    throw new GraphQLError("Failed to fetch child appointments", {
      extensions: { code: "FETCH_APPOINTMENTS_FAILED" },
    });
  }
};
