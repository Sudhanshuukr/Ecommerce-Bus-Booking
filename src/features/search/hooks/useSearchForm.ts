'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchFormState,
  SearchFormErrors,
  SearchUIState,
  TripType,
  PassengerCounts,
  MIN_ADULTS,
  MAX_PASSENGERS,
} from '../types/search-form';
import { validateSearchForm, getTodayDateString } from '../utils/validation';

export interface UseSearchFormOptions {
  initialValues?: Partial<SearchFormState>;
  onSearchSubmit?: (values: SearchFormState) => void;
}

export function useSearchForm(options: UseSearchFormOptions = {}) {
  const { initialValues, onSearchSubmit } = options;
  const router = useRouter();

  const todayStr = React.useMemo(() => getTodayDateString(), []);

  // 1. Domain Form State
  const [formState, setFormState] = React.useState<SearchFormState>({
    tripType: initialValues?.tripType || 'one-way',
    origin: initialValues?.origin || '',
    destination: initialValues?.destination || '',
    departureDate: initialValues?.departureDate || todayStr,
    returnDate: initialValues?.returnDate || '',
    passengers: initialValues?.passengers || { adults: 1, children: 0 },
  });

  // 2. Validation Errors State
  const [errors, setErrors] = React.useState<SearchFormErrors>({});

  // 3. UI State
  const [uiState, setUiState] = React.useState<SearchUIState>({
    isPassengerSelectorOpen: false,
    isSubmitting: false,
    isSwapping: false,
  });

  // Handlers for Form State
  const setTripType = React.useCallback((tripType: TripType) => {
    setFormState((prev) => {
      // Clear return date if switching to one-way
      const nextReturnDate = tripType === 'one-way' ? '' : prev.returnDate || prev.departureDate;
      return {
        ...prev,
        tripType,
        returnDate: nextReturnDate,
      };
    });
    setErrors((prev) => ({ ...prev, returnDate: undefined }));
  }, []);

  const setOrigin = React.useCallback((origin: string) => {
    setFormState((prev) => ({ ...prev, origin }));
    setErrors((prev) => ({ ...prev, origin: undefined, destination: undefined, general: undefined }));
  }, []);

  const setDestination = React.useCallback((destination: string) => {
    setFormState((prev) => ({ ...prev, destination }));
    setErrors((prev) => ({ ...prev, destination: undefined, origin: undefined, general: undefined }));
  }, []);

  const setDepartureDate = React.useCallback((departureDate: string) => {
    setFormState((prev) => {
      // Adjust return date if departure date is set past existing return date in round-trip
      let nextReturnDate = prev.returnDate;
      if (prev.tripType === 'round-trip' && prev.returnDate && prev.returnDate < departureDate) {
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
    setFormState((prev) => ({ ...prev, returnDate }));
    setErrors((prev) => ({ ...prev, returnDate: undefined }));
  }, []);

  const updatePassengerCount = React.useCallback(
    (type: keyof PassengerCounts, delta: number) => {
      setFormState((prev) => {
        const currentCount = prev.passengers[type];
        const newCount = Math.max(0, currentCount + delta);

        // Apply boundary validation
        if (type === 'adults' && newCount < MIN_ADULTS) {
          return prev;
        }

        const totalPassengers =
          type === 'adults'
            ? newCount + prev.passengers.children
            : prev.passengers.adults + newCount;

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

  // Dedicated Swap Handler with UI animation pulse
  const handleSwapLocations = React.useCallback(() => {
    setUiState((prev) => ({ ...prev, isSwapping: true }));
    setFormState((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
    setErrors((prev) => ({ ...prev, origin: undefined, destination: undefined }));

    setTimeout(() => {
      setUiState((prev) => ({ ...prev, isSwapping: false }));
    }, 300);
  }, []);

  // UI Popover Toggle
  const togglePassengerSelector = React.useCallback((isOpen?: boolean) => {
    setUiState((prev) => ({
      ...prev,
      isPassengerSelectorOpen: isOpen !== undefined ? isOpen : !prev.isPassengerSelectorOpen,
    }));
  }, []);

  // Submit Handler
  const handleSubmit = React.useCallback(
    (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const { isValid, errors: validationErrors } = validateSearchForm(formState);

      if (!isValid) {
        setErrors(validationErrors);
        return false;
      }

      setErrors({});
      setUiState((prev) => ({ ...prev, isSubmitting: true }));

      if (onSearchSubmit) {
        onSearchSubmit(formState);
      } else {
        const query = new URLSearchParams({
          origin: formState.origin.trim(),
          destination: formState.destination.trim(),
          departureDate: formState.departureDate,
          returnDate: formState.returnDate || '',
          adults: String(formState.passengers.adults),
          children: String(formState.passengers.children),
          tripType: formState.tripType,
        }).toString();

        router.push(`/search?${query}`);
      }

      // Simulate processing state transition
      setTimeout(() => {
        setUiState((prev) => ({ ...prev, isSubmitting: false }));
      }, 400);

      return true;
    },
    [formState, onSearchSubmit, router]
  );

  return {
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
  };
}
