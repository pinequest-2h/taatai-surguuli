"use client";

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_REPORTS, GET_MY_REPORTS, GET_PSYCHOLOGIST_REPORTS } from '@/lib/graphql/queries';
import { Report, ReportFilters, GetReportsResponse, GetMyReportsResponse, GetPsychologistReportsResponse } from '@/types/graphql';
import ReportCard from './ReportCard';

interface ReportListProps {
  showUser?: boolean;
  canEdit?: boolean;
  onStatusUpdate?: (reportId: string, status: string) => void;
  showAllReports?: boolean;
  psychologistView?: boolean;
}

export default function ReportList({ 
  showUser = false, 
  canEdit = false, 
  onStatusUpdate,
  showAllReports = false,
  psychologistView = false
}: ReportListProps) {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);


  const { data: myReportsData, loading: myReportsLoading, error: myReportsError, refetch: refetchMyReports } = useQuery<GetMyReportsResponse>(
    GET_MY_REPORTS,
    {
      variables: { limit, offset },
      fetchPolicy: 'cache-and-network',
      skip: showAllReports || psychologistView
    }
  );

  const { data: allReportsData, loading: allReportsLoading, error: allReportsError, refetch: refetchAllReports } = useQuery<GetReportsResponse>(
    GET_REPORTS,
    {
      variables: { filters, limit, offset },
      fetchPolicy: 'cache-and-network',
      skip: !showAllReports || psychologistView
    }
  );

  const { data: psychologistReportsData, loading: psychologistReportsLoading, error: psychologistReportsError, refetch: refetchPsychologistReports } = useQuery<GetPsychologistReportsResponse>(
    GET_PSYCHOLOGIST_REPORTS,
    {
      variables: { limit, offset },
      fetchPolicy: 'cache-and-network',
      skip: !psychologistView
    }
  );

  const data = psychologistView ? psychologistReportsData : (showAllReports ? allReportsData : myReportsData);
  const loading = psychologistView ? psychologistReportsLoading : (showAllReports ? allReportsLoading : myReportsLoading);
  const error = psychologistView ? psychologistReportsError : (showAllReports ? allReportsError : myReportsError);
  const refetch = psychologistView ? refetchPsychologistReports : (showAllReports ? refetchAllReports : refetchMyReports);

  const reports = psychologistView 
    ? (data as GetPsychologistReportsResponse)?.getPsychologistReports?.edges?.map((edge) => edge.node) || []
    : showAllReports 
      ? (data as GetReportsResponse)?.getReports?.edges?.map((edge) => edge.node) || []
      : (data as GetMyReportsResponse)?.getMyReports?.edges?.map((edge) => edge.node) || [];
  
  const totalCount = psychologistView
    ? (data as GetPsychologistReportsResponse)?.getPsychologistReports?.totalCount || 0
    : showAllReports
      ? (data as GetReportsResponse)?.getReports?.totalCount || 0
      : (data as GetMyReportsResponse)?.getMyReports?.totalCount || 0;
    
  const hasNextPage = psychologistView
    ? (data as GetPsychologistReportsResponse)?.getPsychologistReports?.pageInfo?.hasNextPage
    : showAllReports
      ? (data as GetReportsResponse)?.getReports?.pageInfo?.hasNextPage
      : (data as GetMyReportsResponse)?.getMyReports?.pageInfo?.hasNextPage;
    
  const hasPreviousPage = psychologistView
    ? (data as GetPsychologistReportsResponse)?.getPsychologistReports?.pageInfo?.hasPreviousPage
    : showAllReports
      ? (data as GetReportsResponse)?.getReports?.pageInfo?.hasPreviousPage
      : (data as GetMyReportsResponse)?.getMyReports?.pageInfo?.hasPreviousPage;

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

      {showAllReports && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Reports</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter('PENDING')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilter('REVIEWED')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.status === 'REVIEWED'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Under Review
            </button>
            <button
              onClick={() => handleStatusFilter('RESOLVED')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.status === 'RESOLVED'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolved
            </button>
            <button
              onClick={() => setFilters({})}
              className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}


      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No reports found</p>
            <p className="text-gray-400 text-sm mt-2">
              You haven&apos;t submitted any reports yet.
            </p>
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
