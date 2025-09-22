"use client";

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';
import { UPDATE_REPORT } from '@/lib/graphql/mutations';
import ReportList from '@/components/ReportList';

export default function PsychologistReportsPage() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const [updateReport] = useMutation(UPDATE_REPORT, {
    onCompleted: () => {
      setIsUpdating(null);
    },
    onError: (error: Error) => {
      console.error('Error updating report:', error);
      setIsUpdating(null);
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'PSYCHOLOGIST') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only psychologists can access this page.</p>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (reportId: string, status: string) => {
    setIsUpdating(reportId);
    try {
      await updateReport({
        variables: {
          _id: reportId,
          input: { status }
        }
      });
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Psychologist Reports</h1>
          <p className="text-gray-600">
            Review and manage reports assigned to you. Update their status as you work on them.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Assigned Reports</h2>
            <div className="text-sm text-gray-500">
              Psychologist View
            </div>
          </div>
          
          <ReportList 
            showUser={true}
            canEdit={true}
            showAllReports={false}
            psychologistView={true}
            onStatusUpdate={handleStatusUpdate}
          />
          
          {isUpdating && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Updating report...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
