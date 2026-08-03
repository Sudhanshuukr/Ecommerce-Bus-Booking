export type TripType = 'one-way' | 'round-trip';

export interface PassengerCounts {
  adults: number;
  children: number;
}

export interface SearchFormState {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: PassengerCounts;
}

export interface SearchFormErrors {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: string;
  general?: string;
}

export interface SearchUIState {
  isPassengerSelectorOpen: boolean;
  isSubmitting: boolean;
  isSwapping: boolean;
}

export const MIN_ADULTS = 1;
export const MAX_PASSENGERS = 8;
