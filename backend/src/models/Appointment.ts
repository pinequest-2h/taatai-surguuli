import { Schema, model, Document } from "mongoose";

export interface IAppointment extends Document {
  psychologist: Schema.Types.ObjectId;
  child: Schema.Types.ObjectId;
  scheduledDate: Date;
  duration: number; // in minutes
  type: 'CONSULTATION' | 'THERAPY_SESSION' | 'FOLLOW_UP' | 'EMERGENCY';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
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
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 180 // Maximum 3 hours
  },
  type: {
    type: String,
    enum: ['CONSULTATION', 'THERAPY_SESSION', 'FOLLOW_UP', 'EMERGENCY'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'],
    default: 'PENDING'
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  location: {
    type: String,
    maxlength: 200
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Meeting link must be a valid URL'
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
AppointmentSchema.index({ psychologist: 1, scheduledDate: 1 });
AppointmentSchema.index({ child: 1, scheduledDate: 1 });
AppointmentSchema.index({ status: 1, scheduledDate: 1 });

export const Appointment = model<IAppointment>('Appointment', AppointmentSchema);
