"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';
import { GET_CHATROOM_MESSAGES, GET_CHATROOM_BY_ID } from '@/lib/graphql/queries';
import { SEND_CHATROOM_MESSAGE, MARK_CHATROOM_MESSAGES_AS_READ } from '@/lib/graphql/mutations';
import { Send, ArrowLeft, User, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ChatroomMessage {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    userName: string;
    profileImage?: string;
  };
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

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
}

interface GetChatroomMessagesResponse {
  getChatroomMessages: ChatroomMessage[];
}

interface GetChatroomByIdResponse {
  getChatroomById?: Chatroom;
}

interface SendChatroomMessageResponse {
  sendChatroomMessage?: ChatroomMessage;
}

interface MarkChatroomMessagesAsReadResponse {
  markChatroomMessagesAsRead: boolean;
}

interface ChatroomPageProps {
  chatroomId: string;
}

const ChatroomPage: React.FC<ChatroomPageProps> = ({ chatroomId }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatroomMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatroomData, loading: chatroomLoading, error: chatroomError } = useQuery<GetChatroomByIdResponse>(GET_CHATROOM_BY_ID, {
    variables: { _id: chatroomId },
    errorPolicy: 'all',
  });

  const { data: messagesData, loading: messagesLoading, error: messagesError } = useQuery<GetChatroomMessagesResponse>(
    GET_CHATROOM_MESSAGES,
    {
      variables: { chatroomId, limit: 100, offset: 0 },
      pollInterval: 10000, // Poll every 10 seconds for new messages (reduced frequency)
      errorPolicy: 'all', // Continue showing data even if there are errors
      notifyOnNetworkStatusChange: false, // Reduce unnecessary re-renders
    }
  );

  const [sendMessage] = useMutation<SendChatroomMessageResponse>(SEND_CHATROOM_MESSAGE);
  const [markAsRead] = useMutation<MarkChatroomMessagesAsReadResponse>(MARK_CHATROOM_MESSAGES_AS_READ);

  useEffect(() => {
    if (messagesData?.getChatroomMessages) {
      setMessages(messagesData.getChatroomMessages);
    }
  }, [messagesData?.getChatroomMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when component mounts
    if (user?._id && chatroomId) {
      markAsRead({
        variables: { chatroomId, userId: user._id },
      }).catch((error) => {
        console.error('Error marking messages as read:', error);
      });
    }
  }, [chatroomId, user?._id, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user?._id) return;

    try {
      await sendMessage({
        variables: {
          input: {
            chatroomId,
            content: message.trim(),
            type: 'TEXT',
          },
        },
      });
      setMessage('');
      // Don't refetch immediately, let polling handle it
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (chatroom: Chatroom) => {
    if (user?.role === 'CHILD') {
      return chatroom.psychologist;
    } else {
      return chatroom.child;
    }
  };

  if (chatroomLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Handle errors gracefully
  if (chatroomError && !chatroomData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading chatroom: {chatroomError.message}</p>
        <Link href="/chatrooms" className="text-blue-600 hover:underline">
          Back to conversations
        </Link>
      </div>
    );
  }

  const chatroom = chatroomData?.getChatroomById;
  if (!chatroom) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Chatroom not found</p>
        <Link href="/chatrooms" className="text-blue-600 hover:underline">
          Back to conversations
        </Link>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant(chatroom);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link
            href="/chatrooms"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {otherParticipant.profileImage ? (
                <Image
                  src={otherParticipant.profileImage}
                  alt={otherParticipant.fullName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {otherParticipant.fullName}
              </h1>
              <p className="text-sm text-gray-500">
                {user?.role === 'CHILD' ? 'Psychologist' : 'Child'}
                {chatroom.isActive && (
                  <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </p>
            </div>
          </div>
          
          <div className="ml-auto">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messagesError && (
          <div className="text-center py-2">
            <p className="text-red-500 text-sm">Error loading messages: {messagesError.message}</p>
          </div>
        )}
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.sender._id === user?._id;
            const showDate = index === 0 || 
              formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

            return (
              <div key={msg._id}>
                {showDate && (
                  <div className="text-center py-2">
                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!chatroom.isActive}
          />
          <button
            type="submit"
            disabled={!message.trim() || !chatroom.isActive}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        {!chatroom.isActive && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            This conversation is currently inactive
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatroomPage;
