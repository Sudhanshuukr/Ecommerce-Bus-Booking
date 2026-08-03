import * as React from 'react';
import { Suspense } from 'react';
import { AppShell, Container, Section } from '@/components/layout';
import { SearchResultsContainer } from '@/features/search-results';

export const metadata = {
  title: 'Available Bus Routes | Bus Booking Platform',
  description: 'Browse all intercity bus routes and schedules.',
};

export default function RoutesPage() {
  return (
    <AppShell>
      <Section spacing="md" className="bg-background min-h-[calc(100vh-16rem)] py-8">
        <Container>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16 text-slate-500 text-sm font-medium">
                Loading available routes...
              </div>
            }
          >
            <SearchResultsContainer />
          </Suspense>
        </Container>
      </Section>
    </AppShell>
  );
}
