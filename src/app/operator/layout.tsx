import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { OperatorSidebar } from '@/components/layout/Operator/OperatorSidebar';

export const dynamic = 'force-dynamic';

export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, errorResponse } = await requireRole(['operator']);

  if (errorResponse || !session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <OperatorSidebar className="hidden lg:flex" />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
