"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center  translate-y-1/2">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Сэтгэлийг холбож,
          <span className="text-blue-600"> Зүрхийг эдгээе</span>
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto">
          Сургууль дээр болон өдөр тутмын амьдралд тулгарсан бэрхшээлээ нээлттэй
          хуваалцаж, шийдлийг хамтдаа хайцгаая.
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
    </div>
  );
}
