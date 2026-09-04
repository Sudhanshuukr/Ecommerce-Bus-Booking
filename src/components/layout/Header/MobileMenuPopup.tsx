'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { Button } from '@/components/ui/button';

export interface MobileMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function MobileMenuPopup({ isOpen, onClose, triggerRef }: MobileMenuPopupProps) {
  const pathname = usePathname();
  const { user, profile, role, isAuthenticated, logout } = useAuth();
  const popupRef = React.useRef<HTMLDivElement>(null);

  // Close popup when pathname changes
  const previousPathnameRef = React.useRef(pathname);
  React.useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      if (isOpen) {
        onClose();
      }
    }
  }, [pathname, isOpen, onClose]);

  // Close popup on click/tap outside or Escape keypress
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isInsidePopup = popupRef.current?.contains(target);
      const isInsideTrigger = triggerRef?.current?.contains(target);

      if (!isInsidePopup && !isInsideTrigger) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

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
    <div
      ref={popupRef}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2 z-50 md:hidden animate-in fade-in-50 zoom-in-95 duration-150"
    >
      {isAuthenticated ? (
        <div className="space-y-2 p-1">
          {/* User Info Header */}
          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-black text-xs shadow-subtle">
              {(profile?.fullName || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-extrabold text-slate-900 truncate">
                {profile?.fullName || user?.email?.split('@')[0]}
              </h4>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1 text-[11px] text-slate-500 font-semibold">
            <span className="inline-flex items-center text-primary font-bold">
              <Shield className="mr-1 h-3 w-3" />
              {getRoleLabel(role)}
            </span>
          </div>

          {/* Role-Specific Actions */}
          {role === 'platform_admin' && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <span>Admin Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          )}

          {role === 'operator' && (
            <Link
              href="/operator"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <span>Operator Panel</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          )}

          <div className="border-t border-slate-100 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full justify-start text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive h-9 rounded-xl px-3"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-1 p-1">
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span>Sign In</span>
          </Link>
          <Link
            href="/signup"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-white shadow-subtle hover:bg-primary/90 transition-colors"
          >
            <span>Create Account</span>
          </Link>
        </div>
      )}
    </div>
  );
}
