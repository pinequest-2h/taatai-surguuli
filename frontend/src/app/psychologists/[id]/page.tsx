"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Brain, 
  Star, 
  Clock, 
  MessageCircle,
  Award,
  Languages,
  ArrowLeft,
  CheckCircle,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { GET_PSYCHOLOGIST_PROFILE } from '@/lib/graphql/queries';
import { CREATE_CHATROOM } from '@/lib/graphql/mutations';
import { GetPsychologistProfileResponse } from '@/types/graphql';
import { useAuth } from '@/context/AuthContext';

interface CreateChatroomResponse {
  createChatroom?: {
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
    unreadCount: {
      child: number;
      psychologist: number;
    };
    createdAt: string;
    updatedAt: string;
  };
}

const PsychologistProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingChatroom, setIsCreatingChatroom] = useState(false);
  const [chatroomError, setChatroomError] = useState('');

  const { data, loading, error } = useQuery<GetPsychologistProfileResponse>(GET_PSYCHOLOGIST_PROFILE, {
    variables: { _id: params.id },
  });

  const [createChatroom] = useMutation<CreateChatroomResponse>(CREATE_CHATROOM);

  const psychologist = data?.getPsychologistProfile;

  const handleSendMessage = async () => {
    if (!user || user.role !== 'CHILD' || !psychologist) return;
    
    setIsCreatingChatroom(true);
    setChatroomError('');
    try {
      const { data: chatroomData } = await createChatroom({
        variables: {
          input: {
            childId: user._id,
            psychologistId: psychologist.user._id,
          },
        },
      });
      
      if (chatroomData?.createChatroom) {
        router.push(`/chatroom/${chatroomData.createChatroom._id}`);
      } else {
        setChatroomError('Failed to create chatroom. Please try again.');
      }
    } catch (error) {
      console.error('Error creating chatroom:', error);
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          setChatroomError('Please sign in to start a conversation.');
        } else if (error.message.includes('Not authorized')) {
          setChatroomError('You are not authorized to create this chatroom.');
        } else {
          setChatroomError('Failed to create chatroom. Please try again.');
        }
      } else {
        setChatroomError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsCreatingChatroom(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !psychologist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Psychologist not found</h3>
          <p className="text-gray-600 mb-4">The psychologist you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/psychologists"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Psychologists
          </Link>
        </div>
      </div>
    );
  }

  const formatSpecialization = (spec: string) => {
    return spec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAvailabilityColor = (isAccepting: boolean) => {
    return isAccepting ? 'text-green-600' : 'text-red-600';
  };

  const getAvailabilityText = (isAccepting: boolean) => {
    return isAccepting ? 'Accepting New Clients' : 'Not Accepting New Clients';
  };

  const getDayName = (day: string) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    };
    return days[day as keyof typeof days] || day;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/psychologists" className="flex items-center">
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
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start space-x-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {psychologist.user.fullName.charAt(0)}
                </span>
              </div>
            </div>


            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {psychologist.user.fullName}
                  </h1>
                  <p className="text-gray-600 mb-4">@{psychologist.user.userName}</p>
                  
                  {/* Verification Badge */}
                  {psychologist.isVerified && (
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-600 font-medium">Verified Professional</span>
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-gray-700 text-lg mb-6">
                    {psychologist.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{psychologist.experience}</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {psychologist.averageRating ? psychologist.averageRating.toFixed(1) : 'New'}
                      </div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{psychologist.totalClients}</div>
                      <div className="text-sm text-gray-600">Total Clients</div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className={`text-lg font-medium ${getAvailabilityColor(psychologist.isAcceptingNewClients)}`}>
                    {getAvailabilityText(psychologist.isAcceptingNewClients)}
                  </div>
                </div>

                {/* Right Side */}
                <div className="text-right">
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${psychologist.hourlyRate}
                    </span>
                    <span className="text-gray-600 text-lg">/hour</span>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleSendMessage}
                      disabled={isCreatingChatroom}
                      className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-center font-medium"
                    >
                      <MessageCircle className="h-5 w-5 inline mr-2" />
                      {isCreatingChatroom ? 'Харилцаа үүсгэж байна...' : 'Зурвас илгээх'}
                    </button>
                    
                    {chatroomError && (
                      <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-lg">
                        {chatroomError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview', icon: Brain },
                { id: 'specializations', label: 'Specializations', icon: Award },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'availability', label: 'Availability', icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Specializations */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Specializations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {psychologist.specializations.map((spec: string) => (
                      <div
                        key={spec}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center"
                      >
                        <span className="text-blue-800 font-medium">
                          {formatSpecialization(spec)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                {psychologist.languages && psychologist.languages.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {psychologist.languages.map((lang: string) => (
                        <span
                          key={lang}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          <Languages className="h-4 w-4 mr-1" />
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {psychologist.certifications && psychologist.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Certifications</h3>
                    <div className="space-y-2">
                      {psychologist.certifications.map((cert: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <Shield className="h-5 w-5 text-green-600 mr-3" />
                          <span className="text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specializations' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {psychologist.specializations.map((spec: string) => (
                    <div key={spec} className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {formatSpecialization(spec)}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Specialized experience in {formatSpecialization(spec).toLowerCase()} with {psychologist.experience} years of practice.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Education & Training</h3>
                <div className="space-y-4">
                  {psychologist.education.map((edu: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <GraduationCap className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu}</h4>
                        <p className="text-gray-600 text-sm">Professional qualification</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Working Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(psychologist.workingHours).map(([day, schedule]: [string, { isAvailable: boolean; startTime?: string; endTime?: string }]) => (
                    <div key={day} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {getDayName(day)}
                      </h4>
                      {schedule.isAvailable ? (
                        <div className="text-green-600">
                          <div className="flex items-center mb-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Available
                          </div>
                          <p className="text-sm text-gray-600">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                        </div>
                      ) : (
                        <div className="text-red-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Not Available
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Reviews & Ratings</h3>
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
            <p className="text-gray-600">
              Be the first to leave a review after your session with {psychologist.user.fullName}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistProfilePage;
