import * as React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Container } from '@/components/layout';

export default function RoutesLoading() {
  return (
    <AppShell>
      <div className="py-10">
        <Container className="max-w-5xl space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-slate-200/80 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-36 bg-slate-200/80 rounded-2xl" />
            <div className="h-36 bg-slate-200/80 rounded-2xl" />
            <div className="h-36 bg-slate-200/80 rounded-2xl" />
          </div>
        </Container>
      </div>
    </AppShell>
  );
}
