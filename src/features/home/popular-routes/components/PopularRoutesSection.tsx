import * as React from 'react';
import { Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { RouteCard } from './RouteCard';
import { PopularRoute } from '../types/popular-route';
import { MOCK_POPULAR_ROUTES } from '../mock/popular-routes';

export interface PopularRoutesSectionProps {
  routes?: PopularRoute[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PopularRoutesSection({
  routes = MOCK_POPULAR_ROUTES,
  title = 'Popular Intercity Corridors',
  subtitle = 'Frequently traveled intercity routes with verified departures and transparent fares.',
  className,
}: PopularRoutesSectionProps) {
  return (
    <Section spacing="lg" className={cn('bg-slate-50/50 py-12 md:py-16', className)}>
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Navigation className="h-3.5 w-3.5" />
            <span>Popular Routes</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>

          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Routes Grid: 3 columns on lg for 6 cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((routeItem) => (
            <RouteCard key={routeItem.id} routeItem={routeItem} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
