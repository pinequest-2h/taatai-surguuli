"use client";

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_REPORTS, GET_USER_REPORTS } from '@/lib/graphql/queries';
import { Report, ReportFilters, GetReportsResponse, GetUserReportsResponse } from '@/types/graphql';
import ReportCard from './ReportCard';

interface ReportListProps {
  userId?: string;
  showUser?: boolean;
  canEdit?: boolean;
  onStatusUpdate?: (reportId: string, status: string) => void;
}

export default function ReportList({ 
  userId, 
  showUser = false, 
  canEdit = false, 
  onStatusUpdate 
}: ReportListProps) {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery<GetReportsResponse | GetUserReportsResponse>(
    userId ? GET_USER_REPORTS : GET_REPORTS,
    {
      variables: userId 
        ? { userId, limit, offset }
        : { filters, limit, offset },
      fetchPolicy: 'cache-and-network'
    }
  );

  const reports = userId 
    ? (data as GetUserReportsResponse)?.getUserReports?.edges?.map((edge) => edge.node) || []
    : (data as GetReportsResponse)?.getReports?.edges?.map((edge) => edge.node) || [];

  const totalCount = userId 
    ? (data as GetUserReportsResponse)?.getUserReports?.totalCount || 0
    : (data as GetReportsResponse)?.getReports?.totalCount || 0;

  const hasNextPage = userId 
    ? (data as GetUserReportsResponse)?.getUserReports?.pageInfo?.hasNextPage
    : (data as GetReportsResponse)?.getReports?.pageInfo?.hasNextPage;

  const hasPreviousPage = userId 
    ? (data as GetUserReportsResponse)?.getUserReports?.pageInfo?.hasPreviousPage
    : (data as GetReportsResponse)?.getReports?.pageInfo?.hasPreviousPage;

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? undefined : status as 'PENDING' | 'REVIEWED' | 'RESOLVED'
    }));
    setOffset(0);
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  const handleLoadPrevious = () => {
    setOffset(prev => Math.max(0, prev - limit));
  };

  if (loading && offset === 0) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading reports: {error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {!userId && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Filter Reports</h3>
          <div className="flex space-x-2">
            {['PENDING', 'REVIEWED', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'PENDING' ? 'Pending' : 
                 status === 'REVIEWED' ? 'Under Review' : 'Resolved'}
              </button>
            ))}
            {filters.status && (
              <button
                onClick={() => setFilters({})}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No reports found</p>
            {userId && (
              <p className="text-gray-400 text-sm mt-2">
                You haven&apos;t submitted any reports yet.
              </p>
            )}
          </div>
        ) : (
          reports.map((report: Report) => (
            <ReportCard
              key={report._id}
              report={report}
              showUser={showUser}
              canEdit={canEdit}
              onStatusUpdate={onStatusUpdate}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalCount > limit && (
        <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">
            Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} reports
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleLoadPrevious}
              disabled={!hasPreviousPage}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleLoadMore}
              disabled={!hasNextPage}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
