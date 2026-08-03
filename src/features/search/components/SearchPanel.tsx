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

export function SearchPanel({ initialValues, onSearchSubmit, className }: SearchPanelProps) {
  const {
    formState,
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
  } = useSearchForm({ initialValues, onSearchSubmit });

  return (
    <Card
      className={cn(
        'w-full rounded-2xl border border-border/80 bg-white p-5 shadow-modal md:p-6 lg:p-7 transition-all duration-normal',
        className
      )}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Top Header: Trip Type Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div
            role="tablist"
            aria-label="Trip Type Selection"
            className="inline-flex items-center rounded-xl bg-slate-100/80 p-1 text-slate-600"
          >
            {(['one-way', 'round-trip'] as TripType[]).map((type) => (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={formState.tripType === type}
                onClick={() => setTripType(type)}
                className={cn(
                  'rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-normal capitalize',
                  formState.tripType === type
                    ? 'bg-white text-primary shadow-subtle'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="text-xs font-medium text-muted-foreground hidden sm:block">
            Direct & Connecting Routes Available
          </div>
        </div>

        {/* General Form Error Banner */}
        {errors.general && (
          <div
            role="alert"
            className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive"
          >
            {errors.general}
          </div>
        )}

        {/* Main Grid / Row Layout */}
        {/* Desktop Layout: lg:flex lg:items-end lg:gap-3 */}
        {/* Tablet Layout: md:grid md:grid-cols-2 md:gap-4 */}
        {/* Mobile Layout: flex flex-col space-y-4 */}
        <div className="flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:flex lg:flex-row lg:items-end lg:gap-3">
          {/* Location Group (Origin + Swap + Destination) */}
          <div className="relative flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 md:col-span-2 lg:flex-1 lg:space-x-2">
            <div className="flex-1">
              <LocationInput
                id="search-origin"
                label="From"
                type="origin"
                value={formState.origin}
                onChange={setOrigin}
                placeholder="e.g. New York, NY"
                error={errors.origin}
              />
            </div>

            {/* Dedicated Swap Button */}
            <div className="flex items-center justify-center self-center pt-5 sm:pt-4">
              <SwapButton onClick={handleSwapLocations} isSwapping={uiState.isSwapping} />
            </div>

            <div className="flex-1">
              <LocationInput
                id="search-destination"
                label="To"
                type="destination"
                value={formState.destination}
                onChange={setDestination}
                placeholder="e.g. Boston, MA"
                error={errors.destination}
              />
            </div>
          </div>

          {/* Date Picker Group (Departure & Return) */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 md:col-span-1 lg:flex-1 lg:space-x-2">
            <div className="flex-1">
              <DatePicker
                id="search-departure-date"
                label="Departure"
                value={formState.departureDate}
                minDate={todayStr}
                onChange={setDepartureDate}
                showQuickPresets
                error={errors.departureDate}
              />
            </div>

            <div className="flex-1">
              <DatePicker
                id="search-return-date"
                label="Return"
                value={formState.returnDate}
                minDate={formState.departureDate || todayStr}
                disabled={formState.tripType === 'one-way'}
                onChange={setReturnDate}
                error={errors.returnDate}
              />
            </div>
          </div>

          {/* Passengers Group */}
          <div className="md:col-span-1 lg:w-48">
            <PassengerSelector
              passengers={formState.passengers}
              onUpdateCount={updatePassengerCount}
              isOpen={uiState.isPassengerSelectorOpen}
              onToggleOpen={togglePassengerSelector}
              error={errors.passengers}
            />
          </div>

          {/* Action CTA Button */}
          <div className="pt-2 md:col-span-2 md:pt-0 lg:w-44">
            <SearchButton isSubmitting={uiState.isSubmitting} />
          </div>
        </div>
      </form>
    </Card>
  );
}
