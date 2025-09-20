"use client";

import { useState } from 'react';
import { useMutation } from '@apollo/client/';
import { CREATE_REPORT } from '@/lib/graphql/mutations';
import { GET_USER_REPORTS } from '@/lib/graphql/queries';
import { CreateReportInput } from '@/types/graphql';

interface ReportFormProps {
  userId: string;
  onSuccess?: () => void;
}

export default function ReportForm({ userId, onSuccess }: ReportFormProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createReport] = useMutation(CREATE_REPORT, {
    refetchQueries: [
      {
        query: GET_USER_REPORTS,
        variables: { userId, limit: 10, offset: 0 }
      }
    ],
    onCompleted: () => {
      setDescription('');
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
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      const input: CreateReportInput = {
        description: description.trim()
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
        Please describe any issues, concerns, or feedback you'd like to share with our team.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !description.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
