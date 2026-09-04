'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LogOut, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { mainNavItems } from './nav-items';

export interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const { user, profile, role, isAuthenticated, logout } = useAuth();

  // 1. Lock and restore body scroll exact state
  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 2. Close drawer on route change
  const previousPathnameRef = React.useRef(pathname);

  React.useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      if (isOpen) {
        onClose();
      }
    }
  }, [pathname, isOpen, onClose]);

  if (!isOpen) return null;

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'platform_admin':
      case 'admin':
        return 'Platform Admin';
      case 'operator':
        return 'Operator';
      case 'driver':
        return 'Driver';
      default:
        return 'Customer';
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Darkened Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-xs flex-col bg-white p-6 shadow-2xl transition-transform duration-300 animate-in slide-in-from-right">
        {/* Top Drawer Bar: Brand & Close Trigger */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <Logo size="compact" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="h-9 w-9 rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Card if Authenticated */}
        {isAuthenticated && (
          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-black text-sm">
                {(profile?.fullName || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-slate-900 truncate">
                  {profile?.fullName || user?.email?.split('@')[0]}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
              <span className="inline-flex items-center text-[11px] font-bold text-primary">
                <Shield className="mr-1 h-3.5 w-3.5" />
                {getRoleLabel(role)}
              </span>

              {role === 'platform_admin' && (
                <Link
                  href="/admin"
                  className="text-xs font-bold text-primary hover:underline flex items-center"
                >
                  <span>Admin Panel</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              )}

              {role === 'operator' && (
                <Link
                  href="/operator"
                  className="text-xs font-bold text-primary hover:underline flex items-center"
                >
                  <span>Operator Panel</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Main Navigation Links */}
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href) && item.href !== '/';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary font-bold shadow-subtle'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Auth Actions */}
        <div className="mt-auto border-t border-slate-100 pt-4 space-y-3">
          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full h-11 justify-center rounded-xl font-bold text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </Button>
          ) : (
            <div className="space-y-2">
              <Link href="/login" className="block w-full">
                <Button variant="outline" className="w-full h-11 justify-center rounded-xl font-bold">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="block w-full">
                <Button variant="default" className="w-full h-11 justify-center rounded-xl font-bold">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
