import gql from "graphql-tag";

export const childTypeDefs = gql`
  enum ChildStatus {
    ACTIVE
    INACTIVE
    SUSPENDED
  }

  enum EmergencyContactRelation {
    PARENT
    GUARDIAN
    GRANDPARENT
    SIBLING
    OTHER
  }

  type ChildProfile {
    _id: ID!
    user: User!
    dateOfBirth: Date!
    grade: String
    school: String
    medicalConditions: [String!]!
    allergies: [String!]!
    medications: [String!]!
    emergencyContacts: [EmergencyContact!]!
    parentGuardian: User!
    status: ChildStatus!
    notes: String
    preferences: ChildPreferences!
    createdAt: Date!
    updatedAt: Date!
  }

  type EmergencyContact {
    name: String!
    phone: String!
    email: String
    relation: EmergencyContactRelation!
    isPrimary: Boolean!
  }

  type ChildPreferences {
    communicationStyle: String
    sessionPreferences: [String!]!
    accessibilityNeeds: [String!]!
    language: String
    timezone: String
  }

  type ChildConnection {
    edges: [ChildEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ChildEdge {
    node: ChildProfile!
    cursor: String!
  }

  input CreateChildProfileInput {
    userId: ID!
    dateOfBirth: Date!
    grade: String
    school: String
    medicalConditions: [String!]
    allergies: [String!]
    medications: [String!]
    emergencyContacts: [EmergencyContactInput!]!
    parentGuardianId: ID!
    notes: String
    preferences: ChildPreferencesInput!
  }

  input UpdateChildProfileInput {
    dateOfBirth: Date
    grade: String
    school: String
    medicalConditions: [String!]
    allergies: [String!]
    medications: [String!]
    emergencyContacts: [EmergencyContactInput!]
    notes: String
    preferences: ChildPreferencesInput
    status: ChildStatus
  }

  input EmergencyContactInput {
    name: String!
    phone: String!
    email: String
    relation: EmergencyContactRelation!
    isPrimary: Boolean!
  }

  input ChildPreferencesInput {
    communicationStyle: String
    sessionPreferences: [String!]
    accessibilityNeeds: [String!]
    language: String
    timezone: String
  }

  input ChildFilters {
    parentGuardianId: ID
    grade: String
    school: String
    status: ChildStatus
    hasMedicalConditions: Boolean
  }

  extend type Query {
    getChildProfile(_id: ID!): ChildProfile
    getChildProfiles(filters: ChildFilters, limit: Int, offset: Int): ChildConnection!
    getChildrenByParent(parentId: ID!, limit: Int, offset: Int): ChildConnection!
    getChildSessions(childId: ID!, limit: Int, offset: Int): SessionConnection!
    getChildProgress(childId: ID!): ChildProgress!
  }

  extend type Mutation {
    createChildProfile(input: CreateChildProfileInput!): ChildProfile!
    updateChildProfile(_id: ID!, input: UpdateChildProfileInput!): ChildProfile!
    addEmergencyContact(childId: ID!, contact: EmergencyContactInput!): ChildProfile!
    updateEmergencyContact(childId: ID!, contactId: ID!, contact: EmergencyContactInput!): ChildProfile!
    removeEmergencyContact(childId: ID!, contactId: ID!): ChildProfile!
    updateChildStatus(_id: ID!, status: ChildStatus!): ChildProfile!
  }

  type ChildProgress {
    childId: ID!
    totalSessions: Int!
    completedSessions: Int!
    averageSessionRating: Float
    goalsAchieved: Int!
    totalGoals: Int!
    progressNotes: [String!]!
    lastSessionDate: Date
    nextSessionDate: Date
  }
`;