"use client";

import { Report } from '@/types/graphql';
import { formatDistanceToNow } from 'date-fns';
import { useMutation } from '@apollo/client/react';
import { UPDATE_REPORT } from '@/lib/graphql/mutations';
import { GET_MY_REPORTS } from '@/lib/graphql/queries';

interface ReportCardProps {
  report: Report;
  showUser?: boolean;
  onStatusUpdate?: (reportId: string, status: string) => void;
  canEdit?: boolean;
}

export default function ReportCard({ 
  report, 
  showUser = false, 
  onStatusUpdate, 
  canEdit = false 
}: ReportCardProps) {
  const [updateReport, { loading }] = useMutation(UPDATE_REPORT, {
    refetchQueries: [
      {
        query: GET_MY_REPORTS,
        variables: { limit: 10, offset: 0 }
      }
    ],
    onCompleted: () => {
      onStatusUpdate?.(report._id, 'updated');
    },
    onError: (error) => {
      console.error('Error updating report:', error);
    }
  });

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateReport({
        variables: {
          _id: report._id,
          input: { status }
        }
      });
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending Review';
      case 'REVIEWED':
        return 'Under Review';
      case 'RESOLVED':
        return 'Resolved';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {showUser && report.userId && (
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {report.userId.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {report.userId.fullName}
                </p>
                <p className="text-xs text-gray-500">@{report.userId.userName}</p>
              </div>
            </div>
          )}
          
          <div className="mb-2">
            {(report.school || report.class) && (
              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                {report.school && (
                  <span className="flex items-center">
                    <span className="font-medium">School:</span> {report.school}
                  </span>
                )}
                {report.class && (
                  <span className="flex items-center">
                    <span className="font-medium">Class:</span> {report.class}
                  </span>
                )}
                {report.anonymous && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    Anonymous
                  </span>
                )}
              </div>
            )}
          </div>
          
          <p className="text-gray-800 text-sm leading-relaxed">
            {report.description}
          </p>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
          {getStatusText(report.status)}
        </span>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          Created {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
        </span>
        
        {canEdit && (
          <div className="flex space-x-2">
            {report.status !== 'REVIEWED' && (
              <button
                onClick={() => handleStatusUpdate('REVIEWED')}
                disabled={loading}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Mark as Reviewed'}
              </button>
            )}
            {report.status !== 'RESOLVED' && (
              <button
                onClick={() => handleStatusUpdate('RESOLVED')}
                disabled={loading}
                className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Mark as Resolved'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
