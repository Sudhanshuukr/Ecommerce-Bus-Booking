import * as React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Container } from '@/components/layout';

export default function RootLoading() {
  return (
    <AppShell>
      <div className="min-h-[calc(100vh-16rem)] py-8 sm:py-12">
        <Container className="space-y-6 animate-pulse">
          <div className="h-48 sm:h-64 w-full bg-slate-200/80 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200/80 rounded-2xl" />
            ))}
          </div>
        </Container>
      </div>
    </AppShell>
  );
}
