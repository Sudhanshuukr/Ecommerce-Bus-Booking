import { LocationObject } from './location';

export type TripType = 'ONE_WAY' | 'ROUND_TRIP';

export interface PassengerCounts {
  adults: number;
  children: number;
  infants?: number;
  [key: string]: number | undefined;
}

export interface SearchQuery {
  origin: LocationObject | null;
  destination: LocationObject | null;
  departureDate: string;
  returnDate: string;
  tripType: TripType;
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
