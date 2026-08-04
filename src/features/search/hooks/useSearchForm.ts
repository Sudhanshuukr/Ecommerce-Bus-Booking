'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  SearchQuery,
  SearchFormErrors,
  SearchUIState,
  TripType,
  PassengerCounts,
  MIN_ADULTS,
  MAX_PASSENGERS,
} from '../types/search-form';
import { LocationObject } from '../types/location';
import { findLocationByQuery, LOCATION_DATASET } from '../constants/locations';
import { validateSearchQuery, getTodayDateString } from '../utils/validation';

export interface UseSearchFormOptions {
  initialQuery?: Partial<SearchQuery>;
  syncWithUrl?: boolean;
  onSearchSubmit?: (query: SearchQuery) => void;
}

/**
 * Parses URL search parameters into a structured SearchQuery domain model.
 */
export function parseSearchQueryFromUrl(searchParams: URLSearchParams): SearchQuery {
  const todayStr = getTodayDateString();

  const originParam = searchParams.get('origin') || searchParams.get('from') || '';
  const destParam = searchParams.get('destination') || searchParams.get('to') || '';
  const departureDate = searchParams.get('departureDate') || todayStr;
  const returnDate = searchParams.get('returnDate') || '';
  const rawTripType = searchParams.get('tripType');

  const tripType: TripType =
    rawTripType === 'ROUND_TRIP' || rawTripType === 'round-trip' ? 'ROUND_TRIP' : 'ONE_WAY';

  const adults = Math.max(MIN_ADULTS, parseInt(searchParams.get('adults') || '1', 10));
  const children = Math.max(0, parseInt(searchParams.get('children') || '0', 10));

  const origin = findLocationByQuery(originParam) || (originParam ? {
    id: `custom-${originParam.toLowerCase()}`,
    name: `${originParam} Station`,
    city: originParam,
    state: '',
    code: originParam.slice(0, 3).toUpperCase(),
  } : null);

  const destination = findLocationByQuery(destParam) || (destParam ? {
    id: `custom-${destParam.toLowerCase()}`,
    name: `${destParam} Station`,
    city: destParam,
    state: '',
    code: destParam.slice(0, 3).toUpperCase(),
  } : null);

  return {
    origin,
    destination,
    departureDate,
    returnDate,
    tripType,
    passengers: { adults, children },
  };
}

/**
 * Converts a SearchQuery domain model into URLSearchParams.
 */
export function buildSearchParamsFromQuery(query: SearchQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.origin) {
    params.set('origin', query.origin.code || query.origin.city);
  }
  if (query.destination) {
    params.set('destination', query.destination.code || query.destination.city);
  }
  if (query.departureDate) {
    params.set('departureDate', query.departureDate);
  }
  if (query.tripType === 'ROUND_TRIP' && query.returnDate) {
    params.set('returnDate', query.returnDate);
  }
  params.set('adults', String(query.passengers.adults || 1));
  if ((query.passengers.children || 0) > 0) {
    params.set('children', String(query.passengers.children));
  }
  params.set('tripType', query.tripType);

  return params;
}

export function useSearchForm(options: UseSearchFormOptions = {}) {
  const { initialQuery, syncWithUrl = true, onSearchSubmit } = options;
  const router = useRouter();
  const searchParams = useSearchParams();

  const todayStr = React.useMemo(() => getTodayDateString(), []);

  // 1. Initial State Resolution
  const defaultQuery = React.useMemo<SearchQuery>(() => {
    if (syncWithUrl && searchParams.toString()) {
      const parsed = parseSearchQueryFromUrl(searchParams);
      return {
        ...parsed,
        ...initialQuery,
      };
    }

    return {
      origin: initialQuery?.origin || LOCATION_DATASET[0], // NYC default
      destination: initialQuery?.destination || LOCATION_DATASET[1], // BOS default
      departureDate: initialQuery?.departureDate || todayStr,
      returnDate: initialQuery?.returnDate || '',
      tripType: initialQuery?.tripType || 'ONE_WAY',
      passengers: initialQuery?.passengers || { adults: 1, children: 0 },
    };
  }, [searchParams, syncWithUrl, initialQuery, todayStr]);

  const [query, setQuery] = React.useState<SearchQuery>(defaultQuery);
  const [errors, setErrors] = React.useState<SearchFormErrors>({});
  const [uiState, setUiState] = React.useState<SearchUIState>({
    isPassengerSelectorOpen: false,
    isSubmitting: false,
    isSwapping: false,
  });

  // Keep state synchronized if URL search parameters change externally
  React.useEffect(() => {
    if (syncWithUrl && searchParams.toString()) {
      const parsed = parseSearchQueryFromUrl(searchParams);
      setQuery((prev) => {
        // Prevent state overwrite if values are identical
        if (
          prev.origin?.id === parsed.origin?.id &&
          prev.destination?.id === parsed.destination?.id &&
          prev.departureDate === parsed.departureDate &&
          prev.returnDate === parsed.returnDate &&
          prev.tripType === parsed.tripType &&
          prev.passengers.adults === parsed.passengers.adults &&
          prev.passengers.children === parsed.passengers.children
        ) {
          return prev;
        }
        return parsed;
      });
    }
  }, [searchParams, syncWithUrl]);

  // Setters & Handlers
  const setTripType = React.useCallback((tripType: TripType) => {
    setQuery((prev) => {
      const nextReturnDate = tripType === 'ONE_WAY' ? '' : prev.returnDate || prev.departureDate;
      return {
        ...prev,
        tripType,
        returnDate: nextReturnDate,
      };
    });
    setErrors((prev) => ({ ...prev, returnDate: undefined }));
  }, []);

  const setOrigin = React.useCallback((origin: LocationObject | null) => {
    setQuery((prev) => ({ ...prev, origin }));
    setErrors((prev) => ({ ...prev, origin: undefined, destination: undefined, general: undefined }));
  }, []);

  const setDestination = React.useCallback((destination: LocationObject | null) => {
    setQuery((prev) => ({ ...prev, destination }));
    setErrors((prev) => ({ ...prev, destination: undefined, origin: undefined, general: undefined }));
  }, []);

  const setDepartureDate = React.useCallback((departureDate: string) => {
    setQuery((prev) => {
      let nextReturnDate = prev.returnDate;
      if (prev.tripType === 'ROUND_TRIP' && prev.returnDate && prev.returnDate < departureDate) {
        nextReturnDate = departureDate;
      }
      return {
        ...prev,
        departureDate,
        returnDate: nextReturnDate,
      };
    });
    setErrors((prev) => ({ ...prev, departureDate: undefined, returnDate: undefined }));
  }, []);

  const setReturnDate = React.useCallback((returnDate: string) => {
    setQuery((prev) => ({ ...prev, returnDate }));
    setErrors((prev) => ({ ...prev, returnDate: undefined }));
  }, []);

  const updatePassengerCount = React.useCallback(
    (type: keyof PassengerCounts, delta: number) => {
      setQuery((prev) => {
        const currentCount = prev.passengers[type] || 0;
        const newCount = Math.max(0, currentCount + delta);

        if (type === 'adults' && newCount < MIN_ADULTS) {
          return prev;
        }

        const currentAdults = type === 'adults' ? newCount : (prev.passengers.adults || 0);
        const currentChildren = type === 'children' ? newCount : (prev.passengers.children || 0);
        const currentInfants = type === 'infants' ? newCount : (prev.passengers.infants || 0);
        const totalPassengers = currentAdults + currentChildren + currentInfants;

        if (totalPassengers > MAX_PASSENGERS) {
          return prev;
        }

        return {
          ...prev,
          passengers: {
            ...prev.passengers,
            [type]: newCount,
          },
        };
      });
      setErrors((prev) => ({ ...prev, passengers: undefined }));
    },
    []
  );

  const handleSwapLocations = React.useCallback(() => {
    setUiState((prev) => ({ ...prev, isSwapping: true }));
    setQuery((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
    setErrors((prev) => ({ ...prev, origin: undefined, destination: undefined }));

    setTimeout(() => {
      setUiState((prev) => ({ ...prev, isSwapping: false }));
    }, 300);
  }, []);

  const togglePassengerSelector = React.useCallback((isOpen?: boolean) => {
    setUiState((prev) => ({
      ...prev,
      isPassengerSelectorOpen: isOpen !== undefined ? isOpen : !prev.isPassengerSelectorOpen,
    }));
  }, []);

  const handleSubmit = React.useCallback(
    (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const { isValid, errors: validationErrors } = validateSearchQuery(query);

      if (!isValid) {
        setErrors(validationErrors);
        return false;
      }

      setErrors({});
      setUiState((prev) => ({ ...prev, isSubmitting: true }));

      if (onSearchSubmit) {
        onSearchSubmit(query);
      } else {
        const urlParams = buildSearchParamsFromQuery(query);
        router.push(`/search?${urlParams.toString()}`);
      }

      setTimeout(() => {
        setUiState((prev) => ({ ...prev, isSubmitting: false }));
      }, 400);

      return true;
    },
    [query, onSearchSubmit, router]
  );

  return {
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
  };
}
