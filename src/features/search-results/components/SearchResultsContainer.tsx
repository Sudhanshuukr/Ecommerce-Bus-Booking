'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchPanel, TripType } from '@/features/search';
import { BusGrid, MOCK_BUS_SCHEDULES } from '@/features/bus';
import { SearchResultsHeader } from './SearchResultsHeader';
import { ParsedSearchQuery } from '../types/search-query';
import { filterBusSchedules } from '../utils/filter-buses';

export function SearchResultsContainer() {
  const searchParams = useSearchParams();
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // Parse URL Search Parameters with fallbacks
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

  // Execute pure filter logic
  const filteredSchedules = React.useMemo(
    () => filterBusSchedules(MOCK_BUS_SCHEDULES, parsedQuery),
    [parsedQuery]
  );

  // Sync SearchPanel initial values from parsed URL search params
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
      {/* Route Header & Edit Toggle */}
      <SearchResultsHeader
        query={parsedQuery}
        resultCount={filteredSchedules.length}
        isEditOpen={isEditOpen}
        onToggleEdit={() => setIsEditOpen((prev) => !prev)}
      />

      {/* Expandable Search Panel for Editing Parameters */}
      {isEditOpen && (
        <div className="animate-in fade-in-50 zoom-in-95 transition-all duration-normal">
          <SearchPanel initialValues={initialFormValues} />
        </div>
      )}

      {/* Bus Schedules Results Grid */}
      <BusGrid
        schedules={filteredSchedules}
        title={
          parsedQuery.origin || parsedQuery.destination
            ? `Buses from ${parsedQuery.origin || 'Any'} to ${parsedQuery.destination || 'Any'}`
            : 'Available Bus Schedules'
        }
        subtitle={`Showing ${filteredSchedules.length} verified routes matching your criteria`}
      />
    </div>
  );
}
