import { Schema, model, Document, models } from "mongoose";

export interface IChildProfile extends Document {
  user: Schema.Types.ObjectId;
  dateOfBirth: Date;
  grade?: string;
  school?: string;
  parentGuardian: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    emergencyContact: {
      name: string;
      phoneNumber: string;
      relationship: string;
    };
  };
  interests: string[];
  goals: string[];
  challenges: string[];
  previousTherapy?: {
    hasPreviousExperience: boolean;
    therapistName?: string;
    duration?: string;
    reasonForEnding?: string;
  };
  preferences: {
    communicationStyle: 'VERBAL' | 'NON_VERBAL' | 'MIXED';
    sessionType: 'INDIVIDUAL' | 'GROUP' | 'FAMILY';
    environment: 'QUIET' | 'ACTIVE' | 'FLEXIBLE';
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChildProfileSchema = new Schema<IChildProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    maxlength: 50
  },
  school: {
    type: String,
    maxlength: 200
  },
  parentGuardian: {
    name: {
      type: String,
      required: true,
      maxlength: 100
    },
    relationship: {
      type: String,
      required: true,
      enum: ['PARENT', 'GUARDIAN', 'GRANDPARENT', 'OTHER']
    },
    phoneNumber: {
      type: String,
      required: true,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      maxlength: 100
    }
  },
  medicalInfo: {
    allergies: [{
      type: String,
      maxlength: 100
    }],
    medications: [{
      type: String,
      maxlength: 100
    }],
    conditions: [{
      type: String,
      maxlength: 100
    }],
    emergencyContact: {
      name: {
        type: String,
        required: true,
        maxlength: 100
      },
      phoneNumber: {
        type: String,
        required: true,
        maxlength: 20
      },
      relationship: {
        type: String,
        required: true,
        maxlength: 50
      }
    }
  },
  interests: [{
    type: String,
    maxlength: 100
  }],
  goals: [{
    type: String,
    maxlength: 200
  }],
  challenges: [{
    type: String,
    maxlength: 200
  }],
  previousTherapy: {
    hasPreviousExperience: {
      type: Boolean,
      default: false
    },
    therapistName: {
      type: String,
      maxlength: 100
    },
    duration: {
      type: String,
      maxlength: 100
    },
    reasonForEnding: {
      type: String,
      maxlength: 200
    }
  },
  preferences: {
    communicationStyle: {
      type: String,
      enum: ['VERBAL', 'NON_VERBAL', 'MIXED'],
      default: 'MIXED'
    },
    sessionType: {
      type: String,
      enum: ['INDIVIDUAL', 'GROUP', 'FAMILY'],
      default: 'INDIVIDUAL'
    },
    environment: {
      type: String,
      enum: ['QUIET', 'ACTIVE', 'FLEXIBLE'],
      default: 'FLEXIBLE'
    }
  }
}, {
  timestamps: true
});

export const ChildProfile = models.ChildProfile || model<IChildProfile>('ChildProfile', ChildProfileSchema);
