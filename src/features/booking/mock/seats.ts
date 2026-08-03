import { Seat, BoardingDroppingPoint } from '../types/seat';

export const MOCK_BOARDING_POINTS: BoardingDroppingPoint[] = [
  {
    id: 'bp-1',
    name: 'Port Authority Bus Terminal',
    time: '07:30 AM',
    address: '625 8th Ave, New York, NY 10018',
  },
  {
    id: 'bp-2',
    name: 'GW Bridge Bus Station',
    time: '07:55 AM',
    address: '4211 Broadway, New York, NY 10033',
  },
];

export const MOCK_DROPPING_POINTS: BoardingDroppingPoint[] = [
  {
    id: 'dp-1',
    name: 'South Station Terminal',
    time: '11:30 AM',
    address: '700 Atlantic Ave, Boston, MA 02110',
  },
  {
    id: 'dp-2',
    name: 'Logan International Airport',
    time: '11:45 AM',
    address: 'Terminal B Bus Stop, Boston, MA 02128',
  },
];

export const MOCK_SEATS: Seat[] = [
  // Lower Deck - Row 1
  { id: 'L-1A', label: '1A', deck: 'lower', row: 1, column: 1, type: 'seater', status: 'available', price: 38 },
  { id: 'L-1B', label: '1B', deck: 'lower', row: 1, column: 2, type: 'seater', status: 'occupied', price: 38 },
  { id: 'L-1C', label: '1C', deck: 'lower', row: 1, column: 4, type: 'seater', status: 'available', price: 38 },
  { id: 'L-1D', label: '1D', deck: 'lower', row: 1, column: 5, type: 'seater', status: 'available', price: 38 },

  // Lower Deck - Row 2
  { id: 'L-2A', label: '2A', deck: 'lower', row: 2, column: 1, type: 'seater', status: 'available', price: 38 },
  { id: 'L-2B', label: '2B', deck: 'lower', row: 2, column: 2, type: 'seater', status: 'available', price: 38 },
  { id: 'L-2C', label: '2C', deck: 'lower', row: 2, column: 4, type: 'seater', status: 'occupied', price: 38 },
  { id: 'L-2D', label: '2D', deck: 'lower', row: 2, column: 5, type: 'seater', status: 'occupied', price: 38 },

  // Lower Deck - Row 3
  { id: 'L-3A', label: '3A', deck: 'lower', row: 3, column: 1, type: 'seater', status: 'reserved', price: 38 },
  { id: 'L-3B', label: '3B', deck: 'lower', row: 3, column: 2, type: 'seater', status: 'reserved', price: 38 },
  { id: 'L-3C', label: '3C', deck: 'lower', row: 3, column: 4, type: 'seater', status: 'available', price: 38 },
  { id: 'L-3D', label: '3D', deck: 'lower', row: 3, column: 5, type: 'seater', status: 'available', price: 38 },

  // Lower Deck - Row 4
  { id: 'L-4A', label: '4A', deck: 'lower', row: 4, column: 1, type: 'seater', status: 'available', price: 38 },
  { id: 'L-4B', label: '4B', deck: 'lower', row: 4, column: 2, type: 'seater', status: 'available', price: 38 },
  { id: 'L-4C', label: '4C', deck: 'lower', row: 4, column: 4, type: 'seater', status: 'available', price: 38 },
  { id: 'L-4D', label: '4D', deck: 'lower', row: 4, column: 5, type: 'seater', status: 'available', price: 38 },

  // Upper Deck - Sleeper Berths - Row 1
  { id: 'U-1A', label: 'U1', deck: 'upper', row: 1, column: 1, type: 'sleeper', status: 'available', price: 48 },
  { id: 'U-1B', label: 'U2', deck: 'upper', row: 1, column: 2, type: 'sleeper', status: 'occupied', price: 48 },
  { id: 'U-1C', label: 'U3', deck: 'upper', row: 1, column: 4, type: 'sleeper', status: 'available', price: 48 },
  { id: 'U-1D', label: 'U4', deck: 'upper', row: 1, column: 5, type: 'sleeper', status: 'available', price: 48 },

  // Upper Deck - Sleeper Berths - Row 2
  { id: 'U-2A', label: 'U5', deck: 'upper', row: 2, column: 1, type: 'sleeper', status: 'available', price: 48 },
  { id: 'U-2B', label: 'U6', deck: 'upper', row: 2, column: 2, type: 'sleeper', status: 'available', price: 48 },
  { id: 'U-2C', label: 'U7', deck: 'upper', row: 2, column: 4, type: 'sleeper', status: 'occupied', price: 48 },
  { id: 'U-2D', label: 'U8', deck: 'upper', row: 2, column: 5, type: 'sleeper', status: 'available', price: 48 },

  // Upper Deck - Sleeper Berths - Row 3
  { id: 'U-3A', label: 'U9', deck: 'upper', row: 3, column: 1, type: 'sleeper', status: 'available', price: 48 },
  { id: 'U-3B', label: 'U10', deck: 'upper', row: 3, column: 2, type: 'sleeper', status: 'available', price: 48 },
  { id: 'U-3C', label: 'U11', deck: 'upper', row: 3, column: 4, type: 'sleeper', status: 'available', price: 48 },
  { id: 'U-3D', label: 'U12', deck: 'upper', row: 3, column: 5, type: 'sleeper', status: 'available', price: 48 },
];
