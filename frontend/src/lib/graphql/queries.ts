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
      languages
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
          hourlyRate
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

// Appointment Queries
export const GET_APPOINTMENT_BY_ID = gql`
  query GetAppointmentById($_id: ID!) {
    getAppointmentById(_id: $_id) {
      _id
      psychologist {
        _id
        fullName
        userName
        profileImage
      }
      child {
        _id
        fullName
        userName
        profileImage
      }
      scheduledDate
      duration
      type
      status
      notes
      location
      isOnline
      meetingLink
      createdAt
      updatedAt
    }
  }
`;

export const GET_APPOINTMENTS = gql`
  query GetAppointments($filters: AppointmentFilters, $limit: Int, $offset: Int) {
    getAppointments(filters: $filters, limit: $limit, offset: $offset) {
      edges {
        node {
          _id
          psychologist {
            _id
            fullName
            userName
            profileImage
          }
          child {
            _id
            fullName
            userName
            profileImage
          }
          scheduledDate
          duration
          type
          status
          notes
          location
          isOnline
          meetingLink
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

export const GET_PSYCHOLOGIST_APPOINTMENTS = gql`
  query GetPsychologistAppointments($psychologistId: ID!, $status: AppointmentStatus, $limit: Int, $offset: Int) {
    getPsychologistAppointments(psychologistId: $psychologistId, status: $status, limit: $limit, offset: $offset) {
      edges {
        node {
          _id
          child {
            _id
            fullName
            userName
            profileImage
          }
          scheduledDate
          duration
          type
          status
          notes
          location
          isOnline
          meetingLink
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

export const GET_CHILD_APPOINTMENTS = gql`
  query GetChildAppointments($childId: ID!, $status: AppointmentStatus, $limit: Int, $offset: Int) {
    getChildAppointments(childId: $childId, status: $status, limit: $limit, offset: $offset) {
      edges {
        node {
          _id
          psychologist {
            _id
            fullName
            userName
            profileImage
          }
          scheduledDate
          duration
          type
          status
          notes
          location
          isOnline
          meetingLink
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

export const GET_UPCOMING_APPOINTMENTS = gql`
  query GetUpcomingAppointments($userId: ID!, $limit: Int) {
    getUpcomingAppointments(userId: $userId, limit: $limit) {
      _id
      psychologist {
        _id
        fullName
        userName
        profileImage
      }
      child {
        _id
        fullName
        userName
        profileImage
      }
      scheduledDate
      duration
      type
      status
      notes
      location
      isOnline
      meetingLink
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

// Feedback Queries
export const GET_FEEDBACK = gql`
  query GetFeedback($filters: FeedbackFilters, $limit: Int, $offset: Int) {
    getFeedback(filters: $filters, limit: $limit, offset: $offset) {
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
          rating
          comment
          sessionId
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
