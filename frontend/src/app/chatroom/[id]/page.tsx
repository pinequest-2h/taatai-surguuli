"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChatroomPage from '@/components/ChatroomPage';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

const IndividualChatroomPage = () => {
  const params = useParams();
  const chatroomId = params.id as string;
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to access this conversation.
            </p>
            <Link
              href="/signin"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!chatroomId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Invalid Chatroom</h1>
          <p className="text-gray-600 mb-6">The chatroom you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/chatrooms"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            Back to Conversations
          </Link>
        </div>
      </div>
    );
  }

  return <ChatroomPage chatroomId={chatroomId} />;
};

export default IndividualChatroomPage;
