'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mainNavItems, type NavItem } from './nav-items';

export interface NavigationProps {
  items?: NavItem[];
  activeHref?: string;
  className?: string;
}

export function Navigation({
  items = mainNavItems,
  activeHref,
  className,
}: NavigationProps) {
  const pathname = usePathname();
  const currentPath = activeHref ?? pathname ?? '/';

  return (
    <nav
      className={cn('hidden md:flex items-center space-x-1 lg:space-x-1.5', className)}
      aria-label="Main Navigation"
    >
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? currentPath === '/'
            : currentPath === item.href || currentPath.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              isActive
                ? 'bg-primary/10 text-primary font-bold shadow-subtle'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
