'use client';

import * as React from 'react';
import { Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusSchedule } from '@/features/bus/types/bus';

export interface BusDetailsHeaderProps {
  schedule: BusSchedule;
  className?: string;
}

export const BusDetailsHeader = React.memo<BusDetailsHeaderProps>(function BusDetailsHeader({
  schedule,
  className,
}) {
  const { operator, busType, route, amenities } = schedule;

  return (
    <div
      className={cn(
        'flex flex-col space-y-4 rounded-2xl border border-border/80 bg-white p-5 shadow-subtle sm:p-6',
        className
      )}
    >
      {/* Operator Header & Badges */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{operator.name}</h1>
            <ShieldCheck className="h-5 w-5 text-emerald-600" aria-label="Verified Operator" />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium">
            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
              <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
              {operator.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({operator.reviewCount} reviews)</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">{busType}</span>
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-2">
        <div className="sm:col-span-4">
          <time className="text-xl font-black text-slate-900">{route.departureTime}</time>
          <p className="text-xs font-medium text-muted-foreground">{route.origin}</p>
        </div>

        <div className="sm:col-span-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-slate-600 mb-1">{route.duration}</span>
          <div className="relative flex items-center w-full max-w-[140px]">
            <div className="h-[2px] w-full bg-slate-200" />
            <div className="absolute left-0 h-2 w-2 rounded-full bg-slate-400" />
            <ArrowRight className="absolute right-0 h-3.5 w-3.5 text-slate-400 bg-white" />
          </div>
        </div>

        <div className="sm:col-span-4 sm:text-right">
          <time className="text-xl font-black text-slate-900">{route.arrivalTime}</time>
          <p className="text-xs font-medium text-muted-foreground">{route.destination}</p>
        </div>
      </div>

      {/* Amenities Bar */}
      {amenities.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold text-muted-foreground">Included Amenities:</span>
          <div className="flex flex-wrap gap-1.5">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center space-x-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
              >
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
