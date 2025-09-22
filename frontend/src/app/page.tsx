"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Heart, Brain, Shield } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Сэтгэлийг холбож,
          <span className="text-blue-600"> Зүрхийг эдгээе</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Хүүхдүүд, өсвөр насныхан болон гэр бүлүүд мэргэжлийн сэтгэл судлаачтай
          холбогдон, дэмжлэг авч, сэтгэл зүйн эрүүл мэндээ хамгаалах аюулгүй,
          найдвартай орчин.
          <br />
          Сургууль дээр болон өдөр тутмын амьдралд тулгарсан бэрхшээлээ нээлттэй
          хуваалцаж, шийдлийг хамтдаа хайх боломжтой.
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Хүүхдэд зориулсан арчилгаа
          </h3>
          <p className="text-gray-600">
            Нас, сэтгэл зүйн онцлогтоо тохирсон, хүүхэд болон өсвөр насныханд
            зориулсан тусгай арга барилаар дэмжлэг үзүүлнэ. Сургууль, найз
            нөхөдтэй холбоотой асуудлыг ч чөлөөтэй ярилцаж болно.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Мэргэжлийн сэтгэл судлаачид
          </h3>
          <p className="text-gray-600">
            Хүүхэд, өсвөр нас болон гэр бүлийн сэтгэл судалтад мэргэшсэн,
            лицензтэй, туршлагатай мэргэжилтнүүдтэй шууд холбогдоно.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Аюулгүй ба найдвартай
          </h3>
          <p className="text-gray-600">
            Таны хувийн нууц, аюулгүй байдал бидний тэргүүлэх зорилго. Бүх
            харилцаа шифрлэгдсэн ба итгэлтэйгээр хуваалцах орчинг
            баталгаажуулдаг.
          </p>
        </div>
      </div>
    </div>
  );
}
