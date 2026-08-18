import { PopularRoute } from '../types/popular-route';

export const MOCK_POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'route-1',
    origin: 'Delhi',
    destination: 'Lucknow',
    startingPrice: 699,
    currency: '₹',
    estimatedDuration: '8h 00m',
    dailyBusesCount: 24,
    popularTag: 'Most Traveled',
  },
  {
    id: 'route-2',
    origin: 'Delhi',
    destination: 'Jaipur',
    startingPrice: 499,
    currency: '₹',
    estimatedDuration: '5h 30m',
    dailyBusesCount: 18,
    popularTag: 'Express Highway',
  },
  {
    id: 'route-3',
    origin: 'Mumbai',
    destination: 'Pune',
    startingPrice: 399,
    currency: '₹',
    estimatedDuration: '3h 30m',
    dailyBusesCount: 30,
    popularTag: 'Daily Commute',
  },
  {
    id: 'route-4',
    origin: 'Bengaluru',
    destination: 'Hyderabad',
    startingPrice: 899,
    currency: '₹',
    estimatedDuration: '9h 00m',
    dailyBusesCount: 20,
    popularTag: 'Overnight Sleeper',
  },
];

