import { Testimonial } from '../types/testimonial';

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah Jenkins',
    role: 'Frequent Traveler',
    initials: 'SJ',
    route: {
      from: 'New York',
      to: 'Washington, DC',
    },
    rating: 5,
    reviewText:
      'Booking was effortless and the live tracking was pinpoint accurate! The bus arrived on time with super comfy seats and fast Wi-Fi.',
    verified: true,
    date: '2 days ago',
  },
  {
    id: 't-2',
    name: 'Marcus Vance',
    role: 'Business Consultant',
    initials: 'MV',
    route: {
      from: 'Boston',
      to: 'New York',
    },
    rating: 5,
    reviewText:
      'I commute weekly between Boston and NYC. The sleeper seats on luxury coaches give me 4 full hours of restful work and zero stress.',
    verified: true,
    date: '1 week ago',
  },
  {
    id: 't-3',
    name: 'Elena Rostova',
    role: 'Verified Passenger',
    initials: 'ER',
    route: {
      from: 'Chicago',
      to: 'Detroit',
    },
    rating: 5,
    reviewText:
      'Had to reschedule my ticket 3 hours before departure. Customer support resolved it instantly without extra fees. Top tier service!',
    verified: true,
    date: '3 weeks ago',
  },
];
