import { Seat, BoardingDroppingPoint } from '../types/seat';

export const MOCK_BOARDING_POINTS: BoardingDroppingPoint[] = [
  {
    id: 'bp-1',
    name: 'Kashmere Gate ISBT',
    time: '10:30 PM',
    address: 'Kashmere Gate, Delhi 110006',
  },
  {
    id: 'bp-2',
    name: 'Anand Vihar ISBT',
    time: '11:00 PM',
    address: 'Anand Vihar, Delhi 110092',
  },
];

export const MOCK_DROPPING_POINTS: BoardingDroppingPoint[] = [
  {
    id: 'dp-1',
    name: 'Alambagh Bus Stand',
    time: '06:15 AM',
    address: 'Alambagh, Lucknow, UP 226005',
  },
  {
    id: 'dp-2',
    name: 'Charbagh Bus Station',
    time: '06:30 AM',
    address: 'Charbagh, Lucknow, UP 226001',
  },
];

// Standard 40-Seat Lower Deck (Seater) + 12-Seat Upper Deck (Sleeper) Layout
export const MOCK_SEATS: Seat[] = [
  // LOWER DECK (Rows 1 to 10 - Seater Seats)
  // Row 1
  { id: 'L-1A', label: '1A', deck: 'lower', row: 1, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-1B', label: '1B', deck: 'lower', row: 1, column: 2, type: 'seater', status: 'occupied', price: 899 },
  { id: 'L-1C', label: '1C', deck: 'lower', row: 1, column: 4, type: 'seater', status: 'available', price: 899 },
  { id: 'L-1D', label: '1D', deck: 'lower', row: 1, column: 5, type: 'seater', status: 'available', price: 899 },

  // Row 2
  { id: 'L-2A', label: '2A', deck: 'lower', row: 2, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-2B', label: '2B', deck: 'lower', row: 2, column: 2, type: 'seater', status: 'available', price: 899 },
  { id: 'L-2C', label: '2C', deck: 'lower', row: 2, column: 4, type: 'seater', status: 'occupied', price: 899 },
  { id: 'L-2D', label: '2D', deck: 'lower', row: 2, column: 5, type: 'seater', status: 'occupied', price: 899 },

  // Row 3
  { id: 'L-3A', label: '3A', deck: 'lower', row: 3, column: 1, type: 'seater', status: 'reserved', price: 899 },
  { id: 'L-3B', label: '3B', deck: 'lower', row: 3, column: 2, type: 'seater', status: 'reserved', price: 899 },
  { id: 'L-3C', label: '3C', deck: 'lower', row: 3, column: 4, type: 'seater', status: 'available', price: 899 },
  { id: 'L-3D', label: '3D', deck: 'lower', row: 3, column: 5, type: 'seater', status: 'available', price: 899 },

  // Row 4
  { id: 'L-4A', label: '4A', deck: 'lower', row: 4, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-4B', label: '4B', deck: 'lower', row: 4, column: 2, type: 'seater', status: 'available', price: 899 },
  { id: 'L-4C', label: '4C', deck: 'lower', row: 4, column: 4, type: 'seater', status: 'available', price: 899 },
  { id: 'L-4D', label: '4D', deck: 'lower', row: 4, column: 5, type: 'seater', status: 'available', price: 899 },

  // Row 5
  { id: 'L-5A', label: '5A', deck: 'lower', row: 5, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-5B', label: '5B', deck: 'lower', row: 5, column: 2, type: 'seater', status: 'available', price: 899 },
  { id: 'L-5C', label: '5C', deck: 'lower', row: 5, column: 4, type: 'seater', status: 'available', price: 899 },
  { id: 'L-5D', label: '5D', deck: 'lower', row: 5, column: 5, type: 'seater', status: 'available', price: 899 },

  // Row 6
  { id: 'L-6A', label: '6A', deck: 'lower', row: 6, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-6B', label: '6B', deck: 'lower', row: 6, column: 2, type: 'seater', status: 'available', price: 899 },
  { id: 'L-6C', label: '6C', deck: 'lower', row: 6, column: 4, type: 'seater', status: 'occupied', price: 899 },
  { id: 'L-6D', label: '6D', deck: 'lower', row: 6, column: 5, type: 'seater', status: 'available', price: 899 },

  // Row 7
  { id: 'L-7A', label: '7A', deck: 'lower', row: 7, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-7B', label: '7B', deck: 'lower', row: 7, column: 2, type: 'seater', status: 'available', price: 899 },
  { id: 'L-7C', label: '7C', deck: 'lower', row: 7, column: 4, type: 'seater', status: 'available', price: 899 },
  { id: 'L-7D', label: '7D', deck: 'lower', row: 7, column: 5, type: 'seater', status: 'available', price: 899 },

  // Row 8
  { id: 'L-8A', label: '8A', deck: 'lower', row: 8, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-8B', label: '8B', deck: 'lower', row: 8, column: 2, type: 'seater', status: 'available', price: 899 },
  { id: 'L-8C', label: '8C', deck: 'lower', row: 8, column: 4, type: 'seater', status: 'available', price: 899 },
  { id: 'L-8D', label: '8D', deck: 'lower', row: 8, column: 5, type: 'seater', status: 'available', price: 899 },

  // Row 9
  { id: 'L-9A', label: '9A', deck: 'lower', row: 9, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-9B', label: '9B', deck: 'lower', row: 9, column: 2, type: 'seater', status: 'available', price: 899 },
  { id: 'L-9C', label: '9C', deck: 'lower', row: 9, column: 4, type: 'seater', status: 'available', price: 899 },
  { id: 'L-9D', label: '9D', deck: 'lower', row: 9, column: 5, type: 'seater', status: 'available', price: 899 },

  // Row 10
  { id: 'L-10A', label: '10A', deck: 'lower', row: 10, column: 1, type: 'seater', status: 'available', price: 899 },
  { id: 'L-10B', label: '10B', deck: 'lower', row: 10, column: 2, type: 'seater', status: 'available', price: 899 },
  { id: 'L-10C', label: '10C', deck: 'lower', row: 10, column: 4, type: 'seater', status: 'available', price: 899 },
  { id: 'L-10D', label: '10D', deck: 'lower', row: 10, column: 5, type: 'seater', status: 'available', price: 899 },

  // UPPER DECK (Rows 1 to 3 - Sleeper Berths)
  // Row 1
  { id: 'U-1A', label: 'U1', deck: 'upper', row: 1, column: 1, type: 'sleeper', status: 'available', price: 1199 },
  { id: 'U-1B', label: 'U2', deck: 'upper', row: 1, column: 2, type: 'sleeper', status: 'available', price: 1199 },
  { id: 'U-1C', label: 'U3', deck: 'upper', row: 1, column: 4, type: 'sleeper', status: 'available', price: 1199 },
  { id: 'U-1D', label: 'U4', deck: 'upper', row: 1, column: 5, type: 'sleeper', status: 'available', price: 1199 },

  // Row 2
  { id: 'U-2A', label: 'U5', deck: 'upper', row: 2, column: 1, type: 'sleeper', status: 'available', price: 1199 },
  { id: 'U-2B', label: 'U6', deck: 'upper', row: 2, column: 2, type: 'sleeper', status: 'available', price: 1199 },
  { id: 'U-2C', label: 'U7', deck: 'upper', row: 2, column: 4, type: 'sleeper', status: 'occupied', price: 1199 },
  { id: 'U-2D', label: 'U8', deck: 'upper', row: 2, column: 5, type: 'sleeper', status: 'available', price: 1199 },

  // Row 3
  { id: 'U-3A', label: 'U9', deck: 'upper', row: 3, column: 1, type: 'sleeper', status: 'available', price: 1199 },
  { id: 'U-3B', label: 'U10', deck: 'upper', row: 3, column: 2, type: 'sleeper', status: 'available', price: 1199 },
  { id: 'U-3C', label: 'U11', deck: 'upper', row: 3, column: 4, type: 'sleeper', status: 'available', price: 1199 },
  { id: 'U-3D', label: 'U12', deck: 'upper', row: 3, column: 5, type: 'sleeper', status: 'available', price: 1199 },
];

export function generateSeatsForSchedule(basePrice: number): Seat[] {
  return MOCK_SEATS.map((seat) => ({
    ...seat,
    price: seat.type === 'sleeper' ? basePrice + 300 : basePrice,
  }));
}
