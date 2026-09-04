import { WhyUsFeature } from '../types/why-us';

export const MOCK_WHY_US_FEATURES: WhyUsFeature[] = [
  {
    id: 'feature-1',
    title: 'Live Seat Selection',
    description: 'Interactive lower and upper deck seat maps. Choose window, aisle, or sleeper berths with zero ambiguity.',
    iconName: 'Armchair',
    badgeText: 'Interactive Map',
  },
  {
    id: 'feature-2',
    title: 'Verified Bus Amenities',
    description: 'Transparent fleet listings showing onboard WiFi, USB charging, blankets, water bottles, and safety gear.',
    iconName: 'ShieldCheck',
    badgeText: 'Fleet Transparency',
  },
  {
    id: 'feature-3',
    title: 'Boarding Hub Timings',
    description: 'Clear pickup and drop-off points with exact landmark addresses and scheduled departure timings.',
    iconName: 'MapPin',
    badgeText: 'Exact Locations',
  },
  {
    id: 'feature-4',
    title: 'Instant PNR E-Ticket',
    description: 'Immediate digital booking confirmation with downloadable pass, passenger seat numbers, and receipt.',
    iconName: 'TicketCheck',
    badgeText: 'Digital Pass',
  },
];
