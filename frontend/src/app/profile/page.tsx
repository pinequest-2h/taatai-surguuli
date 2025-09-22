"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GET_USER_BY_ID } from '@/lib/graphql/queries';
import { UPDATE_USER } from '@/lib/graphql/mutations';

interface GetUserByIdResponse {
  getUserById?: {
    _id: string;
    fullName: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    bio?: string;
    gender: 'FEMALE' | 'MALE' | 'OTHER';
    role: 'CHILD' | 'PSYCHOLOGIST' | 'ADMIN';
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
    gender: 'FEMALE' | 'MALE' | 'OTHER';
    role: 'CHILD' | 'PSYCHOLOGIST' | 'ADMIN';
    isVerified: boolean;
    isPrivate: boolean;
    profileImage?: string;
    createdAt?: string;
  };
}

const ProfilePage = () => {
  const { user: currentUser, logout, updateUser: updateAuthUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    gender: 'OTHER' as 'FEMALE' | 'MALE' | 'OTHER',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading } = useQuery<GetUserByIdResponse>(GET_USER_BY_ID, {
    variables: { _id: currentUser?._id },
    skip: !currentUser?._id,
  });

  const [updateUser] = useMutation<UpdateUserResponse>(UPDATE_USER);

  const user = data?.getUserById || currentUser;

  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        userName: user.userName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        gender: user.gender || 'OTHER',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);


    if (!formData.fullName.trim()) {
      setError('Full name is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.userName.trim()) {
      setError('Username is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: updateData } = await updateUser({
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

      if (updateData?.updateUser) {
        setIsEditing(false);

        updateAuthUser(updateData.updateUser);
        alert('✅ Profile updated successfully!');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        return <User className="h-5 w-5 text-gray-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile 👤
          </h1>
          <p className="text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-4xl font-bold">
                      {user?.fullName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.fullName || 'User Name'}
                </h2>
                <p className="text-gray-600 mb-2">@{user?.userName || 'username'}</p>
                
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role || '')} mb-4`}>
                  {getRoleIcon(user?.role || '')}
                  <span className="ml-2 capitalize">{user?.role?.toLowerCase() || 'user'}</span>
                </div>

                {user?.isVerified && (
                  <div className="flex items-center justify-center text-green-600 mb-4">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Verified Account</span>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user?.fullName || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">@{user?.userName || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user?.email || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user?.phoneNumber || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="OTHER">Prefer not to say</option>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                    </select>
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 capitalize">{user?.gender?.toLowerCase() || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us a little about yourself..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{user?.bio || 'No bio provided'}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        {getRoleIcon(user?.role || '')}
                        <span className="ml-3 text-gray-900 capitalize">{user?.role?.toLowerCase() || 'user'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Status
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                        <span className={`font-medium ${user?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {user?.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-5 w-5 mr-2" />
                      )}
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                {user?.role === 'PSYCHOLOGIST' && (
                  <Link
                    href="/profile/psychologist"
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Brain className="h-5 w-5 mr-3 text-purple-600" />
                    <div>
                      <div className="font-medium">Psychologist Profile</div>
                      <div className="text-sm text-gray-600">Manage your professional profile</div>
                    </div>
                  </Link>
                )}
                <div
                  
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >

                  <div>
                   <button onClick={handleLogout} className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <LogOut className="h-5 w-5 mr-3 text-gray-600" />
                    Logout
                   </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
