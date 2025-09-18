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
  isPrivate: boolean;
  bio?: string;
  followers: Schema.Types.ObjectId[];
  followings: Schema.Types.ObjectId[];
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
    isPrivate: { type: Boolean, default: false },
    bio: { type: String },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followings: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {

        if (ret.isPrivate === undefined || ret.isPrivate === null) {
          ret.isPrivate = false;
        }
        return ret;
      }
    },
    toObject: {
      transform: function(doc, ret) {

        if (ret.isPrivate === undefined || ret.isPrivate === null) {
          ret.isPrivate = false;
        }
        return ret;
      }
    }
  }
);

export const User = models.User || model<IUser>("User", userSchema);
