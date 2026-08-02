import * as React from 'react';
import { Container } from '../Container';
import { Logo } from '@/components/shared/Logo';
import { FooterSection } from './FooterSection';
import { SocialLinks } from './SocialLinks';
import { quickLinksGroup, supportLinksGroup } from './footer-links';
import { cn } from '@/lib/utils';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn('w-full border-t border-border bg-surface text-foreground', className)}
      {...props}
    >
      <Container className="py-12 md:py-16">
        {/* Main Footer Content Grid */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Logo size="default" />
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              Modern, reliable intercity bus ticket reservation platform built for effortless travel.
            </p>
            <SocialLinks />
          </div>

          {/* Quick Links Column */}
          <FooterSection group={quickLinksGroup} />

          {/* Support Links Column */}
          <FooterSection group={supportLinksGroup} />

          {/* Trust / Service Column */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-foreground uppercase">
              Bus Booking
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Safe payments, verified operators, and instant ticket confirmations.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} Bus Booking Platform. All rights reserved.</p>
          <p className="font-medium text-muted-foreground">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </Container>
    </footer>
  );
}
