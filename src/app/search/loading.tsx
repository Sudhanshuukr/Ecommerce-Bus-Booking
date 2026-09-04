import * as React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Container, Section } from '@/components/layout';

export default function SearchLoading() {
  return (
    <AppShell>
      <Section spacing="md" className="bg-background min-h-[calc(100vh-16rem)] py-8">
        <Container className="space-y-6 animate-pulse">
          {/* Top Search Controls Bar Skeleton */}
          <div className="h-20 w-full bg-slate-200/80 rounded-2xl" />

          {/* Grid Layout: Sidebar & Bus Results Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block h-[450px] bg-slate-200/80 rounded-2xl" />
            <div className="lg:col-span-3 space-y-4">
              <div className="h-36 bg-slate-200/80 rounded-2xl" />
              <div className="h-36 bg-slate-200/80 rounded-2xl" />
              <div className="h-36 bg-slate-200/80 rounded-2xl" />
            </div>
          </div>
        </Container>
      </Section>
    </AppShell>
  );
}
