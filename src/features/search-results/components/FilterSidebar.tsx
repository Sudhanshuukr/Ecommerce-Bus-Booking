'use client';

import * as React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PriceRangeFilter } from './PriceRangeFilter';
import { BusTypeFilter } from './BusTypeFilter';
import { AmenitiesFilter } from './AmenitiesFilter';
import { DepartureTimeFilter } from './DepartureTimeFilter';
import { FilterState, TimeWindow } from '../types/search-filter';

export interface FilterSidebarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  className?: string;
}

export const FilterSidebar = React.memo<FilterSidebarProps>(function FilterSidebar({
  filterState,
  onFilterChange,
  onResetFilters,
  className,
}) {
  const hasActiveFilters =
    filterState.priceMax < 3000 ||
    filterState.busTypes.length > 0 ||
    filterState.amenities.length > 0 ||
    filterState.timeWindows.length > 0;


  return (
    <aside
      aria-label="Search Filters"
      className={cn(
        'flex flex-col space-y-6 rounded-2xl border border-border/80 bg-white p-5 shadow-subtle',
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900">Filters</h2>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-slate-900"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Filter Sections */}
      <PriceRangeFilter
        priceMax={filterState.priceMax}
        onChange={(priceMax) => onFilterChange({ priceMax })}
      />

      <div className="border-t border-slate-100" />

      <BusTypeFilter
        selectedTypes={filterState.busTypes}
        onChange={(busTypes) => onFilterChange({ busTypes })}
      />

      <div className="border-t border-slate-100" />

      <DepartureTimeFilter
        selectedWindows={filterState.timeWindows}
        onChange={(timeWindows: TimeWindow[]) => onFilterChange({ timeWindows })}
      />

      <div className="border-t border-slate-100" />

      <AmenitiesFilter
        selectedAmenities={filterState.amenities}
        onChange={(amenities) => onFilterChange({ amenities })}
      />
    </aside>
  );
});
