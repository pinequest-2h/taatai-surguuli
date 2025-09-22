"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  LogOut, 
  Brain, 
  MessageCircle, 
  X, 
  Home, 
  Users,
  FileText,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Сонсъё, Дэмжье.
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            <Link
              href="/"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Home className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Нүүр хуудас
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/chatrooms"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <MessageCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Зурвас
                </Link>

                <Link
                  href="/psychologists"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Сэтгэл судлаачид
                </Link>

                {/* Report Navigation - Role-based */}
                {user?.role === "CHILD" && (
                  <Link
                    href="/reports"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Тайлан илгээх
                  </Link>
                )}

                {user?.role === "PSYCHOLOGIST" && (
                  <Link
                    href="/psychologist/reports"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Миний тайлан
                  </Link>
                )}

                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin/reports"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Shield className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Тайлан удирдах
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Профайл
                </Link>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-2 py-2">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => router.push("/profile")}
                    >
                      <User className="h-8 w-8 text-gray-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="group flex items-center w-full px-3 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Гарах
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/psychologists"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Сэтгэл судлаачид
                </Link>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    href="/signin"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Нэвтрэх
                  </Link>

                  <Link
                    href="/signup"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
                  >
                    <User className="mr-3 h-5 w-5 text-blue-500" />
                    Бүртгүүлэх
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
