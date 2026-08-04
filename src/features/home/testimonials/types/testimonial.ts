export interface TestimonialRoute {
  from: string;
  to: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  initials: string;
  avatarUrl?: string;
  route: TestimonialRoute;
  rating: number; // 1 to 5
  reviewText: string;
  verified?: boolean;
  date?: string;
}
