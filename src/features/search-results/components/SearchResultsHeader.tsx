'use client';

import * as React from 'react';
import { MapPin, Calendar, Users, SlidersHorizontal, ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ParsedSearchQuery } from '../types/search-query';
import { SortSelector } from './SortSelector';
import { SortOption } from '../types/search-filter';

export interface SearchResultsHeaderProps {
  query: ParsedSearchQuery;
  isEditOpen: boolean;
  onToggleEdit: () => void;
  resultCount: number;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  onToggleMobileFilter?: () => void;
  isMobileFilterOpen?: boolean;
  className?: string;
}

export const SearchResultsHeader = React.memo<SearchResultsHeaderProps>(function SearchResultsHeader({
  query,
  isEditOpen,
  onToggleEdit,
  resultCount,
  sortBy,
  onSortChange,
  onToggleMobileFilter,
  isMobileFilterOpen = false,
  className,
}) {
  const routeText =
    query.origin || query.destination
      ? `${query.origin || 'Any Origin'} → ${query.destination || 'Any Destination'}`
      : 'All Bus Routes';

  return (
    <div
      className={cn(
        'flex flex-col space-y-4 rounded-2xl border border-border/80 bg-white p-4 sm:p-5 shadow-subtle',
        className
      )}
    >
      {/* Upper Row: Route Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Route Summary */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl capitalize">{routeText}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>{query.departureDate || 'Today'}</span>
            </div>

            <span>•</span>

            <div className="flex items-center space-x-1">
              <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>
                {query.totalPassengers} {query.totalPassengers === 1 ? 'Passenger' : 'Passengers'}
              </span>
            </div>

            <span>•</span>

            <span className="capitalize">{query.tripType.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {resultCount} {resultCount === 1 ? 'Bus' : 'Buses'} Available
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleEdit}
            aria-expanded={isEditOpen}
            aria-label="Modify search criteria"
            className="h-9 px-3 text-xs font-semibold"
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            <span>{isEditOpen ? 'Hide Form' : 'Modify Search'}</span>
            <ChevronDown
              className={cn('ml-1.5 h-3.5 w-3.5 transition-transform duration-normal', isEditOpen && 'rotate-180')}
            />
          </Button>

          {/* Mobile Filter Drawer Button */}
          {onToggleMobileFilter && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleMobileFilter}
              aria-expanded={isMobileFilterOpen}
              aria-label="Open filter sidebar"
              className="h-9 px-3 text-xs font-semibold lg:hidden"
            >
              <Filter className="mr-1.5 h-3.5 w-3.5 text-primary" />
              <span>Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Lower Row: Sort Controls Bar */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="text-muted-foreground font-medium">
          Showing {resultCount} matching schedules
        </span>

        <SortSelector sortBy={sortBy} onChange={onSortChange} />
      </div>
    </div>
  );
});
