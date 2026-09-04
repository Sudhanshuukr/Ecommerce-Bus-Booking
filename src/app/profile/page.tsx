'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Shield, Ticket, LogOut, ArrowRight, Bus, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Container } from '@/components/layout/Container';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, role, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [authLoading, isAuthenticated, router]);

  // Loading skeleton while checking auth state
  if (authLoading) {
    return (
      <AppShell className="bg-slate-50/50">
        <div className="py-12">
          <Container className="max-w-2xl space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-subtle animate-pulse space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-40 bg-slate-200 rounded" />
                  <div className="h-4 w-60 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
              <div className="h-10 w-full bg-slate-200 rounded-xl" />
            </div>
          </Container>
        </div>
      </AppShell>
    );
  }

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'platform_admin':
      case 'admin':
        return { label: 'Platform Admin', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'operator':
        return { label: 'Bus Operator', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'driver':
        return { label: 'Verified Driver', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      default:
        return { label: 'Customer Account', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const roleInfo = getRoleBadge(role);

  return (
    <AppShell className="bg-slate-50/50">
      <div className="py-8 sm:py-12">
        <Container className="max-w-2xl space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Account Profile
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage your personal information, role credentials, and travel bookings.
            </p>
          </div>

          {/* Main User Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white font-black text-2xl shadow-soft">
                  {(profile?.fullName || user?.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {profile?.fullName || user?.email?.split('@')[0]}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                    <Mail className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                    <span>{user?.email}</span>
                  </p>
                </div>
              </div>

              <span
                className={cn(
                  'inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-extrabold self-start sm:self-auto',
                  roleInfo.color
                )}
              >
                <ShieldCheck className="mr-1.5 h-4 w-4" />
                <span>{roleInfo.label}</span>
              </span>
            </div>

            {/* Profile Info Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                  Full Name
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {profile?.fullName || 'Not specified'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                  Mobile Number
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {profile?.phone || 'Not linked'}
                </span>
              </div>
            </div>

            {/* Quick Actions & Role Shortcuts */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Quick Shortcuts
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/my-bookings"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-subtle hover:border-primary/40 hover:shadow-soft transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">My Bookings</h4>
                      <p className="text-[11px] text-muted-foreground">View upcoming trips</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                {role === 'platform_admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-subtle hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">Platform Admin</h4>
                        <p className="text-[11px] text-slate-600">Manage schedules & users</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-indigo-600" />
                  </Link>
                )}

                {role === 'operator' && (
                  <Link
                    href="/operator"
                    className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-subtle hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <Bus className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">Operator Portal</h4>
                        <p className="text-[11px] text-slate-600">Bus fleet management</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                  </Link>
                )}
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 px-5 text-xs font-bold text-destructive hover:bg-destructive/20 active:scale-95 transition-all"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out of Account</span>
              </button>
            </div>
          </div>
        </Container>
      </div>
    </AppShell>
  );
}
