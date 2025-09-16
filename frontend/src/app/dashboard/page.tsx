"use client";

import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  Calendar, 
  MessageCircle, 
  Users, 
  Star, 

  Heart,
  Plus,
  Settings,
  Bell,
  TrendingUp,
  Shield
} from 'lucide-react';
import { GET_UPCOMING_APPOINTMENTS } from '@/lib/graphql/queries';
import { GetUpcomingAppointmentsResponse } from '@/types/graphql';
import Link from 'next/link';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const { data: upcomingData, loading: upcomingLoading } = useQuery<GetUpcomingAppointmentsResponse>(GET_UPCOMING_APPOINTMENTS, {
    variables: { userId: user?._id, limit: 5 },
    skip: !user?._id,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  console.log(user.role)

  const upcomingAppointments = upcomingData?.getUpcomingAppointments || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'CHILD':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'PSYCHOLOGIST':
        return <Brain className="h-5 w-5 text-purple-500" />;
      case 'ADMIN':
        return <Shield className="h-5 w-5 text-blue-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CHILD':
        return 'bg-pink-100 text-pink-800';
      case 'PSYCHOLOGIST':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">PsychConnect</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.fullName.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium">{user.fullName}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user.fullName}! 👋
          </h1>
          <p className="text-gray-600">
            Welcome to your {user.role === 'CHILD' ? 'mental health' : 'professional'} dashboard
          </p>
        </div>

        {/* Role Badge */}
        <div className="mb-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
            {getRoleIcon(user.role)}
            <span className="ml-2 capitalize">{user.role.toLowerCase()}</span>
            {user.isVerified && (
              <span className="ml-2 text-green-600">✓ Verified</span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingAppointments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.role === 'PSYCHOLOGIST' ? '4.8' : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Psychologist Profile Setup Notice */}
            {user.role === 'PSYCHOLOGIST' && (
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 mr-3" />
                  <h2 className="text-xl font-bold">Welcome to PsychConnect! 🧠</h2>
                </div>
                <p className="text-purple-100 mb-4">
                  To start accepting clients and building your practice, you&apos;ll need to create your professional profile.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/profile/psychologist"
                    className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Professional Profile
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors border border-purple-400"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    View Account Settings
                  </Link>
                </div>
              </div>
            )}

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                <Link
                  href="/appointments"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {upcomingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment: {
                    _id: string;
                    psychologist: { fullName: string; userName: string };
                    child: { fullName: string; userName: string };
                    scheduledDate: string;
                    duration: number;
                    status: string;
                  }) => (
                    <div key={appointment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.role === 'CHILD' 
                                ? appointment.psychologist.fullName.charAt(0)
                                : appointment.child.fullName.charAt(0)
                              }
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {user.role === 'CHILD' 
                                ? `Session with ${appointment.psychologist.fullName}`
                                : `Session with ${appointment.child.fullName}`
                              }
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.scheduledDate).toLocaleDateString()} at{' '}
                              {new Date(appointment.scheduledDate).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'CONFIRMED' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {appointment.duration} minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600 mb-4">
                    {user.role === 'CHILD' 
                      ? 'Book a session with a psychologist to get started'
                      : 'Your upcoming sessions will appear here'
                    }
                  </p>
                  {user.role === 'CHILD' && (
                    <Link
                      href="/psychologists"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Find Psychologists
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Welcome to PsychConnect!</p>
                    <p className="text-sm text-gray-600">Complete your profile to get started</p>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    Just now
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {user.role === 'CHILD' ? (
                  <>
                    <Link
                      href="/psychologists"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Users className="h-5 w-5 mr-3 text-blue-600" />
                      Find Psychologists
                    </Link>
                    <Link
                      href="/appointments/new"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-3 text-green-600" />
                      Book Session
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 mr-3 text-purple-600" />
                      Messages
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/appointments"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                      Manage Sessions
                    </Link>
                    <Link
                      href="/profile/psychologist"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings className="h-5 w-5 mr-3 text-green-600" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 mr-3 text-purple-600" />
                      Messages
                    </Link>
                  </>
                )}
                <Link
                  href="/profile"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5 mr-3 text-gray-600" />
                  Account Settings
                </Link>
              </div>
            </div>

            {/* Tips & Resources */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">💡 Daily Tip</h2>
              <p className="text-blue-100 mb-4">
                {user.role === 'CHILD' 
                  ? 'Take a few minutes each day to practice deep breathing. It can help reduce stress and improve your mood!'
                  : 'Remember to take breaks between sessions to maintain your own mental well-being.'
                }
              </p>
              <button className="text-white text-sm font-medium hover:underline">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
