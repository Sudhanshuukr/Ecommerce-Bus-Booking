import {
  SearchQuery,
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
 * Validates the complete SearchQuery domain model against business rules.
 */
export function validateSearchQuery(query: SearchQuery): {
  isValid: boolean;
  errors: SearchFormErrors;
} {
  const errors: SearchFormErrors = {};

  // 1. Origin check
  if (!query.origin) {
    errors.origin = 'Please select a departure city';
  }

  // 2. Destination check
  if (!query.destination) {
    errors.destination = 'Please select an arrival city';
  }

  // 3. Origin & Destination must differ
  if (query.origin && query.destination) {
    if (
      query.origin.id === query.destination.id ||
      query.origin.code.toLowerCase() === query.destination.code.toLowerCase()
    ) {
      errors.destination = 'Origin and destination cities must be different';
    }
  }

  // 4. Departure Date checks
  const todayStr = getTodayDateString();
  if (!query.departureDate) {
    errors.departureDate = 'Please select a departure date';
  } else if (query.departureDate < todayStr) {
    errors.departureDate = 'Departure date cannot be in the past';
  }

  // 5. Return Date checks (for ROUND_TRIP)
  if (query.tripType === 'ROUND_TRIP') {
    if (!query.returnDate) {
      errors.returnDate = 'Please select a return date';
    } else if (query.returnDate < query.departureDate) {
      errors.returnDate = 'Return date cannot be earlier than departure date';
    }
  }

  // 6. Passenger checks
  const adults = query.passengers.adults || 0;
  const children = query.passengers.children || 0;
  const infants = query.passengers.infants || 0;
  const totalPassengers = adults + children + infants;

  if (adults < MIN_ADULTS) {
    errors.passengers = `At least ${MIN_ADULTS} adult passenger is required`;
  } else if (totalPassengers > MAX_PASSENGERS) {
    errors.passengers = `Maximum passenger limit is ${MAX_PASSENGERS}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
