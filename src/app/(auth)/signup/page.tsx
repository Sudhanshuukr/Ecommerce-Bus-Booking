import { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { SignupForm } from '@/features/auth/components/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new customer account on Bus Booking Platform.',
};

export default function SignupPage() {
  return (
    <AppShell hideMobileNav={true} className="bg-slate-50/50">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <SignupForm />
      </div>
    </AppShell>
  );
}

