import { Metadata } from 'next';
import Link from 'next/link';
import {
  Ticket,
  Calendar,
  IndianRupee,
  Bus,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { getCurrentAuthUser } from '@/lib/auth/server';
import { OperatorHeader } from '@/components/layout/Operator/OperatorHeader';
import { Badge } from '@/components/ui/badge';
import {
  getOperatorOverviewMetrics,
  getOperatorRecentBookings,
} from '@/lib/operator/fetchers';

export const metadata: Metadata = {
  title: 'Operator Dashboard',
  description: 'Fleet operations, active schedule metrics, and customer reservations for bus operators.',
};

export default async function OperatorDashboardPage() {
  const session = await getCurrentAuthUser();
  const operatorId = session?.profile?.operatorId || null;

  const metrics = await getOperatorOverviewMetrics(operatorId);
  const recentBookings = await getOperatorRecentBookings(operatorId, 10);

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      subtitle: 'From operator bookings',
      icon: IndianRupee,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Total Bookings',
      value: metrics.totalBookings.toString(),
      subtitle: 'Reservations on your routes',
      icon: Ticket,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      title: 'Active Schedules',
      value: metrics.activeSchedules.toString(),
      subtitle: 'Currently scheduled trips',
      icon: Calendar,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Fleet Buses',
      value: metrics.fleetBuses.toString(),
      subtitle: 'Registered vehicles',
      icon: Bus,
      color: 'text-violet-600 bg-violet-50 border-violet-200',
    },
  ];

  return (
    <div className="flex-1 space-y-6 pb-10">
      <OperatorHeader
        title="Operator Overview"
        subtitle="Live fleet metrics, active schedules, and recent customer bookings."
      />

      <main className="px-6 space-y-8">
        {/* Banner if operator is unassigned */}
        {!operatorId && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Operator Profile Unlinked</p>
              <p>
                Your account is set to the Operator role, but is not currently linked to a specific bus operator entity in the system. Please contact the platform administrator to assign your account to an operator profile.
              </p>
            </div>
          </div>
        )}

        {/* KPI Cards Grid */}
        <section aria-label="Operator Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                Showing latest 10 bookings created for your bus schedules
              </p>
            </div>
            <Link
              href="/operator/bookings"
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
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <span className="inline-flex items-center space-x-1.5">
                            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{b.operatorName}</span>
                          </span>
                        </td>
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
                        No customer bookings found for your assigned operator account.
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
