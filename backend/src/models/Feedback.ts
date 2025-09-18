import { Schema, model, Document, models } from "mongoose";

export interface IFeedback extends Document {
  session: Schema.Types.ObjectId;
  psychologist: Schema.Types.ObjectId;
  child: Schema.Types.ObjectId;
  rating: number; // 1-5 stars
  comment?: string;
  categories: {
    communication: number; // 1-5
    professionalism: number; // 1-5
    helpfulness: number; // 1-5
    punctuality: number; // 1-5
    environment: number; // 1-5
  };
  wouldRecommend: boolean;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  session: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  categories: {
    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    helpfulness: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    environment: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  wouldRecommend: {
    type: Boolean,
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
FeedbackSchema.index({ psychologist: 1, createdAt: -1 });
FeedbackSchema.index({ session: 1 });
FeedbackSchema.index({ rating: 1 });

export const Feedback = models.Feedback || model<IFeedback>('Feedback', FeedbackSchema);
