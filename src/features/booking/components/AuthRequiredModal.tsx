'use client';

import * as React from 'react';
import Link from 'next/link';
import { Lock, X, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl: string;
}

export function AuthRequiredModal({ isOpen, onClose, returnUrl }: AuthRequiredModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const primaryButtonRef = React.useRef<HTMLAnchorElement>(null);

  // Keyboard accessibility: Escape key listener
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management: autofocus primary action when modal opens
  React.useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        primaryButtonRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const encodedReturnUrl = encodeURIComponent(returnUrl);
  const loginHref = `/login?next=${encodedReturnUrl}`;
  const signupHref = `/signup?next=${encodedReturnUrl}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className={cn(
          'relative z-10 w-full max-w-md rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-modal',
          'animate-in fade-in-0 zoom-in-95 duration-200 focus:outline-none'
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Icon Badge */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
            <Lock className="h-6 w-6" />
          </div>

          <h2 id="auth-modal-title" className="font-heading text-xl font-extrabold text-slate-900 tracking-tight">
            Login required
          </h2>

          <p id="auth-modal-desc" className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
            It seems you&apos;re not logged in. Please log in or create an account before entering passenger details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            ref={primaryButtonRef}
            href={loginHref}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-5 text-xs sm:text-sm font-bold text-white shadow-subtle hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-95 transition-all"
          >
            <LogIn className="mr-2 h-4 w-4" />
            <span>Log In</span>
          </Link>

          <Link
            href={signupHref}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-xs sm:text-sm font-bold text-slate-700 shadow-subtle hover:bg-slate-50 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 transition-all"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Sign Up</span>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Your selected seats will be saved during login.
        </p>
      </div>
    </div>
  );
}
