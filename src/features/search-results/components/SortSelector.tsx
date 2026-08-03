'use client';

import * as React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SortOption, SORT_OPTIONS } from '../types/search-filter';

export interface SortSelectorProps {
  sortBy: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export const SortSelector = React.memo<SortSelectorProps>(function SortSelector({
  sortBy,
  onChange,
  className,
}) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <ArrowUpDown className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
      <label htmlFor="sort-select-input" className="text-xs font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline">
        Sort By:
      </label>
      <select
        id="sort-select-input"
        value={sortBy}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Sort search results"
        className="h-9 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-slate-800 shadow-subtle hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});
