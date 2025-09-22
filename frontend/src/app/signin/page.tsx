"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';
import { LOGIN_USER } from '@/lib/graphql/mutations';
import { LoginUserResponse } from '@/types/graphql';
import { Brain, Eye, EyeOff, Heart } from 'lucide-react';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const [loginUser] = useMutation<LoginUserResponse>(LOGIN_USER, {
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await loginUser({
        variables: {
          input: {
            identifier: formData.identifier,
            password: formData.password,
          },
        },
      });

      if (data?.loginUser) {
        login(data.loginUser.user, data.loginUser.token);
        
        // Show role-specific success message
        if (data.loginUser.user.role === 'PSYCHOLOGIST') {
          setError(''); // Clear any previous errors
          // You could add a success message here if needed
        }
        
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Тавтай морил! 🌟
          </h1>
          <p className="text-gray-600">
            Сэтгэл зүйн эрүүл мэндийн аялалаа үргэлжлүүлэхийн тулд нэвтэрнэ үү
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                И-мэйл эсвэл хэрэглэгчийн нэр
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="И-мэйл эсвэл хэрэглэгчийн нэрээ оруулна уу"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Нууц үг
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Нууц үгээ оруулна уу"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Нэвтэрч байна...
                </div>
              ) : (
                'Нэвтрэх'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Нууц үгээ мартсан уу?
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Бүртгэл байхгүй юу?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Энд бүртгүүлнэ үү
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-pink-500 mr-3" />
              <span className="text-sm text-gray-700">
                Сэтгэл зүйн дэмжлэгийн аюулгүй, найдвартай платформ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
