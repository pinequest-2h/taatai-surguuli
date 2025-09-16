import { Schema, model, Document, models } from "mongoose";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  userName: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  profileImage?: string;
  gender: "FEMALE" | "MALE" | "OTHER";
  role: "CHILD" | "PSYCHOLOGIST" | "ADMIN";
  isVerified: boolean;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    profileImage: { type: String },
    gender: { type: String, enum: ["FEMALE", "MALE", "OTHER"], required: true },
    role: { type: String, enum: ["CHILD", "PSYCHOLOGIST", "ADMIN"], required: true },
    isVerified: { type: Boolean, default: false },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model<IUser>("User", userSchema);
