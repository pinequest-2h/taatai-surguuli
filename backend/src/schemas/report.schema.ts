import gql from "graphql-tag";

export const reportTypeDefs = gql`
  enum ReportStatus {
    PENDING
    REVIEWED
    RESOLVED
  }

  type Report {
    _id: ID!
    userId: User!
    description: String!
    status: ReportStatus!
    createdAt: Date!
    updatedAt: Date!
  }

  type ReportConnection {
    edges: [ReportEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ReportEdge {
    node: Report!
    cursor: String!
  }

  input ReportFilters {
    userId: ID
    status: ReportStatus
  }

  input CreateReportInput {
    description: String!
  }

  input UpdateReportInput {
    status: ReportStatus
    description: String
  }

  extend type Query {
    getReportById(_id: ID!): Report
    getReports(
      filters: ReportFilters
      limit: Int
      offset: Int
    ): ReportConnection!
    getUserReports(userId: ID!, limit: Int, offset: Int): ReportConnection!
  }

  extend type Mutation {
    createReport(input: CreateReportInput!): Report!
    updateReport(_id: ID!, input: UpdateReportInput!): Report!
    deleteReport(_id: ID!): Boolean!
  }
`;
