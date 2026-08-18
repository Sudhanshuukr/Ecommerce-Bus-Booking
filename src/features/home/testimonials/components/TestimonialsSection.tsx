import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { TestimonialCard } from './TestimonialCard';
import { Testimonial } from '../types/testimonial';
import { MOCK_TESTIMONIALS } from '../mock/testimonials';

export interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
  ratingCallout?: string;
  className?: string;
}

export function TestimonialsSection({
  testimonials = MOCK_TESTIMONIALS,
  title = 'What Our Travelers Say',
  subtitle = 'Read authentic feedback from passengers who rely on our platform for their daily commutes and trips.',
  ratingCallout = '4.9/5 Average Rating (Demo Data)',
  className,
}: TestimonialsSectionProps) {
  return (
    <Section spacing="lg" className={cn('bg-background py-12 md:py-16', className)}>
      <Container>
        {/* Section Header */}
        <header className="mx-auto mb-10 flex max-w-2xl flex-col items-center space-y-2 text-center">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span>{ratingCallout}</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </header>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

