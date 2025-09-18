import { Schema, model, Document, models } from "mongoose";

export interface ISession extends Document {
  psychologist: Schema.Types.ObjectId;
  child: Schema.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  goals?: string[];
  progress?: string;
  homework?: string;
  nextSessionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>({
  psychologist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  child: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 180
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
    default: 'SCHEDULED'
  },
  notes: {
    type: String,
    maxlength: 2000
  },
  goals: [{
    type: String,
    maxlength: 200
  }],
  progress: {
    type: String,
    maxlength: 1000
  },
  homework: {
    type: String,
    maxlength: 1000
  },
  nextSessionDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
SessionSchema.index({ psychologist: 1, startTime: 1 });
SessionSchema.index({ child: 1, startTime: 1 });
SessionSchema.index({ status: 1, startTime: 1 });

export const Session = models.Session || model<ISession>('Session', SessionSchema);
