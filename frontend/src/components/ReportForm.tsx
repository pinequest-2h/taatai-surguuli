"use client";

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_REPORT } from '@/lib/graphql/mutations';
import { GET_MY_REPORTS } from '@/lib/graphql/queries';
import { CreateReportInput } from '@/types/graphql';

interface ReportFormProps {
  userId: string;
  onSuccess?: () => void;
}

export default function ReportForm({ userId, onSuccess }: ReportFormProps) {
  const [school, setSchool] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createReport] = useMutation(CREATE_REPORT, {
    refetchQueries: [
      {
        query: GET_MY_REPORTS,
        variables: { limit: 10, offset: 0 }
      }
    ],
    onCompleted: () => {
      setSchool('');
      setClassGrade('');
      setDescription('');
      setAnonymous(false);
      setIsSubmitting(false);
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error creating report:', error);
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim() || !classGrade.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const input: CreateReportInput = {
        school: school.trim(),
        class: classGrade.trim(),
        description: description.trim(),
        anonymous
      };
      await createReport({ variables: { input } });
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit a Report</h2>
      <p className="text-gray-600 mb-6">
        Please describe any issues, concerns, or feedback youd like to share with our team.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
              School *
            </label>
            <input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Enter your school name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
              Class *
            </label>
            <input
              type="text"
              id="class"
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value)}
              placeholder="e.g., Grade 5, Class A"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe your concern or issue in detail..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[120px]"
            required
            disabled={isSubmitting}
          />
        </div>

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
              Submit this report anonymously (your identity will be hidden from administrators)
            </span>
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !school.trim() || !classGrade.trim() || !description.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
