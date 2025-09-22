"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { CREATE_USER } from '@/lib/graphql/mutations';
import { CreateUserResponse } from '@/types/graphql';
import { Brain, Eye, EyeOff, Heart, User } from 'lucide-react';
import EmailVerification from '@/components/EmailVerification';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    bio: '',
    gender: 'OTHER' as 'FEMALE' | 'MALE' | 'OTHER',
    role: 'CHILD' as 'CHILD' | 'PSYCHOLOGIST' | 'ADMIN',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [createdUserEmail, setCreatedUserEmail] = useState('');

  const router = useRouter();


  React.useEffect(() => {
    console.log('formData.role changed to:', formData.role);
  }, [formData.role]);
  const [createUser] = useMutation<CreateUserResponse>(CREATE_USER, {
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting form with role:', formData.role);
      const { data } = await createUser({
        variables: {
          input: {
            fullName: formData.fullName,
            userName: formData.userName,
            email: formData.email || undefined,
            phoneNumber: formData.phoneNumber || undefined,
            password: formData.password,
            bio: formData.bio || undefined,
            gender: formData.gender,
            role: formData.role,
          },
        },
      });

      if (data?.createUser) {
        // If user provided email, show email verification
        if (formData.email) {
          setCreatedUserEmail(formData.email);
          setShowEmailVerification(true);
        } else {
          // No email provided, go directly to sign in
          router.push('/signin?message=Registration successful! Please sign in.');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    console.log('Form change:', e.target.name, e.target.value);
    console.log('Current formData before update:', formData);
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    console.log('New formData after update:', newFormData);
    setFormData(newFormData);
  };

  // Show email verification if user was created with email
  if (showEmailVerification) {
    return (
      <EmailVerification
        email={createdUserEmail}
        onVerified={() => {
          router.push('/signin?message=Email verified! Please sign in.');
        }}
        onCancel={() => {
          router.push('/signin?message=Registration successful! Please sign in.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Манай нийгэмлэгт нэгдээрэй! 🎉
          </h1>
          <p className="text-gray-600">
            Өнөөдөр бидэнтэй хамт сэтгэл зүйн эрүүл мэндийн аялалаа эхлүүлээрэй
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Би бол: (Одоогийн: {formData.role})
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.role === 'CHILD' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="CHILD"
                    checked={formData.role === 'CHILD'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium text-gray-900">Хүүхэд/Гэр бүл</span>
                  </div>
                </label>
                <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.role === 'PSYCHOLOGIST' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="PSYCHOLOGIST"
                    checked={formData.role === 'PSYCHOLOGIST'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    <span className="font-medium text-gray-900">Сэтгэл судлаач</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Бүтэн нэр *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="Бүтэн нэрээ оруулна уу"
                />
              </div>

              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                  Хэрэглэгчийн нэр *
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="Хэрэглэгчийн нэр сонгоно уу"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  И-мэйл
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="И-мэйлээ оруулна уу"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Утасны дугаар
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="Утасны дугаараа оруулна уу"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Хүйс *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
              >
                <option value="OTHER">Хэлэхгүй байх</option>
                <option value="FEMALE">Эмэгтэй</option>
                <option value="MALE">Эрэгтэй</option>
              </select>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Товч танилцуулга
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="Өөрийнхөө тухай бага зүйл хэлээрэй..."
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Нууц үг *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                    placeholder="Нууц үг үүсгэнэ үү"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Нууц үг баталгаажуулах *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                    placeholder="Нууц үгээ баталгаажуулна уу"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Бүртгэл үүсгэж байна...
                </div>
              ) : (
                'Бүртгэл үүсгэх'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Бүртгэл аль хэдийн байна уу?{' '}
              <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Энд нэвтрэнэ үү
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-pink-500 mr-3" />
              <span className="text-sm text-gray-700">
                Сэтгэл зүйн эрүүл мэнд болон сайн сайхан байдлыг төлөвшүүлэх дэмжлэгтэй нийгэмлэгт нэгдээрэй
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
