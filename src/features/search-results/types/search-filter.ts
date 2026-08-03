export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'time-asc'
  | 'time-desc'
  | 'duration-asc'
  | 'rating-desc';

export type TimeWindow = 'early-morning' | 'morning' | 'afternoon' | 'night';

export interface FilterState {
  priceMax: number;
  busTypes: string[];
  amenities: string[];
  timeWindows: TimeWindow[];
  sortBy: SortOption;
}

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'time-asc', label: 'Departure: Earliest First' },
  { value: 'time-desc', label: 'Departure: Latest First' },
  { value: 'duration-asc', label: 'Duration: Shortest First' },
  { value: 'rating-desc', label: 'Rating: Highest Rated' },
];

export interface TimeWindowConfig {
  id: TimeWindow;
  label: string;
  sublabel: string;
}

export const TIME_WINDOWS: TimeWindowConfig[] = [
  { id: 'early-morning', label: 'Early Morning', sublabel: 'Before 6 AM' },
  { id: 'morning', label: 'Morning', sublabel: '6 AM - 12 PM' },
  { id: 'afternoon', label: 'Afternoon', sublabel: '12 PM - 6 PM' },
  { id: 'night', label: 'Night', sublabel: 'After 6 PM' },
];
