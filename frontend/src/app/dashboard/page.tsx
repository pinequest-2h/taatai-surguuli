"use client";

import React, { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Brain,
  MessageCircle,
  Users,
  Plus,
  Settings,
  Bell,
  ArrowRight,
  Clock,
} from "lucide-react";
import { GET_CHATROOMS } from "@/lib/graphql/queries";
import { GetChatroomsResponse, Chatroom } from "@/types/graphql";
import Link from "next/link";

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const { data: chatroomsData, loading: chatroomsLoading } =
    useQuery<GetChatroomsResponse>(GET_CHATROOMS, {
      variables: { userId: user?._id },
      skip: !user?._id,
    });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const chatrooms = chatroomsData?.getChatrooms || [];
  const recentChatrooms = chatrooms.slice(0, 3);

  const getOtherParticipant = (chatroom: Chatroom) => {
    return user.role === "CHILD" ? chatroom.psychologist : chatroom.child;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Саяхан";
    else if (diffInHours < 24) return `${Math.floor(diffInHours)} цаг өмнө`;
    else return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Эрүүл сэтгэлгээ
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/chatrooms"
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Бүх зурвас
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Профайл
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Тавтай морил, {user.fullName}! 👋
          </h1>
          <p className="text-gray-600">
            {user.role === "CHILD"
              ? "Өнөөдөр өөрийгөө сонсох, илүү сайхан мэдрэмж авах шинэ боломж байна. Сэтгэл судлаачтай холбогдож дэмжлэг аваарай 💙"
              : "Та хүүхдүүд болон гэр бүлүүдийн сэтгэлийг сонсож, тэдэнд итгэл найдвар өгөхөд бэлэн байна 🙌"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/psychologists"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.role === "CHILD"
                    ? "Сэтгэл судлаач олох"
                    : "Хүүхдүүдтэй холбогдох"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {user.role === "CHILD"
                    ? "Өөрт тохирсон мэргэжилтнээ олж, итгэлтэй ярилц"
                    : "Хүүхдүүдтэй холбогдож, тэдэнд урам зориг өгөөрэй"}
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/chatrooms"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Зурвас</h3>
                <p className="text-gray-600 text-sm">
                  Таны бүх харилцан ярианы жагсаалт
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/profile"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Профайл</h3>
                <p className="text-gray-600 text-sm">
                  Хувийн мэдээллээ шинэчилж, өөрийгөө илүү танилцуул
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Conversations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Сүүлийн харилцан яриа
              </h2>
              <Link
                href="/chatrooms"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                Бүгдийг харах
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {chatroomsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentChatrooms.length > 0 ? (
              <div className="space-y-4">
                {recentChatrooms.map((chatroom: Chatroom) => {
                  const otherParticipant = getOtherParticipant(chatroom);
                  return (
                    <Link
                      key={chatroom._id}
                      href={`/chatroom/${chatroom._id}`}
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {otherParticipant?.fullName?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {otherParticipant?.fullName || "Unknown User"}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {chatroom.lastMessageAt
                              ? formatTime(chatroom.lastMessageAt)
                              : "Шинэ"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {chatroom.lastMessage?.content ||
                            "Харилцан яриа эхлүүлэх"}
                        </p>
                      </div>
                      {chatroom.unreadCount &&
                        chatroom.unreadCount[user.role.toLowerCase()] > 0 && (
                          <div className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                            {chatroom.unreadCount[user.role.toLowerCase()]}
                          </div>
                        )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Хараахан харилцан яриа алга байна 😊
                </h3>
                <p className="text-gray-600 mb-4">
                  {user.role === "CHILD"
                    ? "Анхны алхмаа хийж, сэтгэл судлаачтай ярилцаж үзээрэй."
                    : "Шинэ хүүхдүүдтэй холбогдож, тэдэнд тусалж эхлээрэй."}
                </p>
                <Link
                  href="/psychologists"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {user.role === "CHILD"
                    ? "Сэтгэл судлаач олох"
                    : "Хүүхдүүдтэй холбогдох"}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Нийт харилцан яриа
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {chatrooms.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Илүү их яриа бол илүү их ойлголт, дэмжлэг ✨
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Идэвхтэй харилцан яриа
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {chatrooms.filter((c: Chatroom) => c.isActive).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Тогтмол ярилцах нь итгэлийг бий болгодог 🤝
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Уншаагүй зурвас
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {chatrooms.reduce(
                    (total: number, c: Chatroom) =>
                      total + (c.unreadCount?.[user.role.toLowerCase()] || 0),
                    0
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Бичсэн бүхнийг уншиж, бусдын сэтгэлийг хүндэлээрэй 💌
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
