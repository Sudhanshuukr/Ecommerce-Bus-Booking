import * as React from 'react';
import Link from 'next/link';
import { Bus, Home } from 'lucide-react';
import { AppShell, Container } from '@/components/layout';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center py-16">
        <Container className="max-w-md text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bus className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">404</h1>
            <h2 className="text-lg font-semibold text-slate-800">Page Not Found</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We couldn&apos;t find the route or page you are looking for. It might have been moved or doesn&apos;t exist.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href="/">
              <Button variant="default" size="default" className="rounded-xl px-5 text-xs font-semibold shadow-subtle">
                <Home className="mr-2 h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="default" className="rounded-xl px-5 text-xs font-semibold">
                <span>Search Buses</span>
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </AppShell>
  );
}
