import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Bus Booking Platform account.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
