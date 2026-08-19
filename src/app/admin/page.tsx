import { Metadata } from 'next';
import Link from 'next/link';
import {
  Ticket,
  Calendar,
  IndianRupee,
  Building2,
  Bus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AdminHeader } from '@/components/layout/Admin/AdminHeader';
import { Badge } from '@/components/ui/badge';
import {
  getAdminOverviewMetrics,
  getAdminRecentBookings,
} from '@/lib/admin/fetchers';

export const metadata: Metadata = {
  title: 'Platform Admin Dashboard',
  description: 'Executive overview and platform-wide metrics for Bus Booking Engine.',
};

export default async function AdminDashboardPage() {
  const metrics = await getAdminOverviewMetrics();
  const recentBookings = await getAdminRecentBookings(10);

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      subtitle: 'From confirmed bookings',
      icon: IndianRupee,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Total Bookings',
      value: metrics.totalBookings.toString(),
      subtitle: 'Platform-wide reservations',
      icon: Ticket,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      title: "Today's Bookings",
      value: metrics.todaysBookings.toString(),
      subtitle: 'Created in last 24h',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Active Schedules',
      value: metrics.activeSchedules.toString(),
      subtitle: 'Scheduled trips',
      icon: Calendar,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Verified Operators',
      value: metrics.totalOperators.toString(),
      subtitle: 'Partner companies',
      icon: Building2,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Total Fleet Buses',
      value: metrics.totalBuses.toString(),
      subtitle: 'Registered vehicles',
      icon: Bus,
      color: 'text-violet-600 bg-violet-50 border-violet-200',
    },
  ];

  return (
    <div className="flex-1 space-y-6 pb-10">
      <AdminHeader
        title="Platform Overview"
        subtitle="Live platform metrics, active schedules, and recent customer bookings."
      />

      <main className="px-6 space-y-8">
        {/* KPI Cards Grid */}
        <section aria-label="Executive Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle flex items-start justify-between space-x-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {card.title}
                    </span>
                    <div className="text-2xl font-extrabold text-slate-900">{card.value}</div>
                    <p className="text-[11px] font-medium text-slate-500">{card.subtitle}</p>
                  </div>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Bookings Section */}
        <section aria-labelledby="recent-bookings-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="recent-bookings-heading" className="text-lg font-bold text-slate-900">
                Recent Customer Bookings
              </h2>
              <p className="text-xs text-muted-foreground">
                Showing latest 10 bookings created across all bus routes
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center text-xs font-bold text-primary hover:underline"
            >
              <span>View All Bookings</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border/80 bg-white shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Operator</th>
                    <th className="py-3.5 px-4">Route</th>
                    <th className="py-3.5 px-4">Seats</th>
                    <th className="py-3.5 px-4">Grand Total</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{b.bookingReference}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{b.operatorName}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900">{b.origin}</span>
                          <span className="text-slate-400 mx-1">→</span>
                          <span className="font-bold text-slate-900">{b.destination}</span>
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
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                        No customer bookings found in Supabase database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
