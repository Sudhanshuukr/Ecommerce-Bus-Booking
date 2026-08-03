import {
  SearchFormState,
  SearchFormErrors,
  MIN_ADULTS,
  MAX_PASSENGERS,
} from '../types/search-form';

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validates the search form state against business rules.
 */
export function validateSearchForm(values: SearchFormState): {
  isValid: boolean;
  errors: SearchFormErrors;
} {
  const errors: SearchFormErrors = {};

  const trimmedOrigin = values.origin.trim();
  const trimmedDestination = values.destination.trim();

  // 1. Origin check
  if (!trimmedOrigin) {
    errors.origin = 'Please enter a departure city';
  }

  // 2. Destination check
  if (!trimmedDestination) {
    errors.destination = 'Please enter an arrival city';
  }

  // 3. Origin & Destination must differ
  if (
    trimmedOrigin &&
    trimmedDestination &&
    trimmedOrigin.toLowerCase() === trimmedDestination.toLowerCase()
  ) {
    errors.destination = 'Origin and destination cities must be different';
  }

  // 4. Departure Date checks
  const todayStr = getTodayDateString();
  if (!values.departureDate) {
    errors.departureDate = 'Please select a departure date';
  } else if (values.departureDate < todayStr) {
    errors.departureDate = 'Departure date cannot be in the past';
  }

  // 5. Return Date checks (for round-trip)
  if (values.tripType === 'round-trip') {
    if (!values.returnDate) {
      errors.returnDate = 'Please select a return date';
    } else if (values.returnDate < values.departureDate) {
      errors.returnDate = 'Return date cannot be earlier than departure date';
    }
  }

  // 6. Passenger checks
  const totalPassengers = values.passengers.adults + values.passengers.children;

  if (values.passengers.adults < MIN_ADULTS) {
    errors.passengers = `At least ${MIN_ADULTS} adult passenger is required`;
  } else if (totalPassengers > MAX_PASSENGERS) {
    errors.passengers = `Maximum passenger limit is ${MAX_PASSENGERS}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
