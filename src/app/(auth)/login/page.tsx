import { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Bus Booking Platform account.',
};

export default function LoginPage() {
  return (
    <AppShell hideMobileNav={true} className="bg-slate-50/50">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <LoginForm />
      </div>
    </AppShell>
  );
}

