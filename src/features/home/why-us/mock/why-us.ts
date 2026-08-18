import { WhyUsFeature, WhyUsStat } from '../types/why-us';

export const MOCK_WHY_US_FEATURES: WhyUsFeature[] = [
  {
    id: 'feature-1',
    title: 'Easy & Fast Booking',
    description: 'Rapid seat reservation experience in under 60 seconds with instant mobile e-tickets.',
    iconName: 'Ticket',
    badgeText: 'Instant Booking',
  },
  {
    id: 'feature-2',
    title: 'Trusted Bus Operators',
    description: 'Travel with reliable, quality-focused bus partners offering verified safety and hygiene standards.',
    iconName: 'ShieldCheck',
    badgeText: 'Verified Partners',
  },
  {
    id: 'feature-3',
    title: 'Secure & Flexible Payments',
    description: 'Protected by bank-grade encryption with multi-option payment methods and hassle-free refund handling.',
    iconName: 'CreditCard',
    badgeText: '100% Encrypted',
  },
  {
    id: 'feature-4',
    title: 'Reliable Customer Support',
    description: 'Our dedicated support team is available 24/7 to assist you before, during, and after your trip.',
    iconName: 'Headphones',
    badgeText: '24/7 Assistance',
  },
];

// Placeholder/Demo marketing statistics (frontend static data)
export const MOCK_WHY_US_STATS: WhyUsStat[] = [
  { id: 'stat-1', value: '1M+', label: 'Happy Passengers (Demo)' },
  { id: 'stat-2', value: '500+', label: 'Verified Operators (Demo)' },
  { id: 'stat-3', value: '99.8%', label: 'On-Time Rate (Demo)' },
  { id: 'stat-4', value: '24/7', label: 'Dedicated Support (Demo)' },
];

