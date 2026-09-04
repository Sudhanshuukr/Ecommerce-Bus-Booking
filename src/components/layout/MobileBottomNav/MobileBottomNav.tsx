'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bus, Ticket, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/context/AuthProvider';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      exact: true,
    },
    {
      label: 'Search',
      href: '/search',
      icon: Bus,
      exact: false,
    },
    {
      label: 'Bookings',
      href: '/my-bookings',
      icon: Ticket,
      exact: false,
    },
    {
      label: isAuthenticated ? 'Account' : 'Sign In',
      href: isAuthenticated ? '/profile' : '/login',
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border/80 bg-surface/95 backdrop-blur-md md:hidden supports-[backdrop-filter]:bg-surface/80 shadow-lg pb-[env(safe-area-inset-bottom,0px)]">
      <nav aria-label="Mobile Navigation" className="flex h-[var(--mobile-bottom-nav-height)] items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== '/';
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center py-1.5 transition-colors',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5 transition-transform duration-200', isActive && 'scale-110')} />
                {item.href === '/my-bookings' && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/80 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
              </div>
              <span className="mt-1 text-[11px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
