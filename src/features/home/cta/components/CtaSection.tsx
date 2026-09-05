import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { ScrollReveal } from '@/components/shared';
import { buttonVariants } from '@/components/ui/button';
import { Footer } from '@/components/layout/Footer';

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
  headline = 'Ready to Plan Your Next Journey?',
  description = 'Compare verified bus schedules, select your exact seat on live deck layouts, and get instant digital e-tickets in seconds.',
  primaryCtaText = 'Search Buses',
  primaryCtaHref = '/search',
  secondaryCtaText = 'View Popular Corridors',
  secondaryCtaHref = '/#popular-routes',
  className,
}: CtaSectionProps) {
  return (
    <Section
      spacing="none"
      className={cn(
        'relative flex min-h-[100svh] flex-col justify-between bg-slate-900 text-slate-200 snap-start pt-12 sm:pt-16 pb-0 overflow-hidden',
        className
      )}
    >
      {/* Upper Portion: CTA Card */}
      <Container className="my-auto py-6 sm:py-8">
        <ScrollReveal delay={0} className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-800/80 via-slate-800/40 to-slate-900/90 p-6 text-center shadow-modal sm:p-10 md:p-12 backdrop-blur-sm">
            {/* Background Ambient Accents */}
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center space-y-4 sm:space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center space-x-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-400 backdrop-blur-sm">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{badgeText}</span>
              </div>

              {/* Headline */}
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {headline}
              </h2>

              {/* Description */}
              <p className="max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-300">
                {description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row w-full sm:w-auto">
                <Link
                  href={primaryCtaHref}
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'lg' }),
                    'group w-full sm:w-auto rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold shadow-subtle transition-all duration-300 hover:shadow-hover'
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
                      'w-full sm:w-auto rounded-xl border-slate-700 bg-slate-800/80 text-white hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    {secondaryCtaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>

      {/* Lower Portion: Unified Footer */}
      <Footer className="border-t border-slate-800/80 bg-slate-900/90 py-10 md:py-12" />
    </Section>
  );
}
