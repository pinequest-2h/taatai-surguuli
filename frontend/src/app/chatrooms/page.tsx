"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatroomList from '@/components/ChatroomList';
import { MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';

const ChatroomsPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

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
              Please sign in to access your conversations.
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

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Зурвас</h1>
                <p className="text-gray-600">
                  {user?.role === 'CHILD' 
                    ? 'Сэтгэл судлаачтай холбогдоорой' 
                    : 'Хүүхдүүд болон гэр бүлүүдтэй харилцаарай'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>Идэвхтэй харилцаа</span>
              </div>
              
              {user?.role === 'CHILD' && (
                <Link
                  href="/psychologists"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Сэтгэл судлаач олох
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-4xl mx-auto px-4 py-8">
        <ChatroomList />
      </div>
    </div>
  );
};

export default ChatroomsPage;
