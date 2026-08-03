import { TripType } from '@/features/search';

export interface SearchQueryParams {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  tripType?: TripType;
}

export interface ParsedSearchQuery {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  tripType: TripType;
  totalPassengers: number;
}
