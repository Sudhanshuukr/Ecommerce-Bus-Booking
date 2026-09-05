'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { LocationInput } from './LocationInput';
import { SwapButton } from './SwapButton';
import { DatePicker } from './DatePicker';
import { PassengerSelector } from './PassengerSelector';
import { SearchButton } from './SearchButton';
import { useSearchForm, UseSearchFormOptions } from '../hooks/useSearchForm';
import { TripType } from '../types/search-form';

export interface SearchPanelProps extends UseSearchFormOptions {
  className?: string;
}

export function SearchPanel({ initialQuery, syncWithUrl = true, onSearchSubmit, className }: SearchPanelProps) {
  const {
    query,
    errors,
    uiState,
    todayStr,
    setTripType,
    setOrigin,
    setDestination,
    setDepartureDate,
    setReturnDate,
    updatePassengerCount,
    handleSwapLocations,
    togglePassengerSelector,
    handleSubmit,
  } = useSearchForm({ initialQuery, syncWithUrl, onSearchSubmit });

  return (
    <Card
      className={cn(
        'relative z-20 w-full rounded-2xl border border-border/80 bg-white p-4 sm:p-5 md:p-6 lg:p-6 shadow-modal transition-all duration-normal',
        className
      )}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4 md:space-y-5">
        {/* Top Header: Trip Type Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 sm:pb-3.5">
          <div
            role="tablist"
            aria-label="Trip Type Selection"
            className="inline-flex items-center rounded-xl bg-slate-100/80 p-0.5 sm:p-1 text-slate-600"
          >
            {([
              { value: 'ONE_WAY', label: 'One Way' },
              { value: 'ROUND_TRIP', label: 'Round Trip' },
            ] as { value: TripType; label: string }[]).map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={query.tripType === tab.value}
                onClick={() => setTripType(tab.value)}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 sm:px-4 sm:py-1.5 text-xs font-semibold tracking-wide transition-all duration-normal',
                  query.tripType === tab.value
                    ? 'bg-white text-primary shadow-subtle'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] sm:text-xs font-medium text-muted-foreground hidden sm:block">
            Direct &amp; Connecting Bus Schedules
          </div>
        </div>

        {/* General Form Error Banner */}
        {errors.general && (
          <div
            role="alert"
            className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 sm:p-3 text-xs font-medium text-destructive"
          >
            {errors.general}
          </div>
        )}

        {/* Main Search Controls Grid / Row Layout */}
        <div className="flex flex-col space-y-3 sm:space-y-3.5 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:flex lg:flex-row lg:items-end lg:gap-3 xl:gap-3.5">
          {/* Location Group (Origin + Swap + Destination) */}
          <div className="relative flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:gap-1.5 md:col-span-2 lg:flex-[1.8] xl:flex-[2] lg:min-w-0 lg:gap-2">
            <div className="flex-1 min-w-0">
              <LocationInput
                id="search-origin"
                label="From"
                type="origin"
                value={query.origin}
                onChange={setOrigin}
                placeholder="Departure city"
                error={errors.origin}
              />
            </div>

            {/* Dedicated Swap Button */}
            <div className="flex items-center justify-center self-center py-0.5 sm:py-0 sm:pt-4 shrink-0">
              <SwapButton onClick={handleSwapLocations} isSwapping={uiState.isSwapping} />
            </div>

            <div className="flex-1 min-w-0">
              <LocationInput
                id="search-destination"
                label="To"
                type="destination"
                value={query.destination}
                onChange={setDestination}
                placeholder="Arrival city"
                error={errors.destination}
              />
            </div>
          </div>

          {/* Date Picker Group (Departure & Return side-by-side) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:col-span-1 lg:flex-[1.3] xl:flex-[1.4] lg:min-w-0 lg:gap-2.5 xl:gap-3">
            <div className="min-w-0">
              <DatePicker
                id="search-departure-date"
                label="Departure"
                value={query.departureDate}
                minDate={todayStr}
                onChange={setDepartureDate}
                showQuickPresets
                error={errors.departureDate}
              />
            </div>

            <div className="min-w-0">
              <DatePicker
                id="search-return-date"
                label="Return"
                value={query.returnDate}
                minDate={query.departureDate || todayStr}
                disabled={query.tripType === 'ONE_WAY'}
                onChange={setReturnDate}
                error={errors.returnDate}
              />
            </div>
          </div>

          {/* Passengers & CTA Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:col-span-1 lg:flex lg:flex-row lg:w-auto lg:gap-2.5 xl:gap-3">
            <div className="w-full lg:w-40 xl:w-48 shrink-0">
              <PassengerSelector
                passengers={query.passengers}
                onUpdateCount={updatePassengerCount}
                isOpen={uiState.isPassengerSelectorOpen}
                onToggleOpen={togglePassengerSelector}
                error={errors.passengers}
              />
            </div>

            <div className="sm:self-end w-full lg:w-36 xl:w-40 shrink-0">
              <SearchButton isSubmitting={uiState.isSubmitting} />
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
