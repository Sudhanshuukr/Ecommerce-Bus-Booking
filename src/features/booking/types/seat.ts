export type SeatStatus = 'available' | 'selected' | 'occupied' | 'reserved';
export type SeatType = 'seater' | 'sleeper';
export type DeckType = 'lower' | 'upper';

export interface Seat {
  id: string;
  label: string;
  deck: DeckType;
  row: number;
  column: number; // 1, 2 = left side; 3 = aisle; 4, 5 = right side
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export interface BoardingDroppingPoint {
  id: string;
  name: string;
  time: string;
  address: string;
}

export interface FareBreakdown {
  seatCount: number;
  seatPriceTotal: number;
  serviceFee: number;
  tax: number;
  grandTotal: number;
}

export const MAX_SEAT_SELECTION_LIMIT = 6;
