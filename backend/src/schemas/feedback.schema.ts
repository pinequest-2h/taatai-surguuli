import gql from "graphql-tag";

export const feedbackTypeDefs = gql`
  enum FeedbackType {
    SESSION_FEEDBACK
    PSYCHOLOGIST_RATING
    PLATFORM_FEEDBACK
    TECHNICAL_ISSUE
    SUGGESTION
  }

  enum Rating {
    VERY_POOR
    POOR
    AVERAGE
    GOOD
    EXCELLENT
  }

  type Feedback {
    _id: ID!
    user: User!
    session: Session
    psychologist: User
    type: FeedbackType!
    rating: Rating
    title: String!
    content: String!
    isAnonymous: Boolean!
    isPublic: Boolean!
    tags: [String!]!
    attachments: [String!]!
    status: String! # PENDING, REVIEWED, RESOLVED
    response: String
    respondedBy: User
    respondedAt: Date
    createdAt: Date!
    updatedAt: Date!
  }

  type FeedbackConnection {
    edges: [FeedbackEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type FeedbackEdge {
    node: Feedback!
    cursor: String!
  }

  type FeedbackStats {
    totalFeedback: Int!
    averageRating: Float!
    ratingDistribution: [RatingCount!]!
    feedbackByType: [TypeCount!]!
  }

  type RatingCount {
    rating: Rating!
    count: Int!
  }

  type TypeCount {
    type: FeedbackType!
    count: Int!
  }

  input CreateFeedbackInput {
    sessionId: ID
    psychologistId: ID
    type: FeedbackType!
    rating: Rating
    title: String!
    content: String!
    isAnonymous: Boolean
    isPublic: Boolean
    tags: [String!]
    attachments: [String!]
  }

  input UpdateFeedbackInput {
    title: String
    content: String
    rating: Rating
    isPublic: Boolean
    tags: [String!]
    attachments: [String!]
  }

  input FeedbackFilters {
    userId: ID
    psychologistId: ID
    sessionId: ID
    type: FeedbackType
    rating: Rating
    isPublic: Boolean
    dateFrom: Date
    dateTo: Date
  }

  extend type Query {
    getFeedbackById(_id: ID!): Feedback
    getFeedback(filters: FeedbackFilters, limit: Int, offset: Int): FeedbackConnection!
    getPsychologistFeedback(psychologistId: ID!, limit: Int, offset: Int): FeedbackConnection!
    getPublicFeedback(limit: Int, offset: Int): FeedbackConnection!
    getFeedbackStats(psychologistId: ID): FeedbackStats!
    getMyFeedback(userId: ID!, limit: Int, offset: Int): FeedbackConnection!
  }

  extend type Mutation {
    createFeedback(input: CreateFeedbackInput!): Feedback!
    updateFeedback(_id: ID!, input: UpdateFeedbackInput!): Feedback!
    deleteFeedback(_id: ID!): Boolean!
    respondToFeedback(_id: ID!, response: String!): Feedback!
    markFeedbackAsResolved(_id: ID!): Feedback!
    reportFeedback(_id: ID!, reason: String!): Boolean!
  }
`;
