import * as React from 'react';
import { Building2, Star, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { ScrollReveal } from '@/components/shared';
import { Card } from '@/components/ui/card';

export interface OperatorShowcaseProps {
  className?: string;
}

const VERIFIED_OPERATORS = [
  { name: 'IntrCity SmartBus', type: 'Private Fleet', rating: 4.8, reviews: 342 },
  { name: 'Zingbus', type: 'Private Fleet', rating: 4.6, reviews: 215 },
  { name: 'VRL Travels', type: 'Private Fleet', rating: 4.9, reviews: 512 },
  { name: 'UPSRTC Janrath', type: 'State Transit', rating: 4.4, reviews: 188 },
  { name: 'MSRTC Shivneri', type: 'State Transit', rating: 4.7, reviews: 310 },
  { name: 'SRS Travels', type: 'Private Fleet', rating: 4.7, reviews: 290 },
  { name: 'KSRTC FlyBus', type: 'State Transit', rating: 4.5, reviews: 140 },
  { name: 'RSRTC Express', type: 'State Transit', rating: 4.5, reviews: 175 },
];

export function OperatorShowcase({ className }: OperatorShowcaseProps) {
  return (
    <Section
      spacing="none"
      className={cn(
        'relative flex min-h-[100svh] flex-col justify-center bg-background py-16 sm:py-20 snap-start',
        className
      )}
    >
      <Container className="my-auto">
        {/* Section Header */}
        <ScrollReveal delay={0} className="mx-auto mb-10 sm:mb-12 flex max-w-2xl flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Building2 className="h-3.5 w-3.5" />
            <span>Network Coverage</span>
          </div>

          <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Available Bus Operators
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground">
            Compare schedules, live seat maps, and amenities across state transit corporations and private operators.
          </p>
        </ScrollReveal>

        {/* Operator Grid */}
        <ScrollReveal delay={150}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {VERIFIED_OPERATORS.map((op, idx) => (
              <Card
                key={idx}
                className="group rounded-2xl border border-border/80 bg-white p-4 sm:p-5 shadow-subtle hover:border-slate-300 hover:shadow-hover transition-all duration-normal"
              >
                <div className="flex flex-col justify-between h-full space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                      {op.rating.toFixed(1)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {op.name}
                      </h3>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-label="Verified" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {op.type} • {op.reviews} reviews
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
