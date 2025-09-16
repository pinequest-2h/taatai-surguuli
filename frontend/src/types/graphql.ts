// GraphQL response types
export interface User {
  _id: string;
  fullName: string;
  userName: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  role: 'CHILD' | 'PSYCHOLOGIST' | 'ADMIN';
  isVerified: boolean;
  isPrivate: boolean;
  bio?: string;
  followers: User[];
  followings: User[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface PsychologistProfile {
  _id: string;
  user: User;
  specializations: string[];
  experience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  hourlyRate: number;
  availability: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  isVerified: boolean;
  isAcceptingNewClients: boolean;
  averageRating?: number;
  totalSessions: number;
  totalClients: number;
  workingHours: {
    monday: { isAvailable: boolean; startTime?: string; endTime?: string };
    tuesday: { isAvailable: boolean; startTime?: string; endTime?: string };
    wednesday: { isAvailable: boolean; startTime?: string; endTime?: string };
    thursday: { isAvailable: boolean; startTime?: string; endTime?: string };
    friday: { isAvailable: boolean; startTime?: string; endTime?: string };
    saturday: { isAvailable: boolean; startTime?: string; endTime?: string };
    sunday: { isAvailable: boolean; startTime?: string; endTime?: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  psychologist: User;
  child: User;
  scheduledDate: string;
  duration: number;
  type: 'CONSULTATION' | 'THERAPY_SESSION' | 'FOLLOW_UP' | 'EMERGENCY';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PsychologistConnection {
  edges: { node: PsychologistProfile; cursor: string }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface AppointmentConnection {
  edges: { node: Appointment; cursor: string }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

// GraphQL response types
export interface GetUpcomingAppointmentsResponse {
  getUpcomingAppointments: Appointment[];
}

export interface GetPsychologistProfileResponse {
  getPsychologistProfile: PsychologistProfile;
}

export interface GetPsychologistProfilesResponse {
  getPsychologistProfiles: PsychologistConnection;
}

export interface GetChildAppointmentsResponse {
  getChildAppointments: AppointmentConnection;
}

export interface GetPsychologistAppointmentsResponse {
  getPsychologistAppointments: AppointmentConnection;
}

export interface LoginUserResponse {
  loginUser: LoginResponse;
}

export interface CreateUserResponse {
  createUser: User;
}

export interface CreateAppointmentResponse {
  createAppointment: Appointment;
}