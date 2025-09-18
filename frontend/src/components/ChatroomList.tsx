"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';
import { GET_CHATROOMS } from '@/lib/graphql/queries';
import { MessageCircle, Users, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Chatroom {
  _id: string;
  child: {
    _id: string;
    fullName: string;
    userName: string;
    profileImage?: string;
  };
  psychologist: {
    _id: string;
    fullName: string;
    userName: string;
    profileImage?: string;
  };
  isActive: boolean;
  lastMessage?: {
    _id: string;
    content: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  unreadCount: {
    child: number;
    psychologist: number;
  };
}

interface GetChatroomsResponse {
  getChatrooms: Chatroom[];
}

const ChatroomList = () => {
  const { user } = useAuth();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);

  const { data, loading, error, refetch } = useQuery<GetChatroomsResponse>(GET_CHATROOMS, {
    variables: { userId: user?._id },
    skip: !user?._id,
    pollInterval: 15000, // Poll every 15 seconds for new messages (reduced frequency)
    errorPolicy: 'all', // Continue showing data even if there are errors
    notifyOnNetworkStatusChange: false, // Reduce unnecessary re-renders
  });

  useEffect(() => {
    if (data?.getChatrooms) {
      setChatrooms(data.getChatrooms);
    }
  }, [data?.getChatrooms]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getUnreadCount = (chatroom: Chatroom) => {
    if (user?.role === 'CHILD') {
      return chatroom.unreadCount.child;
    } else if (user?.role === 'PSYCHOLOGIST') {
      return chatroom.unreadCount.psychologist;
    }
    return 0;
  };

  const getOtherParticipant = (chatroom: Chatroom) => {
    if (user?.role === 'CHILD') {
      return chatroom.psychologist;
    } else {
      return chatroom.child;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading chatrooms: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (chatrooms.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-600 mb-6">
          {user?.role === 'CHILD' 
            ? "Start a conversation with a psychologist to get support."
            : "Your conversations with children will appear here."
          }
        </p>
        {user?.role === 'CHILD' && (
          <Link
            href="/psychologists"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            Find a Psychologist
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{chatrooms.length} active</span>
        </div>
      </div>

      <div className="space-y-3">
        {chatrooms.map((chatroom) => {
          const otherParticipant = getOtherParticipant(chatroom);
          const unreadCount = getUnreadCount(chatroom);
          
          return (
            <Link
              key={chatroom._id}
              href={`/chatroom/${chatroom._id}`}
              className="block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {otherParticipant.profileImage ? (
                      <Image
                        src={otherParticipant.profileImage}
                        alt={otherParticipant.fullName}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {otherParticipant.fullName}
                    </h3>
                    {chatroom.lastMessageAt && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(chatroom.lastMessageAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {chatroom.lastMessage?.content || 'No messages yet'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {user?.role === 'CHILD' ? 'Psychologist' : 'Child'}
                      </span>
                      {chatroom.isActive ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ChatroomList;
