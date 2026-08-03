'use client';

import * as React from 'react';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SeatLegendProps {
  className?: string;
}

export const SeatLegend = React.memo<SeatLegendProps>(function SeatLegend({ className }) {
  return (
    <div
      aria-label="Seat Status Legend"
      className={cn(
        'flex flex-wrap items-center justify-center gap-4 rounded-xl border border-border/80 bg-slate-50/80 p-3 text-xs font-semibold text-slate-700',
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 rounded-md border border-slate-300 bg-white shadow-subtle" />
        <span>Available</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white">
          <Check className="h-3 w-3 stroke-[3]" />
        </div>
        <span>Selected</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 rounded-md border border-slate-300 bg-slate-200" />
        <span>Occupied</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-md border border-amber-300 bg-amber-100 text-amber-600">
          <Lock className="h-3 w-3" />
        </div>
        <span>Reserved</span>
      </div>
    </div>
  );
});
