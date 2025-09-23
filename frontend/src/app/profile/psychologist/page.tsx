"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { 
  Brain, 
  Award, 
  GraduationCap, 
  Languages, 
  Clock, 
  DollarSign,
  Edit, 
  Save, 
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GET_PSYCHOLOGIST_PROFILE } from '@/lib/graphql/queries';
import { CREATE_PSYCHOLOGIST_PROFILE, UPDATE_PSYCHOLOGIST_PROFILE } from '@/lib/graphql/mutations';

interface PsychologistProfile {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    profileImage?: string;
  };
  specializations: string[];
  experience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  hourlyRate: number;
  availability: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  isVerified: boolean;
  isAcceptingNewClients: boolean;
  averageRating?: number;
  totalSessions: number;
  totalClients: number;
  workingHours: {
    monday?: { isAvailable: boolean; startTime?: string; endTime?: string; breaks: Array<{ startTime: string; endTime: string }> };
    tuesday?: { isAvailable: boolean; startTime?: string; endTime?: string; breaks: Array<{ startTime: string; endTime: string }> };
    wednesday?: { isAvailable: boolean; startTime?: string; endTime?: string; breaks: Array<{ startTime: string; endTime: string }> };
    thursday?: { isAvailable: boolean; startTime?: string; endTime?: string; breaks: Array<{ startTime: string; endTime: string }> };
    friday?: { isAvailable: boolean; startTime?: string; endTime?: string; breaks: Array<{ startTime: string; endTime: string }> };
    saturday?: { isAvailable: boolean; startTime?: string; endTime?: string; breaks: Array<{ startTime: string; endTime: string }> };
    sunday?: { isAvailable: boolean; startTime?: string; endTime?: string; breaks: Array<{ startTime: string; endTime: string }> };
  };
  createdAt: string;
  updatedAt: string;
}

interface GetPsychologistProfileResponse {
  getPsychologistProfile?: PsychologistProfile;
}

interface CreatePsychologistProfileResponse {
  createPsychologistProfile?: PsychologistProfile;
}

interface UpdatePsychologistProfileResponse {
  updatePsychologistProfile?: PsychologistProfile;
}

const PsychologistProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    specializations: [] as string[],
    experience: 0,
    education: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    hourlyRate: 0,
    bio: '',
    isAcceptingNewClients: true,
  });
  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data, loading, refetch } = useQuery<GetPsychologistProfileResponse>(GET_PSYCHOLOGIST_PROFILE, {
    variables: { _id: user?._id },
    skip: !user?._id,
  });

  const [createProfile] = useMutation<CreatePsychologistProfileResponse>(CREATE_PSYCHOLOGIST_PROFILE);
  const [updateProfile] = useMutation<UpdatePsychologistProfileResponse>(UPDATE_PSYCHOLOGIST_PROFILE);

  const profile = data?.getPsychologistProfile;

  React.useEffect(() => {
    if (profile) {
      setFormData({
        specializations: profile.specializations || [],
        experience: profile.experience || 0,
        education: profile.education || [],
        certifications: profile.certifications || [],
        languages: profile.languages || [],
        hourlyRate: profile.hourlyRate || 0,
        bio: profile.bio || '',
        isAcceptingNewClients: profile.isAcceptingNewClients ?? true,
      });
    }
  }, [profile]);

  const specializations = [
    'CHILD_PSYCHOLOGY',
    'ADOLESCENT_PSYCHOLOGY',
    'FAMILY_THERAPY',
    'COGNITIVE_BEHAVIORAL_THERAPY',
    'TRAUMA_THERAPY',
    'ANXIETY_DISORDERS',
    'DEPRESSION',
    'AUTISM_SPECTRUM',
    'LEARNING_DISABILITIES',
    'BEHAVIORAL_ISSUES',
    'SOCIAL_SKILLS',
    'EMOTIONAL_REGULATION',
  ];

  const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Arabic', 'Portuguese'];

  const formatSpecialization = (spec: string) => {
    return spec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (profile) {
        // Update existing profile
        await updateProfile({
          variables: {
            _id: user?._id,
            input: {
              specializations: formData.specializations,
              experience: formData.experience,
              education: formData.education,
              certifications: formData.certifications,
              languages: formData.languages,
              hourlyRate: formData.hourlyRate,
              bio: formData.bio,
              isAcceptingNewClients: formData.isAcceptingNewClients,
            },
          },
        });
      } else {
        // Create new profile
        await createProfile({
          variables: {
            input: {
              specializations: formData.specializations,
              experience: formData.experience,
              education: formData.education,
              certifications: formData.certifications,
              languages: formData.languages,
              hourlyRate: formData.hourlyRate,
              bio: formData.bio,
              isAcceptingNewClients: formData.isAcceptingNewClients,
              workingHours: {
                monday: { isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [] },
                tuesday: { isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [] },
                wednesday: { isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [] },
                thursday: { isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [] },
                friday: { isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [] },
                saturday: { isAvailable: false, startTime: '', endTime: '', breaks: [] },
                sunday: { isAvailable: false, startTime: '', endTime: '', breaks: [] },
              },
            },
          },
        });
      }

      await refetch();
      setIsEditing(false);
      
      // Show success message
      if (!profile) {
        
        alert('🎉 Congratulations! Your professional profile has been created successfully! You can now start accepting clients.');
      } else {
        // Profile was updated
        alert('✅ Your professional profile has been updated successfully!');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecializationChange = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation.trim()]
      }));
      setNewEducation('');
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/profile" className="flex items-center">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Psychologist Profile 🧠
          </h1>
          <p className="text-gray-600">
            {profile ? 'Manage your professional profile' : 'Create your professional profile'}
          </p>
        </div>

        {!profile && !isEditing && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-8 text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Your Professional Journey! 🌟</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create your professional profile to start connecting with children and families who need your expertise. 
              Your profile will help clients find you and understand your specializations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Professional Profile
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors border border-purple-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Professional Information</h2>
            {profile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Specializations *
              </label>
              {isEditing || !profile ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specializations.map((spec) => (
                    <label key={spec} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => handleSpecializationChange(spec)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {formatSpecialization(spec)}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map((spec: string) => (
                    <span
                      key={spec}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {formatSpecialization(spec)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Experience and Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                {isEditing || !profile ? (
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profile.experience} years</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($) *
                </label>
                {isEditing || !profile ? (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">${profile.hourlyRate}/hour</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio *
              </label>
              {isEditing || !profile ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell clients about your approach, experience, and how you can help..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{profile.bio}</p>
                </div>
              )}
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education
              </label>
              {isEditing || !profile ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., PhD in Clinical Psychology, University of..."
                    />
                    <button
                      type="button"
                      onClick={addEducation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.education.map((edu, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{edu}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.education.map((edu: string, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{edu}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              {isEditing || !profile ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Licensed Clinical Psychologist, CBT Certification..."
                    />
                    <button
                      type="button"
                      onClick={addCertification}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{cert}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.certifications.map((cert: string, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Award className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{cert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              {isEditing || !profile ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <select
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a language</option>
                      {commonLanguages.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Languages className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{lang}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      <Languages className="h-4 w-4 mr-1" />
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accepting New Clients
              </label>
              {isEditing || !profile ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAcceptingNewClients}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAcceptingNewClients: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I am currently accepting new clients
                  </span>
                </div>
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {profile.isAcceptingNewClients ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  )}
                  <span className={`font-medium ${profile.isAcceptingNewClients ? 'text-green-600' : 'text-red-600'}`}>
                    {profile.isAcceptingNewClients ? 'Accepting New Clients' : 'Not Accepting New Clients'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {(isEditing || !profile) && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? 'Saving...' : (profile ? 'Save Changes' : 'Create Profile')}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PsychologistProfilePage;
