import * as React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Container } from '@/components/layout';

export default function BusDetailLoading() {
  return (
    <AppShell>
      <div className="py-8">
        <Container className="max-w-5xl space-y-6 animate-pulse">
          <div className="h-24 w-full bg-slate-200/80 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-200/80 rounded-2xl" />
            <div className="h-72 bg-slate-200/80 rounded-2xl" />
          </div>
        </Container>
      </div>
    </AppShell>
  );
}
