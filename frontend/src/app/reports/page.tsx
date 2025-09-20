"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ReportForm from '@/components/ReportForm';
import ReportList from '@/components/ReportList';

export default function ReportsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'submit' | 'my-reports'>('submit');

  const handleStatusUpdate = (reportId: string, status: string) => {
    console.log(`Updating report ${reportId} to status: ${status}`);
        
  };

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


  if (user.role !== 'CHILD') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only children can submit reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">
            Submit reports about any issues or concerns you have. Our team will review them and get back to you.
          </p>
        </div>

        
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('submit')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submit New Report
            </button>
            <button
              onClick={() => setActiveTab('my-reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Reports
            </button>
          </nav>
        </div>

              
        {activeTab === 'submit' && (
          <div className="space-y-6">
            <ReportForm 
              userId={user._id} 
              onSuccess={() => {
                setActiveTab('my-reports');
              }}
            />
          </div>
        )}

        {activeTab === 'my-reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Reports</h2>
              <ReportList canEdit={false} onStatusUpdate={handleStatusUpdate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
