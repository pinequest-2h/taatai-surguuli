"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_REPORT } from "@/lib/graphql/mutations";
import { GET_MY_REPORTS } from "@/lib/graphql/queries";
import { CreateReportInput } from "@/types/graphql";

interface ReportFormProps {
  onSuccess?: () => void;
}

export default function ReportForm({ onSuccess }: ReportFormProps) {
  const [school, setSchool] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classError, setClassError] = useState("");

  const [createReport] = useMutation(CREATE_REPORT, {
    refetchQueries: [
      {
        query: GET_MY_REPORTS,
        variables: { limit: 10, offset: 0 },
      },
    ],
    onCompleted: () => {
      setSchool("");
      setClassGrade("");
      setDescription("");
      setAnonymous(false);
      setIsSubmitting(false);
      setClassError("");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Алдаа гарлаа:", error);
      setIsSubmitting(false);
    },
  });

  const validateClass = (value: string) => {
    const match = value.match(/^(\d{1,2})([A-Za-zА-Яа-я]*)$/);
    if (match) {
      const grade = parseInt(match[1], 10);
      if (grade > 12) {
        setClassError("Анги 1–12 хооронд байх ёстой.");
        return false;
      }
    }
    setClassError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim() || !classGrade.trim() || !description.trim()) return;
    if (!validateClass(classGrade)) return;

    setIsSubmitting(true);
    try {
      const input: CreateReportInput = {
        school: school.trim(),
        class: classGrade.trim(),
        description: description.trim(),
        anonymous,
      };
      await createReport({ variables: { input } });
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Тайлан илгээх</h2>
      <p className="text-gray-600 mb-6">
        Та сургууль, ангиа бичээд тулгарч буй асуудлаа дэлгэрэнгүй хуваалцаарай.
        Таны мэдээлэл <span className="font-semibold">нууцлалтай</span>{" "}
        хадгалагдана.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Сургууль */}
        <div>
          <label
            htmlFor="school"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Сургууль *
          </label>
          <input
            type="text"
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Жишээ нь: 23-р сургууль"
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Анги */}
        <div>
          <label
            htmlFor="class"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Анги *
          </label>
          <input
            type="text"
            id="class"
            value={classGrade}
            onChange={(e) => {
              setClassGrade(e.target.value);
              validateClass(e.target.value);
            }}
            placeholder="Жишээ нь: 5А, 11Б"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none text-gray-900
              focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                classError ? "border-red-500" : "border-gray-300"
              }`}
            required
            disabled={isSubmitting}
          />
          {classError && (
            <p className="text-red-500 text-sm mt-1">{classError}</p>
          )}
        </div>

        {/* Тайлбар */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Асуудлын дэлгэрэнгүй *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Та ямар асуудалтай тулгарч байгаагаа дэлгэрэнгүй бичнэ үү..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              resize-vertical min-h-[120px]"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Нууц илгээх */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <span className="ml-2 text-sm text-gray-700">
              Нэрээ нууцлан илгээх (админ таныг танихгүй)
            </span>
          </label>
        </div>

        {/* Илгээх товч */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !school.trim() ||
              !classGrade.trim() ||
              !description.trim() ||
              !!classError
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-md 
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed 
              transition-colors"
          >
            {isSubmitting ? "Илгээж байна..." : "Тайлан илгээх"}
          </button>
        </div>
      </form>
    </div>
  );
}
