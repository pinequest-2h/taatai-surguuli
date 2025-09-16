import gql from "graphql-tag";

export const userTypeDefs = gql`
  scalar Date

  enum Gender {
    FEMALE
    MALE
    OTHER
  }

  enum Role {
    CHILD
    PSYCHOLOGIST
    ADMIN
  }

  type User {
    _id: ID!
    fullName: String!
    userName: String!
    email: String
    phoneNumber: String
    profileImage: String
    gender: Gender!
    role: Role!
    isVerified: Boolean!
    isPrivate: Boolean!
    bio: String
    followers: [User!]!
    followings: [User!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type DeleteUserResponse {
    success: Boolean!
    message: String!
    deletedUser: User!
  }

  type ClearSearchHistoryResponse {
    success: Boolean!
    message: String!
  }

  type FollowResponse {
    success: Boolean!
    message: String!
    user: User!
  }

  input CreateUserInput {
    fullName: String!
    userName: String!
    email: String
    phoneNumber: String
    password: String! # зөвхөн input-д үлдээсэн
    bio: String
    profileImage: String
    gender: Gender!
    role: Role!
  }

  input UpdateUserInput {
    fullName: String
    userName: String
    email: String
    phoneNumber: String
    bio: String
    profileImage: String
    gender: Gender
    role: Role
    isPrivate: Boolean
  }

  input LoginInput {
    identifier: String!
    password: String!
  }

  input ForgotPasswordInput {
    identifier: String!
  }

  input ResetPasswordInput {
    identifier: String!
    otp: String!
    newPassword: String!
  }

  input OtpStorageInput {
    identifier: String!
    otp: String!
  }

  input SendVerificationEmailInput {
    email: String!
  }

  type Query {
    hello: String!
    getUserById(_id: ID!): User
    getUserByUsername(userName: String!): User
    searchUsers(keyword: String!): [User!]!
    getUserSearchHistory(userId: ID!): [User!]!
    getUserFollowers(userId: ID!): [User!]!
    getUserFollowings(userId: ID!): [User!]!
  }

  type Mutation {
    sayHello(name: String!): String!
    createUser(input: CreateUserInput!): User!
    loginUser(input: LoginInput!): LoginResponse!
    forgotPassword(input: ForgotPasswordInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Boolean!
    verifyOTP(identifier: String!, otp: String!): Boolean!
    otpStorage(input: OtpStorageInput!): Boolean!
    sendVerificationEmail(input: SendVerificationEmailInput!): Boolean!
    verifyEmailOTP(email: String!, otp: String!): Boolean!
    updateUser(_id: ID!, input: UpdateUserInput!): User!
    deleteUser(userId: ID!): DeleteUserResponse!
    addToSearchHistory(searchedUserId: ID!): User!
    removeFromSearchHistory(searchedUserId: ID!): User!
    clearSearchHistory: ClearSearchHistoryResponse!
    followUser(followUserId: ID!): FollowResponse!
    unfollowUser(unfollowUserId: ID!): FollowResponse!
  }
`;
