"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  ArrowLeft,
  CheckCircle,
  Brain,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GET_PSYCHOLOGIST_PROFILE, GET_AVAILABLE_PSYCHOLOGISTS } from '@/lib/graphql/queries';
import { CREATE_APPOINTMENT } from '@/lib/graphql/mutations';
import { GetPsychologistProfileResponse, CreateAppointmentResponse } from '@/types/graphql';

const NewAppointmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    psychologistId: searchParams.get('psychologistId') || '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    type: 'CONSULTATION' as 'CONSULTATION' | 'THERAPY_SESSION' | 'FOLLOW_UP' | 'EMERGENCY',
    notes: '',
    location: '',
    isOnline: true,
    meetingLink: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get psychologist data if psychologistId is provided
  const { data: psychologistData } = useQuery<GetPsychologistProfileResponse>(GET_PSYCHOLOGIST_PROFILE, {
    variables: { _id: formData.psychologistId },
    skip: !formData.psychologistId,
  });

  const psychologist = psychologistData?.getPsychologistProfile;

  // Get available psychologists for the selected date/time
  const { refetch: refetchAvailable } = useQuery(GET_AVAILABLE_PSYCHOLOGISTS, {
    variables: {
      date: formData.scheduledDate,
      time: formData.scheduledTime,
      duration: formData.duration,
    },
    skip: !formData.scheduledDate || !formData.scheduledTime,
  });

  const [createAppointment] = useMutation<CreateAppointmentResponse>(CREATE_APPOINTMENT, {
    onError: (error) => {
      setError(error.message);
    }
  });

  useEffect(() => {
    if (formData.scheduledDate && formData.scheduledTime) {
      refetchAvailable();
    }
  }, [formData.scheduledDate, formData.scheduledTime, formData.duration, refetchAvailable]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      const { data } = await createAppointment({
        variables: {
          input: {
            psychologistId: formData.psychologistId,
            childId: user?._id,
            scheduledDate: scheduledDateTime.toISOString(),
            duration: formData.duration,
            type: formData.type,
            notes: formData.notes || undefined,
            location: formData.location || undefined,
            isOnline: formData.isOnline,
            meetingLink: formData.isOnline ? formData.meetingLink || undefined : undefined,
          },
        },
      });

      if (data?.createAppointment) {
        router.push(`/appointments/${data.createAppointment._id}?success=true`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData(prev => ({
      ...prev,
      scheduledDate: date,
      scheduledTime: '', // Reset time when date changes
    }));
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum 1 day in advance
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Maximum 30 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  const appointmentTypes = [
    { value: 'CONSULTATION', label: 'Initial Consultation', description: 'First meeting to discuss needs' },
    { value: 'THERAPY_SESSION', label: 'Therapy Session', description: 'Regular therapy session' },
    { value: 'FOLLOW_UP', label: 'Follow-up', description: 'Follow-up session' },
    { value: 'EMERGENCY', label: 'Emergency Session', description: 'Urgent mental health support' },
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
  ];

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
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Your Session 📅
          </h1>
          <p className="text-gray-600">
            Schedule a session with a qualified psychologist
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, label: 'Psychologist', icon: Brain },
              { step: 2, label: 'Date & Time', icon: Calendar },
              { step: 3, label: 'Details', icon: Clock },
              { step: 4, label: 'Confirm', icon: CheckCircle },
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= item.step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= item.step ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
                {item.step < 4 && (
                  <div className={`w-8 h-0.5 ml-4 ${
                    step > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Psychologist Selection */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Psychologist</h2>
              
              {psychologist ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {psychologist.user.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {psychologist.user.fullName}
                      </h3>
                      <p className="text-gray-600">@{psychologist.user.userName}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">
                          {psychologist.averageRating ? psychologist.averageRating.toFixed(1) : 'New'} • 
                          {psychologist.experience} years experience • 
                          ${psychologist.hourlyRate}/hour
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No psychologist selected</p>
                  <Link
                    href="/psychologists"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Psychologists
                  </Link>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.psychologistId}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleDateChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.scheduledDate || !formData.scheduledTime}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Session Details */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Session Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointmentTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.type === type.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Format *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.isOnline 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="isOnline"
                        checked={formData.isOnline}
                        onChange={() => setFormData(prev => ({ ...prev, isOnline: true }))}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <Video className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">Online Session</div>
                          <div className="text-sm text-gray-600">Video call via secure platform</div>
                        </div>
                      </div>
                    </label>
                    <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      !formData.isOnline 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="isOnline"
                        checked={!formData.isOnline}
                        onChange={() => setFormData(prev => ({ ...prev, isOnline: false }))}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900">In-Person Session</div>
                          <div className="text-sm text-gray-600">Meet at specified location</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.isOnline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Link (Optional)
                    </label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                )}

                {!formData.isOnline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required={!formData.isOnline}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter meeting location"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific concerns or topics you'd like to discuss..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Review & Confirm
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Confirm Your Booking</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Psychologist Info */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Psychologist</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {psychologist?.user.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{psychologist?.user.fullName}</h4>
                      <p className="text-gray-600">@{psychologist?.user.userName}</p>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Session Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Date & Time:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium text-gray-900">
                        {durationOptions.find(opt => opt.value === formData.duration)?.label}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="font-medium text-gray-900">
                        {appointmentTypes.find(type => type.value === formData.type)?.label}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Format:</span>
                      <p className="font-medium text-gray-900">
                        {formData.isOnline ? 'Online Session' : 'In-Person Session'}
                      </p>
                    </div>
                  </div>
                  {formData.location && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Location:</span>
                      <p className="font-medium text-gray-900">{formData.location}</p>
                    </div>
                  )}
                  {formData.notes && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Notes:</span>
                      <p className="font-medium text-gray-900">{formData.notes}</p>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Pricing</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {durationOptions.find(opt => opt.value === formData.duration)?.label} session
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${(psychologist?.hourlyRate || 0) * (formData.duration / 60)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Booking...
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentPage;
