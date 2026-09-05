'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, Shield } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Navigation } from './Navigation';
import { MobileMenuPopup } from './MobileMenuPopup';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { cn } from '@/lib/utils';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  hideMobileNav?: boolean;
}

export function Header({ className, hideMobileNav = false, ...props }: HeaderProps) {
  const { user, profile, role, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'platform_admin':
      case 'admin':
        return 'Platform Admin';
      case 'operator':
        return 'Operator';
      case 'driver':
        return 'Driver';
      case 'developer':
        return 'Developer';
      default:
        return 'Customer';
    }
  };

  return (
    <header
      className={cn(
        'fixed top-2.5 sm:top-4 inset-x-0 z-40 w-full px-3 sm:px-6 pointer-events-none transition-all duration-300',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'pointer-events-auto mx-auto flex h-12 sm:h-14 md:h-16 max-w-5xl items-center justify-between rounded-full px-3.5 sm:px-5 md:px-6 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border border-slate-300/90 shadow-hover text-slate-900'
            : 'bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-soft text-slate-900'
        )}
      >
        {/* Brand Logo */}
        <div className="shrink-0 flex items-center">
          <Logo size="default" />
        </div>

        {/* Desktop Navigation */}
        <Navigation />

        {/* Right Actions: Desktop Auth State & Mobile Menu Button */}
        <div className="relative flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Desktop-only Auth Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end text-xs">
                  <span className="font-bold text-slate-900">
                    {profile?.fullName || user?.email?.split('@')[0]}
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold text-primary">
                    <Shield className="mr-1 h-3 w-3" />
                    {getRoleLabel(role)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="h-8 rounded-full px-3 text-xs font-semibold"
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-3.5 text-xs font-semibold text-slate-700 hover:text-slate-900">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="h-8 rounded-full px-4 text-xs font-semibold shadow-subtle hover:shadow-hover transition-shadow">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button Trigger & Popup Container */}
          {!hideMobileNav && (
            <div className="relative md:hidden">
              <Button
                ref={triggerRef}
                variant="ghost"
                size="icon"
                className="flex items-center justify-center h-9 w-9 rounded-full text-foreground hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-foreground" />
                ) : (
                  <Menu className="h-5 w-5 text-foreground" />
                )}
              </Button>

              <MobileMenuPopup
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                triggerRef={triggerRef}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
