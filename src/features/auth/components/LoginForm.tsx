'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthProvider';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Invalid credentials. Please try again.');
      setIsSubmitting(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-subtle">
      <div className="space-y-2 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Welcome Back</h1>
        <p className="text-xs text-muted-foreground">Sign in to manage your bus bookings and account preferences.</p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center space-x-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive animate-in fade-in-50"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-slate-700 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full h-10 rounded-xl border border-border bg-white pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-slate-700 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 rounded-xl border border-border bg-white pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 text-xs font-bold shadow-soft hover:shadow-hover active:scale-95 transition-all mt-2"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Signing In...</span>
            </div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="border-t border-slate-100 pt-4 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold text-primary hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}
