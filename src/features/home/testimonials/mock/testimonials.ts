import { Testimonial } from '../types/testimonial';

export const MOCK_TESTIMONIALS: Testimonial[] = [

  {
    id: 't-1',
    name: 'Rajesh Sharma',
    role: 'Frequent Commuter',
    initials: 'RS',
    route: {
      from: 'Delhi',
      to: 'Jaipur',
    },
    rating: 5,
    reviewText:
      'Booking was simple and fast. The e-ticket on my phone worked seamlessly at Kashmere Gate ISBT, and the Volvo departed right on schedule.',
    verified: true,
    date: '2 days ago',
  },
  {
    id: 't-2',
    name: 'Ananya Iyer',
    role: 'Business Traveler',
    initials: 'AI',
    route: {
      from: 'Bengaluru',
      to: 'Hyderabad',
    },
    rating: 5,
    reviewText:
      'I commute regularly between Bengaluru and Hyderabad. The sleeper berths on VRL Travels make it easy to rest comfortably overnight.',
    verified: true,
    date: '1 week ago',
  },
  {
    id: 't-3',
    name: 'Vikram Malhotra',
    role: 'Weekend Traveler',
    initials: 'VM',
    route: {
      from: 'Mumbai',
      to: 'Pune',
    },
    rating: 4,
    reviewText:
      'Great selection of operators and departure times. Customer support helped me adjust my boarding location at Dadar smoothly.',
    verified: true,
    date: '2 weeks ago',
  },
  {
    id: 't-4',
    name: 'Priya Patel',
    role: 'Family Trip Traveler',
    initials: 'PP',
    route: {
      from: 'Delhi',
      to: 'Lucknow',
    },
    rating: 5,
    reviewText:
      'Clear pricing with zero hidden fees. Booking IntrCity SmartBus tickets for my whole family took less than two minutes.',
    verified: true,
    date: '3 weeks ago',
  },
];


