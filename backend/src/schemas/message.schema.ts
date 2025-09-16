import gql from "graphql-tag";

export const messageTypeDefs = gql`
  enum MessageType {
    TEXT
    IMAGE
    FILE
    AUDIO
    VIDEO
    SYSTEM
  }

  enum MessageStatus {
    SENT
    DELIVERED
    READ
    FAILED
  }

  type Message {
    _id: ID!
    sender: User!
    recipient: User!
    session: Session
    type: MessageType!
    content: String!
    attachments: [String!]!
    status: MessageStatus!
    isEncrypted: Boolean!
    replyTo: Message
    editedAt: Date
    deletedAt: Date
    createdAt: Date!
    updatedAt: Date!
  }

  type MessageConnection {
    edges: [MessageEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type MessageEdge {
    node: Message!
    cursor: String!
  }

  type Conversation {
    _id: ID!
    participants: [User!]!
    lastMessage: Message
    unreadCount: Int!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  input SendMessageInput {
    recipientId: ID!
    sessionId: ID
    type: MessageType!
    content: String!
    attachments: [String!]
    replyToId: ID
  }

  input UpdateMessageInput {
    content: String
    attachments: [String!]
  }

  input MessageFilters {
    sessionId: ID
    senderId: ID
    recipientId: ID
    type: MessageType
    dateFrom: Date
    dateTo: Date
  }

  extend type Query {
    getMessageById(_id: ID!): Message
    getMessages(filters: MessageFilters, limit: Int, offset: Int): MessageConnection!
    getConversationMessages(conversationId: ID!, limit: Int, offset: Int): MessageConnection!
    getSessionMessages(sessionId: ID!, limit: Int, offset: Int): MessageConnection!
    getConversations(userId: ID!, limit: Int, offset: Int): [Conversation!]!
    getUnreadMessages(userId: ID!): [Message!]!
    searchMessages(query: String!, filters: MessageFilters, limit: Int): MessageConnection!
  }

  extend type Mutation {
    sendMessage(input: SendMessageInput!): Message!
    updateMessage(_id: ID!, input: UpdateMessageInput!): Message!
    deleteMessage(_id: ID!): Message!
    markMessageAsRead(_id: ID!): Message!
    markAllMessagesAsRead(userId: ID!): Boolean!
    createConversation(participantIds: [ID!]!): Conversation!
    archiveConversation(conversationId: ID!): Conversation!
  }

  extend type Subscription {
    messageReceived(userId: ID!): Message!
    messageStatusUpdated(messageId: ID!): Message!
  }
`;
