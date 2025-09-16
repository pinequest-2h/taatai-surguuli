"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Plus,
  Search,
  Brain,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GET_CHILD_APPOINTMENTS, GET_PSYCHOLOGIST_APPOINTMENTS } from '@/lib/graphql/queries';
import { GetChildAppointmentsResponse, GetPsychologistAppointmentsResponse, Appointment } from '@/types/graphql';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data: childAppointments, loading: childLoading } = useQuery<GetChildAppointmentsResponse>(GET_CHILD_APPOINTMENTS, {
    variables: { 
      childId: user?._id, 
      status: statusFilter || undefined,
      limit: 50,
      offset: 0 
    },
    skip: user?.role !== 'CHILD',
  });

  const { data: psychologistAppointments, loading: psychologistLoading } = useQuery<GetPsychologistAppointmentsResponse>(GET_PSYCHOLOGIST_APPOINTMENTS, {
    variables: { 
      psychologistId: user?._id, 
      status: statusFilter || undefined,
      limit: 50,
      offset: 0 
    },
    skip: user?.role !== 'PSYCHOLOGIST',
  });

  const appointments = user?.role === 'CHILD' 
    ? childAppointments?.getChildAppointments?.edges?.map((edge) => edge.node) || []
    : psychologistAppointments?.getPsychologistAppointments?.edges?.map((edge) => edge.node) || [];

  const loading = user?.role === 'CHILD' ? childLoading : psychologistLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'NO_SHOW':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return 'bg-blue-100 text-blue-800';
      case 'THERAPY_SESSION':
        return 'bg-purple-100 text-purple-800';
      case 'FOLLOW_UP':
        return 'bg-green-100 text-green-800';
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    const matchesSearch = searchKeyword === '' || 
      (user?.role === 'CHILD' 
        ? appointment.psychologist.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          appointment.psychologist.userName.toLowerCase().includes(searchKeyword.toLowerCase())
        : appointment.child.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          appointment.child.userName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    
    return matchesSearch;
  });

  const upcomingAppointments = filteredAppointments.filter((appointment: Appointment) => 
    new Date(appointment.scheduledDate) > new Date() && 
    ['PENDING', 'CONFIRMED'].includes(appointment.status)
  );

  const pastAppointments = filteredAppointments.filter((appointment: Appointment) => 
    new Date(appointment.scheduledDate) <= new Date() || 
    ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(appointment.status)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <ArrowLeft className="h-5 w-5 text-gray-600 mr-2" />
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">PsychConnect</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Sessions 📅
            </h1>
            <p className="text-gray-600">
              {user?.role === 'CHILD' 
                ? 'Manage your therapy sessions and appointments'
                : 'Manage your client sessions and appointments'
              }
            </p>
          </div>
          
          {user?.role === 'CHILD' && (
            <Link
              href="/appointments/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Book New Session
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Search ${user?.role === 'CHILD' ? 'psychologists' : 'clients'}...`}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment: Appointment) => (
                    <div key={appointment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.role === 'CHILD' 
                                ? appointment.psychologist.fullName.charAt(0)
                                : appointment.child.fullName.charAt(0)
                              }
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {user?.role === 'CHILD' 
                                ? `Session with ${appointment.psychologist.fullName}`
                                : `Session with ${appointment.child.fullName}`
                              }
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {user?.role === 'CHILD' 
                                ? `@${appointment.psychologist.userName}`
                                : `@${appointment.child.userName}`
                              }
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(appointment.scheduledDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(appointment.scheduledDate).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.duration} minutes
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 mb-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                                {formatType(appointment.type)}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1">{appointment.status}</span>
                              </span>
                            </div>

                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mb-3">
                                <strong>Notes:</strong> {appointment.notes}
                              </p>
                            )}

                            <div className="flex items-center text-sm text-gray-600">
                              {appointment.isOnline ? (
                                <div className="flex items-center">
                                  <Video className="h-4 w-4 mr-1" />
                                  Online Session
                                  {appointment.meetingLink && (
                                    <a 
                                      href={appointment.meetingLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="ml-2 text-blue-600 hover:text-blue-700 underline"
                                    >
                                      Join Meeting
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {appointment.location || 'Location TBD'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/appointments/${appointment._id}`}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            View Details
                          </Link>
                          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Past Sessions</h2>
                <div className="space-y-4">
                  {pastAppointments.map((appointment: Appointment) => (
                    <div key={appointment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-75">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.role === 'CHILD' 
                                ? appointment.psychologist.fullName.charAt(0)
                                : appointment.child.fullName.charAt(0)
                              }
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {user?.role === 'CHILD' 
                                ? `Session with ${appointment.psychologist.fullName}`
                                : `Session with ${appointment.child.fullName}`
                              }
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {user?.role === 'CHILD' 
                                ? `@${appointment.psychologist.userName}`
                                : `@${appointment.child.userName}`
                              }
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(appointment.scheduledDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(appointment.scheduledDate).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                                {formatType(appointment.type)}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1">{appointment.status}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/appointments/${appointment._id}`}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                <p className="text-gray-600 mb-6">
                  {searchKeyword || statusFilter 
                    ? 'Try adjusting your filters to see more results.'
                    : user?.role === 'CHILD' 
                      ? 'You haven\'t booked any sessions yet.'
                      : 'You don\'t have any scheduled sessions yet.'
                  }
                </p>
                {user?.role === 'CHILD' && !searchKeyword && !statusFilter && (
                  <Link
                    href="/appointments/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Book Your First Session
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
