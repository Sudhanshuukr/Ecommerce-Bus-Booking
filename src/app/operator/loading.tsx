import * as React from 'react';

export default function OperatorLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards Skeleton (4 columns) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-100 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-20 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Management Shortcuts & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Skeleton */}
        <div className="h-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle space-y-4">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="space-y-3 pt-2">
            <div className="h-16 w-full bg-slate-100 rounded-xl" />
            <div className="h-16 w-full bg-slate-100 rounded-xl" />
            <div className="h-16 w-full bg-slate-100 rounded-xl" />
          </div>
        </div>

        {/* Recent Bookings Table Skeleton */}
        <div className="lg:col-span-2 h-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>
          <div className="space-y-3 pt-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-9 w-full bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
