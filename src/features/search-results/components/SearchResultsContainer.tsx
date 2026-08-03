'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SearchPanel, TripType } from '@/features/search';
import { BusGrid, MOCK_BUS_SCHEDULES } from '@/features/bus';
import { SearchResultsHeader } from './SearchResultsHeader';
import { FilterSidebar } from './FilterSidebar';
import { ParsedSearchQuery } from '../types/search-query';
import { FilterState, SortOption } from '../types/search-filter';
import { filterBusSchedules } from '../utils/filter-buses';
import { sortBusSchedules } from '../utils/sort-buses';
import { parseFilterStateFromUrl, createFilterQueryString } from '../utils/query-builder';

export function SearchResultsContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  // 1. Parse URL Base Search Query
  const parsedQuery = React.useMemo<ParsedSearchQuery>(() => {
    const origin = searchParams.get('origin') || '';
    const destination = searchParams.get('destination') || '';
    const departureDate = searchParams.get('departureDate') || '';
    const returnDate = searchParams.get('returnDate') || '';
    const adults = Math.max(1, parseInt(searchParams.get('adults') || '1', 10));
    const children = Math.max(0, parseInt(searchParams.get('children') || '0', 10));
    const rawTripType = searchParams.get('tripType');
    const tripType: TripType = rawTripType === 'round-trip' ? 'round-trip' : 'one-way';

    return {
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      tripType,
      totalPassengers: adults + children,
    };
  }, [searchParams]);

  // 2. Parse URL Filter State (Single source of truth)
  const filterState = React.useMemo<FilterState>(
    () => parseFilterStateFromUrl(searchParams),
    [searchParams]
  );

  // 3. Update URL with new filter state
  const handleFilterChange = React.useCallback(
    (updates: Partial<FilterState>) => {
      const newQueryString = createFilterQueryString(
        new URLSearchParams(searchParams.toString()),
        updates
      );
      router.push(`${pathname}?${newQueryString}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // 4. Reset Filters handler
  const handleResetFilters = React.useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('priceMax');
    params.delete('busTypes');
    params.delete('amenities');
    params.delete('timeWindows');
    params.delete('sortBy');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // 5. Execute Pure Filter & Sort Pipeline
  const finalSchedules = React.useMemo(() => {
    const filtered = filterBusSchedules(MOCK_BUS_SCHEDULES, parsedQuery, filterState);
    return sortBusSchedules(filtered, filterState.sortBy);
  }, [parsedQuery, filterState]);

  // Initial values for SearchPanel form pre-fill
  const initialFormValues = React.useMemo(
    () => ({
      origin: parsedQuery.origin,
      destination: parsedQuery.destination,
      departureDate: parsedQuery.departureDate,
      returnDate: parsedQuery.returnDate,
      passengers: { adults: parsedQuery.adults, children: parsedQuery.children },
      tripType: parsedQuery.tripType,
    }),
    [parsedQuery]
  );

  return (
    <div className="space-y-6">
      {/* Route Header & Sort Controls Bar */}
      <SearchResultsHeader
        query={parsedQuery}
        resultCount={finalSchedules.length}
        isEditOpen={isEditOpen}
        onToggleEdit={() => setIsEditOpen((prev) => !prev)}
        sortBy={filterState.sortBy}
        onSortChange={(sortBy: SortOption) => handleFilterChange({ sortBy })}
        onToggleMobileFilter={() => setIsMobileFilterOpen((prev) => !prev)}
        isMobileFilterOpen={isMobileFilterOpen}
      />

      {/* Expandable Search Panel for Editing Parameters */}
      {isEditOpen && (
        <div className="animate-in fade-in-50 zoom-in-95 transition-all duration-normal">
          <SearchPanel initialValues={initialFormValues} />
        </div>
      )}

      {/* Main Content Layout: Desktop Sidebar + Bus Grid */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:w-72 shrink-0">
          <FilterSidebar
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer Modal */}
        {isMobileFilterOpen && (
          <div
            role="dialog"
            aria-label="Mobile Search Filters"
            className="fixed inset-0 z-50 flex flex-col bg-white p-5 overflow-y-auto lg:hidden animate-in fade-in-50"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Filters & Sorting</h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>

            <FilterSidebar
              filterState={filterState}
              onFilterChange={(updates) => {
                handleFilterChange(updates);
              }}
              onResetFilters={handleResetFilters}
            />

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-6 w-full h-11 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-soft"
            >
              Show {finalSchedules.length} Results
            </button>
          </div>
        )}

        {/* Bus Results Grid Area */}
        <div className="flex-1 w-full">
          <BusGrid
            schedules={finalSchedules}
            title={
              parsedQuery.origin || parsedQuery.destination
                ? `Buses from ${parsedQuery.origin || 'Any'} to ${parsedQuery.destination || 'Any'}`
                : 'Available Bus Schedules'
            }
            subtitle={`Showing ${finalSchedules.length} schedules matching your search and filter criteria`}
          />
        </div>
      </div>
    </div>
  );
}
