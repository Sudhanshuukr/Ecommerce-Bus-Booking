import { WhyUsFeature } from '../types/why-us';

export const MOCK_WHY_US_FEATURES: WhyUsFeature[] = [
  {
    id: 'feature-1',
    title: 'Verified Operators',
    description: 'Travel only with top-rated, background-checked bus partners offering premium safety standards.',
    iconName: 'ShieldCheck',
    badgeText: 'Top Safety',
  },
  {
    id: 'feature-2',
    title: 'Instant E-Tickets & Refunds',
    description: 'Get instant booking confirmations with QR tickets and instant automated hassle-free refunds.',
    iconName: 'Ticket',
    badgeText: 'Instant',
  },
  {
    id: 'feature-3',
    title: 'Live Bus Tracking',
    description: 'Track your bus real-time on live maps and share your journey location with family & friends.',
    iconName: 'MapPin',
  },
  {
    id: 'feature-4',
    title: '24/7 Priority Customer Care',
    description: 'Our dedicated support team is available around the clock to assist you before, during, and after trip.',
    iconName: 'Headphones',
    badgeText: '24/7 Support',
  },
];
