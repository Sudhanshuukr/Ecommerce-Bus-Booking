import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SignupForm } from '@/features/auth/components/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new customer account on Bus Booking Platform.',
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
}
