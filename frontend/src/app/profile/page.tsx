"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Brain,
  ArrowLeft,
  Camera,
  Shield,
  Heart,
  LogOut,
  Calendar,
  Settings,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GET_USER_BY_ID } from "@/lib/graphql/queries";
import { UPDATE_USER } from "@/lib/graphql/mutations";

interface GetUserByIdResponse {
  getUserById?: {
    _id: string;
    fullName: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    bio?: string;
    gender: "FEMALE" | "MALE" | "OTHER";
    role: "CHILD" | "PSYCHOLOGIST" | "ADMIN";
    isVerified: boolean;
    isPrivate: boolean;
    profileImage?: string;
    createdAt?: string;
  };
}

interface UpdateUserResponse {
  updateUser?: {
    _id: string;
    fullName: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    bio?: string;
    gender: "FEMALE" | "MALE" | "OTHER";
    role: "CHILD" | "PSYCHOLOGIST" | "ADMIN";
    isVerified: boolean;
    isPrivate: boolean;
    profileImage?: string;
    createdAt?: string;
  };
}

const ProfilePage = () => {
  const {
    user: currentUser,
    logout,
    updateUser: updateAuthUser,
    isAuthenticated,
    isLoading,
  } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    gender: "OTHER" as "FEMALE" | "MALE" | "OTHER",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading } = useQuery<GetUserByIdResponse>(GET_USER_BY_ID, {
    variables: { _id: currentUser?._id },
    skip: !currentUser?._id,
  });

  const [updateUser] = useMutation<UpdateUserResponse>(UPDATE_USER);

  const user = data?.getUserById || currentUser;

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        userName: user.userName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        gender: user.gender || "OTHER",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Ачааллаж байна...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!formData.fullName.trim() || !formData.userName.trim()) {
      setError("Бүтэн нэр болон хэрэглэгчийн нэр заавал шаардлагатай.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: updatedData } = await updateUser({
        variables: {
          _id: currentUser?._id,
          input: {
            fullName: formData.fullName.trim(),
            userName: formData.userName.trim(),
            email: formData.email?.trim() || undefined,
            phoneNumber: formData.phoneNumber?.trim() || undefined,
            bio: formData.bio?.trim() || undefined,
            gender: formData.gender,
          },
        },
      });

      if (updatedData?.updateUser) {
        setIsEditing(false);
        updateAuthUser(updatedData.updateUser);
        alert("✅ Хувийн мэдээлэл амжилттай шинэчлэгдлээ!");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Хувийн мэдээлэл шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "CHILD":
        return <Heart className="h-5 w-5 text-pink-500" />;
      case "PSYCHOLOGIST":
        return <Brain className="h-5 w-5 text-purple-500" />;
      case "ADMIN":
        return <Shield className="h-5 w-5 text-blue-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "CHILD":
        return "bg-pink-100 text-pink-800";
      case "PSYCHOLOGIST":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "CHILD":
        return "Хүүхэд";
      case "PSYCHOLOGIST":
        return "Сэтгэл зүйч";
      case "ADMIN":
        return "Админ";
      default:
        return "Хэрэглэгч";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 pb-12">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Сэтгэл Зүйч
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Хяналтын самбар
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Миний Профайл 👤
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Хувийн мэдээлэл болон дансны тохиргоог удирдах
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-36 h-36 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto text-white text-5xl font-bold shadow-lg">
                    {user?.fullName?.charAt(0) || "Х"}
                  </div>
                  <button className="absolute bottom-2 right-2 bg-white border-2 border-gray-200 rounded-full p-3 hover:bg-gray-50 transition-all hover:scale-110 shadow-md">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.fullName || "Хэрэглэгч"}
                </h2>
                <p className="text-gray-500 mb-4 text-lg">
                  @{user?.userName || "username"}
                </p>

                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getRoleColor(
                    user?.role || ""
                  )} mb-6 shadow-sm`}
                >
                  {getRoleIcon(user?.role || "")}
                  <span className="ml-2">
                    {getRoleLabel(user?.role || "")}
                  </span>
                </div>

                {user?.isVerified && (
                  <div className="flex items-center justify-center text-green-600 mb-6 bg-green-50 px-4 py-2 rounded-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Баталгаажсан данс
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Гишүүн болсон: {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                      "mn-MN",
                      { month: "long", year: "numeric" }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Info Form */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Settings className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Хувийн мэдээлэл
                  </h2>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-sm font-medium"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Засах
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 shadow-sm font-medium"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Цуцлах
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name & Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["fullName", "userName"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {field === "fullName" ? "Бүтэн нэр *" : "Хэрэглэгчийн нэр *"}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name={field}
                          value={formData[field as keyof typeof formData]}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder={field === "fullName" ? "Бүтэн нэрээ оруулна уу" : "Хэрэглэгчийн нэр оруулна уу"}
                        />
                      ) : (
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">
                            {formData[field as keyof typeof formData] ||
                              "Тодорхойлогдоогүй"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["email", "phoneNumber"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {field === "email" ? "И-мэйл" : "Утасны дугаар"}
                      </label>
                      {isEditing ? (
                        <input
                          type={field === "email" ? "email" : "tel"}
                          name={field}
                          value={formData[field as keyof typeof formData] || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder={field === "email" ? "и-мэйл@example.com" : "+976 1234 5678"}
                        />
                      ) : (
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                          {field === "email" ? (
                            <Mail className="h-5 w-5 text-gray-400 mr-3" />
                          ) : (
                            <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          )}
                          <span className="text-gray-900 font-medium">
                            {formData[field as keyof typeof formData] ||
                              "Тодорхойлогдоогүй"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Хүйс
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="OTHER">Хэлэхгүй байх</option>
                      <option value="FEMALE">Эмэгтэй</option>
                      <option value="MALE">Эрэгтэй</option>
                    </select>
                  ) : (
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 font-medium">
                        {formData.gender === "FEMALE" ? "Эмэгтэй" : 
                         formData.gender === "MALE" ? "Эрэгтэй" : "Хэлэхгүй байх"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Өөрийн тухай
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="Өөрийнхөө тухай бага зүйл хэлээрэй..."
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                      <p className="text-gray-900 font-medium">
                        {formData.bio || "Өөрийн тухай мэдээлэл байхгүй"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit */}
                {isEditing && (
                  <div className="flex justify-end pt-8 border-t-2 border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg font-medium"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      ) : (
                        <Save className="h-5 w-5 mr-3" />
                      )}
                      {isSubmitting ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-3 text-blue-600" />
                Дансны үйлдлүүд
              </h3>
              {user?.role === "PSYCHOLOGIST" && (
                <Link
                  href="/profile/psychologist"
                  className="flex items-center p-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all hover:scale-105 border-2 border-transparent hover:border-purple-200 group"
                >
                  <Brain className="h-6 w-6 mr-4 text-purple-600 group-hover:text-purple-700" />
                  <div>
                    <div className="font-semibold text-lg">Сэтгэл зүйчийн профайл</div>
                    <div className="text-sm text-gray-500">
                      Мэргэжлийн профайлаа удирдах
                    </div>
                  </div>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-4 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all hover:scale-105 border-2 border-transparent hover:border-red-200 group"
              >
                <LogOut className="h-6 w-6 mr-4 text-red-600 group-hover:text-red-700" />
                <div>
                  <div className="font-semibold text-lg">Системээс гарах</div>
                  <div className="text-sm text-gray-500">
                    Дансаа аюулгүй болгож гарах
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
