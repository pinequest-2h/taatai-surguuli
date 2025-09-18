import { Schema, model, Document, models } from "mongoose";

export interface IChatroomMessage extends Document {
  chatroom: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatroomMessageSchema = new Schema<IChatroomMessage>({
  chatroom: {
    type: Schema.Types.ObjectId,
    ref: 'Chatroom',
    required: true
  },
  sender: {
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
  }
}, {
  timestamps: true
});

// Index for efficient queries
ChatroomMessageSchema.index({ chatroom: 1, createdAt: -1 });
ChatroomMessageSchema.index({ sender: 1 });
ChatroomMessageSchema.index({ isRead: 1 });

export const ChatroomMessage = models.ChatroomMessage || model<IChatroomMessage>('ChatroomMessage', ChatroomMessageSchema);
