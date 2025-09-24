import gql from "graphql-tag";

export const psychologistTypeDefs = gql`
  enum Specialization {
    CHILD_PSYCHOLOGY
    ADOLESCENT_PSYCHOLOGY
    FAMILY_THERAPY
    COGNITIVE_BEHAVIORAL_THERAPY
    TRAUMA_THERAPY
    ANXIETY_DISORDERS
    DEPRESSION
    AUTISM_SPECTRUM
    LEARNING_DISABILITIES
    BEHAVIORAL_ISSUES
    SOCIAL_SKILLS
    EMOTIONAL_REGULATION
  }

  enum AvailabilityStatus {
    AVAILABLE
    BUSY
    OFFLINE
    ON_BREAK
  }

  type PsychologistProfile {
    _id: ID!
    user: User!
    specializations: [Specialization!]!
    experience: Int! # years of experience
    education: [String!]!
    certifications: [String!]!
    hourlyRate: Float!
    availability: AvailabilityStatus!
    workingHours: WorkingHours!
    bio: String!
    profileImage: String
    coverImage: String
    isVerified: Boolean!
    isAcceptingNewClients: Boolean!
    averageRating: Float
    totalSessions: Int!
    totalClients: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type WorkingHours {
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
    sunday: DaySchedule
  }

  type DaySchedule {
    isAvailable: Boolean!
    startTime: String
    endTime: String
    breaks: [TimeSlot!]!
  }

  type TimeSlot {
    startTime: String!
    endTime: String!
  }

  type PsychologistConnection {
    edges: [PsychologistEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PsychologistEdge {
    node: PsychologistProfile!
    cursor: String!
  }

  input CreatePsychologistProfileInput {
    specializations: [Specialization!]!
    experience: Int!
    education: [String!]!
    certifications: [String!]!
    hourlyRate: Float!
    bio: String!
    profileImage: String
    coverImage: String
    isAcceptingNewClients: Boolean
    workingHours: WorkingHoursInput!
  }

  input UpdatePsychologistProfileInput {
    specializations: [Specialization!]
    experience: Int
    education: [String!]
    certifications: [String!]
    hourlyRate: Float
    bio: String
    profileImage: String
    coverImage: String
    isAcceptingNewClients: Boolean
    workingHours: WorkingHoursInput
  }

  input WorkingHoursInput {
    monday: DayScheduleInput
    tuesday: DayScheduleInput
    wednesday: DayScheduleInput
    thursday: DayScheduleInput
    friday: DayScheduleInput
    saturday: DayScheduleInput
    sunday: DayScheduleInput
  }

  input DayScheduleInput {
    isAvailable: Boolean!
    startTime: String
    endTime: String
    breaks: [TimeSlotInput!]!
  }

  input TimeSlotInput {
    startTime: String!
    endTime: String!
  }

  input PsychologistFilters {
    specializations: [Specialization!]
    minExperience: Int
    maxHourlyRate: Float
    isAcceptingNewClients: Boolean
    availability: AvailabilityStatus
    location: String
  }

  extend type Query {
    getPsychologists: [User!]!
    getPsychologistById(_id: ID!): User
    searchPsychologists(keyword: String!): [User!]!
    getPsychologistProfile(_id: ID!): PsychologistProfile
    getPsychologistProfileByUserId(userId: ID!): PsychologistProfile
    getPsychologistProfiles(filters: PsychologistFilters, limit: Int, offset: Int): PsychologistConnection!
    getAvailablePsychologists(date: Date!, time: String!, duration: Int!): [PsychologistProfile!]!
    getPsychologistStats(_id: ID!): PsychologistStats!
  }

  extend type Mutation {
    createPsychologistProfile(input: CreatePsychologistProfileInput!): PsychologistProfile!
    updatePsychologistProfile(input: UpdatePsychologistProfileInput!): PsychologistProfile!
    updateAvailability(_id: ID!, status: AvailabilityStatus!): PsychologistProfile!
    updateWorkingHours(_id: ID!, workingHours: WorkingHoursInput!): PsychologistProfile!
    verifyPsychologist(_id: ID!): PsychologistProfile!
    suspendPsychologist(_id: ID!, reason: String!): PsychologistProfile!
  }

  type PsychologistStats {
    totalSessions: Int!
    totalClients: Int!
    averageRating: Float!
    totalEarnings: Float!
    thisMonthSessions: Int!
    thisMonthEarnings: Float!
    completedSessions: Int!
  }
`;
