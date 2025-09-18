import { Schema, model, Document, models } from "mongoose";

export interface IChatroom extends Document {
  child: Schema.Types.ObjectId;
  psychologist: Schema.Types.ObjectId;
  isActive: boolean;
  lastMessage?: Schema.Types.ObjectId;
  lastMessageAt?: Date;
  unreadCount: {
    child: number;
    psychologist: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChatroomSchema = new Schema<IChatroom>({
  child: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  psychologist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'ChatroomMessage'
  },
  lastMessageAt: {
    type: Date
  },
  unreadCount: {
    child: {
      type: Number,
      default: 0
    },
    psychologist: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Ensure one chatroom per child-psychologist pair
ChatroomSchema.index({ child: 1, psychologist: 1 }, { unique: true });

// Index for efficient queries
ChatroomSchema.index({ child: 1, isActive: 1 });
ChatroomSchema.index({ psychologist: 1, isActive: 1 });
ChatroomSchema.index({ lastMessageAt: -1 });

export const Chatroom = models.Chatroom || model<IChatroom>('Chatroom', ChatroomSchema);
