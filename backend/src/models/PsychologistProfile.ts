import { Schema, model, Document, models } from "mongoose";

export interface IPsychologistProfile extends Document {
  user: Schema.Types.ObjectId;
  specializations: string[];
  experience: number;
  education: string[];
  certifications: string[];
  hourlyRate: number;
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE' | 'ON_BREAK';
  workingHours: {
    monday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    tuesday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    wednesday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    thursday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    friday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    saturday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    sunday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
  };
  bio: string;
  profileImage?: string;
  coverImage?: string;
  isVerified: boolean;
  isAcceptingNewClients: boolean;
  averageRating?: number;
  totalSessions: number;
  totalClients: number;
  createdAt: Date;
  updatedAt: Date;
}

const PsychologistProfileSchema = new Schema<IPsychologistProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specializations: [{
    type: String,
    enum: [
      'CHILD_PSYCHOLOGY',
      'ADOLESCENT_PSYCHOLOGY',
      'FAMILY_THERAPY',
      'COGNITIVE_BEHAVIORAL_THERAPY',
      'TRAUMA_THERAPY',
      'ANXIETY_DISORDERS',
      'DEPRESSION',
      'AUTISM_SPECTRUM',
      'LEARNING_DISABILITIES',
      'BEHAVIORAL_ISSUES',
      'SOCIAL_SKILLS',
      'EMOTIONAL_REGULATION'
    ],
    required: true
  }],

  
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  education: [{
    type: String,
    required: true
  }],
  certifications: [{
    type: String
  }],
  
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: String,
    enum: ['AVAILABLE', 'BUSY', 'OFFLINE', 'ON_BREAK'],
    default: 'OFFLINE'
  },
  workingHours: {
    monday: {
      isAvailable: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breaks: [{
        startTime: String,
        endTime: String
      }]
    },
    tuesday: {
      isAvailable: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breaks: [{
        startTime: String,
        endTime: String
      }]
    },
    wednesday: {
      isAvailable: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breaks: [{
        startTime: String,
        endTime: String
      }]
    },
    thursday: {
      isAvailable: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breaks: [{
        startTime: String,
        endTime: String
      }]
    },
    friday: {
      isAvailable: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breaks: [{
        startTime: String,
        endTime: String
      }]
    },
    saturday: {
      isAvailable: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breaks: [{
        startTime: String,
        endTime: String
      }]
    },
    sunday: {
      isAvailable: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breaks: [{
        startTime: String,
        endTime: String
      }]
    }
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  profileImage: String,
  coverImage: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isAcceptingNewClients: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  totalClients: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

export const PsychologistProfile = models.PsychologistProfile || model<IPsychologistProfile>('PsychologistProfile', PsychologistProfileSchema);
