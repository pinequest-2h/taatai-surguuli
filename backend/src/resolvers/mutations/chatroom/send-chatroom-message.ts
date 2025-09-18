import { GraphQLError } from "graphql";
import { Chatroom } from "@/models/Chatroom";
import { ChatroomMessage } from "@/models/ChatroomMessage";

export const createChatroom = async (
  _parent: unknown, 
  { input }: { input: { childId: string; psychologistId: string } },
  context: { userId?: string }
) => {
  try {
    const { childId, psychologistId } = input;

    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    // Verify the authenticated user is the child trying to create the chatroom
    if (context.userId !== childId) {
      throw new GraphQLError("Not authorized to create chatroom for this child", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    // Check if chatroom already exists
    const existingChatroom = await Chatroom.findOne({
      child: childId,
      psychologist: psychologistId
    })
      .populate('child', '_id fullName userName profileImage')
      .populate('psychologist', '_id fullName userName profileImage');

    if (existingChatroom) {
      return existingChatroom;
    }

    const chatroom = new Chatroom({
      child: childId,
      psychologist: psychologistId,
      isActive: true,
      unreadCount: {
        child: 0,
        psychologist: 0
      }
    });

    await chatroom.save();
    
    // Populate the fields
    await chatroom.populate('child', '_id fullName userName profileImage');
    await chatroom.populate('psychologist', '_id fullName userName profileImage');

    return chatroom;
  } catch (error) {
    console.error("❌ CreateChatroom Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to create chatroom", {
      extensions: { code: "CREATE_CHATROOM_FAILED" },
    });
  }
};

export const sendChatroomMessage = async (
  _parent: unknown, 
  { input }: { input: { chatroomId: string; content: string; type?: string } },
  context: { userId?: string }
) => {
  try {
    const { chatroomId, content, type = 'TEXT' } = input;
    const senderId = context.userId;

    if (!senderId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    // Verify chatroom exists and user is a participant
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) {
      throw new GraphQLError("Chatroom not found", {
        extensions: { code: "CHATROOM_NOT_FOUND" },
      });
    }

    if (chatroom.child.toString() !== senderId && chatroom.psychologist.toString() !== senderId) {
      throw new GraphQLError("Not authorized to send messages to this chatroom", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    // Create the message
    const message = new ChatroomMessage({
      chatroom: chatroomId,
      sender: senderId,
      content,
      type: type as 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO',
      isRead: false
    });

    await message.save();

    // Update chatroom with last message info
    chatroom.lastMessage = message._id.toString();
    chatroom.lastMessageAt = new Date();
    
    // Update unread count for the recipient
    if (chatroom.child.toString() === senderId) {
      chatroom.unreadCount.psychologist += 1;
    } else {
      chatroom.unreadCount.child += 1;
    }

    await chatroom.save();

    // Populate the message
    await message.populate('sender', '_id fullName userName profileImage');
    await message.populate('chatroom');

    return message;
  } catch (error) {
    console.error("❌ SendChatroomMessage Error:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to send message", {
      extensions: { code: "SEND_MESSAGE_FAILED" },
    });
  }
};

export const markChatroomMessagesAsRead = async (
  _parent: unknown, 
  { chatroomId, userId }: { chatroomId: string; userId: string }
) => {
  try {
    // Mark all messages in the chatroom as read for the user
    await ChatroomMessage.updateMany(
      { 
        chatroom: chatroomId,
        sender: { $ne: userId } // Don't mark own messages as read
      },
      { isRead: true }
    );

    // Reset unread count for the user
    const chatroom = await Chatroom.findById(chatroomId);
    if (chatroom) {
      if (chatroom.child.toString() === userId) {
        chatroom.unreadCount.child = 0;
      } else if (chatroom.psychologist.toString() === userId) {
        chatroom.unreadCount.psychologist = 0;
      }
      await chatroom.save();
    }

    return true;
  } catch (error) {
    console.error("❌ MarkChatroomMessagesAsRead Error:", error);
    throw new GraphQLError("Failed to mark messages as read", {
      extensions: { code: "MARK_MESSAGES_READ_FAILED" },
    });
  }
};
