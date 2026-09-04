import * as React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Container } from '@/components/layout';

export default function ProfileLoading() {
  return (
    <AppShell className="bg-slate-50/50">
      <div className="py-10">
        <Container className="max-w-3xl space-y-6 animate-pulse">
          <div className="h-8 w-40 bg-slate-200/80 rounded-lg" />
          <div className="h-44 w-full bg-slate-200/80 rounded-2xl" />
          <div className="h-36 w-full bg-slate-200/80 rounded-2xl" />
        </Container>
      </div>
    </AppShell>
  );
}
