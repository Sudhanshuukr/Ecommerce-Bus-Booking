import * as React from 'react';
import Link from 'next/link';
import { Building2, TicketCheck, Layers, ArrowUpRight } from 'lucide-react';
import { Container } from '../Container';
import { Logo } from '@/components/shared/Logo';
import { ScrollReveal } from '@/components/shared';
import { SocialLinks } from './SocialLinks';
import { quickLinksGroup, supportLinksGroup } from './footer-links';
import { cn } from '@/lib/utils';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const TOP_ROUTES_FOOTER = [
  { label: 'Delhi to Lucknow', href: '/search?origin=Delhi&destination=Lucknow' },
  { label: 'Mumbai to Pune', href: '/search?origin=Mumbai&destination=Pune' },
  { label: 'Bengaluru to Chennai', href: '/search?origin=Bengaluru&destination=Chennai' },
  { label: 'Delhi to Jaipur', href: '/search?origin=Delhi&destination=Jaipur' },
];

export function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'relative flex flex-col justify-between border-t border-slate-800 bg-slate-900 text-slate-200 py-12 md:py-16',
        className
      )}
      {...props}
    >
      <Container className="my-auto space-y-12 sm:space-y-16">
        <ScrollReveal delay={0}>
          {/* Top Brand & Statement Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-10 sm:pb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-3">
                <Logo size="default" className="text-white" />
                <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-0.5 text-xs font-semibold text-teal-400">
                  Intercity Transit Platform
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                India&apos;s modern intercity bus reservation platform. Compare schedules across bus operators, choose your exact seat on live layouts, and get instant digital e-tickets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <SocialLinks />
            </div>
          </div>
        </ScrollReveal>

        {/* Main Links Grid */}
        <ScrollReveal delay={120}>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Quick Links Column */}
            <div className="space-y-3">
              <h3 className="font-heading text-xs font-bold tracking-wider text-slate-100 uppercase">
                {quickLinksGroup.title}
              </h3>
              <ul className="space-y-2.5">
                {quickLinksGroup.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore Column */}
            <div className="space-y-3">
              <h3 className="font-heading text-xs font-bold tracking-wider text-slate-100 uppercase">
                {supportLinksGroup.title}
              </h3>
              <ul className="space-y-2.5">
                {supportLinksGroup.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Corridors Column */}
            <div className="space-y-3">
              <h3 className="font-heading text-xs font-bold tracking-wider text-slate-100 uppercase">
                Top Corridors
              </h3>
              <ul className="space-y-2.5">
                {TOP_ROUTES_FOOTER.map((route) => (
                  <li key={route.label}>
                    <Link
                      href={route.href}
                      className="group inline-flex items-center text-xs sm:text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      <span>{route.label}</span>
                      <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Features Column */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs font-bold tracking-wider text-slate-100 uppercase">
                Platform Features
              </h3>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-teal-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span>Multi-Operator Schedules</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-teal-400">
                    <TicketCheck className="h-4 w-4" />
                  </div>
                  <span>Instant PNR Digital Passes</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-teal-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span>Interactive Deck Layouts</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom Bar */}
        <ScrollReveal delay={200}>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
            <p>© {currentYear} Bustkit. All rights reserved.</p>
            <p className="font-medium text-slate-400">
              Built for seamless intercity travel across India
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </footer>
  );
}
