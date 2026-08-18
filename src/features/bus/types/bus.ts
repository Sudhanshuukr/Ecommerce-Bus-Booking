import { BoardingDroppingPoint, Seat } from '@/features/booking/types/seat';

export interface BusOperator {
  id: string;
  name: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
}

export interface BusRoute {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

export interface BusSchedule {
  id: string;
  operator: BusOperator;
  busType: string;
  route: BusRoute;
  price: number;
  currency: string;
  availableSeats: number;
  totalSeats: number;
  amenities: string[];
  badge?: 'Fastest' | 'Cheapest' | 'Top Rated' | 'Popular';
  boardingPoints?: BoardingDroppingPoint[];
  droppingPoints?: BoardingDroppingPoint[];
  seats?: Seat[];
}
