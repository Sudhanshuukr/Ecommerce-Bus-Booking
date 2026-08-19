'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Building2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { cn } from '@/lib/utils';

export interface OperatorHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function OperatorHeader({
  title = 'Operator Dashboard',
  subtitle = 'Fleet operations, active schedule metrics, and customer reservations.',
  className,
}: OperatorHeaderProps) {
  const router = useRouter();
  const { profile, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur shadow-subtle',
        className
      )}
    >
      {/* Title / Subtitle */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>}
      </div>

      {/* Profile & Actions */}
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="hidden md:inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Home className="mr-1.5 h-3.5 w-3.5" />
          <span>Customer Portal</span>
        </Link>

        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <div className="flex flex-col items-end text-xs">
            <span className="font-bold text-slate-900">
              {profile?.fullName || user?.email?.split('@')[0] || 'Bus Operator'}
            </span>
            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Building2 className="mr-1 h-3 w-3 text-emerald-600" />
              Operator
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors ml-2"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
