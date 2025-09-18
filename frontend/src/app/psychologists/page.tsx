"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { 
  Brain, 
  Star, 
  Clock, 
  Filter, 
  Search,
  Heart,
  MessageCircle,
  Users
} from 'lucide-react';
import { GET_PSYCHOLOGIST_PROFILES } from '@/lib/graphql/queries';
import { GetPsychologistProfilesResponse, PsychologistProfile } from '@/types/graphql';

const PsychologistsPage = () => {
  const [filters, setFilters] = useState({
    specializations: [] as string[],
    minExperience: 0,
    isAcceptingNewClients: true,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data, loading, error } = useQuery<GetPsychologistProfilesResponse>(GET_PSYCHOLOGIST_PROFILES, {
    variables: {
      filters: {
        ...filters,
        specializations: filters.specializations.length > 0 ? filters.specializations : undefined,
      },
      limit: 20,
      offset: 0,
    },
  });

  const psychologists = data?.getPsychologistProfiles?.edges?.map((edge) => edge.node) || [];

  // Frontend should send backend enum values, but display Mongolian labels
  const specializationOptions = [
    { value: 'CHILD_PSYCHOLOGY', label: 'ХҮҮХДИЙН_СЭТГЭЛ_СУДЛАЛ' },
    { value: 'ADOLESCENT_PSYCHOLOGY', label: 'ӨСВӨР_НАСНЫ_СЭТГЭЛ_СУДЛАЛ' },
    { value: 'FAMILY_THERAPY', label: 'ГЭР_БҮЛИЙН_СЭТГЭЛ_ЗАСАЛ' },
    { value: 'COGNITIVE_BEHAVIORAL_THERAPY', label: 'ТАНИН_МЭДЭХҮЙН_ЗАН_ҮЙЛИЙН_СЭТГЭЛ_ЗАСАЛ' },
    { value: 'TRAUMA_THERAPY', label: 'СЭТГЭЛ_ЗҮЙН_ГЭМТЛИЙН_ЭМЧИЛГЭЭ' },
    { value: 'ANXIETY_DISORDERS', label: 'ТҮГШҮҮРИЙН_ЭМГЭГҮҮД' },
    { value: 'DEPRESSION', label: 'СЭТГЭЛ_ГУТРАЛ' },
    { value: 'AUTISM_SPECTRUM', label: 'АУТИЗМЫН_ХҮРЭЭНИЙ_ЭМГЭГ' },
    { value: 'LEARNING_DISABILITIES', label: 'СУРГАЛТЫН_БЭРХШЭЭЛ' },
    { value: 'BEHAVIORAL_ISSUES', label: 'ЗАН_ҮЙЛИЙН_АСУУДАЛ' },
    { value: 'SOCIAL_SKILLS', label: 'НИЙГМИЙН_УР_ЧАДВАР' },
    { value: 'EMOTIONAL_REGULATION', label: 'СЭТГЭЛ_ХӨДЛӨЛӨӨ_ЗОХИЦУУЛАХ_ЧАДВАР' },
  ];




  const handleSpecializationChange = (spec: string) => {
    setFilters(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  //

  const formatSpecialization = (spec: string) => {
    return spec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAvailabilityColor = (isAccepting: boolean) => {
    return isAccepting ? 'text-green-600' : 'text-red-600';
  };

  const getAvailabilityText = (isAccepting: boolean) => {
    return isAccepting ? 'Шинэ үйлчлүүлэгч хүлээн авч байна' : 'Шинэ үйлчлүүлэгч хүлээн авч байхгүй';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Сэтгэл Сэтгэлгээ</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Хяналтын самбар
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Төгс сэтгэл судлаачаа олоорой 🌟
          </h1>
          <p className="text-gray-600">
            Хүүхэд болон гэр бүлийн эмчилгээнд мэргэшсэн мэргэжлийн сэтгэл зүйн эрүүл мэндийн мэргэжилтнүүдтэй холбогдоорой
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Шүүлтүүр
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хайх
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Сэтгэл судлаач хайх..."
                  />
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Мэргэшил
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {specializationOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.specializations.includes(option.value)}
                        onChange={() => handleSpecializationChange(option.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {formatSpecialization(option.label)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Experience */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хамгийн бага туршлага (жил)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={filters.minExperience}
                  onChange={(e) => setFilters(prev => ({ ...prev, minExperience: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Hourly Rate removed */}

              {/* Availability */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isAcceptingNewClients}
                    onChange={(e) => setFilters(prev => ({ ...prev, isAcceptingNewClients: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Шинэ үйлчлүүлэгч хүлээн авч байна</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  specializations: [],
                  minExperience: 0,
                  isAcceptingNewClients: true,
                })}
                className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Бүх шүүлтүүрийг цэвэрлэх
              </button>
            </div>
          </div>

          {/* Psychologists List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                Error loading psychologists: {error.message}
              </div>
            ) : psychologists.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Сэтгэл судлаач олдсонгүй</h3>
                <p className="text-gray-600">Илүү олон үр дүнг харахын тулд шүүлтүүрээ тохируулна уу.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {psychologists.map((psychologist: PsychologistProfile) => (
                  <div key={psychologist._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-6">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {psychologist.user.fullName.charAt(0)}
                          </span>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {psychologist.user.fullName}
                            </h3>
                            <p className="text-gray-600 mb-2">@{psychologist.user.userName}</p>
                            
                            {/* Specializations */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {psychologist.specializations.slice(0, 3).map((spec: string) => (
                                <span
                                  key={spec}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {formatSpecialization(spec)}
                                </span>
                              ))}
                              {psychologist.specializations.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{psychologist.specializations.length - 3} илүү
                                </span>
                              )}
                            </div>

                            {/* Bio */}
                            <p className="text-gray-700 mb-4 line-clamp-2">
                              {psychologist.bio}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {psychologist.experience} жилийн туршлага
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                {psychologist.averageRating ? psychologist.averageRating.toFixed(1) : 'New'}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {psychologist.totalClients} үйлчлүүлэгч
                              </div>
                            </div>
                          </div>

                          {/* Right Side */}
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getAvailabilityColor(psychologist.isAcceptingNewClients)} mt-2`}>
                              {getAvailabilityText(psychologist.isAcceptingNewClients)}
                            </div>
                          </div>
                        </div>

                        {/* Languages removed */}

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center space-x-3">
                          <Link
                            href={`/psychologists/${psychologist._id}`}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Профайл харах
                          </Link>
                          <Link
                            href={`/psychologists/${psychologist._id}`}
                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Зурвас илгээх
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistsPage;
