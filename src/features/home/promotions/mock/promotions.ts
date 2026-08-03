import { Offer } from '../types/promotion';

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    code: 'FIRST250',
    title: 'First Trip Special Discount',
    description: 'Get up to 25% off on your first intercity bus ticket booking across all nationwide routes.',
    discountBadge: '25% OFF',
    validUntil: 'Oct 31, 2026',
    category: 'First Booking',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  },
  {
    id: 'offer-2',
    code: 'WEEKEND15',
    title: 'Weekend Getaway Savings',
    description: 'Save 15% on Friday and Sunday departures. Perfect for quick city escapes with friends.',
    discountBadge: '15% OFF',
    validUntil: 'Nov 15, 2026',
    category: 'Weekend Special',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
  },
  {
    id: 'offer-3',
    code: 'EXPRESS30',
    title: 'Volvo & Scania Deluxe Deal',
    description: 'Flat $10 instant discount on premium Volvo Multi-Axle sleeper & seater coaches.',
    discountBadge: '$10 OFF',
    validUntil: 'Dec 05, 2026',
    category: 'Routes Discount',
    bgGradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
  },
];
