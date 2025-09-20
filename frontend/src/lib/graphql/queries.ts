import { gql } from '@apollo/client';

// User Queries
export const GET_USER_BY_ID = gql`
  query GetUserById($_id: ID!) {
    getUserById(_id: $_id) {
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
      followers {
        _id
        fullName
        userName
      }
      followings {
        _id
        fullName
        userName
      }
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      _id
      fullName
      userName
      email
      profileImage
      role
      isVerified
    }
  }
`;

// Psychologist Queries
export const GET_PSYCHOLOGISTS = gql`
  query GetPsychologists {
    getPsychologists {
      _id
      fullName
      userName
      email
      profileImage
      role
      isVerified
    }
  }
`;

export const GET_PSYCHOLOGIST_PROFILE = gql`
  query GetPsychologistProfile($_id: ID!) {
    getPsychologistProfile(_id: $_id) {
      _id
      user {
        _id
        fullName
        userName
        email
        profileImage
      }
      specializations
      experience
      education
      certifications
      hourlyRate
      availability
      bio
      profileImage
      coverImage
      isVerified
      isAcceptingNewClients
      averageRating
      totalSessions
      totalClients
      workingHours {
        monday {
          isAvailable
          startTime
          endTime
        }
        tuesday {
          isAvailable
          startTime
          endTime
        }
        wednesday {
          isAvailable
          startTime
          endTime
        }
        thursday {
          isAvailable
          startTime
          endTime
        }
        friday {
          isAvailable
          startTime
          endTime
        }
        saturday {
          isAvailable
          startTime
          endTime
        }
        sunday {
          isAvailable
          startTime
          endTime
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PSYCHOLOGIST_PROFILES = gql`
  query GetPsychologistProfiles($filters: PsychologistFilters, $limit: Int, $offset: Int) {
    getPsychologistProfiles(filters: $filters, limit: $limit, offset: $offset) {
      edges {
        node {
          _id
          user {
            _id
            fullName
            userName
            profileImage
          }
          specializations
          experience
          bio
          isAcceptingNewClients
          averageRating
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_AVAILABLE_PSYCHOLOGISTS = gql`
  query GetAvailablePsychologists($date: Date!, $time: String!, $duration: Int!) {
    getAvailablePsychologists(date: $date, time: $time, duration: $duration) {
      _id
      user {
        _id
        fullName
        userName
        profileImage
      }
      specializations
      experience
      hourlyRate
      isAcceptingNewClients
    }
  }
`;

// Session Queries
export const GET_SESSIONS = gql`
  query GetSessions($filters: SessionFilters, $limit: Int, $offset: Int) {
    getSessions(filters: $filters, limit: $limit, offset: $offset) {
      edges {
        node {
          _id
          psychologist {
            _id
            fullName
            userName
          }
          child {
            _id
            fullName
            userName
          }
          scheduledDate
          duration
          type
          status
          notes
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Message Queries
export const GET_MESSAGES = gql`
  query GetMessages($filters: MessageFilters, $limit: Int, $offset: Int) {
    getMessages(filters: $filters, limit: $limit, offset: $offset) {
      edges {
        node {
          _id
          sender {
            _id
            fullName
            userName
            profileImage
          }
          recipient {
            _id
            fullName
            userName
            profileImage
          }
          content
          type
          isRead
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Chatroom Queries
export const GET_CHATROOMS = gql`
  query GetChatrooms($userId: ID!) {
    getChatrooms(userId: $userId) {
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
      lastMessage {
        _id
        content
        createdAt
      }
      lastMessageAt
      unreadCount {
        child
        psychologist
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CHATROOM_BY_ID = gql`
  query GetChatroomById($_id: ID!) {
    getChatroomById(_id: $_id) {
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
      lastMessage {
        _id
        content
        createdAt
      }
      lastMessageAt
      unreadCount {
        child
        psychologist
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CHATROOM_MESSAGES = gql`
  query GetChatroomMessages($chatroomId: ID!, $limit: Int, $offset: Int) {
    getChatroomMessages(chatroomId: $chatroomId, limit: $limit, offset: $offset) {
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

export const GET_OR_CREATE_CHATROOM = gql`
  query GetOrCreateChatroom($childId: ID!, $psychologistId: ID!) {
    getOrCreateChatroom(childId: $childId, psychologistId: $psychologistId) {
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
      lastMessage {
        _id
        content
        createdAt
      }
      lastMessageAt
      unreadCount {
        child
        psychologist
      }
      createdAt
      updatedAt
    }
  }
`;

// Report Queries
export const GET_REPORTS = gql`
  query GetReports($filters: ReportFilters, $limit: Int, $offset: Int) {
    getReports(filters: $filters, limit: $limit, offset: $offset) {
      edges {
        node {
          _id
          userId {
            _id
            fullName
            userName
            email
            profileImage
          }
          description
          status
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_REPORT_BY_ID = gql`
  query GetReportById($_id: ID!) {
    getReportById(_id: $_id) {
      _id
      userId {
        _id
        fullName
        userName
        email
        profileImage
      }
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_REPORTS = gql`
  query GetUserReports($userId: ID!, $limit: Int, $offset: Int) {
    getUserReports(userId: $userId, limit: $limit, offset: $offset) {
      edges {
        node {
          _id
          userId {
            _id
            fullName
            userName
            email
            profileImage
          }
          description
          status
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;
