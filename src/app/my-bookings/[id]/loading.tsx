import * as React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Container } from '@/components/layout';

export default function BookingDetailLoading() {
  return (
    <AppShell className="bg-slate-50/50">
      <div className="py-12">
        <Container className="max-w-4xl space-y-6 animate-pulse">
          <div className="h-6 w-36 bg-slate-200/80 rounded" />
          <div className="h-32 w-full bg-slate-200/80 rounded-2xl" />
          <div className="h-64 w-full bg-slate-200/80 rounded-2xl" />
        </Container>
      </div>
    </AppShell>
  );
}
