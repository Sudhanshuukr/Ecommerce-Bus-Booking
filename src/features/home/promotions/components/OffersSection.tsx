import * as React from 'react';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { ScrollReveal } from '@/components/shared';
import { OfferCard } from './OfferCard';
import { Offer } from '../types/promotion';
import { MOCK_OFFERS } from '../mock/promotions';

export interface OffersSectionProps {
  offers?: Offer[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function OffersSection({
  offers = MOCK_OFFERS,
  title = 'Exclusive Offers & Savings',
  subtitle = 'Unlock special discounts on top intercity routes and operator schedules.',
  className,
}: OffersSectionProps) {
  return (
    <Section
      spacing="none"
      className={cn(
        'relative flex min-h-[100svh] flex-col justify-center bg-slate-50/50 py-16 sm:py-20 snap-start',
        className
      )}
    >
      <Container className="my-auto">
        {/* Section Header */}
        <ScrollReveal delay={0} className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Tag className="h-3.5 w-3.5" />
            <span>Limited Period Deals</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
        </ScrollReveal>

        {/* Offers Grid */}
        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
