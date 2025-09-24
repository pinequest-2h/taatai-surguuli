import { GraphQLError } from "graphql";
import { Chatroom } from "@/models/Chatroom";
import { ChatroomMessage } from "@/models/ChatroomMessage";
import { User } from "@/models/User";

export const getChatrooms = async (_parent: unknown, { userId }: { userId: string }) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    const chatrooms = await Chatroom.find({
      $or: [
        { child: userId },
        { psychologist: userId }
      ],
      isActive: true
    })
      .populate({
        path: 'child',
        select: '_id fullName userName profileImage',
      })
      .populate({
        path: 'psychologist', 
        select: '_id fullName userName profileImage',
      })
      .populate('lastMessage')
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    const validChatrooms = chatrooms.filter(chatroom => {
      if (!chatroom.child || !chatroom.psychologist) {
        return false;
      }
      return true;
    });

    return validChatrooms;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch chatrooms", {
      extensions: { code: "GET_CHATROOMS_FAILED" },
    });
  }
};

export const getChatroomById = async (_parent: unknown, { _id }: { _id: string }) => {
  try {
    const chatroom = await Chatroom.findById(_id)
      .populate({
        path: 'child',
        select: '_id fullName userName profileImage',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'psychologist', 
        select: '_id fullName userName profileImage',
        match: { _id: { $exists: true } }
      })
      .populate('lastMessage');

    if (!chatroom) {
      throw new GraphQLError("Chatroom not found", {
        extensions: { code: "CHATROOM_NOT_FOUND" },
      });
    }

    if (!chatroom.child || !chatroom.psychologist) {
      throw new GraphQLError("Chatroom has invalid references", {
        extensions: { code: "CHATROOM_INVALID_REFERENCES" },
      });
    }

    return chatroom;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch chatroom", {
      extensions: { code: "GET_CHATROOM_FAILED" },
    });
  }
};

export const getChatroomMessages = async (
  _parent: unknown, 
  { chatroomId, limit = 50, offset = 0 }: { chatroomId: string; limit?: number; offset?: number }
) => {
  try {
    // Verify chatroom exists
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) {
      throw new GraphQLError("Chatroom not found", {
        extensions: { code: "CHATROOM_NOT_FOUND" },
      });
    }

    const messages = await ChatroomMessage.find({ chatroom: chatroomId })
      .populate('sender', '_id fullName userName profileImage')
      .populate('chatroom')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    return messages;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch messages", {
      extensions: { code: "GET_MESSAGES_FAILED" },
    });
  }
};

export const getOrCreateChatroom = async (
  _parent: unknown, 
  { childId, psychologistId }: { childId: string; psychologistId: string }
) => {
  try {
    const child = await User.findById(childId);
    const psychologist = await User.findById(psychologistId);

    if (!child || child.role !== 'CHILD') {
      throw new GraphQLError("Child not found", {
        extensions: { code: "CHILD_NOT_FOUND" },
      });
    }

    if (!psychologist || psychologist.role !== 'PSYCHOLOGIST') {
      throw new GraphQLError("Psychologist not found", {
        extensions: { code: "PSYCHOLOGIST_NOT_FOUND" },
      });
    }

    let chatroom = await Chatroom.findOne({
      child: childId,
      psychologist: psychologistId
    })
      .populate({
        path: 'child',
        select: '_id fullName userName profileImage',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'psychologist', 
        select: '_id fullName userName profileImage',
        match: { _id: { $exists: true } }
      });

    if (!chatroom) {
      chatroom = new Chatroom({
        child: childId,
        psychologist: psychologistId,
        isActive: true,
        unreadCount: {
          child: 0,
          psychologist: 0
        }
      });

      await chatroom.save();
      
      await chatroom.populate({
        path: 'child',
        select: '_id fullName userName profileImage'
      });
      await chatroom.populate({
        path: 'psychologist',
        select: '_id fullName userName profileImage'
      });
    }

    return chatroom;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to get or create chatroom", {
      extensions: { code: "GET_OR_CREATE_CHATROOM_FAILED" },
    });
  }
};
