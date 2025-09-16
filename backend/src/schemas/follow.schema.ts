import gql from "graphql-tag";

export const followTypeDefs = gql`
  scalar Date

  # Follow request-ийн статус
  enum FollowRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  # Follow request type
  type FollowRequest {
    _id: ID!
    requester: User! # Follow хүсэлт явуулсан user
    receiver: User! # Follow хүсэлтийг хүлээн авах user
    status: FollowRequestStatus!
    createdAt: Date!
    updatedAt: Date!
  }

  # Follow mutation response
  type FollowResponse {
    success: Boolean!
    message: String!
    request: FollowRequest
  }

  # Queries
  type Query {
    getPendingFollowRequests(userId: ID!): [FollowRequest!]! # User-ийн pending follow requests авах
  }

  # Mutations
  type Mutation {
    followUser(targetUserId: ID!): FollowResponse! # Follow request илгээх
    acceptFollowRequest(requestId: ID!): FollowResponse! # Follow request хүлээн авах
    rejectFollowRequest(requestId: ID!): FollowResponse! # Follow request татгалзах
    unfollowUser(targetUserId: ID!): FollowResponse! # User unfollow хийх
  }
`;
