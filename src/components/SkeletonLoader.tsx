import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 space-y-6 animate-pulse">
      
      {/* Current Weather Card Skeleton */}
      <div className="bg-[#0F0F0F] border border-white/20 rounded-sm p-6 sm:p-10 space-y-6">
        <div className="flex justify-between items-start pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-white/10 rounded-none" />
            <div className="h-12 w-64 bg-white/15 rounded-none" />
          </div>
          <div className="h-8 w-24 bg-white/10 rounded-none" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-4 border-b border-white/10">
          <div className="flex items-baseline space-x-4">
            <div className="h-24 w-40 bg-white/15 rounded-none" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-white/10 rounded-none" />
              <div className="h-4 w-36 bg-white/10 rounded-none" />
            </div>
          </div>
          <div className="h-20 w-48 bg-white/10 rounded-none" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-sm p-4 space-y-2">
              <div className="h-3 w-16 bg-white/10" />
              <div className="h-6 w-20 bg-white/15" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Card Skeleton */}
      <div className="bg-[#0F0F0F] border border-white/20 rounded-sm p-6 sm:p-8 space-y-4">
        <div className="h-6 w-56 bg-white/10 rounded-none" />
        <div className="h-14 bg-white/10 rounded-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-20 bg-white/5 border border-white/10 rounded-sm" />
          <div className="h-20 bg-white/5 border border-white/10 rounded-sm" />
        </div>
      </div>

    </div>
  );
};

