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
      bio
    }
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

// Appointment Mutations
export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
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
      location
      isOnline
      meetingLink
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($_id: ID!, $input: UpdateAppointmentInput!) {
    updateAppointment(_id: $_id, input: $input) {
      _id
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

export const CANCEL_APPOINTMENT = gql`
  mutation CancelAppointment($_id: ID!, $reason: String) {
    cancelAppointment(_id: $_id, reason: $reason) {
      _id
      status
    }
  }
`;

export const CONFIRM_APPOINTMENT = gql`
  mutation ConfirmAppointment($_id: ID!) {
    confirmAppointment(_id: $_id) {
      _id
      status
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