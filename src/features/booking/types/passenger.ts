import { BusSchedule } from '@/features/bus/types/bus';
import { Seat, BoardingDroppingPoint, FareBreakdown } from './seat';

export type Gender = 'male' | 'female' | 'other';

export interface Passenger {
  seatId: string;
  seatLabel: string;
  fullName: string;
  age: string;
  gender: Gender | '';
  mobile: string;
  email: string;
}

export interface PassengerFormErrors {
  fullName?: string;
  age?: string;
  gender?: string;
  mobile?: string;
  email?: string;
}

export type BookingStep = 'seats' | 'passengers' | 'review' | 'confirmation';

export interface BookingConfirmationData {
  bookingId: string;
  bookingDate: string;
  schedule: BusSchedule;
  boardingPoint: BoardingDroppingPoint;
  droppingPoint: BoardingDroppingPoint;
  selectedSeats: Seat[];
  passengers: Passenger[];
  fareBreakdown: FareBreakdown;
}
