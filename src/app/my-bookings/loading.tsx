import * as React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Container } from '@/components/layout';

export default function MyBookingsLoading() {
  return (
    <AppShell>
      <div className="py-10">
        <Container className="max-w-4xl space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-slate-200/80 rounded-lg" />
          <div className="h-12 w-full bg-slate-200/80 rounded-xl" />
          <div className="space-y-4 pt-2">
            <div className="h-40 bg-slate-200/80 rounded-2xl" />
            <div className="h-40 bg-slate-200/80 rounded-2xl" />
          </div>
        </Container>
      </div>
    </AppShell>
  );
}
