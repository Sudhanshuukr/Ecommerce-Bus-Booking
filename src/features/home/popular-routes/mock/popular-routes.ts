import { PopularRoute } from '../types/popular-route';

export const MOCK_POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'route-1',
    origin: 'New York, NY',
    destination: 'Boston, MA',
    startingPrice: 26,
    currency: '$',
    estimatedDuration: '4h 00m',
    dailyBusesCount: 24,
    popularTag: 'Most Traveled',
  },
  {
    id: 'route-2',
    origin: 'Washington, DC',
    destination: 'New York, NY',
    startingPrice: 32,
    currency: '$',
    estimatedDuration: '4h 30m',
    dailyBusesCount: 18,
    popularTag: 'Business Express',
  },
  {
    id: 'route-3',
    origin: 'Boston, MA',
    destination: 'Philadelphia, PA',
    startingPrice: 35,
    currency: '$',
    estimatedDuration: '5h 45m',
    dailyBusesCount: 14,
  },
  {
    id: 'route-4',
    origin: 'New York, NY',
    destination: 'Washington, DC',
    startingPrice: 29,
    currency: '$',
    estimatedDuration: '4h 25m',
    dailyBusesCount: 20,
    popularTag: 'Daily Frequent',
  },
];
