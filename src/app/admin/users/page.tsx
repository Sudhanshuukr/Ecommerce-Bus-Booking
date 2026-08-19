import { Metadata } from 'next';
import { Users, Search, Shield } from 'lucide-react';
import { AdminHeader } from '@/components/layout/Admin/AdminHeader';
import { getAdminUsers } from '@/lib/admin/fetchers';

export const metadata: Metadata = {
  title: 'User Management - Platform Admin',
  description: 'Inspect platform user profiles, identities, and roles.',
};

export interface AdminUsersPageProps {
  searchParams: Promise<{
    q?: string;
    role?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const roleFilter = resolvedParams.role || 'all';

  const users = await getAdminUsers(q, roleFilter);

  const getRoleBadgeStyle = (r: string) => {
    switch (r) {
      case 'platform_admin':
      case 'admin':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'operator':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'driver':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'developer':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-10">
      <AdminHeader
        title="Platform User Registry"
        subtitle="Inspect registered user profiles, identities, and role assignments."
      />

      <main className="px-6 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-border/80 shadow-subtle">
          <form method="GET" className="flex items-center space-x-2 w-full sm:w-80">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search user by email..."
                className="w-full h-9 rounded-xl border border-border bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-all"
              />
            </div>
            {roleFilter !== 'all' && <input type="hidden" name="role" value={roleFilter} />}
          </form>

          {/* Role Filter Tags */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'customer', 'platform_admin', 'operator', 'driver', 'developer'].map((r) => {
              const isActive = roleFilter === r;
              return (
                <a
                  key={r}
                  href={`/admin/users?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    role: r,
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.replace('_', ' ')}
                </a>
              );
            })}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-border/80 bg-white shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary shrink-0" />
                          <span>{u.fullName || 'Unnamed User'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold border capitalize ${getRoleBadgeStyle(
                            u.role
                          )}`}
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{u.phone || 'N/A'}</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                      No user records match your active search or role filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
