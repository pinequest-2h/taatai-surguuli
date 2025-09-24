import DataLoader from 'dataloader';
import { User } from '../models/User';
import { Report } from '../models/Report';
import { Session } from '../models/Session';
import { Message } from '../models/Message';
import { PsychologistProfile } from '../models/PsychologistProfile';
import { Chatroom } from '../models/Chatroom';
import { ChatroomMessage } from '../models/ChatroomMessage';

export const createUserLoader = () => {
  return new DataLoader<string, typeof User | null>(async (userIds: readonly string[]) => {
    const users = await User.find({ _id: { $in: userIds } });
    
    return userIds.map(id => 
      users.find(user => user._id.toString() === id) || null
    );
  });
};

export const createUserReportsLoader = () => {
  return new DataLoader<string, typeof Report[]>(async (userIds: readonly string[]) => {
    const reports = await Report.find({ userId: { $in: userIds } });
    
    const reportsByUser = reports.reduce((acc, report) => {
      const userId = report.userId.toString();
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(report);
      return acc;
    }, {} as Record<string, typeof Report[]>);
    
    return userIds.map(id => reportsByUser[id] || []);
  });
};

export const createPsychologistReportsLoader = () => {
  return new DataLoader<string, typeof Report[]>(async (psychologistIds: readonly string[]) => {
    const reports = await Report.find({ psychologistId: { $in: psychologistIds } });
    
    const reportsByPsychologist = reports.reduce((acc, report) => {
      const psychologistId = report.psychologistId.toString();
      if (!acc[psychologistId]) acc[psychologistId] = [];
      acc[psychologistId].push(report);
      return acc;
    }, {} as Record<string, typeof Report[]>);
    
    return psychologistIds.map(id => reportsByPsychologist[id] || []);
  });
};

export const createUserSessionsLoader = () => {
  return new DataLoader<string, typeof Session[]>(async (userIds: readonly string[]) => {
    const sessions = await Session.find({ userId: { $in: userIds } });
    
    const sessionsByUser = sessions.reduce((acc, session) => {
      const userId = session.userId.toString();
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(session);
      return acc;
    }, {} as Record<string, typeof Session[]>);
    
    return userIds.map(id => sessionsByUser[id] || []);
  });
};

export const createSessionMessagesLoader = () => {
  return new DataLoader<string, typeof Message[]>(async (sessionIds: readonly string[]) => {
    const messages = await Message.find({ sessionId: { $in: sessionIds } })
      .sort({ createdAt: 1 });
    
    const messagesBySession = messages.reduce((acc, message) => {
      const sessionId = message.sessionId.toString();
      if (!acc[sessionId]) acc[sessionId] = [];
      acc[sessionId].push(message);
      return acc;
    }, {} as Record<string, typeof Message[]>);
    
    return sessionIds.map(id => messagesBySession[id] || []);
  });
};

export const createPsychologistProfileLoader = () => {
  return new DataLoader<string, typeof PsychologistProfile | null>(async (userIds: readonly string[]) => {
    const profiles = await PsychologistProfile.find({ userId: { $in: userIds } });
    
    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.userId.toString()] = profile;
      return acc;
    }, {} as Record<string, typeof PsychologistProfile>);
    
    return userIds.map(id => profileMap[id] || null);
  });
};

export const createUserChatroomsLoader = () => {
  return new DataLoader<string, typeof Chatroom[]>(async (userIds: readonly string[]) => {
    const chatrooms = await Chatroom.find({ 
      participants: { $in: userIds } 
    });
    
    const chatroomsByUser = userIds.reduce((acc, userId) => {
      acc[userId] = chatrooms.filter(chatroom => 
        chatroom.participants.includes(userId)
      );
      return acc;
    }, {} as Record<string, typeof Chatroom[]>);
    
    return userIds.map(id => chatroomsByUser[id] || []);
  });
};

export const createChatroomMessagesLoader = () => {
  return new DataLoader<string, typeof ChatroomMessage[]>(async (chatroomIds: readonly string[]) => {
    const messages = await ChatroomMessage.find({ 
      chatroomId: { $in: chatroomIds } 
    }).sort({ createdAt: 1 });
    
    const messagesByChatroom = messages.reduce((acc, message) => {
      const chatroomId = message.chatroomId.toString();
      if (!acc[chatroomId]) acc[chatroomId] = [];
      acc[chatroomId].push(message);
      return acc;
    }, {} as Record<string, typeof ChatroomMessage[]>);
    
    return chatroomIds.map(id => messagesByChatroom[id] || []);
  });
};

export const createDataLoaders = () => {
  return {
    userLoader: createUserLoader(),
    userReportsLoader: createUserReportsLoader(),
    psychologistReportsLoader: createPsychologistReportsLoader(),
    userSessionsLoader: createUserSessionsLoader(),
    sessionMessagesLoader: createSessionMessagesLoader(),
    psychologistProfileLoader: createPsychologistProfileLoader(),
    userChatroomsLoader: createUserChatroomsLoader(),
    chatroomMessagesLoader: createChatroomMessagesLoader(),
  };
};

export type DataLoaders = ReturnType<typeof createDataLoaders>;