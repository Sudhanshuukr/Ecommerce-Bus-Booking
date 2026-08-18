import * as React from 'react';
import { Suspense } from 'react';
import { AppShell, Container, Section } from '@/components/layout';
import { SearchResultsContainer } from '@/features/search-results/components/SearchResultsContainer';

export const metadata = {
  title: 'Search Bus Routes | Bus Booking Platform',
  description: 'Compare and book verified intercity bus schedules with real-time seat availability.',
};

export default function SearchPage() {
  return (
    <AppShell>
      <Section spacing="md" className="bg-background min-h-[calc(100vh-16rem)] py-8">
        <Container>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16 text-slate-500 text-sm font-medium">
                Loading search results...
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
