import gql from "graphql-tag";

export const sessionTypeDefs = gql`
  enum SessionStatus {
    SCHEDULED
    IN_PROGRESS
    COMPLETED
    CANCELLED
    NO_SHOW
  }

  enum SessionType {
    INDIVIDUAL
    GROUP
    FAMILY
    COUPLES
  }

  type Session {
    _id: ID!
    psychologist: User!
    child: User!
    type: SessionType!
    status: SessionStatus!
    startTime: Date
    endTime: Date
    duration: Int # in minutes
    notes: String
    goals: [String!]!
    progress: String
    homework: String
    nextSessionDate: Date
    createdAt: Date!
    updatedAt: Date!
  }

  type SessionConnection {
    edges: [SessionEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type SessionEdge {
    node: Session!
    cursor: String!
  }

  input CreateSessionInput {
    psychologistId: ID!
    childId: ID!
    type: SessionType!
    goals: [String!]!
    notes: String
  }

  input UpdateSessionInput {
    type: SessionType
    status: SessionStatus
    notes: String
    goals: [String!]
    progress: String
    homework: String
    nextSessionDate: Date
  }

  input SessionFilters {
    psychologistId: ID
    childId: ID
    status: SessionStatus
    type: SessionType
    dateFrom: Date
    dateTo: Date
  }

  extend type Query {
    getSessionById(_id: ID!): Session
    getSessions(filters: SessionFilters, limit: Int, offset: Int): SessionConnection!
    getPsychologistSessions(psychologistId: ID!, status: SessionStatus, limit: Int, offset: Int): SessionConnection!
    getChildSessions(childId: ID!, status: SessionStatus, limit: Int, offset: Int): SessionConnection!
    getSessionHistory(childId: ID!, limit: Int, offset: Int): SessionConnection!
  }

  extend type Mutation {
    createSession(input: CreateSessionInput!): Session!
    updateSession(_id: ID!, input: UpdateSessionInput!): Session!
    startSession(_id: ID!): Session!
    endSession(_id: ID!, notes: String, progress: String): Session!
    cancelSession(_id: ID!, reason: String): Session!
    addSessionNotes(_id: ID!, notes: String!): Session!
    updateSessionProgress(_id: ID!, progress: String!): Session!
    assignHomework(_id: ID!, homework: String!): Session!
  }
`;
