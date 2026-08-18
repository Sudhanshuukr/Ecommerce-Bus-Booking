import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';

export interface CtaSectionProps {
  badgeText?: string;
  headline?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function CtaSection({
  badgeText = 'Start Traveling',
  headline = 'Ready to Book Your Next Journey?',
  description = 'Find and compare verified bus operators, select your preferred seats, and get instant mobile e-tickets in seconds.',
  primaryCtaText = 'Search Buses Now',
  primaryCtaHref = '/search',
  secondaryCtaText = 'Explore Popular Routes',
  secondaryCtaHref = '/routes',
  className,
}: CtaSectionProps) {
  return (
    <Section spacing="lg" className={cn('bg-background py-12 md:py-16', className)}>
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-slate-900/5 p-8 text-center shadow-lg dark:border-primary/30 dark:from-primary/20 dark:via-slate-900 dark:to-slate-950 sm:p-12 md:p-16">
          {/* Background Ambient Accents */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{badgeText}</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {headline}
            </h2>

            {/* Description */}
            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <Link
                href={primaryCtaHref}
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'group w-full sm:w-auto shadow-md transition-all duration-300 hover:shadow-lg'
                )}
              >
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>{primaryCtaText}</span>
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              {secondaryCtaText && secondaryCtaHref && (
                <Link
                  href={secondaryCtaHref}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'w-full sm:w-auto'
                  )}
                >
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
