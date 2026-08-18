'use client';

import * as React from 'react';
import { Bus, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BusCard } from './BusCard';
import { BusSchedule } from '../types/bus';
import { MOCK_BUS_SCHEDULES } from '../mock/buses';

export interface BusGridProps {
  schedules?: BusSchedule[];
  onSelectSchedule?: (scheduleId: string) => void;
  onResetFilters?: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function BusGrid({
  schedules = MOCK_BUS_SCHEDULES,
  onSelectSchedule,
  onResetFilters,
  title = 'Available Bus Routes',
  subtitle = 'Compare verified operators, departure schedules, and transparent fares.',
  className,
}: BusGridProps) {
  const handleSelect = React.useCallback(
    (scheduleId: string) => {
      if (onSelectSchedule) {
        onSelectSchedule(scheduleId);
      } else {
        console.log(`Selected bus schedule: ${scheduleId}`);
      }
    },
    [onSelectSchedule]
  );

  return (
    <section aria-labelledby="bus-discovery-heading" className={cn('w-full space-y-6', className)}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 id="bus-discovery-heading" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h2>
            <Badge variant="secondary" className="font-semibold text-xs rounded-full px-2.5 py-0.5">
              {schedules.length} {schedules.length === 1 ? 'Route' : 'Routes'} Found
            </Badge>
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {/* Informational Filter Tag */}
        <div className="flex items-center space-x-2 text-xs font-medium text-muted-foreground bg-slate-100/80 rounded-lg px-3 py-1.5 w-fit">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-600" />
          <span>Filter & Sort Active</span>
        </div>
      </div>

      {/* Grid Container */}
      {schedules.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {schedules.map((schedule) => (
            <BusCard key={schedule.id} schedule={schedule} onSelect={handleSelect} />
          ))}
        </div>
      ) : (

        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50/50 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <Bus className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Bus Routes Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
            No bus schedules match your active search and filter criteria. Try adjusting your filters or travel parameters.
          </p>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-subtle hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}

