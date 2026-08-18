'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, LogOut, Shield } from 'lucide-react';
import { Container } from '../Container';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Navigation } from './Navigation';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { cn } from '@/lib/utils';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Header({ className, ...props }: HeaderProps) {
  const { user, profile, role, isAuthenticated, logout } = useAuth();

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
        'sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60',
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
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex flex-col items-end text-xs">
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
                <Button variant="ghost" size="sm" className="text-xs font-bold">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm" className="hidden sm:inline-flex text-xs font-bold">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button Structure */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </Container>
    </header>
  );
}
