// Generated types file
// This file can be auto-generated using GraphQL Code Generator
// Run: npm run codegen to generate types from your GraphQL schema

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  fullName: string;
  userName: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  gender: "FEMALE" | "MALE" | "OTHER";
  role: "CHILD" | "PSYCHOLOGIST" | "ADMIN";
  bio?: string;
}

export interface CreatePsychologistInput {
  fullName: string;
  userName: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  gender: "FEMALE" | "MALE" | "OTHER";
  bio?: string;
}

export interface UpdateUserInput {
  fullName?: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
  gender?: "FEMALE" | "MALE" | "OTHER";
  role?: "CHILD" | "PSYCHOLOGIST" | "ADMIN";
  isPrivate?: boolean;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface UserConnection {
  edges: UserEdge[];
  pageInfo: PageInfo;
}

export interface UserEdge {
  node: User;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export interface Error {
  message: string;
  code?: string;
}

export type Specialization =
  | "CHILD_PSYCHOLOGY"
  | "ADOLESCENT_PSYCHOLOGY"
  | "FAMILY_THERAPY"
  | "COGNITIVE_BEHAVIORAL_THERAPY"
  | "TRAUMA_THERAPY"
  | "ANXIETY_DISORDERS"
  | "DEPRESSION"
  | "AUTISM_SPECTRUM"
  | "LEARNING_DISABILITIES"
  | "BEHAVIORAL_ISSUES"
  | "SOCIAL_SKILLS"
  | "EMOTIONAL_REGULATION";

export interface TimeSlotInput {
  startTime: string;
  endTime: string;
}

export interface DayScheduleInput {
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  breaks: TimeSlotInput[];
}

export interface WorkingHoursInput {
  monday?: DayScheduleInput;
  tuesday?: DayScheduleInput;
  wednesday?: DayScheduleInput;
  thursday?: DayScheduleInput;
  friday?: DayScheduleInput;
  saturday?: DayScheduleInput;
  sunday?: DayScheduleInput;
}

export interface CreatePsychologistProfileInput {
  specializations: Specialization[];
  experience: number;
  education: string[];
  certifications: string[];
  hourlyRate: number;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  isAcceptingNewClients?: boolean;
  workingHours: WorkingHoursInput;
}

// Report related generated types
export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED";

export interface CreateReportInput {
  description: string;
}

export interface UpdateReportInput {
  status?: ReportStatus;
  description?: string;
}

export interface ReportFilters {
  userId?: string;
  status?: ReportStatus;
}
