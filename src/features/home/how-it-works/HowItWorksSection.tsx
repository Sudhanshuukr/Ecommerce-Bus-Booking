import * as React from 'react';
import { Search, Armchair, TicketCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { ScrollReveal } from '@/components/shared';
import { Card } from '@/components/ui/card';

export interface HowItWorksSectionProps {
  className?: string;
}

const STEPS = [
  {
    step: '01',
    title: 'Search Route',
    description: 'Enter your origin, destination, and travel date to view verified bus departures and fares.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Choose Seat',
    description: 'Compare operators, review onboard amenities, and select your favorite sleeper berth or seater.',
    icon: Armchair,
  },
  {
    step: '03',
    title: 'Instant E-Ticket',
    description: 'Provide passenger details, confirm your booking, and get your digital ticket with PNR reference.',
    icon: TicketCheck,
  },
];

export function HowItWorksSection({ className }: HowItWorksSectionProps) {
  return (
    <Section
      spacing="none"
      className={cn(
        'relative flex min-h-[100svh] flex-col justify-center bg-slate-50/60 py-16 sm:py-20 snap-start',
        className
      )}
    >
      <Container className="my-auto">
        {/* Section Header */}
        <ScrollReveal delay={0} className="mx-auto mb-10 sm:mb-12 flex max-w-2xl flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <TicketCheck className="h-3.5 w-3.5" />
            <span>Simple 3-Step Flow</span>
          </div>

          <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            How Bus Booking Works
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground">
            From route discovery to instant seat confirmation in three clear steps.
          </p>
        </ScrollReveal>

        {/* Steps Grid */}
        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-6 shadow-subtle hover:border-slate-300 hover:shadow-hover transition-all duration-normal"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-heading text-2xl font-bold text-slate-300">
                        {item.step}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
