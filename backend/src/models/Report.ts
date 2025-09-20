import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId; 
  description: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED"; 
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "RESOLVED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>("Report", ReportSchema);
