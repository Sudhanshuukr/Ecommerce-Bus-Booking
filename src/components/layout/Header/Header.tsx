'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, Shield } from 'lucide-react';
import { Container } from '../Container';
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
  const triggerRef = React.useRef<HTMLButtonElement>(null);

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
        'sticky top-0 z-30 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60',
        className
      )}
      {...props}
    >
      <Container className="flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Logo size="default" />

        {/* Desktop Navigation */}
        <Navigation />

        {/* Right Actions: Desktop Auth State & Mobile Menu Button */}
        <div className="relative flex items-center space-x-3">
          {/* Desktop-only Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
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
                  className="text-xs font-semibold"
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="text-xs font-semibold">
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
                className="flex items-center justify-center h-10 w-10 text-foreground"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
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
      </Container>
    </header>
  );
}
