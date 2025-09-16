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
  id: string;
  name?: string;
  email?: string;
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

// TODO: Add more generated types as your schema grows
