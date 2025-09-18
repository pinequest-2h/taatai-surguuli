import { gql } from '@apollo/client';

// User Authentication Mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      fullName
      userName
      email
      role
      isVerified
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      user {
        _id
        fullName
        userName
        email
        role
        isVerified
        isPrivate
        profileImage
      }
      token
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($_id: ID!, $input: UpdateUserInput!) {
    updateUser(_id: $_id, input: $input) {
      _id
      fullName
      userName
      email
      phoneNumber
      profileImage
      gender
      role
      isVerified
      isPrivate
      bio
    }
  }
`;

// Chatroom Mutations
export const CREATE_CHATROOM = gql`
  mutation CreateChatroom($input: CreateChatroomInput!) {
    createChatroom(input: $input) {
      _id
      child {
        _id
        fullName
        userName
        profileImage
      }
      psychologist {
        _id
        fullName
        userName
        profileImage
      }
      isActive
      unreadCount {
        child
        psychologist
      }
      createdAt
      updatedAt
    }
  }
`;

export const SEND_CHATROOM_MESSAGE = gql`
  mutation SendChatroomMessage($input: SendChatroomMessageInput!) {
    sendChatroomMessage(input: $input) {
      _id
      chatroom {
        _id
      }
      sender {
        _id
        fullName
        userName
        profileImage
      }
      content
      type
      isRead
      createdAt
      updatedAt
    }
  }
`;

export const MARK_CHATROOM_MESSAGES_AS_READ = gql`
  mutation MarkChatroomMessagesAsRead($chatroomId: ID!, $userId: ID!) {
    markChatroomMessagesAsRead(chatroomId: $chatroomId, userId: $userId)
  }
`;

// Psychologist Mutations
export const CREATE_PSYCHOLOGIST_PROFILE = gql`
  mutation CreatePsychologistProfile($input: CreatePsychologistProfileInput!) {
    createPsychologistProfile(input: $input) {
      _id
      user {
        _id
        fullName
        userName
        email
      }
      specializations
      experience
      education
      certifications
      languages
      hourlyRate
      bio
      isAcceptingNewClients
      averageRating
    }
  }
`;

export const UPDATE_PSYCHOLOGIST_PROFILE = gql`
  mutation UpdatePsychologistProfile($_id: ID!, $input: UpdatePsychologistProfileInput!) {
    updatePsychologistProfile(_id: $_id, input: $input) {
      _id
      specializations
      experience
      education
      certifications
      languages
      hourlyRate
      bio
      isAcceptingNewClients
    }
  }
`;

// Session Mutations
export const SCHEDULE_SESSION = gql`
  mutation ScheduleSession($input: ScheduleSessionInput!) {
    scheduleSession(input: $input) {
      _id
      psychologist {
        _id
        fullName
      }
      child {
        _id
        fullName
      }
      scheduledDate
      duration
      type
      status
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      _id
      sender {
        _id
        fullName
      }
      recipient {
        _id
        fullName
      }
      content
      type
      createdAt
    }
  }
`;

// Feedback Mutations
export const SUBMIT_FEEDBACK = gql`
  mutation SubmitFeedback($input: SubmitFeedbackInput!) {
    submitFeedback(input: $input) {
      _id
      psychologist {
        _id
        fullName
      }
      child {
        _id
        fullName
      }
      rating
      comment
      sessionId
      createdAt
    }
  }
`;