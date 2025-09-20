"use client";

import { Report } from '@/types/graphql';
import { formatDistanceToNow } from 'date-fns';

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
          {showUser && (
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
        
        {canEdit && onStatusUpdate && (
          <div className="flex space-x-2">
            {report.status !== 'REVIEWED' && (
              <button
                onClick={() => onStatusUpdate(report._id, 'REVIEWED')}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Mark as Reviewed
              </button>
            )}
            {report.status !== 'RESOLVED' && (
              <button
                onClick={() => onStatusUpdate(report._id, 'RESOLVED')}
                className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
