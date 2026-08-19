'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  Calendar,
  Bus,
  Building2,
  Users,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Bookings', href: '/admin/bookings', icon: Ticket },
    { label: 'Schedules', href: '/admin/schedules', icon: Calendar },
    { label: 'Buses', href: '/admin/buses', icon: Bus },
    { label: 'Operators', href: '/admin/operators', icon: Building2 },
    { label: 'Users', href: '/admin/users', icon: Users },
  ];

  return (
    <aside
      aria-label="Platform Admin Navigation Sidebar"
      className={cn(
        'flex flex-col w-64 shrink-0 bg-slate-900 text-white min-h-screen border-r border-slate-800 p-4 space-y-6',
        className
      )}
    >
      {/* Brand & Badge */}
      <div className="space-y-3 px-2 pt-2 border-b border-slate-800 pb-4">
        <Logo size="default" />
        <div className="flex items-center space-x-2 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 rounded-lg px-2.5 py-1 w-fit">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Platform Admin Console</span>
        </div>
      </div>

      {/* Main Admin Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all group',
                isActive
                  ? 'bg-primary text-white font-bold shadow-soft'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={cn('h-3.5 w-3.5 transition-transform opacity-0 group-hover:opacity-100', isActive && 'opacity-100')}
              />
            </Link>
          );
        })}
      </nav>

      {/* System Footer Note */}
      <div className="pt-4 border-t border-slate-800 px-2 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">Bus Booking Engine v1.0</p>
        <p className="mt-0.5">Strictly for authorized platform administrators.</p>
      </div>
    </aside>
  );
}
