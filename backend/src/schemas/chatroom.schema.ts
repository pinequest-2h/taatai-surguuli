import gql from "graphql-tag";

export const chatroomTypeDefs = gql`
  type Chatroom {
    _id: ID!
    child: User!
    psychologist: User!
    isActive: Boolean!
    lastMessage: ChatroomMessage
    lastMessageAt: Date
    unreadCount: UnreadCount!
    createdAt: Date!
    updatedAt: Date!
  }

  type UnreadCount {
    child: Int!
    psychologist: Int!
  }

  type ChatroomMessage {
    _id: ID!
    chatroom: Chatroom!
    sender: User!
    content: String!
    type: MessageType!
    isRead: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  enum MessageType {
    TEXT
    IMAGE
    FILE
    AUDIO
    VIDEO
  }

  input CreateChatroomInput {
    childId: ID!
    psychologistId: ID!
  }

  input SendChatroomMessageInput {
    chatroomId: ID!
    content: String!
    type: MessageType = TEXT
  }

  extend type Query {
    getChatrooms(userId: ID!): [Chatroom!]!
    getChatroomById(_id: ID!): Chatroom
    getChatroomMessages(chatroomId: ID!, limit: Int = 50, offset: Int = 0): [ChatroomMessage!]!
    getOrCreateChatroom(childId: ID!, psychologistId: ID!): Chatroom!
  }

  extend type Mutation {
    createChatroom(input: CreateChatroomInput!): Chatroom!
    sendChatroomMessage(input: SendChatroomMessageInput!): ChatroomMessage!
    markChatroomMessagesAsRead(chatroomId: ID!, userId: ID!): Boolean!
  }

  extend type Subscription {
    chatroomMessageReceived(chatroomId: ID!): ChatroomMessage!
  }
`;
