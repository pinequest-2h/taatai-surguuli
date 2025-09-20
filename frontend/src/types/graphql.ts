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

// GraphQL response types
export interface GetPsychologistProfileResponse {
  getPsychologistProfile: PsychologistProfile;
}

export interface GetPsychologistProfilesResponse {
  getPsychologistProfiles: PsychologistConnection;
}

export interface LoginUserResponse {
  loginUser: LoginResponse;
}

export interface CreateUserResponse {
  createUser: User;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface GetChatroomsResponse {
  getChatrooms: Chatroom[];
}

export interface Chatroom {
  _id: string;
  child: User;
  psychologist: User;
  isActive: boolean;
  lastMessage?: ChatroomMessage;
  lastMessageAt?: string;
  unreadCount: UnreadCount;
  createdAt: string;
  updatedAt: string;
}

export interface UnreadCount {
  child: number;
  psychologist: number;
  [key: string]: number;
}

export interface ChatroomMessage {
  _id: string;
  chatroom: Chatroom;
  sender: User;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface Report {
  _id: string;
  userId: User | null;
  school?: string;
  class?: string;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  anonymous?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportConnection {
  edges: { node: Report; cursor: string }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface CreateReportInput {
  school: string;
  class: string;
  description: string;
  anonymous: boolean;
}

export interface UpdateReportInput {
  status?: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  description?: string;
}

export interface ReportFilters {
  school?: string;
  class?: string;
  status?: 'PENDING' | 'REVIEWED' | 'RESOLVED';
}

// Report Response Types
export interface CreateReportResponse {
  createReport: Report;
}

export interface UpdateReportResponse {
  updateReport: Report;
}

export interface GetReportsResponse {
  getReports: ReportConnection;
}

export interface GetMyReportsResponse {
  getMyReports: ReportConnection;
}

export interface GetReportByIdResponse {
  getReportById: Report;
}