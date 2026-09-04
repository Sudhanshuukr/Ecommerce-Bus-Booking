import { Offer } from '../types/promotion';

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    code: 'FIRST15',
    title: 'First Journey Special',
    description: 'Get 15% off on your first intercity bus ticket booking across all corridors.',
    discountBadge: '15% OFF',
    validUntil: 'Valid on 1st Booking',
    category: 'First Booking',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  },
  {
    id: 'offer-2',
    code: 'RETURN100',
    title: 'Round Trip Bonus',
    description: 'Flat ₹100 discount when you book your return journey on express routes.',
    discountBadge: '₹100 OFF',
    validUntil: 'Round Trips',
    category: 'Weekend Special',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
  },
  {
    id: 'offer-3',
    code: 'VOLVO50',
    title: 'Premium Fleet Deal',
    description: 'Flat ₹50 savings on Volvo and Scania Multi-Axle AC sleeper & seater services.',
    discountBadge: '₹50 OFF',
    validUntil: 'AC Services',
    category: 'Routes Discount',
    bgGradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
  },
];
