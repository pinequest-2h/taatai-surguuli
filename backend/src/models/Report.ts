import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId | null; 
  school?: string;
  class?: string;
  description: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED"; 
  anonymous?: boolean;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    school: { type: String, required: false },
    class: { type: String, required: false },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "RESOLVED"],
      default: "PENDING",
    },
    anonymous: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>("Report", ReportSchema);
