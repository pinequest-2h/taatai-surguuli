"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ReportForm from "@/components/ReportForm";
import ReportList from "@/components/ReportList";

export default function ReportsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"submit" | "my-reports">("submit");

  const handleStatusUpdate = (reportId: string, status: string) => {
    console.log(`Updating report ${reportId} to status: ${status}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Хандалт боломжгүй 🚫
          </h1>
          <p className="text-gray-600">
            Энэ хуудсанд нэвтрэхийн тулд та эхлээд{" "}
            <span className="font-semibold">нэвтрэх</span> шаардлагатай.
          </p>
        </div>
      </div>
    );
  }

  if (user.role !== "CHILD") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Хандалт боломжгүй 🚫
          </h1>
          <p className="text-gray-600">
            Энэхүү хэсгийг зөвхөн{" "}
            <span className="font-semibold">хүүхдүүд</span> ашиглаж болно.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Таны Тайлангууд 📝
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Та өөрийн санаа зовсон асуудлаа энд хуваалцаж болно. Бид таны
            мэдээллийг
            <span className="font-semibold"> нууцлалтайгаар</span> авч үзэж, аль
            болох хурдан хугацаанд асуудлыг шийдэх болно.
          </p>
        </div>

        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8 justify-center">
            <button
              onClick={() => setActiveTab("submit")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "submit"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              ✍️ Шинэ Тайлан Илгээх
            </button>
            <button
              onClick={() => setActiveTab("my-reports")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "my-reports"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📂 Миний Тайлангууд
            </button>
          </nav>
        </div>

        {activeTab === "submit" && (
          <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Шинэ Тайлан
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Та юу мэдэрч байгаагаа, ямар асуудалтай тулгарч байгаагаа
                дэлгэрэнгүй бичиж илгээгээрэй. Энэ нь танд тусламж авах эхний
                алхам юм.
              </p>
              <ReportForm
                userId={user._id}
                onSuccess={() => setActiveTab("my-reports")}
              />
            </div>
          </div>
        )}
  
        {activeTab === "my-reports" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Миний Илгээсэн Тайлангууд
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Доорх жагсаалтаас өөрийн өмнө илгээсэн бүх тайлангаа харах
                боломжтой. Таны тайлангийн{" "}
                <span className="font-semibold">статус</span>-г манай баг
                шинэчилж оруулдаг.
              </p>
              <ReportList canEdit={false} onStatusUpdate={handleStatusUpdate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
