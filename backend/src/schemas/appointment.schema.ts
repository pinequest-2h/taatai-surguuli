import gql from "graphql-tag";

export const appointmentTypeDefs = gql`
  enum AppointmentStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
    NO_SHOW
  }

  enum AppointmentType {
    CONSULTATION
    THERAPY_SESSION
    FOLLOW_UP
    EMERGENCY
  }

  type Appointment {
    _id: ID!
    psychologist: User!
    child: User!
    scheduledDate: Date!
    duration: Int! # in minutes
    type: AppointmentType!
    status: AppointmentStatus!
    notes: String
    location: String
    isOnline: Boolean!
    meetingLink: String
    createdAt: Date!
    updatedAt: Date!
  }

  type AppointmentConnection {
    edges: [AppointmentEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type AppointmentEdge {
    node: Appointment!
    cursor: String!
  }

  input CreateAppointmentInput {
    psychologistId: ID!
    childId: ID!
    scheduledDate: Date!
    duration: Int!
    type: AppointmentType!
    notes: String
    location: String
    isOnline: Boolean!
    meetingLink: String
  }

  input UpdateAppointmentInput {
    scheduledDate: Date
    duration: Int
    type: AppointmentType
    status: AppointmentStatus
    notes: String
    location: String
    isOnline: Boolean
    meetingLink: String
  }

  input AppointmentFilters {
    psychologistId: ID
    childId: ID
    status: AppointmentStatus
    type: AppointmentType
    dateFrom: Date
    dateTo: Date
  }

  extend type Query {
    getAppointmentById(_id: ID!): Appointment
    getAppointments(filters: AppointmentFilters, limit: Int, offset: Int): AppointmentConnection!
    getPsychologistAppointments(psychologistId: ID!, status: AppointmentStatus, limit: Int, offset: Int): AppointmentConnection!
    getChildAppointments(childId: ID!, status: AppointmentStatus, limit: Int, offset: Int): AppointmentConnection!
    getUpcomingAppointments(userId: ID!, limit: Int): [Appointment!]!
  }

  extend type Mutation {
    createAppointment(input: CreateAppointmentInput!): Appointment!
    updateAppointment(_id: ID!, input: UpdateAppointmentInput!): Appointment!
    cancelAppointment(_id: ID!, reason: String): Appointment!
    confirmAppointment(_id: ID!): Appointment!
    rescheduleAppointment(_id: ID!, newDate: Date!): Appointment!
    completeAppointment(_id: ID!, notes: String): Appointment!
  }
`;
