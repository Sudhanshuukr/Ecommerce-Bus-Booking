import { Metadata } from 'next';
import { Ticket, Search, ShieldCheck } from 'lucide-react';
import { AdminHeader } from '@/components/layout/Admin/AdminHeader';
import { Badge } from '@/components/ui/badge';
import { getAdminBookings } from '@/lib/admin/fetchers';

export const metadata: Metadata = {
  title: 'Booking Management - Platform Admin',
  description: 'View and inspect platform-wide customer bookings.',
};

export interface AdminBookingsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const status = resolvedParams.status || 'all';

  const bookings = await getAdminBookings(q, status);

  return (
    <div className="flex-1 space-y-6 pb-10">
      <AdminHeader
        title="Platform Bookings Management"
        subtitle="Search and inspect all customer reservations across operators and schedules."
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
                placeholder="Search by reference (e.g. BB-2026)..."
                className="w-full h-9 rounded-xl border border-border bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-all"
              />
            </div>
            {status !== 'all' && <input type="hidden" name="status" value={status} />}
          </form>

          {/* Status Filter Tags */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'confirmed', 'pending', 'cancelled'].map((st) => {
              const isActive = status === st;
              return (
                <a
                  key={st}
                  href={`/admin/bookings?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    status: st,
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </a>
              );
            })}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="rounded-2xl border border-border/80 bg-white shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Operator</th>
                  <th className="py-3.5 px-4">Route</th>
                  <th className="py-3.5 px-4">Departure Time</th>
                  <th className="py-3.5 px-4">Seats</th>
                  <th className="py-3.5 px-4">Grand Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Booking Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <Ticket className="h-4 w-4 text-primary shrink-0" />
                          <span>{b.bookingReference}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{b.operatorName}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{b.origin}</span>
                        <span className="text-slate-400 mx-1">→</span>
                        <span className="font-bold text-slate-900">{b.destination}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">
                        {b.departureTime
                          ? new Date(b.departureTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="secondary" className="font-bold text-[11px] px-2 py-0.5">
                          {b.seatCount} {b.seatCount === 1 ? 'Seat' : 'Seats'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {b.currency}{b.grandTotal}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(b.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                      No customer bookings match your active search or filter criteria.
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
