import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  session: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  recipient: Schema.Types.ObjectId;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
  isRead: boolean;
  attachments?: Array<{
    filename: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  session: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO'],
    default: 'TEXT'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
MessageSchema.index({ session: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ isRead: 1 });

export const Message = model<IMessage>('Message', MessageSchema);
