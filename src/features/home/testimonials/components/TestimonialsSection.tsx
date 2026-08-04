import * as React from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { TestimonialCard } from './TestimonialCard';
import { Testimonial } from '../types/testimonial';
import { MOCK_TESTIMONIALS } from '../mock/testimonials';

export interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function TestimonialsSection({
  testimonials = MOCK_TESTIMONIALS,
  title = 'Loved by Over 500,000 Passengers',
  subtitle = 'Read verified reviews from travelers who rely on us for their daily commutes and holiday journeys.',
  className,
}: TestimonialsSectionProps) {
  return (
    <Section spacing="lg" className={cn('bg-background py-12 md:py-16', className)}>
      <Container>
        {/* Section Header */}
        <header className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <MessageSquareQuote className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Real Traveler Stories</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </header>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
