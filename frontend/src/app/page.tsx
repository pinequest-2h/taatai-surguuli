"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Heart, 
  Brain, 
  Shield
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Сэтгэл холбож,
          <span className="text-blue-600"> Зүрх эдгээж</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Хүүхдүүд болон гэр бүлүүд мэргэжлийн сэтгэл судлаачтай холбогдож, дэмжлэг, зөвлөгөө, 
          сэтгэл зүйн эрүүл мэндийг авах аюулгүй, найдвартай платформ.
        </p>
        
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Эхлэх
            </Link>
            <Link
              href="/signin"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Нэвтрэх
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chatrooms"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Зурвас руу орох
            </Link>
            <Link
              href="/psychologists"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Сэтгэл судлаач харах
            </Link>
          </div>
        )}
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Хүүхдэд зориулсан арчилгаа</h3>
          <p className="text-gray-600">
            Хүүхдүүд болон өсвөр насны хүмүүст зориулсан насны тохиргоотой арга барилаар тусгайлан бэлтгэсэн дэмжлэг.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Мэргэжлийн сэтгэл судлаачид</h3>
          <p className="text-gray-600">
            Хүүхдүүд болон гэр бүлийн эмчилгээнд мэргэшсэн лицензтэй, туршлагатай сэтгэл судлаачтай холбогдоорой.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Аюулгүй ба найдвартай</h3>
          <p className="text-gray-600">
            Таны хувийн нууц болон аюулгүй байдал бидний хамгийн чухал зорилго бөгөөд шифрлэгдсэн харилцаа болон аюулгүй сешнүүдтэй.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;