import React from 'react';

export const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-4" />
        <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      {/* About Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-24 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>

      {/* Skills Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-24 bg-gray-200 rounded" />
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>

      {/* Experience Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-3">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
