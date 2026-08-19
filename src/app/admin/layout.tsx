import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { AdminSidebar } from '@/components/layout/Admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, errorResponse } = await requireRole(['platform_admin']);

  if (errorResponse || !session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar className="hidden lg:flex" />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
