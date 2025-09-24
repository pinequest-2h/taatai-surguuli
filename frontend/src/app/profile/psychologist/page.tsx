"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import Link from "next/link";
import {
  Brain,
  Award,
  GraduationCap,
  Clock,
  DollarSign,
  Edit,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GET_PSYCHOLOGIST_PROFILE_BY_USER_ID } from "@/lib/graphql/queries";
import {
  CREATE_PSYCHOLOGIST_PROFILE,
  UPDATE_PSYCHOLOGIST_PROFILE,
} from "@/lib/graphql/mutations";

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
    monday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    tuesday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    wednesday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    thursday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    friday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    saturday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
    sunday?: {
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{ startTime: string; endTime: string }>;
    };
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
    hourlyRate: 0,
    bio: "",
    isAcceptingNewClients: true,
  });
  const [newEducation, setNewEducation] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data, loading, error: queryError, refetch } = useQuery<GetPsychologistProfileResponse>(
    GET_PSYCHOLOGIST_PROFILE_BY_USER_ID,
    {
      variables: { userId: user?._id },
      skip: !user?._id,
    }
  );

  // Handle query completion and errors with useEffect


  const [createProfile] = useMutation<CreatePsychologistProfileResponse>(
    CREATE_PSYCHOLOGIST_PROFILE
  );
  const [updateProfile] = useMutation<UpdatePsychologistProfileResponse>(
    UPDATE_PSYCHOLOGIST_PROFILE
  );

  const profile = data?.getPsychologistProfile;

  // Debug logging


  const specializations = [
    "CHILD_PSYCHOLOGY",
    "ADOLESCENT_PSYCHOLOGY",
    "FAMILY_THERAPY",
    "COGNITIVE_BEHAVIORAL_THERAPY",
    "TRAUMA_THERAPY",
    "ANXIETY_DISORDERS",
    "DEPRESSION",
    "AUTISM_SPECTRUM",
    "LEARNING_DISABILITIES",
    "BEHAVIORAL_ISSUES",
    "SOCIAL_SKILLS",
    "EMOTIONAL_REGULATION",
  ];

  const formatSpecialization = (spec: string) => {
    const translations: { [key: string]: string } = {
      CHILD_PSYCHOLOGY: "Хүүхдийн сэтгэлзүй",
      ADOLESCENT_PSYCHOLOGY: "Өсвөр насныхны сэтгэлзүй",
      FAMILY_THERAPY: "Гэр бүлийн эмчилгээ",
      COGNITIVE_BEHAVIORAL_THERAPY: "Танин мэдэхүйн-зан үйлийн эмчилгээ",
      TRAUMA_THERAPY: "Гэмтлийн эмчилгээ",
      ANXIETY_DISORDERS: "Түгшүүрийн эмгэг",
      DEPRESSION: "Сэтгэлийн хямрал",
      AUTISM_SPECTRUM: "Аутизмын спектр",
      LEARNING_DISABILITIES: "Суралцахуйн бэрхшээл",
      BEHAVIORAL_ISSUES: "Зан үйлийн асуудал",
      SOCIAL_SKILLS: "Нийгмийн ур чадвар",
      EMOTIONAL_REGULATION: "Сэтгэл санааны зохицуулалт",
    };
    return (
      translations[spec] ||
      spec.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // Validate required fields
    if (formData.specializations.length === 0) {
      setError("Дор хаяж нэг мэргэшсэн чиглэл сонгоно уу.");
      setIsLoading(false);
      return;
    }

    if (formData.experience < 0) {
      setError("Туршлага 0-ээс бага байж болохгүй.");
      setIsLoading(false);
      return;
    }

    if (formData.education.length === 0) {
      setError("Дор хаяж нэг боловсролын зэрэг оруулна уу.");
      setIsLoading(false);
      return;
    }

    if (formData.bio.trim().length === 0) {
      setError("Танилцуулга оруулна уу.");
      setIsLoading(false);
      return;
    }

    if (formData.hourlyRate <= 0) {
      setError("Цаг тутамдын төлбөр 0-ээс их байх ёстой.");
      setIsLoading(false);
      return;
    }

    try {
      if (profile) {
        
        await updateProfile({
          variables: {
            input: {
              specializations: formData.specializations,
              experience: formData.experience,
              education: formData.education,
              certifications: formData.certifications,
              hourlyRate: formData.hourlyRate,
              bio: formData.bio,
              isAcceptingNewClients: formData.isAcceptingNewClients,
            },
          },
        });
      } else {
        
        await createProfile({
          variables: {
            input: {
              specializations: formData.specializations,
              experience: formData.experience,
              education: formData.education,
              certifications: formData.certifications,
              hourlyRate: formData.hourlyRate,
              bio: formData.bio,
              isAcceptingNewClients: formData.isAcceptingNewClients,
              workingHours: {
                monday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "17:00",
                  breaks: [],
                },
                tuesday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "17:00",
                  breaks: [],
                },
                wednesday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "17:00",
                  breaks: [],
                },
                thursday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "17:00",
                  breaks: [],
                },
                friday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "17:00",
                  breaks: [],
                },
                saturday: {
                  isAvailable: false,
                  startTime: "",
                  endTime: "",
                  breaks: [],
                },
                sunday: {
                  isAvailable: false,
                  startTime: "",
                  endTime: "",
                  breaks: [],
                },
              },
            },
          },
        });
      }

      await refetch();
      setIsEditing(false);
      
      // Show success message
      setSuccessMessage(profile ? "Профайл амжилттай шинэчлэгдлээ!" : "Профайл амжилттай үүсгэгдлээ!");
      setTimeout(() => setSuccessMessage(""), 5000);
      if (!profile) {
        // Profile was just created
        alert(
          "🎉 Баяр хүргэе! Таны мэргэжлийн профайл амжилттай үүсгэгдлээ! Та одоо үйлчлүүлэгчдийг хүлээн авч эхэлж болно."
        );
      } else {
        // Profile was updated
        alert("✅ Таны мэргэжлийн профайл амжилттай шинэчлэгдлээ!");
      }
    } catch (err: unknown) {
      // Handle Apollo Client errors
      if (err && typeof err === 'object') {
        // Check for Apollo Client error structure
        const apolloError = err as {
          message?: string;
          graphQLErrors?: Array<{ extensions?: { code?: string } }>;
        };
        
        // Handle CombinedGraphQLErrors
        if (apolloError.message && apolloError.message.includes('Failed to create psychologist profile')) {
          // Check if this is the specific profile already exists error
          if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
            const graphQLError = apolloError.graphQLErrors[0];
            if (graphQLError.extensions?.code === 'PROFILE_ALREADY_EXISTS') {
              setError("Таны мэргэжлийн профайл аль хэдийн үүсгэгдсэн байна. Профайлыг шинэчлэхийн тулд 'Засварлах' товчийг дарна уу.");
              // Refetch to get the existing profile
              await refetch();
              return;
            }
          }
        }
        
        // Handle regular GraphQL errors
        if ('graphQLErrors' in apolloError && apolloError.graphQLErrors) {
          const graphQLError = apolloError.graphQLErrors[0];
          if (graphQLError?.extensions?.code === 'PROFILE_ALREADY_EXISTS') {
            setError("Таны мэргэжлийн профайл аль хэдийн үүсгэгдсэн байна. Профайлыг шинэчлэхийн тулд 'Засварлах' товчийг дарна уу.");
            // Refetch to get the existing profile
            await refetch();
            return;
          }
        }
      }
      
      setError(
        err instanceof Error
          ? err.message
          : "Профайл хадгалахад алдаа гарлаа. Дахин оролдоно уу."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecializationChange = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, newEducation.trim()],
      }));
      setNewEducation("");
    }
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
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
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Сонсъё, Дэмжье.
                </span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Сэтгэлзүйчийн профайл 🧠
          </h1>
          <p className="text-gray-600">
            {profile
              ? "Мэргэжлийн профайлаа удирдах"
              : "Мэргэжлийн профайл үүсгэх"}
          </p>
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <p><strong>User ID:</strong> {user?._id}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Query Error:</strong> {queryError ? queryError.message : 'None'}</p>
              <p><strong>Has Profile:</strong> {profile ? 'Yes' : 'No'}</p>
              <p><strong>Profile ID:</strong> {profile?._id || 'N/A'}</p>
            </div>
          )}
        </div>

        {!profile && !isEditing && !loading && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-8 text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {queryError ? "Профайл ачааллахад алдаа гарлаа" : "Мэргэжлийн аяллаа эхлүүлээрэй! 🌟"}
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {queryError 
                ? "Профайл ачааллахад алдаа гарлаа. Дахин оролдох эсвэл шинэ профайл үүсгэх боломжтой."
                : "Таны мэргэжлийн туршлагыг хэрэгтэй хүүхэд, гэр бүлүүдтэй холбохын тулд мэргэжлийн профайлаа үүсгэнэ үү. Таны профайл нь үйлчлүүлэгчид таныг олж, таны мэргэшсэн чиглэлүүдийг ойлгоход тусална."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                {queryError ? "Шинэ профайл үүсгэх" : "Мэргэжлийн профайл үүсгэх"}
              </button>
              {queryError && (
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Дахин оролдох
                </button>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors border border-purple-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Хяналтын самбар руу буцах
              </Link>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Профайл ачааллаж байна...</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Мэргэжлийн мэдээлэл
            </h2>
            {profile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Профайл засах
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {successMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Мэргэшсэн чиглэл *
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
                  {profile.specializations && Array.isArray(profile.specializations) && profile.specializations.length > 0 ? (
                    profile.specializations.map((spec: string) => (
                      <span
                        key={spec}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {formatSpecialization(spec)}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Мэргэшсэн чиглэл сонгогдоогүй байна</span>
                  )}
                </div>
              )}
            </div>

            {/* Experience and Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ажлын туршлага (жил) *
                </label>
                {isEditing || !profile ? (
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        experience: parseInt(e.target.value) || 0,
                      }))
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {profile.experience} жил
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цагийн төлбөр ($) *
                </label>
                {isEditing || !profile ? (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hourlyRate: parseFloat(e.target.value) || 0,
                      }))
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      ${profile.hourlyRate}/цаг
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мэргэжлийн танилцуулга *
              </label>
              {isEditing || !profile ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Үйлчлүүлэгчдэд өөрийн арга барил, туршлага, хэрхэн тусалж чадах талаар хэлнэ үү..."
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
                Боловсрол
              </label>
              {isEditing || !profile ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="жишээ: Эмнэлзүйн сэтгэлзүйн докторын зэрэг, ..."
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
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
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
                  {profile.education && Array.isArray(profile.education) && profile.education.length > 0 ? (
                    profile.education.map((edu: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <GraduationCap className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-gray-900">{edu}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Боловсролын мэдээлэл оруулаагүй байна</span>
                  )}
                </div>
              )}
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Гэрчилгээ
              </label>
              {isEditing || !profile ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="жишээ: Эмнэлзүйн сэтгэлзүйчийн лиценз, ТЗЭ-ийн гэрчилгээ..."
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
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
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
                  {profile.certifications && Array.isArray(profile.certifications) && profile.certifications.length > 0 ? (
                    profile.certifications.map((cert: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <Award className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-gray-900">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Гэрчилгээний мэдээлэл оруулаагүй байна</span>
                  )}
                </div>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Шинэ үйлчлүүлэгч хүлээн авах
              </label>
              {isEditing || !profile ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAcceptingNewClients}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isAcceptingNewClients: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Би одоогоор шинэ үйлчлүүлэгч хүлээн авч байна
                  </span>
                </div>
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {profile.isAcceptingNewClients ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  )}
                  <span
                    className={`font-medium ${
                      profile.isAcceptingNewClients
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {profile.isAcceptingNewClients
                      ? "Шинэ үйлчлүүлэгч хүлээн авч байна"
                      : "Шинэ үйлчлүүлэгч хүлээн авахгүй байна"}
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
                    Цуцлах
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
                  {isLoading
                    ? "Хадгалж байна..."
                    : profile
                    ? "Өөрчлөлтийг хадгалах"
                    : "Профайл үүсгэх"}
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
